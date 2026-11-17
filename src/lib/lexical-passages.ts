// Wording-based passage retrieval — the lexical half of Ask's excerpts.
//
// Embedding search ranks by overall meaning, so a query that half-remembers a
// specific sentence ("tears in the social fabric") surfaces passages that are
// broadly about social order and misses the one sentence that actually says
// it. This finds short stretches of text where the query's DISTINCTIVE words
// (rare across the corpus) occur close together, so that sentence wins.
//
// It deliberately stays silent on conceptual questions made of common
// vocabulary ("resentment and the sacred"): those need meaning search, and a
// lexical hit there would be noise.

import { getPublicPosts } from './parser';
import { ARCHIVAL_SOURCES } from './types';
import { escapeRe, phraseWords } from './phrase-match';
import { splitPostParagraphs } from './post-paragraphs';

export interface LexicalPassage {
  slug: string;
  title: string;
  source: string;
  /** Verbatim slice of one paragraph, centred on the matching stretch. */
  text: string;
  /** Share of the query's rarity-weighted words found in the stretch, 0–1. */
  coverage: number;
}

const STOP = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'was', 'one', 'our', 'out', 'had', 'has',
  'his', 'her', 'him', 'its', 'who', 'did', 'get', 'how', 'may', 'say', 'she', 'use', 'way', 'also', 'been',
  'does', 'from', 'have', 'here', 'into', 'just', 'know', 'like', 'look', 'made', 'make', 'more', 'most',
  'much', 'need', 'only', 'over', 'said', 'same', 'than', 'that', 'them', 'then', 'they', 'this', 'time',
  'very', 'what', 'when', 'with', 'will', 'your', 'about', 'after', 'again', 'being', 'could', 'doing',
  'every', 'first', 'other', 'since', 'some', 'still', 'there', 'these', 'think', 'those', 'through',
  'under', 'where', 'which', 'while', 'would', 'their', 'both', 'each', 'even', 'such', 'were', 'whether',
  'within', 'without', 'katz', 'bouvard', 'center', 'study', 'say', 'says', 'mean', 'means', 'quote',
  'passage', 'find', 'wrote', 'write', 'writes',
]);

/** Words must sit within this many characters of each other to count as one stretch. */
const WINDOW = 420;
/** A word is "distinctive" when it appears in under this share of texts. */
const RARE_SHARE = 0.12;

interface Doc { slug: string; title: string; source: string; lower: string; paras: string[]; }

let _docs: Doc[] | null = null;
function docs(): Doc[] {
  if (!_docs) {
    _docs = getPublicPosts()
      .filter((p) => !ARCHIVAL_SOURCES.includes(p.source))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        source: p.source,
        lower: p.content.toLowerCase(),
        // The reader's own split, so the excerpt's p-N anchor lands right.
        paras: splitPostParagraphs(p.content),
      }));
  }
  return _docs;
}

// "tears" → tear, "identities" → identit; matched with a short suffix allowance
// so tear / tears / tearing all hit.
function stem(w: string): string {
  if (w.length >= 6 && w.endsWith('ies')) return w.slice(0, -3);
  if (w.length >= 6 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length >= 5 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length >= 4 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

function termRegex(base: string, flags: string): RegExp {
  return new RegExp(`(?<![a-z0-9])${escapeRe(base)}(?:s|es|ed|ing|y|ies)?(?![a-z0-9])`, flags);
}

/** Distinct content-word stems of a query — shared with the semantic route's
    term-presence boost so both sides agree on what the query's words are. */
export function queryBases(query: string, max = 12): string[] {
  return Array.from(
    new Set(phraseWords(query).filter((w) => w.length >= 3 && !STOP.has(w)).map(stem)),
  ).slice(0, max);
}

/** True when the text contains every base (inflections allowed). */
export function containsBases(text: string, bases: string[]): boolean {
  return bases.length > 0 && bases.every((b) => termRegex(b, 'i').test(text));
}

// ── Single-word mode ────────────────────────────────────────────────────────
// The default search chips submit bare core vocabulary ("scapegoating"), which
// the phrase path above refuses (one word, and GA's core terms appear in far
// more than RARE_SHARE of texts) — leaving those queries to embeddings alone,
// whose cosine band is too tight on a single word to separate texts ABOUT the
// term from texts vaguely near it. Rank instead by how centrally a text uses
// the word: a title match, then occurrence count, with chatter subordinated.
const SINGLE_MAX_SHARE = 0.35;
const SINGLE_TIER: Record<string, number> = { reddit: 0.6, twitter: 0.6 };

function singleTermPassages(base: string, k: number): LexicalPassage[] {
  const all = docs();
  const test = termRegex(base, 'i');
  const hits = all.filter((d) => test.test(d.lower));
  if (hits.length === 0 || hits.length / all.length >= SINGLE_MAX_SHARE) return [];

  const scored: (LexicalPassage & { rank: number })[] = [];
  for (const doc of hits) {
    const count = Array.from(doc.lower.matchAll(termRegex(base, 'gi'))).length;
    if (count === 0) continue;
    // Best paragraph: the one using the word most; ties go to the earliest,
    // where the definitional uses live.
    let bestPara = '';
    let bestN = 0;
    for (const para of doc.paras) {
      const n = Array.from(para.toLowerCase().matchAll(termRegex(base, 'gi'))).length;
      if (n > bestN) { bestN = n; bestPara = para; }
    }
    if (!bestPara) continue;
    let text = bestPara;
    if (text.length > 1400) {
      const at = Math.max(0, text.toLowerCase().search(test));
      const s = Math.max(0, at - 400);
      text = text.slice(s, Math.min(text.length, at + 900));
    }
    const titled = test.test(doc.title);
    const rank = (Math.log(1 + count) + (titled ? 2 : 0)) * (SINGLE_TIER[doc.source] ?? 1);
    scored.push({ slug: doc.slug, title: doc.title, source: doc.source, text, coverage: 1, rank });
  }
  scored.sort((a, b) => b.rank - a.rank);
  return scored.slice(0, k).map(({ rank: _rank, ...p }) => p);
}

export function lexicalPassages(query: string, k = 3): LexicalPassage[] {
  const bases = queryBases(query);
  if (bases.length === 1) return singleTermPassages(bases[0], k);
  if (bases.length < 2) return [];

  const all = docs();
  const n = all.length;

  // Rarity weight per word, from how many texts contain it.
  const terms = bases
    .map((base) => {
      const re = termRegex(base, 'i');
      const hits = new Set<number>();
      for (let i = 0; i < n; i++) if (re.test(all[i].lower)) hits.add(i);
      return { base, hits, df: hits.size, weight: Math.log(1 + n / (1 + hits.size)) };
    })
    .filter((t) => t.df > 0);
  if (terms.length < 2) return [];

  const total = terms.reduce((s, t) => s + t.weight, 0);
  const rare = terms.filter((t) => t.df / n < RARE_SHARE);
  // Only speak up when the query carries at least two distinctive words.
  if (rare.length < 2) return [];

  // Candidate texts: contain at least two of the distinctive words.
  const count = new Map<number, number>();
  for (const t of rare) for (const i of t.hits) count.set(i, (count.get(i) ?? 0) + 1);

  const found: (LexicalPassage & { span: number })[] = [];
  for (const [i, c] of count) {
    if (c < 2) continue;
    const doc = all[i];
    let best: (LexicalPassage & { span: number }) | null = null;

    for (const para of doc.paras) {
      const lower = para.toLowerCase();
      // Every match position, tagged with its term.
      const marks: { at: number; end: number; t: number }[] = [];
      terms.forEach((t, ti) => {
        if (!t.hits.has(i)) return;
        for (const m of lower.matchAll(termRegex(t.base, 'gi'))) {
          marks.push({ at: m.index, end: m.index + m[0].length, t: ti });
        }
      });
      if (marks.length < 2) continue;
      marks.sort((a, b) => a.at - b.at);

      // Best stretch: the window of WINDOW chars holding the most rarity weight.
      for (let a = 0; a < marks.length; a++) {
        const seen = new Set<number>();
        let weight = 0;
        let rareCount = 0;
        let end = marks[a].end;
        for (let b = a; b < marks.length && marks[b].at - marks[a].at <= WINDOW; b++) {
          if (!seen.has(marks[b].t)) {
            seen.add(marks[b].t);
            weight += terms[marks[b].t].weight;
            if (terms[marks[b].t].df / n < RARE_SHARE) rareCount++;
          }
          end = marks[b].end;
        }
        if (rareCount < 2) continue;
        const coverage = weight / total;
        const span = end - marks[a].at;
        if (!best || coverage > best.coverage + 1e-9 || (Math.abs(coverage - best.coverage) < 1e-9 && span < best.span)) {
          // Readable slice: the whole paragraph when modest, else the stretch
          // with context (GABlog posts are often one enormous block).
          let text = para;
          if (para.length > 1400) {
            const s = Math.max(0, marks[a].at - 400);
            const e = Math.min(para.length, end + 500);
            text = para.slice(s, e);
          }
          best = { slug: doc.slug, title: doc.title, source: doc.source, text, coverage, span };
        }
      }
    }
    if (best) found.push(best);
  }

  // Keep only stretches carrying most of the query's distinctive weight, and
  // only those nearly as complete as the best one — when one passage holds the
  // sentence, weaker partial matches are noise beside it.
  const bestCoverage = found.reduce((m, f) => Math.max(m, f.coverage), 0);
  return found
    .filter((f) => f.coverage >= 0.5 && f.coverage >= bestCoverage - 0.05)
    .sort((a, b) => b.coverage - a.coverage || a.span - b.span)
    .slice(0, k)
    .map((f) => ({ slug: f.slug, title: f.title, source: f.source, text: f.text, coverage: f.coverage }));
}
