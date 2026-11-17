import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { maskSid } from '@/lib/sid-mask';
import { isOwner } from '@/lib/analytics-auth';
import { isOwnerRequest } from '@/lib/owner-mark';
import { getKV } from '@/lib/kv';

// Records search queries so we can later show what readers look for. Every
// search is logged anonymously — no IP, no identity is stored (clientIp is used
// only as an in-memory rate-limit key). Searches from the owner's browser carry
// a mine:true flag so they can be filtered out/in later. Logging is best-effort:
// any failure here must never affect the search itself.
//
// POST { q, mode, mine?, n?, sid? } → { ok } — sid is the ephemeral per-tab
// session token (see src/lib/session-id.ts): random, anonymous, gone when the
// tab closes. It only lets one visit's searches be grouped together.

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
// log (capped list, newest first). OWNER-ONLY: raw entries are what the
// gated /study console is built from, so this requires the same csc-study
// cookie (src/lib/study-auth.ts). The sid is still served as a one-way mask
// (src/lib/sid-mask.ts), so even owner pulls never hold a POSTable token.
export async function GET(request: Request) {
  const raw1 = new URL(request.url).searchParams.get('raw') === '1';
  // The gate runs before anything else so the raw branch behaves identically
  // whether or not KV is configured.
  if (raw1 && !isOwner(request)) {
    return new Response('Not found', { status: 404 });
  }
  const kv = getKV();
  if (!kv) return Response.json(raw1 ? { entries: [] } : { terms: [] });
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
      // private: an owner-gated response must never land in a shared cache.
      return Response.json({ entries }, { headers: { 'Cache-Control': 'private, no-store' } });
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

  let body: { q?: unknown; mode?: unknown; mine?: unknown; n?: unknown; sid?: unknown; op?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Owner maintenance: retroactively flag already-logged entries as mine
  // (e.g. searches made from a browser without the csc-mine flag before the
  // server-side owner-network detection existed). Owner-gated; matching is
  // by normalized exact query. Activity entries for the flagged searches'
  // sids are flagged too, so the whole session leaves the readers' view.
  if (body.op === 'mark-mine') {
    if (!isOwner(request)) return new Response('Not found', { status: 404 });
    return markMine(typeof body.q === 'string' ? body.q : '');
  }

  const q = typeof body.q === 'string' ? body.q.trim().slice(0, 200) : '';
  if (q.length < 2) return Response.json({ ok: true, stored: false });
  const mode = typeof body.mode === 'string' && MODES.has(body.mode) ? body.mode : 'keyword';
  const mine = body.mine === true || (await isOwnerRequest(getKV(), request));
  const sid = typeof body.sid === 'string' && /^[a-z0-9]{4,12}$/i.test(body.sid) ? body.sid : undefined;
  const n = typeof body.n === 'number' && Number.isFinite(body.n)
    ? Math.max(0, Math.min(99999, Math.floor(body.n)))
    : undefined;

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  const now = Date.now();
  const entry = JSON.stringify({ q, mode, mine, n, sid, t: now });
  const norm = q.toLowerCase().replace(/\s+/g, ' ').trim();
  // Monitor probes must not accumulate in the terms ZSET at all — filtering
  // only on read leaves them self-reinforcing (chip clicks re-log them).
  if (/^__.*__$/.test(norm)) return Response.json({ ok: true, stored: false });
  // Durable daily counts (search:day:YYYY-MM-DD, ~400-day TTL) so the
  // searches-per-day series survives after the capped list rolls over.
  const dayKey = `search:day:${new Date(now).toISOString().slice(0, 10)}`;
  try {
    const pipe = kv.pipeline();
    pipe.lpush(LOG_KEY, entry);
    pipe.ltrim(LOG_KEY, 0, LOG_CAP - 1);
    pipe.zincrby(TERMS_KEY, 1, norm);
    pipe.incr(TOTAL_KEY);
    if (mine) {
      pipe.lpush(MINE_KEY, entry);
      pipe.ltrim(MINE_KEY, 0, MINE_CAP - 1);
    }
    pipe.hincrby(dayKey, 'n', 1);
    pipe.hincrby(dayKey, mode, 1);
    if (mine) pipe.hincrby(dayKey, 'mine', 1);
    pipe.expire(dayKey, 60 * 60 * 24 * 400);
    await pipe.exec();
  } catch {
    return Response.json({ ok: true, stored: false }); // never surface a logging failure
  }
  return Response.json({ ok: true, stored: true });
}

// Rewrite already-logged entries whose normalized query matches, setting
// mine:true in place (LSET), then do the same for every activity entry that
// shares a flagged search's sid. Reached only through the owner-gated
// mark-mine op above.
async function markMine(rawQ: string) {
  const norm = rawQ.toLowerCase().replace(/\s+/g, ' ').trim();
  if (norm.length < 2) return Response.json({ ok: false, error: 'q too short' }, { status: 400 });
  const kv = getKV();
  if (!kv) return Response.json({ ok: false, error: 'no kv' }, { status: 503 });
  try {
    const rows = (await kv.lrange(LOG_KEY, 0, LOG_CAP - 1)) as unknown[];
    const sids = new Set<string>();
    let searches = 0;
    const pipe = kv.pipeline();
    rows.forEach((r, i) => {
      let e: Record<string, unknown> | null = null;
      try { e = typeof r === 'string' ? JSON.parse(r) : (r as Record<string, unknown>); } catch { /* skip */ }
      if (!e || typeof e.q !== 'string') return;
      if (e.q.toLowerCase().replace(/\s+/g, ' ').trim() !== norm || e.mine === true) return;
      searches += 1;
      if (typeof e.sid === 'string') sids.add(e.sid);
      pipe.lset(LOG_KEY, i, JSON.stringify({ ...e, mine: true }));
    });
    let activity = 0;
    if (sids.size > 0) {
      const acts = (await kv.lrange('activity:log', 0, 19999)) as unknown[];
      acts.forEach((r, i) => {
        let e: Record<string, unknown> | null = null;
        try { e = typeof r === 'string' ? JSON.parse(r) : (r as Record<string, unknown>); } catch { /* skip */ }
        if (!e || typeof e.sid !== 'string' || !sids.has(e.sid) || e.mine === true) return;
        activity += 1;
        pipe.lset('activity:log', i, JSON.stringify({ ...e, mine: true }));
      });
    }
    if (searches + activity > 0) await pipe.exec();
    return Response.json(
      { ok: true, flagged: { searches, activity, sessions: sids.size } },
      { headers: { 'Cache-Control': 'private, no-store' } },
    );
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
