import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { openCors } from '@/lib/cors';
import { isOwnerRequest } from '@/lib/owner-mark';
import { Redis } from '@upstash/redis';

// Conversion counters — the four anonymous events that make "did that change
// help?" answerable: open (the session moved past its landing page into a
// text or /begin), read (≥50% scroll AND ≥90s on one text), follow (a click
// out to Substack / @centerstudy_ / RSS, with destination and placement),
// return (a browser back after 1–30 days). Aggregate counts only — no IP, no
// id, no per-visitor rows (clientIp is only an in-memory rate-limit key).
// Best-effort like /api/view: a failure here must never affect the page.
//
// POST { event, dest?, where?, gap? } → { ok }
// GET  → last-30-day totals + per-day series. Aggregates only, so public —
//        the same posture as GET /api/search-log.

function getKV(): Redis | null {
  // The live Upstash store is connected with the "centerstudy" prefix; the
  // unprefixed KV_REST_API_* point at an older, deleted DB. (Matches /api/view.)
  const url =
    process.env.centerstudy_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.centerstudy_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const EVENTS = ['open', 'read', 'follow', 'return'] as const;
const DESTS = ['substack', 'x', 'rss'] as const;
const WHERES = ['footer', 'post-end', 'flagship', 'endlist', 'start', 'other'] as const;

// One hash per UTC day: convert:YYYY-MM-DD → { open: n, read: n, follow: n,
// "follow:substack:post-end": n, "return:7d": n, … }. ~400-day TTL.
function dayKey(d: Date): string {
  return `convert:${d.toISOString().slice(0, 10)}`;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!rateLimit(`convert:${clientIp(request)}`, 60, 60_000).ok) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Two events keep their own (non-public) keys rather than the convert:*
  // hashes that GET serves: per-text read depth, and 404 hits.
  if (body.event === 'depth') return depthHit(request, body);
  if (body.event === '404') return missHit(request, body);

  const event = typeof body.event === 'string' && (EVENTS as readonly string[]).includes(body.event)
    ? body.event
    : null;
  if (!event) return Response.json({ ok: true, stored: false });

  // The hash fields this hit increments: the bare event, plus one qualified
  // field so follow placement and return recency stay legible.
  const fields = [event];
  if (event === 'follow') {
    const dest = typeof body.dest === 'string' && (DESTS as readonly string[]).includes(body.dest) ? body.dest : 'other';
    const where = typeof body.where === 'string' && (WHERES as readonly string[]).includes(body.where) ? body.where : 'other';
    fields.push(`follow:${dest}:${where}`);
  } else if (event === 'return') {
    const gap = typeof body.gap === 'number' && body.gap >= 1 && body.gap <= 30 ? Math.round(body.gap) : null;
    if (gap !== null) fields.push(gap <= 7 ? 'return:7d' : 'return:30d');
  }

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  // Owner events (the /mine browser flag, the owner's Google session, or one
  // of his networks — src/lib/owner-mark.ts) count normally AND into ":mine"
  // shadow fields, so the readout can show owner vs. readers; readers =
  // base minus mine.
  if (body.mine === true || (await isOwnerRequest(kv, request))) {
    fields.push(...fields.map((f) => `${f}:mine`));
  }

  try {
    const dk = dayKey(new Date());
    // Pipelined so EXPIRE runs after the HINCRBYs server-side — concurrent
    // calls could land EXPIRE before the key exists (a no-op), leaving a
    // single-event day hash with no TTL.
    const pipe = kv.pipeline();
    for (const f of fields) pipe.hincrby(dk, f, 1);
    pipe.expire(dk, 60 * 60 * 24 * 400);
    await pipe.exec();
  } catch {
    return Response.json({ ok: true, stored: false }); // never surface a logging failure
  }
  return Response.json({ ok: true, stored: true });
}

type Body = {
  event?: unknown; dest?: unknown; where?: unknown; gap?: unknown; mine?: unknown;
  slug?: unknown; d?: unknown; t?: unknown; pd?: unknown; pt?: unknown;
  path?: unknown; probe?: unknown;
};

const stored = (ok: boolean) => Response.json({ ok: true, stored: ok });

// ── Read depth ───────────────────────────────────────────────────────────
// How far down a text readers get and how long they stay. One hash per UTC
// day — depth:YYYY-MM-DD → { "<slug>|<d>.<t>": n } — where d is the deepest
// quarter reached (0/25/50/75/100) and t a dwell bucket (0: <30s, 1: <90s,
// 2: <5min, 3: 5min+). Each (reader session, text) occupies exactly ONE
// cell: the client reports again only when a bucket grows, naming the cell
// it previously reported (pd/pt) so the count moves instead of duplicating.
// The owner's own reading is left out — except a flagged self-test, which
// lands under the throwaway slug "__probe__".
const DEPTHS = [0, 25, 50, 75, 100];
const DWELLS = [0, 1, 2, 3];
const pick = (v: unknown, allowed: number[]): number | null =>
  typeof v === 'number' && allowed.includes(v) ? v : null;

async function depthHit(request: Request, body: Body): Promise<Response> {
  let slug =
    typeof body.slug === 'string' && /^[a-z0-9][a-z0-9-]{0,199}$/.test(body.slug) ? body.slug : null;
  const d = pick(body.d, DEPTHS);
  const t = pick(body.t, DWELLS);
  const pd = pick(body.pd, DEPTHS);
  const pt = pick(body.pt, DWELLS);
  if (!slug || d === null || t === null) return stored(false);

  const kv = getKV();
  if (!kv) return stored(false);
  if (body.mine === true || (await isOwnerRequest(kv, request))) {
    if (body.probe !== true) return stored(false);
    slug = '__probe__';
  }

  try {
    const dk = `depth:${new Date().toISOString().slice(0, 10)}`;
    const pipe = kv.pipeline();
    const moved = pd !== null && pt !== null;
    if (moved) {
      if (d < pd || t < pt || (d === pd && t === pt)) return stored(false); // buckets only grow
      pipe.hincrby(dk, `${slug}|${pd}.${pt}`, -1);
    }
    pipe.hincrby(dk, `${slug}|${d}.${t}`, 1);
    pipe.expire(dk, 60 * 60 * 24 * 400);
    await pipe.exec();
  } catch {
    return stored(false);
  }
  return stored(true);
}

// ── 404s ─────────────────────────────────────────────────────────────────
// Which missing URLs people actually land on — broken links in the wild.
// fof:YYYY-MM-DD → { "<path>": n }, 90-day TTL. Paths only.
const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|preview|fetch|scrape|monitor|lighthouse/i;

async function missHit(request: Request, body: Body): Promise<Response> {
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) return stored(false);
  let path =
    typeof body.path === 'string' && /^\/(?![/\\])/.test(body.path) && body.path.length <= 150
      ? body.path
      : null;
  if (!path) return stored(false);

  const kv = getKV();
  if (!kv) return stored(false);
  if (body.mine === true || (await isOwnerRequest(kv, request))) {
    if (body.probe !== true) return stored(false);
    path = '/__probe__';
  }

  try {
    const dk = `fof:${new Date().toISOString().slice(0, 10)}`;
    const pipe = kv.pipeline();
    pipe.hincrby(dk, path, 1);
    pipe.expire(dk, 60 * 60 * 24 * 90);
    await pipe.exec();
  } catch {
    return stored(false);
  }
  return stored(true);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: openCors() });
}

export async function GET() {
  const kv = getKV();
  if (!kv) return Response.json({ totals: {}, days: {} }, { headers: openCors() });

  const keys: string[] = [];
  for (let i = 0; i < 30; i++) keys.push(dayKey(new Date(Date.now() - i * 86_400_000)));

  try {
    const pipe = kv.pipeline();
    for (const k of keys) pipe.hgetall(k);
    const rows = (await pipe.exec()) as (Record<string, number> | null)[];

    const days: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};
    rows.forEach((row, i) => {
      if (!row || Object.keys(row).length === 0) return;
      days[keys[i].slice('convert:'.length)] = row;
      for (const [field, n] of Object.entries(row)) totals[field] = (totals[field] ?? 0) + Number(n);
    });
    return Response.json(
      { totals, days },
      // s-maxage so Vercel's edge absorbs repeat hits — without it every GET
      // runs a 30-command pipeline against the shared store (house pattern:
      // GET /api/search-log).
      { headers: openCors({ 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' }) },
    );
  } catch {
    return Response.json({ totals: {}, days: {} }, { headers: openCors() });
  }
}
