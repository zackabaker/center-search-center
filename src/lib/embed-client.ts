'use client';

// Browser-side query embedding for semantic search. transformers.js is loaded
// from a CDN at call time (not bundled by Next) and the bge-small model is
// downloaded from the HF hub and cached by the browser. This only ever runs
// when the user actually performs a meaning-search, so it never affects the
// load of any other page.

const CDN = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';
const MODEL = 'Xenova/bge-small-en-v1.5';
const QUERY_PREFIX = 'Represent this sentence for searching relevant passages: ';

export type ProgressFn = (pct: number) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pipePromise: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPipe(onProgress?: ProgressFn): Promise<any> {
  if (!pipePromise) {
    pipePromise = (async () => {
      // Function-indirection so neither webpack nor turbopack tries to bundle
      // the CDN URL at build time — it's a pure runtime browser import.
      const importer = new Function('u', 'return import(u)') as (u: string) => Promise<unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TF: any = await importer(CDN);
      TF.env.allowLocalModels = false; // browser → always fetch from the hub
      return TF.pipeline('feature-extraction', MODEL, {
        quantized: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        progress_callback: (p: any) => {
          if (onProgress && p?.status === 'progress' && typeof p.progress === 'number') onProgress(p.progress);
        },
      });
    })().catch((e) => { pipePromise = null; throw e; });
  }
  return pipePromise;
}

export function modelLoaded(): boolean {
  return pipePromise !== null;
}

// Returns a 384-length unit vector for the query, or throws.
export async function embedQueryClient(text: string, onProgress?: ProgressFn): Promise<number[]> {
  const pipe = await getPipe(onProgress);
  const out = await pipe(QUERY_PREFIX + text, { pooling: 'mean', normalize: true });
  return Array.from(out.data as Float32Array);
}
