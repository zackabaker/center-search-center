// Apply the editorial audit's defining-quote corrections to glossary.ts:
// for each flagged term, promote the better defining passage (from the
// entry's own machine-verified passages) to definitionQuote, and demote the
// old defining quote into the passages array in its place. Every string
// involved is already verbatim-verified; this only changes which one leads.
// Usage: npx tsx scripts/fix-glossary-quotes.ts
import { GLOSSARY } from '../src/data/guide/glossary';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// slug → index into that entry's passages[] holding the better defining quote
// (from the 12-agent editorial audit, 2026-07-10).
const SWAPS: Record<string, number> = {
  'aborted-gesture-of-appropriation': 1,
  'consciousness': 1,
  'declarative': 1,
  'interrogative': 1,
  'justice': 1,
  'markets': 0,
  'mimetic-crisis': 0,
  'mimetic-desire': 1,
  'occupied-center': 1,
  'originary-hypothesis': 0,
  'originary-sign': 0,
  'reification': 0,
  'resentment': 0,
  'technics': 1,
  'wisdom': 0,
};

const FILE = join(__dirname, '../src/data/guide/glossary.ts');
let swapped = 0;

const next = GLOSSARY.map((e) => {
  const idx = SWAPS[e.slug];
  if (idx === undefined) return e;
  const p = e.passages[idx];
  if (!p) {
    console.error(`SKIP ${e.slug}: no passage at index ${idx}`);
    return e;
  }
  swapped++;
  const demoted = {
    text: e.definitionQuote,
    slug: e.definitionSlug,
    title: e.definitionSource,
    source: p.source, // best available label; old source string kept in title
  };
  const passages = e.passages.slice();
  passages[idx] = demoted;
  return {
    ...e,
    definitionQuote: p.text,
    definitionSource: p.title,
    definitionSlug: p.slug,
    passages,
  };
});

const raw = readFileSync(FILE, 'utf8');
const headerEnd = raw.indexOf('export const GLOSSARY: GlossaryEntry[] = [');
if (headerEnd === -1) throw new Error('GLOSSARY marker not found');
const header = raw.slice(0, headerEnd);

// Serialize in the file's original object-literal line format —
// generate-term-defs.mjs regex-parses these lines and requires unquoted
// top-level keys (`term: "..."`), not JSON (`"term":"..."`). Key order and
// nested-object style mirror the existing file to keep the diff minimal.
const lit = (o: Record<string, unknown>) =>
  '{ ' +
  Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ') +
  ' }';
const litArr = (arr: Record<string, unknown>[]) => '[' + arr.map(lit).join(', ') + ']';

function serialize(e: (typeof next)[number]): string {
  const parts = [
    `term: ${JSON.stringify(e.term)}`,
    `slug: ${JSON.stringify(e.slug)}`,
  ];
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

const body =
  'export const GLOSSARY: GlossaryEntry[] = [\n' +
  next.map(serialize).join('\n') +
  '\n];\n';

writeFileSync(FILE, header + body);
console.log(`Applied ${swapped}/${Object.keys(SWAPS).length} defining-quote swaps.`);
