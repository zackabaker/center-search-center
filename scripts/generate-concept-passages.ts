/**
 * Concept Atlas index. For each curated concept, embeds its definition and finds
 * the passages across the WHOLE corpus that express it most directly, then orders
 * them by date — so a concept page can show how the idea develops over 15+ years.
 *
 * Writes src/data/concept-passages.json: { conceptSlug: [{slug,title,date,text,score}] }.
 * Build-time only; the corpus chunk vectors are intermediate (never persisted or
 * bundled). Exits cleanly if the model can't load.
 */
import fs from 'fs';
import path from 'path';
import { CONCEPTS } from '../src/data/guide/concepts';
import { embedPassages, embedQuery, dot, EMBED_DIM } from '../src/lib/embed';

interface Post { slug: string; title: string; content: string; source: string; date: string | null; }

const DATA = path.join(process.cwd(), 'src', 'data');
const CHUNK_TARGET = 900;
const MAX_CHUNKS_PER_POST = 14;
const BATCH = 64;
const PER_CONCEPT = 10;
const MIN_SCORE = 0.5;

function chunkPost(content: string): string[] {
  const paras = content.split(/\n\n+/).map((p) => p.trim()).filter((p) => p.length > 60);
  const chunks: string[] = [];
  let buf = '';
  for (const p of paras) {
    buf = buf ? `${buf}\n\n${p}` : p;
    if (buf.length >= CHUNK_TARGET) { chunks.push(buf); buf = ''; }
    if (chunks.length >= MAX_CHUNKS_PER_POST) break;
  }
  if (buf && chunks.length < MAX_CHUNKS_PER_POST) chunks.push(buf);
  return chunks;
}

function dateKey(d: string | null): number {
  if (!d) return Number.MAX_SAFE_INTEGER; // undated → last
  const t = new Date(d).getTime();
  return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

async function main() {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(DATA, 'posts-cache.json'), 'utf-8'));

  // Build chunk list with provenance.
  const meta: { slug: string; title: string; source: string; date: string | null; text: string }[] = [];
  for (const p of posts) {
    for (const text of chunkPost(p.content)) {
      meta.push({ slug: p.slug, title: p.title, source: p.source, date: p.date, text });
    }
  }
  console.log(`embedding ${meta.length} chunks for the concept atlas…`);

  const t0 = Date.now();
  const vectors = new Float32Array(meta.length * EMBED_DIM);
  for (let i = 0; i < meta.length; i += BATCH) {
    const vecs = await embedPassages(meta.slice(i, i + BATCH).map((m) => m.text));
    if (!vecs) { console.warn('⚠ model unavailable — skipping concept atlas.'); return; }
    for (let j = 0; j < vecs.length; j++) vectors.set(vecs[j], (i + j) * EMBED_DIM);
    process.stdout.write(`  ${Math.min(i + BATCH, meta.length)}/${meta.length}\r`);
  }
  console.log(`\nembedded in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  // Persist the chunk vectors + metadata for runtime semantic search. These go
  // in /vectors (NOT src/data) so they're traced only into the /api/semantic
  // function — never bundled into every serverless function.
  const VEC = path.join(process.cwd(), 'vectors');
  fs.mkdirSync(VEC, { recursive: true });
  fs.writeFileSync(path.join(VEC, 'embeddings.f32.bin'), Buffer.from(vectors.buffer));
  fs.writeFileSync(path.join(VEC, 'embeddings-meta.json'), JSON.stringify({ dim: EMBED_DIM, chunks: meta }));
  console.log(`✓ wrote vectors/embeddings.f32.bin (${(vectors.byteLength / 1e6).toFixed(1)} MB) + meta`);

  const out: Record<string, { slug: string; title: string; date: string | null; text: string; score: number }[]> = {};
  for (const concept of CONCEPTS) {
    const q = await embedQuery(`${concept.title}: ${concept.definition}`);
    if (!q) { console.warn('⚠ query embed failed — skipping concept atlas.'); return; }
    const scored = meta.map((m, i) => ({ i, score: dot(q, vectors.subarray(i * EMBED_DIM, (i + 1) * EMBED_DIM)) }));
    scored.sort((a, b) => b.score - a.score);
    const seen = new Set<string>();
    const picked: { slug: string; title: string; date: string | null; text: string; score: number }[] = [];
    for (const s of scored) {
      if (s.score < MIN_SCORE) break;
      const m = meta[s.i];
      if (seen.has(m.slug)) continue;
      seen.add(m.slug);
      picked.push({ slug: m.slug, title: m.title, date: m.date, text: m.text, score: Math.round(s.score * 1000) / 1000 });
      if (picked.length >= PER_CONCEPT) break;
    }
    picked.sort((a, b) => dateKey(a.date) - dateKey(b.date)); // chronological → development over time
    out[concept.slug] = picked;
  }

  fs.writeFileSync(path.join(DATA, 'concept-passages.json'), JSON.stringify(out));
  const total = Object.values(out).reduce((n, a) => n + a.length, 0);
  console.log(`✓ wrote concept-passages.json (${CONCEPTS.length} concepts, ${total} passages)`);
}

main().catch((e) => { console.warn('⚠ concept atlas generation failed; concept pages keep curated passages only:', e?.message); });
