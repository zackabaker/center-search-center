import { getUser } from '@/lib/auth';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { getAnnounce, getContact, getProfile, getStats, recordContact, score, setAnnounce, setUsername } from '@/lib/user-store';

export const dynamic = 'force-dynamic';
const PRIVATE = { 'Cache-Control': 'private, no-store' };

async function payload(sub: string) {
  const [profile, stats, announce, contact] = await Promise.all([getProfile(sub), getStats(sub), getAnnounce(sub), getContact(sub)]);
  return { profile, stats, score: score(stats), announce, emailKept: !!contact };
}

// GET /api/me/profile → { profile, stats, score } for the signed-in reader.
export async function GET(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  return Response.json(await payload(user.sub), { headers: PRIVATE });
}

// PATCH { username } — change the reader's username.
// PATCH { announce } — ask for, or stop, occasional announcements by email.
export async function PATCH(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`profile:${user.sub}`, 20, 60_000).ok) return Response.json({ error: 'Too many requests' }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (typeof b.username === 'string') {
    const problem = await setUsername(user.sub, b.username.trim());
    if (problem) return Response.json({ error: problem }, { status: 400 });
  }
  if (typeof b.announce === 'boolean') {
    // Asking for announcements is the reader giving their address for it,
    // so it is kept then even if they signed in before emails were kept.
    if (b.announce && user.email) await recordContact(user.sub, user.email);
    await setAnnounce(user.sub, b.announce);
  }
  return Response.json(await payload(user.sub), { headers: PRIVATE });
}
