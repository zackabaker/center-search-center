// Runtime semantic search over the build-time corpus embeddings. Loads the
// vector file + metadata once per process and ranks chunks by cosine similarity
// to a query vector. Everything is optional: if the index files are missing the
// loaders return empty, and callers keep their lexical behaviour.

import fs from 'fs';
import path from 'path';
import { dot, EMBED_DIM } from './vecmath';

interface ChunkMeta { slug: string; title: string; source: string; text: string; }

interface SemanticIndex {
  dim: number;
  vectors: Float32Array;   // meta.length * dim, row-major
  chunks: ChunkMeta[];
}

let _index: SemanticIndex | null | undefined; // undefined = not tried; null = unavailable

function loadIndex(): SemanticIndex | null {
  if (_index !== undefined) return _index;
  try {
    const dir = path.join(process.cwd(), 'vectors');
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'embeddings-meta.json'), 'utf-8')) as { dim: number; chunks: ChunkMeta[] };
    const buf = fs.readFileSync(path.join(dir, 'embeddings.f32.bin'));
    const vectors = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
    _index = { dim: meta.dim || EMBED_DIM, vectors, chunks: meta.chunks };
  } catch {
    _index = null;
  }
  return _index;
}

export interface SemanticChunk { slug: string; title: string; source: string; text: string; score: number; }

// Top-k chunks by cosine similarity to the query vector. One chunk per post by
// default (best-scoring), so a single long essay can't flood the results.
export function semanticChunks(queryVec: Float32Array, k = 12, onePerPost = true): SemanticChunk[] {
  const idx = loadIndex();
  if (!idx) return [];
  const { vectors, chunks, dim } = idx;
  const scored: SemanticChunk[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const v = vectors.subarray(i * dim, (i + 1) * dim);
    scored.push({ ...chunks[i], score: dot(queryVec, v) });
  }
  scored.sort((a, b) => b.score - a.score);
  if (!onePerPost) return scored.slice(0, k);
  const seen = new Set<string>();
  const out: SemanticChunk[] = [];
  for (const c of scored) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
    if (out.length >= k) break;
  }
  return out;
}

export function semanticAvailable(): boolean {
  return loadIndex() !== null;
}
