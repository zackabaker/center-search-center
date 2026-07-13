// Katz-first sweep fixes (owner policy: terms/concepts with no Katz
// definition are removed, not Gans-defined):
// 1. Remove "awe" from the glossary — the corpus has no Katz definition.
// 2. Concept "narrative": replace the Gans-authored defining quote (which was
//    mislabeled as Katz) with Katz's own revision — already mined, verified,
//    and leading the glossary "narrative" term; the Gans quote demotes to a
//    passage.
// 3. Normalize every concept's definitionAuthor to the source post's REAL
//    author (fixes "Dennis Bouvard" variance and credits the co-authored
//    money/market essay to Adam Katz & Zack Baker).
// Usage: npx tsx scripts/katz-sweep-fixes.ts
import { GLOSSARY } from '../src/data/guide/glossary';
import { getPublicPosts } from '../src/lib/parser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const posts = getPublicPosts();
const bySlug = new Map(posts.map((p) => [p.slug, p]));

// ── 1. Glossary: drop awe ────────────────────────────────────────────────
const next = GLOSSARY.filter((e) => e.slug !== 'awe');
if (next.length !== GLOSSARY.length - 1) throw new Error('awe not found in glossary');

const lit = (o: Record<string, unknown>) =>
  '{ ' + Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(', ') + ' }';
const litArr = (arr: Record<string, unknown>[]) => '[' + arr.map(lit).join(', ') + ']';
function serialize(e: (typeof next)[number]): string {
  const parts = [`term: ${JSON.stringify(e.term)}`, `slug: ${JSON.stringify(e.slug)}`];
  if (e.concept) parts.push(`concept: ${JSON.stringify(e.concept)}`);
  parts.push(
    `definitionQuote: ${JSON.stringify(e.definitionQuote)}`,
    `definitionSource: ${JSON.stringify(e.definitionSource)}`,
    `definitionSlug: ${JSON.stringify(e.definitionSlug)}`,
    `posts: ${e.posts}`,
    `passages: ${litArr(e.passages as unknown as Record<string, unknown>[])}`,
    `sources: ${litArr(e.sources as unknown as Record<string, unknown>[])}`
  );
  return `  { ${parts.join(', ')} },`;
}
const GFILE = join(__dirname, '../src/data/guide/glossary.ts');
const graw = readFileSync(GFILE, 'utf8');
const gmark = graw.indexOf('export const GLOSSARY: GlossaryEntry[] = [');
writeFileSync(GFILE, graw.slice(0, gmark) + 'export const GLOSSARY: GlossaryEntry[] = [\n' + next.map(serialize).join('\n') + '\n];\n');
console.log(`glossary: removed awe → ${next.length} terms`);

// ── 2 + 3. Concept glossary: narrative swap + author normalization ─────────
const CFILE = join(__dirname, '../src/data/guide/concept-glossary.json');
const cg = JSON.parse(readFileSync(CFILE, 'utf8'));

const narrTerm = next.find((e) => e.slug === 'narrative');
if (!narrTerm) throw new Error('glossary narrative term missing');
const n = cg['narrative'];
n.passages = [{ text: n.definitionQuote, source: n.definitionSource, sourceSlug: n.definitionSlug }, ...(n.passages || [])];
n.definitionQuote = narrTerm.definitionQuote;
n.definitionSource = narrTerm.definitionSource;
n.definitionSlug = narrTerm.definitionSlug;
console.log('concept narrative: now led by Katz\'s revision (Gans quote demoted to passage)');

let normalized = 0;
for (const [slug, g] of Object.entries<Record<string, unknown> & { definitionSlug?: string; definitionAuthor?: string }>(cg)) {
  if (!g.definitionSlug) continue;
  const post = bySlug.get(g.definitionSlug);
  const real = (post?.author ?? '').trim() ||
    (post?.source === 'chronicle' || post?.source === 'ap' ? 'Eric Gans' : 'Adam Katz');
  if (g.definitionAuthor !== real) {
    g.definitionAuthor = real;
    normalized++;
  }
  void slug;
}
writeFileSync(CFILE, JSON.stringify(cg, null, 2) + '\n');
console.log(`concept authors normalized: ${normalized}`);
