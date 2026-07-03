// Robust parsing for the archive's varied date formats. Chronicle dates come
// as "Thursday, July 6th, 1995" — the ordinal suffix makes Date.parse return
// Invalid Date (this silently broke chronological ordering, sitemap
// lastModified, and JSON-LD datePublished for all 855 Chronicles).
export function parsePostDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const cleaned = dateStr.replace(/(\d{1,2})(st|nd|rd|th)\b/gi, '$1');
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? null : d;
}

export function postTime(dateStr: string | null | undefined): number | null {
  const d = parsePostDate(dateStr);
  return d ? d.getTime() : null;
}

export function postYear(dateStr: string | null | undefined): string | null {
  const d = parsePostDate(dateStr);
  return d ? String(d.getFullYear()) : null;
}
