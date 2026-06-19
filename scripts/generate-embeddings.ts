/**
 * Build-time semantic "related essays" index. Embeds each post (title + lead)
 * with the local bge-small model and writes src/data/related.json — a map of
 * slug -> nearest-neighbour slugs by cosine similarity, so discovery is by
 * meaning rather than word overlap.
 *
 * Runs at prebuild after the posts cache. Fully local (bundled model in
 * /models) — no API, no network. Writes nothing and exits cleanly if the model
 * can't load, so the site keeps its lexical fallback (getRelatedEntries).
 */
import fs from 'fs';
import path from 'path';
import { embedPassages, dot, EMBED_DIM } from '../src/lib/embed';

interface Post { slug: string; title: string; content: string; source: string; }

const DATA = path.join(process.cwd(), 'src', 'data');
const LEAD_CHARS = 1800;   // title + opening is enough to characterize an essay
const BATCH = 64;
const NEIGHBOURS = 12;

async function main() {
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(DATA, 'posts-cache.json'), 'utf-8'));
  const texts = posts.map((p) => `${p.title}\n\n${p.content.slice(0, LEAD_CHARS)}`);
  console.log(`embedding ${posts.length} posts for semantic related…`);

  const t0 = Date.now();
  const vecs: Float32Array[] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = await embedPassages(texts.slice(i, i + BATCH));
    if (!batch) {
      console.warn('⚠ embedding model unavailable — skipping related.json (lexical fallback stays).');
      return;
    }
    vecs.push(...batch);
    process.stdout.write(`  ${Math.min(i + BATCH, texts.length)}/${texts.length}\r`);
  }
  console.log(`\nembedded in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  const related: Record<string, { slug: string; score: number }[]> = {};
  for (let i = 0; i < posts.length; i++) {
    const scores: { slug: string; score: number }[] = [];
    for (let k = 0; k < posts.length; k++) {
      if (k === i) continue;
      scores.push({ slug: posts[k].slug, score: dot(vecs[i], vecs[k]) });
    }
    scores.sort((a, b) => b.score - a.score);
    related[posts[i].slug] = scores.slice(0, NEIGHBOURS).map((s) => ({ slug: s.slug, score: Math.round(s.score * 1000) / 1000 }));
  }

  fs.writeFileSync(path.join(DATA, 'related.json'), JSON.stringify(related));
  console.log(`✓ wrote related.json (${posts.length} posts, dim ${EMBED_DIM})`);
}

main().catch((e) => { console.warn('⚠ related-index generation failed; lexical fallback stays in place:', e?.message); });
