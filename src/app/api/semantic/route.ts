import { isSameOrigin } from '@/lib/rate-limit';
import { semanticChunks, semanticAvailable } from '@/lib/semantic';
import { EMBED_DIM } from '@/lib/vecmath';

// Semantic search. The browser embeds the query locally (bge-small) and POSTs
// the unit vector here; this endpoint only does cosine over the prebuilt corpus
// vectors and returns the closest passages. No model / onnxruntime runs in this
// function — just float math — so it stays small and fast.
//
// POST { vector: number[384] } → { results: [{slug,title,source,text,score}] }

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!semanticAvailable()) {
    return Response.json({ error: 'Semantic index unavailable' }, { status: 503 });
  }

  let vector: unknown;
  try {
    ({ vector } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!Array.isArray(vector) || vector.length !== EMBED_DIM || !vector.every((x) => typeof x === 'number')) {
    return Response.json({ error: `vector must be ${EMBED_DIM} numbers` }, { status: 400 });
  }

  // Drop same-title duplicates (e.g. the pdf + ap copies of one article).
  const seenTitle = new Set<string>();
  const results = semanticChunks(Float32Array.from(vector as number[]), 40)
    .filter((c) => {
      const key = c.title.trim().toLowerCase();
      if (seenTitle.has(key)) return false;
      seenTitle.add(key);
      return true;
    })
    .slice(0, 24)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      source: c.source,
      // Trim the matched passage to a readable snippet for the result card.
      text: c.text.length > 360 ? c.text.slice(0, 360).replace(/\s+\S*$/, '') + '…' : c.text,
      score: Math.round(c.score * 1000) / 1000,
    }));

  return Response.json({ results });
}
