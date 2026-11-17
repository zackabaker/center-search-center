// One search box, routed by the shape of what was typed.
//
//   words     a word, a name, a short phrase       → exact words first
//   sentence  a half-remembered line, a "riff"     → similar passages first
//   question  an open question                     → an answer, then passages
//
// The reader can always switch views by hand; this only picks the first one.

import { CONCEPT_TITLES, TERM_TO_CONCEPT_SLUG } from '@/lib/cs-terms';

export type QueryShape = 'words' | 'sentence' | 'question';
export type SearchView = 'exact' | 'similar' | 'answer';

const QUESTION_OPENER =
  /^(what|whats|what's|how|why|who|whom|whose|when|where|which|is|are|was|were|does|do|did|can|could|should|would|will|explain|describe|define|tell me|summari[sz]e|compare)\b/i;

export function queryShape(raw: string): QueryShape {
  const q = raw.trim();
  if (!q) return 'words';
  // Quotes or boolean operators are an explicit request for exact matching.
  if (/["“”]/.test(q) || /\b(AND|OR|NOT)\b/.test(q)) return 'words';
  const words = q.split(/\s+/).length;
  if (q.endsWith('?') || (words >= 3 && QUESTION_OPENER.test(q))) return 'question';
  if (words >= 6) return 'sentence';
  return 'words';
}

export function viewForShape(shape: QueryShape): SearchView {
  return shape === 'question' ? 'answer' : shape === 'sentence' ? 'similar' : 'exact';
}

/** Where a query should land, for a given view (default: by its shape). */
export function searchHref(raw: string, view?: SearchView): string {
  const q = raw.trim();
  const v = view ?? viewForShape(queryShape(q));
  if (v === 'answer') return q ? `/ask?q=${encodeURIComponent(q)}` : '/ask';
  if (!q) return '/search';
  return v === 'similar'
    ? `/search?q=${encodeURIComponent(q)}&view=similar`
    : `/search?q=${encodeURIComponent(q)}`;
}

const TERMS_BY_LENGTH = Object.keys(TERM_TO_CONCEPT_SLUG).sort((a, b) => b.length - a.length);

/** The curated concept a query names — as the whole query, or inside a
 *  longer one ("what is deferral?"). Longest term wins. */
export function findConcept(raw: string): { slug: string; title: string } | null {
  const q = raw.toLowerCase().replace(/["“”?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return null;
  const hit = (term: string) => {
    const slug = TERM_TO_CONCEPT_SLUG[term];
    const title = slug ? CONCEPT_TITLES[slug] : undefined;
    return slug && title ? { slug, title } : null;
  };
  const exact = hit(q);
  if (exact) return exact;
  const padded = ` ${q} `;
  for (const term of TERMS_BY_LENGTH) {
    if (term.length < 4) continue;
    if (padded.includes(` ${term} `)) {
      const found = hit(term);
      if (found) return found;
    }
  }
  return null;
}
