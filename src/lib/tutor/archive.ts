// The tutor's archive: every first answer it writes is saved and reused for
// the same question, or one that means the same thing (owner direction,
// 2026-11-19: don't write an answer twice). Only the tutor's own answers ever
// go in. A follow-up is never archived, because it depends on its thread.
//
// Two hashes: the answers by id, and each question's meaning vector by the
// same id, so a lookup reads the small vectors and then one answer.
import type { Redis } from '@upstash/redis';
import { dot, EMBED_DIM } from '../vecmath';
import { keptIdFor } from './kept';

const A = 'tutor:archive';
// Measured on the site's embedding model: rewordings of one question score
// 0.91 and up ("What is X?" / "Can you explain X?"); different questions that
// share most of their words ("…about money?" / "…about debt?") stay under 0.87.
const SAME_QUESTION = 0.9;

export interface Archived {
  q: string;
  a: string;
  sources: unknown[];
  whole: unknown[];
  t: number;
}

const pack = (v: Float32Array) => Buffer.from(v.buffer, v.byteOffset, v.byteLength).toString('base64');
function unpack(s: string): Float32Array | null {
  const b = Buffer.from(s, 'base64');
  if (b.byteLength !== EMBED_DIM * 4) return null;
  return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const parse = (v: unknown): Archived | null => {
  const o = typeof v === 'string' ? JSON.parse(v) : v;
  return o && typeof (o as Archived).a === 'string' ? (o as Archived) : null;
};

/**
 * `ns` separates the short answers written for the search box ('brief') from
 * the tutor's full ones (the default).
 */
export async function findArchived(kv: Redis, question: string, vec: Float32Array | null, ns = ''): Promise<Archived | null> {
  const ANSWERS = ns ? `${A}:${ns}` : A;
  const VECTORS = ns ? `${A}:${ns}:vec` : `${A}:vec`;
  const exact = parse(await kv.hget(ANSWERS, keptIdFor(question)));
  if (exact) return exact;
  if (!vec) return null;
  const vectors = ((await kv.hgetall(VECTORS)) ?? {}) as Record<string, string>;
  let best = '';
  let bestScore = SAME_QUESTION;
  for (const [id, packed] of Object.entries(vectors)) {
    const v = typeof packed === 'string' ? unpack(packed) : null;
    if (!v) continue;
    const s = dot(vec, v);
    if (s >= bestScore) { bestScore = s; best = id; }
  }
  return best ? parse(await kv.hget(ANSWERS, best)) : null;
}

export async function archiveAnswer(kv: Redis, entry: Archived, vec: Float32Array | null, ns = ''): Promise<void> {
  const ANSWERS = ns ? `${A}:${ns}` : A;
  const VECTORS = ns ? `${A}:${ns}:vec` : `${A}:vec`;
  const id = keptIdFor(entry.q);
  await kv.hset(ANSWERS, { [id]: JSON.stringify(entry) });
  if (vec) await kv.hset(VECTORS, { [id]: pack(vec) });
}
