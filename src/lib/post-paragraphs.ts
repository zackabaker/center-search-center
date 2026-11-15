// One source of truth for turning a post's raw content into the paragraph
// list the reader renders. ANCHOR-CRITICAL: /q/[id] quote permalinks, the
// verify API, Ask excerpts (api/semantic) and the reader's ToC all address
// paragraphs as #p-N, where N is 1 + the index in THIS list. Changing the
// split or the strip filters renumbers every citation in circulation.
//
// Used by: PostContent (the reader), HighlightedContent (?q= arrivals, which
// compose PostContent), post/[slug]/page.tsx (ToC + landmarks), the semantic
// route (Ask excerpt anchors) and lexical-passages (wording retrieval).

// Paragraphs to strip (Substack boilerplate etc.). The corpus cache is already
// cleaned of these at generation time, so on current data they strip nothing —
// they are a safety net for freshly fetched posts and must keep matching
// exactly what historical anchors were numbered against.
export const STRIP_PATTERNS = [
  /Thanks for reading Center Study Center/,
  /Thanks for reading GA Newsletter/,
  /reader-supported publication/,
  /^Subscribe$/,
  /^Share$/,
];

export function shouldStripParagraph(p: string): boolean {
  return STRIP_PATTERNS.some((re) => re.test(p));
}

/** Split post content into rendered paragraphs; index i ⇒ anchor `p-${i + 1}`. */
export function splitPostParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .filter((p) => !shouldStripParagraph(p));
}
