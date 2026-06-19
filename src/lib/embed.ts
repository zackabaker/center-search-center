// Shared local embedding model (bge-small-en-v1.5, 384-dim) used at build time
// to embed the corpus and at runtime to embed a query. Loaded from the bundled
// model files in /models — no network, no API, no per-query cost. All callers
// degrade gracefully: embedText returns null if the model can't load, so the
// semantic layer is always optional and never breaks the lexical fallback.

import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let extractorPromise: Promise<any> | null = null;

export const EMBED_DIM = 384;
const MODEL_ID = 'Xenova/bge-small-en-v1.5';
// bge models want this instruction prefix on the *query* side for retrieval.
const QUERY_PREFIX = 'Represent this sentence for searching relevant passages: ';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getExtractor(): Promise<any> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import('@xenova/transformers');
      // Use a local copy under /models if present (fast, offline); otherwise
      // download from the HF hub. This runs only at build time, so the model is
      // never bundled into the serverless functions.
      env.allowRemoteModels = true;
      env.allowLocalModels = true;
      env.localModelPath = path.join(process.cwd(), 'models');
      return pipeline('feature-extraction', MODEL_ID);
    })().catch((err) => {
      // Reset so a later call can retry, and signal failure to callers.
      extractorPromise = null;
      throw err;
    });
  }
  return extractorPromise;
}

// Embed an array of passages → array of Float32 unit vectors (or null on failure).
export async function embedPassages(texts: string[]): Promise<Float32Array[] | null> {
  if (texts.length === 0) return [];
  try {
    const extractor = await getExtractor();
    const out = await extractor(texts, { pooling: 'mean', normalize: true });
    const dim = out.dims[out.dims.length - 1] as number;
    const data = out.data as Float32Array;
    const vecs: Float32Array[] = [];
    for (let i = 0; i < texts.length; i++) {
      vecs.push(data.slice(i * dim, (i + 1) * dim));
    }
    return vecs;
  } catch {
    return null;
  }
}

// Embed a single search query (with the bge query instruction).
export async function embedQuery(text: string): Promise<Float32Array | null> {
  const vecs = await embedPassages([QUERY_PREFIX + text]);
  return vecs ? vecs[0] : null;
}

// Cosine similarity for unit-normalized vectors is just the dot product.
export function dot(a: Float32Array, b: Float32Array): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
