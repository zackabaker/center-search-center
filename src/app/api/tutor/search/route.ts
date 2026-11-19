import { isOwner } from '@/lib/analytics-auth';
import { tutorRetrieve, tutorIndexStatus } from '@/lib/tutor/retrieve';
import { EMBED_DIM } from '@/lib/vecmath';

// Owner-only window onto the tutor's retrieval, for judging search quality
// before any model is attached. Everyone else gets the console's 404.
//
// GET ?q=...&mode=hybrid|keyword → { status, meaning, results: TutorHit[] }

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

async function embed(q: string, origin: string): Promise<Float32Array | null> {
  try {
    const r = await fetch(`${origin}/api/embed`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify({ q: q.slice(0, 500) }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!r.ok) return null;
    const { vector } = await r.json();
    return Array.isArray(vector) && vector.length === EMBED_DIM ? Float32Array.from(vector) : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const status = tutorIndexStatus();
  if (q.length < 2) return Response.json({ status, meaning: false, results: [] });
  const vec = url.searchParams.get('mode') === 'keyword' ? null : await embed(q, url.origin);
  return Response.json({ status, meaning: !!vec, results: tutorRetrieve(q, vec, { limit: 30 }) });
}
