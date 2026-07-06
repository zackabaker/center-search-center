import { isSameOrigin, rateLimit, clientIp } from '@/lib/rate-limit';
import { embedQuery } from '@/lib/embed';
import { EMBED_DIM } from '@/lib/vecmath';

// Server-side query embedding (bge-small, bundled local model — no network,
// no per-query API cost). This is its own function so the ~130MB of model +
// onnxruntime lands HERE and nowhere else; /api/semantic keeps the corpus
// vectors and calls this route when handed raw text.
//
// POST { q } → { vector: number[384] }

export const maxDuration = 30; // first call in a cold lambda loads the model

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!rateLimit(`embed:${clientIp(request)}`, 30, 60_000).ok) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let q: unknown;
  try {
    ({ q } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (typeof q !== 'string' || q.trim().length < 2 || q.length > 500) {
    return Response.json({ error: 'q must be a 2-500 char string' }, { status: 400 });
  }

  const vec = await embedQuery(q.trim());
  if (!vec || vec.length !== EMBED_DIM) {
    return Response.json({ error: 'Embedding unavailable' }, { status: 503 });
  }
  return Response.json({ vector: Array.from(vec) });
}
