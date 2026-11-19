/**
 * The tutor's corpus index. Embeds every paragraph of the public Katz texts
 * (no per-text cap) and writes plain files under tutor/index/:
 *
 *   paragraphs.jsonl  one paragraph per line: key, title, author, date, url, text
 *   keys.json         the paragraph keys, in vector order
 *   vectors.f32.bin   one 384-float unit vector per key (bge-small-en-v1.5)
 *
 * Vectors are cached by text hash under .next/cache, so a deploy only embeds
 * new or changed paragraphs. Exits cleanly if the model can't load — retrieval
 * then runs on keywords alone.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { buildTutorParagraphs } from '../src/lib/tutor/corpus';
import { embedPassages, EMBED_DIM } from '../src/lib/embed';
import type { Post } from '../src/lib/types';

const OUT = path.join(process.cwd(), 'tutor', 'index');
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'cs-tutor-embeddings');
const CACHE_VERSION = `bge-small-en-v1.5/${EMBED_DIM}`;
const BATCH = 32;

async function main() {
  const posts: Post[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'posts-cache.json'), 'utf-8'),
  );
  const paras = buildTutorParagraphs(posts);
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(
    path.join(OUT, 'paragraphs.jsonl'),
    paras.map((p) => JSON.stringify(p)).join('\n') + '\n',
  );
  console.log(`tutor index: ${paras.length} paragraphs from ${new Set(paras.map((p) => p.slug)).size} texts`);

  const hashOf = (t: string) => crypto.createHash('sha1').update(t).digest('hex');
  const cache = new Map<string, Float32Array>();
  try {
    if (fs.readFileSync(path.join(CACHE_DIR, 'version'), 'utf-8').trim() === CACHE_VERSION) {
      const keys: string[] = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, 'keys.json'), 'utf-8'));
      const buf = fs.readFileSync(path.join(CACHE_DIR, 'vectors.f32.bin'));
      const all = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4));
      for (let i = 0; i < keys.length; i++) cache.set(keys[i], all.subarray(i * EMBED_DIM, (i + 1) * EMBED_DIM));
    }
  } catch { /* no cache — embed everything */ }

  const hashes = paras.map((p) => hashOf(p.text));
  const vectors = new Float32Array(paras.length * EMBED_DIM);
  const todo: number[] = [];
  for (let i = 0; i < paras.length; i++) {
    const hit = cache.get(hashes[i]);
    if (hit) vectors.set(hit, i * EMBED_DIM); else todo.push(i);
  }
  console.log(`embedding ${todo.length} paragraphs (${paras.length - todo.length} reused)…`);
  const t0 = Date.now();
  for (let b = 0; b < todo.length; b += BATCH) {
    const idxs = todo.slice(b, b + BATCH);
    const vecs = await embedPassages(idxs.map((i) => paras[i].text));
    if (!vecs) {
      console.warn('⚠ embedding model unavailable — tutor retrieval will be keyword-only.');
      return;
    }
    for (let j = 0; j < vecs.length; j++) vectors.set(vecs[j], idxs[j] * EMBED_DIM);
    if (b % (BATCH * 20) === 0) console.log(`  ${Math.min(b + BATCH, todo.length)}/${todo.length}`);
  }
  console.log(`embedded in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

  const bytes = Buffer.from(vectors.buffer, vectors.byteOffset, vectors.byteLength);
  fs.writeFileSync(path.join(OUT, 'vectors.f32.bin'), bytes);
  fs.writeFileSync(path.join(OUT, 'keys.json'), JSON.stringify(paras.map((p) => p.key)));
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(path.join(CACHE_DIR, 'version'), CACHE_VERSION);
    fs.writeFileSync(path.join(CACHE_DIR, 'keys.json'), JSON.stringify(hashes));
    fs.writeFileSync(path.join(CACHE_DIR, 'vectors.f32.bin'), bytes);
  } catch (e) { console.warn('⚠ could not write tutor embedding cache:', (e as Error)?.message); }
  console.log(`✓ wrote tutor/index (${(bytes.byteLength / 1e6).toFixed(1)} MB of vectors)`);
}

main().catch((e) => { console.warn('⚠ tutor index failed:', e?.message ?? e); });
