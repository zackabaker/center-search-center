import { getUser } from '@/lib/auth';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { cleanIdioms, getIdioms, setIdioms } from '@/lib/user-store';

export const dynamic = 'force-dynamic';
const PRIVATE = { 'Cache-Control': 'private, no-store' };

// GET /api/me/idioms → { idioms } — the signed-in reader's saved idioms.
export async function GET(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  return Response.json({ idioms: await getIdioms(user.sub) }, { headers: PRIVATE });
}

// PUT { idioms } — replace the stored list with the reader's current one.
export async function PUT(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`idioms:${user.sub}`, 60, 60_000).ok) return Response.json({ error: 'Too many requests' }, { status: 429 });
  let body: { idioms?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const idioms = cleanIdioms(body.idioms);
  await setIdioms(user.sub, idioms);
  return Response.json({ ok: true, count: idioms.length }, { headers: PRIVATE });
}
