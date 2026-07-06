#!/usr/bin/env node
// Generates src/data/term-defs.json — the slim client-side payload behind the
// term-link hover cards. Quote-first even in the tooltip: each entry is the
// term's verbatim defining quote + source.
//
// Keys: "c:<concept-slug>" for concept hubs, "g:<glossary-slug>" for glossary
// terms. Re-run after editing concept-glossary.json or glossary.ts.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = {};

// ── Concepts: verbatim defining quotes from concept-glossary.json ───────────
const cg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/guide/concept-glossary.json'), 'utf8'));
const csTerms = fs.readFileSync(path.join(ROOT, 'src/lib/cs-terms.ts'), 'utf8');
const titles = {};
for (const m of csTerms.matchAll(/'([a-z0-9-]+)': '((?:[^'\\]|\\')+)',/g)) {
  titles[m[1]] = m[2].replace(/\\'/g, "'");
}
for (const [slug, entry] of Object.entries(cg)) {
  if (!entry.definitionQuote) continue;
  out[`c:${slug}`] = {
    t: titles[slug] || slug,
    q: entry.definitionQuote,
    s: entry.definitionSource || '',
    href: `/guide/concepts/${slug}`,
  };
}

// ── Glossary terms: quote-first definitions from glossary.ts ────────────────
// (definitionQuote fields exist once the quote-first flip has run; entries
// without one are skipped — their links simply have no hover card.)
const g = fs.readFileSync(path.join(ROOT, 'src/data/guide/glossary.ts'), 'utf8');
for (const line of g.split('\n')) {
  const m = line.match(/^\s*\{ term: "((?:[^"\\]|\\.)+)", slug: "([^"]+)",/);
  if (!m) continue;
  const term = m[1].replace(/\\"/g, '"');
  const slug = m[2];
  const dq = line.match(/definitionQuote: "((?:[^"\\]|\\.)*)"/);
  const ds = line.match(/definitionSource: "((?:[^"\\]|\\.)*)"/);
  if (!dq) continue;
  // Skip terms whose concept hub already provides the card (concept link wins).
  const conceptM = line.match(/concept: "([a-z0-9-]+)"/);
  out[`g:${slug}`] = {
    t: term,
    q: JSON.parse(`"${dq[1]}"`),
    s: ds ? JSON.parse(`"${ds[1]}"`) : '',
    href: conceptM ? `/guide/concepts/${conceptM[1]}` : `/concepts?view=glossary#${slug}`,
  };
}

const file = path.join(ROOT, 'src/data/term-defs.json');
fs.writeFileSync(file, JSON.stringify(out) + '\n');
const size = fs.statSync(file).size;
console.log(`✓ term-defs.json: ${Object.keys(out).length} entries, ${(size / 1024).toFixed(1)} KB`);
