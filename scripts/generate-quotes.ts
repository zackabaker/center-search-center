// Build the canonical quote inventory (src/data/quotes.json) — every curated
// verbatim passage in the reference layer becomes an addressable quote with a
// stable content-derived id, served at /q/[id].
//
// Sources: glossary.ts (134 defining quotes + usage passages),
// concept-glossary.json (41 concept defining quotes + passages),
// concept-passages.json (the chronological atlas).
//
// IDs are the first 12 hex chars of SHA-256 over the NFKC-normalized text —
// content-addressed, so they never depend on ordering and never change unless
// the quote text itself changes. Every quote is machine-verified verbatim
// against the corpus before it is admitted; non-verbatim candidates are
// dropped loudly.
//
// Usage: npx tsx scripts/generate-quotes.ts
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { GLOSSARY } from '../src/data/guide/glossary';
import CONCEPT_GLOSSARY from '../src/data/guide/concept-glossary.json';
import CONCEPT_PASSAGES from '../src/data/concept-passages.json';
import { getPublicPosts } from '../src/lib/parser';
import { buildPhraseRegex, elisionSegments } from '../src/lib/phrase-match';

type QuoteRec = {
  id: string;
  text: string;
  sourceSlug: string;
  sourceTitle: string;
  source: string;        // venue key (substack/gablog/…) when known, else label
  date: string | null;
  concepts: string[];    // concept hub slugs this quote evidences
  terms: string[];       // glossary term slugs this quote evidences
  defining: boolean;     // is it a defining quote (vs usage passage)
};

const norm = (s: string) => s.normalize('NFKC').replace(/\s+/g, ' ').trim();
const idFor = (text: string) =>
  createHash('sha256').update(norm(text).toLowerCase()).digest('hex').slice(0, 12);

const posts = getPublicPosts();
const postBySlug = new Map(posts.map((p) => [p.slug, p]));

function isVerbatim(text: string): boolean {
  const segs = elisionSegments(text);
  const targets = segs.length > 0 ? segs : [text];
  return targets.every((seg) => {
    const re = buildPhraseRegex(seg, 5000); // verification: no word cap
    if (!re) return false;
    return posts.some((p) => { re.lastIndex = 0; return re.test(p.content); });
  });
}

const bank = new Map<string, QuoteRec>();
let dropped = 0;

function admit(
  text: string,
  sourceSlug: string,
  sourceTitle: string,
  sourceLabel: string,
  opts: { concept?: string; term?: string; defining?: boolean }
) {
  const t = norm(text);
  if (t.length < 30) return; // too short to be a citable quote page
  const id = idFor(t);
  let rec = bank.get(id);
  if (!rec) {
    if (!isVerbatim(t)) {
      dropped++;
      console.error(`  DROP (not verbatim): "${t.slice(0, 70)}…" [${sourceSlug}]`);
      return;
    }
    const post = postBySlug.get(sourceSlug);
    rec = {
      id,
      text: t,
      sourceSlug,
      sourceTitle: post?.title ?? sourceTitle,
      source: post?.source ?? sourceLabel,
      date: post?.date ?? null,
      concepts: [],
      terms: [],
      defining: false,
    };
    bank.set(id, rec);
  }
  if (opts.concept && !rec.concepts.includes(opts.concept)) rec.concepts.push(opts.concept);
  if (opts.term && !rec.terms.includes(opts.term)) rec.terms.push(opts.term);
  if (opts.defining) rec.defining = true;
}

// 1) Glossary terms — defining quotes + usage passages
for (const e of GLOSSARY) {
  admit(e.definitionQuote, e.definitionSlug, e.definitionSource, '', { term: e.slug, defining: true });
  for (const p of e.passages) admit(p.text, p.slug, p.title, p.source, { term: e.slug });
}

// 2) Concept hubs — defining quotes + passages
type CG = Record<string, { definitionQuote?: string; definitionSource?: string; definitionSlug?: string; passages?: { text: string; source: string; sourceSlug: string }[] }>;
for (const [slug, g] of Object.entries(CONCEPT_GLOSSARY as CG)) {
  if (g.definitionQuote && g.definitionSlug) {
    admit(g.definitionQuote, g.definitionSlug, g.definitionSource ?? '', '', { concept: slug, defining: true });
  }
  for (const p of g.passages ?? []) admit(p.text, p.sourceSlug, p.source, p.source, { concept: slug });
}

// 3) Concept atlas — chronological corpus passages
type CP = Record<string, { slug: string; title: string; date: string | null; text: string }[]>;
for (const [slug, arr] of Object.entries(CONCEPT_PASSAGES as CP)) {
  for (const p of arr) admit(p.text, p.slug, p.title, '', { concept: slug });
}

const quotes = [...bank.values()].sort((a, b) => a.id.localeCompare(b.id));
const out = join(__dirname, '../src/data/quotes.json');
writeFileSync(out, JSON.stringify(quotes) + '\n');
console.log(`quotes.json: ${quotes.length} quotes (${quotes.filter((q) => q.defining).length} defining), ${dropped} dropped as non-verbatim`);
