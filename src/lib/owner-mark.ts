// Server-side owner detection for the ingest routes, so the owner's own
// usage is excluded from the analytics display no matter which browser or
// device it comes from (the localStorage csc-mine flag only covers browsers
// he set it in).
//
// Two signals, either marks a request "mine":
//   1. The owner's Google session (signed csc-session cookie — src/lib/auth).
//   2. The request IP's PEPPERED HASH is in the `owner:iph` set. That set is
//      written only when the owner opens /analytics — i.e. it holds hashes of
//      HIS OWN networks (home, phone, laptop on café wifi), nothing else, and
//      every entry expires. No reader's IP is ever stored or hashed into
//      anything durable; readers' hashes are computed, compared, discarded.
//
// Privacy posture unchanged: logs still store no IP and no identity — only
// the boolean `mine` outcome.
import crypto from 'crypto';
import type { Redis } from '@upstash/redis';
import { getUser, isOwnerUser } from './auth';

const SET_KEY = 'owner:iph';
const TTL = 60 * 60 * 24 * 60; // owner networks age out after 60 days

type HeaderReader = { get(name: string): string | null };

function ipHash(headers: HeaderReader): string | null {
  const pepper = process.env.STUDY_KEY || process.env.AUTH_SECRET;
  if (!pepper) return null;
  const fwd = headers.get('x-forwarded-for') ?? '';
  const ip = (fwd.split(',')[0] ?? '').trim() || headers.get('x-real-ip') || '';
  if (!ip) return null;
  return crypto.createHash('sha256').update(`${pepper}:${ip}`).digest('hex').slice(0, 32);
}

/** Call when the owner opens the console: remember his current network. */
export async function rememberOwnerNetwork(kv: Redis, headers: HeaderReader): Promise<void> {
  const h = ipHash(headers);
  if (!h) return;
  try {
    const pipe = kv.pipeline();
    pipe.sadd(SET_KEY, h);
    pipe.expire(SET_KEY, TTL); // refreshed on every console visit
    await pipe.exec();
  } catch {
    /* best-effort */
  }
}

/** Is this request the owner's — by session, or by one of his networks? */
export async function isOwnerRequest(kv: Redis | null, request: Request): Promise<boolean> {
  if (isOwnerUser(getUser(request))) {
    // Caught him by his signed-in session, on whatever device or network —
    // seed that network now too, so the NEXT visit from here is caught even
    // signed out (previously this only happened from an actual /analytics
    // visit, so a phone he reads on while signed in, but never opens the
    // console from, never got remembered).
    if (kv) rememberOwnerNetwork(kv, request.headers).catch(() => {});
    return true;
  }
  if (!kv) return false;
  const h = ipHash(request.headers);
  if (!h) return false;
  try {
    return (await kv.sismember(SET_KEY, h)) === 1;
  } catch {
    return false;
  }
}
