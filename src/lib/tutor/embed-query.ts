import { EMBED_DIM } from '../vecmath';

// The question's meaning vector, from the site's own embedding function
// (/api/embed holds the model). Null on any failure: retrieval then runs on
// keywords alone.
export async function embedQuestion(q: string, origin: string, timeoutMs = 20_000): Promise<Float32Array | null> {
  try {
    const r = await fetch(`${origin}/api/embed`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify({ q: q.slice(0, 500) }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return null;
    const { vector } = await r.json();
    return Array.isArray(vector) && vector.length === EMBED_DIM ? Float32Array.from(vector) : null;
  } catch {
    return null;
  }
}
