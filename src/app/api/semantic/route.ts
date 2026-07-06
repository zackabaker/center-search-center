import { openCors, preflight } from '@/lib/cors';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { semanticChunks, semanticAvailable } from '@/lib/semantic';
import { EMBED_DIM } from '@/lib/vecmath';

// Semantic search. The browser embeds the query locally (bge-small) and POSTs
// the unit vector here; this endpoint only does cosine over the prebuilt corpus
// vectors and returns the closest passages. No model / onnxruntime runs in this
// function — just float math — so it stays small and fast.
//
// POST { vector: number[384] } → { results: [{slug,title,source,text,score}] }

export function OPTIONS() {
  return preflight(openCors());
}

export async function POST(request: Request) {
  if (!semanticAvailable()) {
    return Response.json({ error: 'Semantic index unavailable' }, { status: 503 });
  }

  let vector: unknown;
  let sources: unknown;
  let q: unknown;
  let full: unknown;
  try {
    ({ vector, sources, q, full } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Raw-text mode: embed server-side via the dedicated /api/embed function
  // (model + onnxruntime live there, not here). Lets Meaning search work with
  // zero client download and lets Ask retrieval go hybrid.
  if (!vector && typeof q === 'string' && q.trim().length >= 2) {
    try {
      const origin = new URL(request.url).origin;
      const r = await fetch(`${origin}/api/embed`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin },
        body: JSON.stringify({ q: q.trim().slice(0, 500) }),
      });
      if (r.ok) ({ vector } = await r.json());
    } catch {
      // fall through to the 503 below
    }
    if (!vector) {
      return Response.json({ error: 'Server-side embedding unavailable' }, { status: 503 });
    }
  }

  if (!Array.isArray(vector) || vector.length !== EMBED_DIM || !vector.every((x) => typeof x === 'number')) {
    return Response.json({ error: `vector must be ${EMBED_DIM} numbers` }, { status: 400 });
  }

  // Optional content-source allow-list (the browser excludes the Chronicles &c.
  // by default). Absent/empty → search all sources.
  const allow = Array.isArray(sources) && sources.length > 0
    ? new Set((sources as unknown[]).filter((s): s is string => typeof s === 'string'))
    : undefined;

  // Drop same-title duplicates (e.g. the pdf + ap copies of one article).
  const seenTitle = new Set<string>();
  const results = semanticChunks(Float32Array.from(vector as number[]), 40, true, allow)
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
      // Trim to a readable snippet for result cards; internal callers (Ask
      // retrieval) pass full: true to get the whole passage for the prompt.
      text: full === true || c.text.length <= 360
        ? c.text
        : c.text.slice(0, 360).replace(/\s+\S*$/, '') + '…',
      score: Math.round(c.score * 1000) / 1000,
    }));

  return Response.json({ results }, { headers: openCors() });
}
