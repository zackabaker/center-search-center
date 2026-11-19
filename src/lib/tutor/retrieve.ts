// Hybrid retrieval for the tutor: keyword rank (BM25 over paragraphs) fused
// with meaning rank (cosine over the paragraph vectors from
// scripts/build-tutor-index.ts) by reciprocal rank. Either half works alone —
// with no vectors on disk, or no query vector, it is keyword-only.
import fs from 'fs';
import path from 'path';
import { getPublicPosts } from '../parser';
import { RETRIEVAL_STOPWORDS } from '../stopwords';
import { stemWord } from '../search-index';
import { dot, EMBED_DIM } from '../vecmath';
import { buildTutorParagraphs, type TutorParagraph } from './corpus';

export interface TutorHit extends TutorParagraph {
  score: number; // fused
  keywordRank: number | null;
  meaningRank: number | null;
  cosine: number | null;
}

const K1 = 1.4;
const B = 0.75;
const RRF_K = 60;
const POOL = 200; // candidates taken from each half before fusing
// Tweets and Reddit comments are short and embed deceptively close to short
// queries; the worked-out texts should win a tie.
const CHATTER = new Set(['twitter', 'reddit']);

const deaccent = (s: string) => s.normalize('NFD').replace(/\p{M}+/gu, '');
function tokens(text: string): string[] {
  return deaccent(text.toLowerCase())
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 1 && !RETRIEVAL_STOPWORDS.has(w))
    .map(stemWord);
}

interface Lexical {
  paras: TutorParagraph[];
  byKey: Map<string, number>;
  postings: Map<string, { doc: number; tf: number }[]>;
  len: Uint32Array;
  avgLen: number;
}
let _lex: Lexical | null = null;
function lexical(): Lexical {
  if (_lex) return _lex;
  const paras = buildTutorParagraphs(getPublicPosts());
  const postings = new Map<string, { doc: number; tf: number }[]>();
  const len = new Uint32Array(paras.length);
  let total = 0;
  for (let d = 0; d < paras.length; d++) {
    const tf = new Map<string, number>();
    const toks = tokens(paras[d].text);
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);
    len[d] = toks.length;
    total += toks.length;
    for (const [t, n] of tf) {
      const list = postings.get(t);
      if (list) list.push({ doc: d, tf: n }); else postings.set(t, [{ doc: d, tf: n }]);
    }
  }
  _lex = {
    paras,
    byKey: new Map(paras.map((p, i) => [p.key, i])),
    postings,
    len,
    avgLen: total / Math.max(1, paras.length),
  };
  return _lex;
}

// Vector row i belongs to the paragraph keys[i] names; `row` maps a paragraph's
// position in the live corpus to its vector row (-1 when it has none yet).
let _vec: { vectors: Float32Array; row: Int32Array } | null | undefined;
function vectors(lex: Lexical) {
  if (_vec !== undefined) return _vec;
  try {
    const dir = path.join(process.cwd(), 'tutor', 'index');
    const keys: string[] = JSON.parse(fs.readFileSync(path.join(dir, 'keys.json'), 'utf-8'));
    const buf = fs.readFileSync(path.join(dir, 'vectors.f32.bin'));
    const all = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4));
    const row = new Int32Array(lex.paras.length).fill(-1);
    for (let i = 0; i < keys.length; i++) {
      const d = lex.byKey.get(keys[i]);
      if (d !== undefined) row[d] = i;
    }
    _vec = { vectors: all, row };
  } catch {
    _vec = null;
  }
  return _vec;
}

export function tutorIndexStatus(): { paragraphs: number; texts: number; embedded: number } {
  const lex = lexical();
  const vec = vectors(lex);
  let embedded = 0;
  if (vec) for (const r of vec.row) if (r >= 0) embedded++;
  return { paragraphs: lex.paras.length, texts: new Set(lex.paras.map((p) => p.slug)).size, embedded };
}

export function tutorRetrieve(
  query: string,
  queryVec: Float32Array | null,
  opts: { limit?: number; perText?: number } = {},
): TutorHit[] {
  const { limit = 24, perText = 3 } = opts;
  const lex = lexical();
  const N = lex.paras.length;

  const bm = new Map<number, number>();
  for (const t of new Set(tokens(query))) {
    const list = lex.postings.get(t);
    if (!list) continue;
    const idf = Math.log(1 + (N - list.length + 0.5) / (list.length + 0.5));
    for (const { doc, tf } of list) {
      const s = idf * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (lex.len[doc] / lex.avgLen)));
      bm.set(doc, (bm.get(doc) ?? 0) + s);
    }
  }
  const keywordTop = [...bm.entries()].sort((a, b) => b[1] - a[1]).slice(0, POOL);

  let meaningTop: [number, number][] = [];
  const vec = queryVec && queryVec.length === EMBED_DIM ? vectors(lex) : null;
  if (vec && queryVec) {
    const scored: [number, number][] = [];
    for (let d = 0; d < N; d++) {
      const r = vec.row[d];
      if (r < 0) continue;
      const cos = dot(queryVec, vec.vectors.subarray(r * EMBED_DIM, (r + 1) * EMBED_DIM));
      scored.push([d, cos * (CHATTER.has(lex.paras[d].source) ? 0.9 : 1)]);
    }
    meaningTop = scored.sort((a, b) => b[1] - a[1]).slice(0, POOL);
  }

  const fused = new Map<number, { score: number; k: number | null; m: number | null; cos: number | null }>();
  keywordTop.forEach(([d], i) => {
    fused.set(d, { score: 1 / (RRF_K + i + 1), k: i + 1, m: null, cos: null });
  });
  meaningTop.forEach(([d, cos], i) => {
    const f = fused.get(d) ?? { score: 0, k: null, m: null, cos: null };
    f.score += 1 / (RRF_K + i + 1);
    f.m = i + 1;
    f.cos = Math.round(cos * 1000) / 1000;
    fused.set(d, f);
  });

  const perSlug = new Map<string, number>();
  // The same paragraph can live in two texts (a book and its chapters, a
  // reposted essay) — show it once, under the better-ranked one.
  const seenText = new Set<string>();
  const out: TutorHit[] = [];
  for (const [d, f] of [...fused.entries()].sort((a, b) => b[1].score - a[1].score)) {
    const p = lex.paras[d];
    const used = perSlug.get(p.slug) ?? 0;
    if (used >= perText) continue;
    const sig = p.text.slice(0, 160);
    if (seenText.has(sig)) continue;
    seenText.add(sig);
    perSlug.set(p.slug, used + 1);
    out.push({ ...p, score: Math.round(f.score * 10000) / 10000, keywordRank: f.k, meaningRank: f.m, cosine: f.cos });
    if (out.length >= limit) break;
  }
  return out;
}
