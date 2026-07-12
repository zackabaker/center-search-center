// Apply the Katz-first defining-quote policy: swap in the mined Katz
// definitions for the terms that were led by Gans quotes. Reads the mining
// workflow's output JSON directly (exact strings — no retyping). "awe" is
// excluded by policy: the corpus has no genuine Katz definition, so the Gans
// quote stays (rendered with an explicit author label).
// Usage: npx tsx scripts/apply-katz-definitions.ts <mining-output.json>
import { GLOSSARY } from '../src/data/guide/glossary';
import { getAllPosts } from '../src/lib/parser';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const KEEP_GANS = new Set(['awe']);

const outPath = process.argv[2];
if (!outPath) throw new Error('usage: apply-katz-definitions.ts <mining-output.json>');
const mined: { slug: string; found: boolean; quote: string; sourceSlug: string; quality: string }[] =
  JSON.parse(readFileSync(outPath, 'utf8')).result;

const posts = getAllPosts();
const bySlug = new Map(posts.map((p) => [p.slug, p]));
const SOURCE_LABEL: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'Essay',
  chronicle: 'Chronicles', ap: 'AP Journal', reddit: 'Substack', twitter: 'Substack',
};
const norm = (s: string) =>
  s.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();

let applied = 0;
const next = GLOSSARY.map((e) => {
  const m = mined.find((x) => x.slug === e.slug);
  if (!m || !m.found || KEEP_GANS.has(e.slug)) return e;
  const post = bySlug.get(m.sourceSlug);
  if (!post) { console.error(`SKIP ${e.slug}: source ${m.sourceSlug} missing`); return e; }
  if (!norm(post.content).includes(norm(m.quote))) {
    console.error(`SKIP ${e.slug}: quote NOT verbatim in ${m.sourceSlug}`);
    return e;
  }
  applied++;
  const demoted = {
    text: e.definitionQuote,
    slug: e.definitionSlug,
    title: e.definitionSource,
    source: SOURCE_LABEL[bySlug.get(e.definitionSlug)?.source ?? ''] ?? 'Chronicles',
  };
  return {
    ...e,
    definitionQuote: m.quote.normalize('NFKC').replace(/\s+/g, ' ').trim(),
    definitionSource: post.title,
    definitionSlug: post.slug,
    passages: [demoted, ...e.passages],
  };
});

// Faithful serializer (same as fix-glossary-quotes.ts) — generate-term-defs.mjs
// regex-parses these lines and requires object-literal keys, not JSON.
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

const FILE = join(__dirname, '../src/data/guide/glossary.ts');
const raw = readFileSync(FILE, 'utf8');
const headerEnd = raw.indexOf('export const GLOSSARY: GlossaryEntry[] = [');
if (headerEnd === -1) throw new Error('marker not found');
writeFileSync(FILE, raw.slice(0, headerEnd) + 'export const GLOSSARY: GlossaryEntry[] = [\n' + next.map(serialize).join('\n') + '\n];\n');
console.log(`Applied ${applied} Katz definitions (awe kept Gans by policy).`);
