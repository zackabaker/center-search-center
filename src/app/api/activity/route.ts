import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { maskSid } from '@/lib/sid-mask';
import { Redis } from '@upstash/redis';

// Anonymous navigation log — one entry per page a visitor opens, carrying the
// same ephemeral per-tab session token (sid) the search log carries, so a
// visit's trail (pages opened + searches run) can be read back together on
// /sessions. Same privacy posture as the search log: no IP, no cookie, no
// user agent is stored; the sid is random, per-tab, and dies with the tab.
// Best-effort like every logger here: a failure must never affect the page.
//
// POST { sid, path, mine?, ref? } → { ok }
// GET  ?raw=1 → { entries: [{ sid, path, mine?, ref?, t }] } (newest first)

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

const LOG_KEY = 'activity:log'; // capped list of recent nav events (JSON entries)
const LOG_CAP = 20000;

// Self-identified crawlers add nothing to a log that exists to show how
// PEOPLE move through the site — skip them at ingest (the UA itself is
// checked and discarded, never stored).
const BOT_UA = /bot|crawl|spider|slurp|headless|preview|fetch|scrape|monitor|lighthouse/i;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Nav events fire on every page change — allow a brisk reading pace.
  if (!rateLimit(`activity:${clientIp(request)}`, 120, 60_000).ok) {
    return Response.json({ ok: false }, { status: 429 });
  }
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) {
    return Response.json({ ok: true, stored: false });
  }

  let body: { sid?: unknown; path?: unknown; mine?: unknown; ref?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const sid = typeof body.sid === 'string' && /^[a-z0-9]{4,12}$/i.test(body.sid) ? body.sid : null;
  // Site-relative paths only. The second character must not be '/' or '\':
  // '//evil.example' (and '/\evil.example', which browsers normalize to the
  // same) is a protocol-relative URL that would render on /sessions as a
  // clickable off-site link.
  const path =
    typeof body.path === 'string' && /^\/(?![/\\])/.test(body.path) && body.path.length <= 200
      ? body.path
      : null;
  if (!sid || !path) return Response.json({ ok: true, stored: false });
  const mine = body.mine === true ? true : undefined;
  // External referrer, sent only with a session's first event — hostname only,
  // so a referring URL's own path/query never enters the log.
  let ref: string | undefined;
  if (typeof body.ref === 'string' && body.ref.length <= 200) {
    try {
      ref = new URL(body.ref).hostname.slice(0, 80) || undefined;
    } catch {
      /* not a URL — drop it */
    }
  }

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  const entry = JSON.stringify({ sid, path, mine, ref, t: Date.now() });
  try {
    await Promise.all([kv.lpush(LOG_KEY, entry), kv.ltrim(LOG_KEY, 0, LOG_CAP - 1)]);
  } catch {
    return Response.json({ ok: true, stored: false }); // never surface a logging failure
  }
  return Response.json({ ok: true, stored: true });
}

// Raw readout for the owner's analysis pulls — same open-aggregate posture as
// GET /api/search-log?raw=1: anonymous entries, timestamps only. The sid is
// served MASKED (one-way hash, src/lib/sid-mask.ts): grouping by session
// works, but a reader of this endpoint can never forge events into a live
// session. Rate-limited and capped because every uncached hit is a large
// lrange against the shared store.
const RAW_CAP = 5000;

export async function GET(request: Request) {
  if (!rateLimit(`activityread:${clientIp(request)}`, 30, 60_000).ok) {
    return Response.json({ entries: [] }, { status: 429 });
  }
  const kv = getKV();
  if (!kv) return Response.json({ entries: [] });
  if (new URL(request.url).searchParams.get('raw') !== '1') {
    return Response.json({ ok: true, see: '/sessions' });
  }
  try {
    const rows = (await kv.lrange(LOG_KEY, 0, RAW_CAP - 1)) as unknown[];
    const entries = rows
      .map((r) => {
        try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return null; }
      })
      .filter((e): e is Record<string, unknown> => !!e && typeof e === 'object')
      .map((e) => ({ ...e, sid: maskSid(e.sid) }));
    return Response.json(
      { entries },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    );
  } catch {
    return Response.json({ entries: [] });
  }
}
