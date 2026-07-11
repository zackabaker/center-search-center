// Audit the 134 glossary defining quotes: is each definitionQuote verbatim in
// its claimed source text (and anywhere in the corpus)? Mechanical pass only —
// editorial "does it actually define the term" judgment happens separately.
// Usage: npx tsx scripts/audit-glossary-quotes.ts [--json out.json]
import { GLOSSARY } from '../src/data/guide/glossary';
import { getAllPosts } from '../src/lib/parser';
import { writeFileSync } from 'fs';

// Same normalization family as verify-answers/verify-quotes: NFKC, curly →
// straight quotes, dash variants, collapse whitespace.
function norm(s: string): string {
  return s
    .normalize('NFKC')
    .replace(/[‘’‚‛]/g, "'")
    .replace(/[“”„‟]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const posts = getAllPosts();
const bySlug = new Map(posts.map((p) => [p.slug, p]));
const normCache = new Map<string, string>();
function normContent(slug: string): string | null {
  if (!normCache.has(slug)) {
    const p = bySlug.get(slug);
    normCache.set(slug, p ? norm(p.title + ' ' + p.content) : '');
  }
  return normCache.get(slug) || null;
}

type Row = {
  slug: string;
  term: string;
  inClaimedSource: boolean;
  inCorpus: boolean;
  claimedSlug: string;
  quoteHead: string;
};

const rows: Row[] = [];
let fullCorpus: string | null = null;

for (const e of GLOSSARY) {
  const q = norm(e.definitionQuote);
  const claimed = normContent(e.definitionSlug);
  const inClaimedSource = !!claimed && claimed.includes(q);
  let inCorpus = inClaimedSource;
  if (!inCorpus) {
    if (fullCorpus === null) fullCorpus = posts.map((p) => norm(p.content)).join('\n');
    inCorpus = fullCorpus.includes(q);
  }
  rows.push({
    slug: e.slug,
    term: e.term,
    inClaimedSource,
    inCorpus,
    claimedSlug: e.definitionSlug,
    quoteHead: e.definitionQuote.slice(0, 70),
  });
}

const badSource = rows.filter((r) => !r.inClaimedSource && r.inCorpus);
const notVerbatim = rows.filter((r) => !r.inCorpus);

console.log(`${rows.length} glossary entries`);
console.log(`  verbatim in claimed source: ${rows.filter((r) => r.inClaimedSource).length}`);
console.log(`  verbatim elsewhere only (wrong source attribution): ${badSource.length}`);
console.log(`  NOT verbatim anywhere: ${notVerbatim.length}`);
for (const r of badSource) console.log(`  [wrong-source] ${r.slug} (claims ${r.claimedSlug}): "${r.quoteHead}…"`);
for (const r of notVerbatim) console.log(`  [NOT-VERBATIM] ${r.slug}: "${r.quoteHead}…"`);

const jsonIdx = process.argv.indexOf('--json');
if (jsonIdx !== -1 && process.argv[jsonIdx + 1]) {
  writeFileSync(process.argv[jsonIdx + 1], JSON.stringify(rows, null, 2));
  console.log(`wrote ${process.argv[jsonIdx + 1]}`);
}
