// Shared verbatim phrase matching — used by /api/grep (full-corpus search),
// /api/verify (public citation resolver), and the quote-page build.
//
// A phrase matches when its words appear in order separated only by runs of
// non-alphanumerics, which makes matching immune to typography differences:
// curly vs straight quotes, em-dashes, line breaks, punctuation.

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function phraseWords(q: string): string[] {
  return q.toLowerCase().normalize('NFKC').split(/[^a-z0-9]+/).filter(Boolean);
}

export function buildPhraseRegex(q: string, maxWords = 120): RegExp | null {
  const words = phraseWords(q);
  if (words.length === 0 || words.length > maxWords) return null;
  if (words.join('').length < 4) return null;
  return new RegExp(
    `(?<![a-zA-Z0-9])${words.map(escapeRe).join('[^a-zA-Z0-9]+')}(?![a-zA-Z0-9])`,
    'gi'
  );
}

/** Split an elided quote ("A … B") into independently verifiable segments. */
export function elisionSegments(q: string): string[] {
  return q
    .split(/\s*(?:…|\.\s*\.\s*\.)\s*/)
    .map((s) => s.trim())
    .filter((s) => phraseWords(s).join('').length >= 12);
}

export function makeSnippet(content: string, index: number, matchLen: number, before = 90, after = 130): string {
  const start = Math.max(0, index - before);
  const end = Math.min(content.length, index + matchLen + after);
  let s = content.slice(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) s = '…' + s;
  if (end < content.length) s = s + '…';
  return s;
}
