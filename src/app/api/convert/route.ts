import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { Redis } from '@upstash/redis';

// Conversion counters — the four anonymous events that make "did that change
// help?" answerable: open (the session moved past its landing page into a
// text or /start), read (≥50% scroll AND ≥90s on one text), follow (a click
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

  let body: { event?: unknown; dest?: unknown; where?: unknown; gap?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

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

export async function GET() {
  const kv = getKV();
  if (!kv) return Response.json({ totals: {}, days: {} });

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
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    );
  } catch {
    return Response.json({ totals: {}, days: {} });
  }
}
