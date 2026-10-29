import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { maskSid } from '@/lib/sid-mask';
import { Redis } from '@upstash/redis';

// Records search queries so we can later show what readers look for. Every
// search is logged anonymously — no IP, no identity is stored (clientIp is used
// only as an in-memory rate-limit key). Searches from the owner's browser carry
// a mine:true flag so they can be filtered out/in later. Logging is best-effort:
// any failure here must never affect the search itself.
//
// POST { q, mode, mine?, n?, sid? } → { ok } — sid is the ephemeral per-tab
// session token (see src/lib/session-id.ts): random, anonymous, gone when the
// tab closes. It only lets one visit's searches be grouped together.

function getKV(): Redis | null {
  // The live Upstash store is connected with the "centerstudy" prefix, so its
  // vars are centerstudy_KV_REST_API_* . The unprefixed KV_REST_API_* still
  // exist but point at an older, deleted DB — so prefer the prefixed ones, then
  // fall back to the legacy / UPSTASH_* names.
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

const LOG_KEY = 'search:log';     // capped list of recent searches (JSON entries)
const TERMS_KEY = 'search:terms'; // ZSET: normalized query → frequency
const TOTAL_KEY = 'search:total'; // running total of searches logged
const MINE_KEY = 'search:mine';   // capped list of the owner's own searches
const LOG_CAP = 5000;
const MINE_CAP = 2000;
const MODES = new Set(['keyword', 'meaning', 'ask']);

// GET → { terms: [{ q, n }] } — the most-searched queries, for the /search
// empty state ("What readers search"). Read-only, anonymous, edge-cached.
// GET ?raw=1 → { entries: [{ q, mode, mine, n, sid?, t }] } — the recent raw
// log (capped list, newest first). No IP, no identity; the sid is served as
// a one-way mask (src/lib/sid-mask.ts), so entries group by visit without
// exposing a token the POST would accept. Lets the owner study session
// bursts and usage shape.
export async function GET(request: Request) {
  const kv = getKV();
  if (!kv) return Response.json({ terms: [] });
  const raw1 = new URL(request.url).searchParams.get('raw') === '1';
  if (raw1) {
    // Uncached hits run a large lrange — keep a per-instance lid on it.
    if (!rateLimit(`searchlogread:${clientIp(request)}`, 30, 60_000).ok) {
      return Response.json({ entries: [] }, { status: 429 });
    }
    try {
      const rows = (await kv.lrange(LOG_KEY, 0, LOG_CAP - 1)) as unknown[];
      const entries = rows
        .map((r) => {
          try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return null; }
        })
        .filter((e): e is Record<string, unknown> => !!e && typeof e === 'object')
        .map((e) => (e.sid ? { ...e, sid: maskSid(e.sid) } : e));
      return Response.json(
        { entries },
        { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
      );
    } catch {
      return Response.json({ entries: [] });
    }
  }
  try {
    const raw = (await kv.zrange(TERMS_KEY, 0, 39, { rev: true, withScores: true })) as (string | number)[];
    const terms: { q: string; n: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      const q = String(raw[i]);
      const n = Number(raw[i + 1]);
      // Skip one-offs and junk so a single stray query never becomes a chip.
      // __token__ patterns are uptime-monitor probes, not human searches.
      if (n < 2 || q.length < 3 || q.length > 60 || /^__.*__$/.test(q) || !/[a-z]/i.test(q)) continue;
      terms.push({ q, n });
      if (terms.length >= 12) break;
    }
    return Response.json(
      { terms },
      { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } },
    );
  } catch {
    return Response.json({ terms: [] });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Cheap per-instance guard against a client spamming the log.
  if (!rateLimit(`searchlog:${clientIp(request)}`, 60, 60_000).ok) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body: { q?: unknown; mode?: unknown; mine?: unknown; n?: unknown; sid?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const q = typeof body.q === 'string' ? body.q.trim().slice(0, 200) : '';
  if (q.length < 2) return Response.json({ ok: true, stored: false });
  const mode = typeof body.mode === 'string' && MODES.has(body.mode) ? body.mode : 'keyword';
  const mine = body.mine === true;
  const sid = typeof body.sid === 'string' && /^[a-z0-9]{4,12}$/i.test(body.sid) ? body.sid : undefined;
  const n = typeof body.n === 'number' && Number.isFinite(body.n)
    ? Math.max(0, Math.min(99999, Math.floor(body.n)))
    : undefined;

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  const entry = JSON.stringify({ q, mode, mine, n, sid, t: Date.now() });
  const norm = q.toLowerCase().replace(/\s+/g, ' ').trim();
  // Monitor probes must not accumulate in the terms ZSET at all — filtering
  // only on read leaves them self-reinforcing (chip clicks re-log them).
  if (/^__.*__$/.test(norm)) return Response.json({ ok: true, stored: false });
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
