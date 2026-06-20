import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { Redis } from '@upstash/redis';

// Records search queries so we can later show what readers look for. Every
// search is logged anonymously — no IP, no identity is stored (clientIp is used
// only as an in-memory rate-limit key). Searches from the owner's browser carry
// a mine:true flag so they can be filtered out/in later. Logging is best-effort:
// any failure here must never affect the search itself.
//
// POST { q, mode, mine?, n? } → { ok }

function getKV(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const LOG_KEY = 'search:log';     // capped list of recent searches (JSON entries)
const TERMS_KEY = 'search:terms'; // ZSET: normalized query → frequency
const TOTAL_KEY = 'search:total'; // running total of searches logged
const MINE_KEY = 'search:mine';   // capped list of the owner's own searches
const LOG_CAP = 5000;
const MINE_CAP = 2000;
const MODES = new Set(['keyword', 'meaning', 'ask']);

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Cheap per-instance guard against a client spamming the log.
  if (!rateLimit(`searchlog:${clientIp(request)}`, 60, 60_000).ok) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body: { q?: unknown; mode?: unknown; mine?: unknown; n?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const q = typeof body.q === 'string' ? body.q.trim().slice(0, 200) : '';
  if (q.length < 2) return Response.json({ ok: true, stored: false });
  const mode = typeof body.mode === 'string' && MODES.has(body.mode) ? body.mode : 'keyword';
  const mine = body.mine === true;
  const n = typeof body.n === 'number' && Number.isFinite(body.n)
    ? Math.max(0, Math.min(99999, Math.floor(body.n)))
    : undefined;

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  const entry = JSON.stringify({ q, mode, mine, n, t: Date.now() });
  const norm = q.toLowerCase().replace(/\s+/g, ' ').trim();
  try {
    await Promise.all([
      kv.lpush(LOG_KEY, entry),
      kv.ltrim(LOG_KEY, 0, LOG_CAP - 1),
      kv.zincrby(TERMS_KEY, 1, norm),
      kv.incr(TOTAL_KEY),
      ...(mine ? [kv.lpush(MINE_KEY, entry), kv.ltrim(MINE_KEY, 0, MINE_CAP - 1)] : []),
    ]);
  } catch {
    return Response.json({ ok: true, stored: false }); // never surface a logging failure
  }
  return Response.json({ ok: true, stored: true });
}
