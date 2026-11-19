import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { getKept, keptIdFor, removeKept, saveKept } from '@/lib/tutor/kept';

// Kept tutor answers.
// GET  ?q=<question> | ?id=<id>  → { kept } or 404          (anyone)
// POST { q, a, sources, whole }  → { kept }                 (owner: keep this answer)
// DELETE { id }                  → { ok }                   (owner: stop serving it)

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id') ?? (url.searchParams.get('q') ? keptIdFor(url.searchParams.get('q')!) : '');
  const kept = id ? await getKept(id) : null;
  return kept ? Response.json({ kept }) : Response.json({ kept: null }, { status: 404 });
}

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let b: { q?: unknown; a?: unknown; sources?: unknown; whole?: unknown };
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (typeof b.q !== 'string' || typeof b.a !== 'string' || b.q.trim().length < 2 || b.a.trim().length < 50) {
    return Response.json({ error: 'Needs a question and an answer.' }, { status: 400 });
  }
  try {
    const kept = await saveKept({
      q: b.q.trim().slice(0, 600),
      a: b.a.slice(0, 40_000),
      sources: Array.isArray(b.sources) ? b.sources.slice(0, 12) : [],
      whole: Array.isArray(b.whole) ? b.whole.slice(0, 6) : [],
    });
    return kept ? Response.json({ kept }) : Response.json({ error: 'Nowhere to save it.' }, { status: 503 });
  } catch {
    return Response.json({ error: 'That did not save. Try again.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let b: { id?: unknown };
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (typeof b.id !== 'string') return Response.json({ error: 'Needs an id.' }, { status: 400 });
  await removeKept(b.id).catch(() => {});
  return Response.json({ ok: true });
}
