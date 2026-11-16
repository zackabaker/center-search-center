import { getUser } from '@/lib/auth';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { getProfile, getStats, score, setUsername } from '@/lib/user-store';

export const dynamic = 'force-dynamic';
const PRIVATE = { 'Cache-Control': 'private, no-store' };

async function payload(sub: string) {
  const [profile, stats] = await Promise.all([getProfile(sub), getStats(sub)]);
  return { profile, stats, score: score(stats) };
}

// GET /api/me/profile → { profile, stats, score } for the signed-in reader.
export async function GET(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  return Response.json(await payload(user.sub), { headers: PRIVATE });
}

// PATCH { username } — change the reader's username.
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
  return Response.json(await payload(user.sub), { headers: PRIVATE });
}
