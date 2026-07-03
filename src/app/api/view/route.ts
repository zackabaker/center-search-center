import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { Redis } from '@upstash/redis';

// Counts post views so we can later surface "most viewed." Anonymous — no IP or
// identity is stored (clientIp is only an in-memory rate-limit key). Best-effort:
// a failure here must never affect the page. No UI consumes this yet; we're just
// accumulating the data, same as the search log.
//
// POST { slug } → { ok }

function getKV(): Redis | null {
  // The live Upstash store is connected with the "centerstudy" prefix; the
  // unprefixed KV_REST_API_* point at an older, deleted DB. Prefer the prefixed
  // vars, then fall back. (Matches /api/search-log.)
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

const COUNTS = 'views:counts'; // ZSET: slug → view count (all-time)
const TOTAL = 'views:total';   // running total of views logged

// Rolling window: a per-month ZSET (views:counts:YYYY-MM, ~70-day TTL) so
// /trending can rank by recent reads instead of ossifying into an all-time list.
function monthKey(d = new Date()): string {
  return `views:counts:${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!rateLimit(`view:${clientIp(request)}`, 120, 60_000).ok) {
    return Response.json({ ok: false }, { status: 429 });
  }

  let body: { slug?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug.trim().slice(0, 200) : '';
  // Slugs are lowercase, hyphen-separated — reject anything else.
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) return Response.json({ ok: true, stored: false });

  const kv = getKV();
  if (!kv) return Response.json({ ok: true, stored: false }); // KV not configured — no-op

  try {
    const mk = monthKey();
    await Promise.all([
      kv.zincrby(COUNTS, 1, slug),
      kv.zincrby(mk, 1, slug),
      kv.expire(mk, 60 * 60 * 24 * 70), // ~70 days: current + previous month stay queryable
      kv.incr(TOTAL),
    ]);
  } catch {
    return Response.json({ ok: true, stored: false }); // never surface a logging failure
  }
  return Response.json({ ok: true, stored: true });
}
