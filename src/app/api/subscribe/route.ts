import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { Redis } from '@upstash/redis';

// Owned email list for the weekly digest. Addresses go straight into our own
// Redis — no third-party form, no tracking. Sending is done by the digest
// pipeline (scripts/generate-digest.mjs + provider) which also handles
// unsubscribe links.
//
// POST { email } → { ok }

function getKV(): Redis | null {
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

const SET_KEY = 'digest:subscribers';       // SET of emails
const LOG_KEY = 'digest:subscribe-log';     // LPUSH {email,t} for audit/undo

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!rateLimit(`subscribe:${clientIp(request)}`, 5, 60_000).ok) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    return Response.json({ error: 'Enter a valid email address' }, { status: 400 });
  }
  const addr = email.trim().toLowerCase();

  const kv = getKV();
  if (!kv) return Response.json({ error: 'Signup is temporarily unavailable' }, { status: 503 });

  try {
    const added = await kv.sadd(SET_KEY, addr);
    if (added) {
      await kv.lpush(LOG_KEY, JSON.stringify({ email: addr, t: Date.now() }));
      await kv.ltrim(LOG_KEY, 0, 9999);
    }
  } catch {
    return Response.json({ error: 'Signup is temporarily unavailable' }, { status: 503 });
  }
  return Response.json({ ok: true });
}
