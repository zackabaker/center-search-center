import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { addNote, removeNote } from '@/lib/analytics-notes';

// Chart annotations for the owner's console. Owner-only, same gate as the
// console itself; everyone else gets its 404.
//
// POST   { day: 'YYYY-MM-DD', label } → { ok, note } | { ok: false, error }
// DELETE { id }                       → { ok }

const notFound = () => new Response('Not found', { status: 404 });

export async function POST(request: Request) {
  if (!isOwner(request)) return notFound();
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let body: { day?: unknown; label?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  try {
    const res = await addNote(String(body.day ?? ''), String(body.label ?? ''));
    if (typeof res === 'string') return Response.json({ ok: false, error: res }, { status: 400 });
    return Response.json({ ok: true, note: res });
  } catch {
    return Response.json({ ok: false, error: 'Could not save the note.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isOwner(request)) return notFound();
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  try {
    await removeNote(String(body.id ?? ''));
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
