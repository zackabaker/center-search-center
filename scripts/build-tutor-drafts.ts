/**
 * First drafts of the tutor's three reviewed files, mined from the corpus and
 * the site's existing curated data. Run by hand (npx tsx scripts/build-tutor-drafts.ts);
 * the outputs under tutor/ are then the owner's to edit, so this is NOT part
 * of the build — re-running it overwrites hand edits.
 *
 *   tutor/glossary.json          per term: defining quote, "is not" candidates,
 *                                canonical passages (paragraph links), related terms
 *   tutor/coverage.json          per term: how much the archive has, and where
 *   tutor/canon-candidates.json  ranked candidate texts for the whole-essay canon
 *
 * Everything quoted is verbatim from a paragraph of the corpus; nothing here
 * is written by a model.
 */
import fs from 'fs';
import path from 'path';
import { GLOSSARY } from '../src/data/guide/glossary';
import { CONCEPTS } from '../src/data/guide/concepts';
import { READING_PATHS } from '../src/data/guide/reading-paths';
import { buildTutorParagraphs, type TutorParagraph } from '../src/lib/tutor/corpus';
import type { Post } from '../src/lib/types';

const ROOT = process.cwd();
const posts: Post[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'posts-cache.json'), 'utf-8'));
const quotes: { sourceSlug: string }[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'quotes.json'), 'utf-8'));
const paras = buildTutorParagraphs(posts);
const lower = paras.map((p) => p.text.toLowerCase());
const CHATTER = new Set(['twitter', 'reddit']);
const postBySlug = new Map(posts.map((p) => [p.slug, p]));

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function termRegex(term: string): RegExp {
  const base = term.toLowerCase().replace(/^the\s+/, '').replace(/\s*\(.*\)\s*$/, '').trim();
  const body = base.split(/[\s-]+/).map(esc).join('[\\s-]+');
  return new RegExp(`(?<![a-z])${body}(?:s|es)?(?![a-z])`, 'i');
}
const norm = (s: string) => s.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
function linkFor(slug: string, quote: string): string {
  const probe = norm(quote).slice(0, 70);
  const hit = paras.find((p) => p.slug === slug && norm(p.text).includes(probe));
  return hit ? hit.url : `/post/${slug}`;
}

// ── per-term matches ─────────────────────────────────────────────────────────
const matches = new Map<string, number[]>();
for (const g of GLOSSARY) {
  const re = termRegex(g.term);
  const idx: number[] = [];
  for (let i = 0; i < paras.length; i++) if (re.test(lower[i])) idx.push(i);
  matches.set(g.slug, idx);
}

// ── coverage ─────────────────────────────────────────────────────────────────
const coverage = GLOSSARY.map((g) => {
  const idx = matches.get(g.slug)!;
  const perText = new Map<string, number>();
  for (const i of idx) {
    if (CHATTER.has(paras[i].source)) continue;
    perText.set(paras[i].slug, (perText.get(paras[i].slug) ?? 0) + 1);
  }
  const texts = perText.size;
  return {
    term: g.term,
    slug: g.slug,
    paragraphs: idx.length,
    texts,
    depth: texts >= 40 ? 'extensive' : texts >= 12 ? 'substantial' : texts >= 4 ? 'some' : 'thin',
    fullest: [...perText.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([slug, n]) => ({
      slug, title: postBySlug.get(slug)?.title ?? slug, paragraphs: n, url: `/post/${slug}`,
    })),
  };
});

// ── glossary ─────────────────────────────────────────────────────────────────
const CONTRAST = /\b(?:is|are|was|does|do) not\b|\bisn['’]t\b|\brather than\b|\bas opposed to\b|\bnot to be confused\b|\bshould not be\b|\bnot (?:a|an|the|simply|merely|just)\b/i;
function isNotCandidates(term: string, idx: number[]): { quote: string; title: string; url: string }[] {
  const re = termRegex(term);
  const found: { quote: string; p: TutorParagraph; rank: number }[] = [];
  for (const i of idx) {
    const p = paras[i];
    if (CHATTER.has(p.source)) continue;
    for (const s of p.text.match(/[^.!?]+[.!?]+["”’)]*/g) ?? []) {
      const t = s.trim();
      if (t.length < 70 || t.length > 320) continue;
      const m = re.exec(t);
      const c = CONTRAST.exec(t);
      // The term has to come first: "X is not Y", not "Y is not X".
      if (!m || !c || m.index > c.index || c.index - m.index > 90) continue;
      found.push({ quote: t, p, rank: m.index + (c.index - m.index) });
    }
  }
  const seen = new Set<string>();
  return found
    .sort((a, b) => a.rank - b.rank)
    .filter((f) => (seen.has(f.p.slug) ? false : (seen.add(f.p.slug), true)))
    .slice(0, 3)
    .map((f) => ({ quote: f.quote, title: f.p.title, url: f.p.url }));
}

const conceptBySlug = new Map(CONCEPTS.map((c) => [c.slug, c]));
const termBySlug = new Map(GLOSSARY.map((g) => [g.slug, g.term]));
const sets = new Map([...matches.entries()].map(([k, v]) => [k, new Set(v)]));
function related(slug: string): string[] {
  const a = sets.get(slug)!;
  if (a.size === 0) return [];
  const scored: [string, number][] = [];
  for (const [other, b] of sets) {
    if (other === slug || b.size === 0) continue;
    let both = 0;
    for (const i of a) if (b.has(i)) both++;
    if (both >= 3) scored.push([other, both / Math.sqrt(a.size * b.size)]);
  }
  return scored.sort((x, y) => y[1] - x[1]).slice(0, 5).map(([s]) => termBySlug.get(s)!);
}

const glossary = GLOSSARY.map((g) => {
  const concept = g.concept ? conceptBySlug.get(g.concept) : undefined;
  return {
    term: g.term,
    slug: g.slug,
    definition: { quote: g.definitionQuote, title: g.definitionSource, url: linkFor(g.definitionSlug, g.definitionQuote) },
    // Candidates only: sentences where the archive says what the term is not,
    // or sets it against something. Keep, replace or delete each one.
    isNot: isNotCandidates(g.term, matches.get(g.slug)!),
    passages: g.passages.slice(0, 3).map((p) => ({ quote: p.text, title: p.title, url: linkFor(p.slug, p.text) })),
    related: [...new Set([...(concept?.relations ?? []).map((r) => conceptBySlug.get(r)?.title ?? r), ...related(g.slug)])].slice(0, 6),
  };
});

// ── canon candidates ─────────────────────────────────────────────────────────
const add = (m: Map<string, number>, k: string, n = 1) => m.set(k, (m.get(k) ?? 0) + n);
const inPaths = new Map<string, number>();
for (const rp of READING_PATHS) for (const p of rp.posts) add(inPaths, p.slug);
const defines = new Map<string, number>();
const cited = new Map<string, number>();
for (const g of GLOSSARY) {
  add(defines, g.definitionSlug);
  for (const p of g.passages) add(cited, p.slug);
  for (const s of g.sources) add(cited, s.slug);
}
for (const c of CONCEPTS) for (const p of c.posts) add(cited, p.slug, 2);
const quoted = new Map<string, number>();
for (const q of quotes) add(quoted, q.sourceSlug);
const fullestFor = new Map<string, number>();
for (const c of coverage) for (const f of c.fullest.slice(0, 3)) add(fullestFor, f.slug);

// The owner's pins, and what readers actually open (a snapshot of the site's
// view counts, plus Substack likes), sit on top of the curation signals.
const pins: string[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'tutor', 'canon-pins.json'), 'utf-8')).pinned;
const pop = JSON.parse(fs.readFileSync(path.join(ROOT, 'tutor', 'popularity.json'), 'utf-8')) as { mostViewedAllTime: string[]; recentlyPopular: string[] };

const candidates = posts
  .filter((p) => ['substack', 'gablog', 'pdf', 'book'].includes(p.source))
  .map((p) => {
    const words = p.content.split(/\s+/).length;
    const why = {
      readingPaths: inPaths.get(p.slug) ?? 0,
      definesTerms: defines.get(p.slug) ?? 0,
      citedInGlossary: cited.get(p.slug) ?? 0,
      curatedQuotes: quoted.get(p.slug) ?? 0,
      fullestTreatmentOf: fullestFor.get(p.slug) ?? 0,
      pinned: pins.includes(p.slug),
      mostViewed: pop.mostViewedAllTime.includes(p.slug) || pop.recentlyPopular.includes(p.slug),
      substackLikes: p.source === 'substack' ? (p.likes ?? 0) : 0,
    };
    // Curation is capped so a long essay the glossary leans on heavily can't
    // outrank everything; readership counts for about as much as curation.
    const curation = why.readingPaths * 4 + why.definesTerms * 2 + why.citedInGlossary + why.curatedQuotes * 0.5 + why.fullestTreatmentOf * 1.5;
    const score = (why.pinned ? 100 : 0) + Math.min(curation, 16) + (why.mostViewed ? 10 : 0) + why.substackLikes * 2.5;
    return { slug: p.slug, title: p.title, source: p.source, date: p.date, words, estTokens: Math.round(words * 1.35), score: Math.round(score * 10) / 10, why };
  })
  // A whole book can't be "loaded whole"; its chapters are separate entries.
  .filter((c) => c.words >= 700 && c.words <= 12000 && c.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 90);
let running = 0;
const canon = candidates.map((c, i) => {
  const include = i < 50;
  if (include) running += c.estTokens;
  return { include, ...c };
});

const out = path.join(ROOT, 'tutor');
fs.mkdirSync(out, { recursive: true });
const write = (name: string, rows: unknown[]) =>
  fs.writeFileSync(path.join(out, name), '[\n' + rows.map((r) => '  ' + JSON.stringify(r)).join(',\n') + '\n]\n');
write('glossary.json', glossary);
write('coverage.json', coverage);
write('canon-candidates.json', canon);

const depth = (d: string) => coverage.filter((c) => c.depth === d).length;
console.log(`glossary: ${glossary.length} terms; ${glossary.filter((g) => g.isNot.length > 0).length} have "is not" candidates; ${glossary.filter((g) => g.definition.url.includes('#p-')).length} definitions linked to a paragraph`);
console.log(`coverage: extensive ${depth('extensive')}, substantial ${depth('substantial')}, some ${depth('some')}, thin ${depth('thin')}`);
console.log(`canon: ${canon.length} candidates; first 50 ≈ ${running.toLocaleString('en-US')} tokens (estimate, words × 1.35)`);
