import { getUser } from '@/lib/auth';
import { isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { addQuery, addRead, clearEvents, getQueries, getReads } from '@/lib/user-store';

export const dynamic = 'force-dynamic';
const PRIVATE = { 'Cache-Control': 'private, no-store' };

// Reading history and queries for a SIGNED-IN reader only. Anonymous visitors
// are never recorded here — the client does not even call this without a
// session, and the handlers reject it if it does.

// GET → { reads, queries }
export async function GET(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  const [reads, queries] = await Promise.all([getReads(user.sub), getQueries(user.sub)]);
  return Response.json({ reads, queries }, { headers: PRIVATE });
}

// POST { type: 'read', slug, title } | { type: 'query', q, kind }
export async function POST(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`events:${user.sub}`, 120, 60_000).ok) return Response.json({ error: 'Too many requests' }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (b.type === 'read' && typeof b.slug === 'string' && /^[a-z0-9-]{1,200}$/i.test(b.slug)) {
    await addRead(user.sub, b.slug, typeof b.title === 'string' ? b.title.slice(0, 300) : b.slug);
  } else if (b.type === 'query' && typeof b.q === 'string' && b.q.trim()) {
    await addQuery(user.sub, b.q.trim().slice(0, 500), b.kind === 'search' ? 'search' : 'ask');
  } else {
    return Response.json({ error: 'Invalid event' }, { status: 400 });
  }
  return Response.json({ ok: true }, { headers: PRIVATE });
}

// DELETE ?what=reads|queries — clear one list.
export async function DELETE(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const what = new URL(request.url).searchParams.get('what');
  if (what !== 'reads' && what !== 'queries') return Response.json({ error: 'Invalid list' }, { status: 400 });
  await clearEvents(user.sub, what);
  return Response.json({ ok: true }, { headers: PRIVATE });
}
