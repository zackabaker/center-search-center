import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { setOppStatus } from '@/lib/opportunities';

// The owner's verdict on an opportunity: done, not relevant, or reopened.
// Owner-only; everyone else gets the console's 404.
//
// POST { id, status: 'done' | 'ignored' | 'open' } → { ok }

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let body: { id?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const id = typeof body.id === 'string' ? body.id : '';
  const status = body.status === 'done' || body.status === 'ignored' ? body.status : body.status === 'open' ? null : undefined;
  if (!id || status === undefined) return Response.json({ ok: false }, { status: 400 });
  try {
    await setOppStatus(id, status);
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
