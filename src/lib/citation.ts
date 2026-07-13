// Shared citation formatting — used by the post-page Cite modal and the /q
// quote-page copy affordances. Centralised because the previous inline logic
// misattributed every Chronicle/Anthropoetics citation to "Katz, Adam" and
// produced invalid BibTeX keys from Chronicle-style ordinal dates.

import { parsePostDate } from './dates';

export interface CitationAuthor {
  /** Bibliography form, e.g. "Gans, Eric" or "Katz, Adam, and Zack Baker". */
  full: string;
  /** Abbreviated form, e.g. "Gans, E." */
  short: string;
  /** BibTeX-key-safe surname, e.g. "gans". */
  key: string;
}

/**
 * Resolve the citation author from the display-order author name the post
 * page already computes ("Eric Gans", "Adam Katz & Zack Baker", "Various
 * Authors", …). Simple "First Last" names invert; multi-author and corporate
 * names pass through untouched rather than being mangled.
 */
export function citationAuthor(displayName: string): CitationAuthor {
  const name = (displayName || 'Adam Katz').trim();
  const multi = /&| and |,|Group|Various/i.test(name);
  if (multi) {
    // "Adam Katz & Zack Baker" → "Katz, Adam, and Zack Baker" when the first
    // name is simple; otherwise leave exactly as given.
    const m = name.match(/^(\S+)\s(\S+)\s*&\s*(.+)$/);
    if (m) {
      return {
        full: `${m[2]}, ${m[1]}, and ${m[3]}`,
        short: `${m[2]}, ${m[1][0]}., and ${m[3]}`,
        key: m[2].toLowerCase().replace(/[^a-z]/g, ''),
      };
    }
    return { full: name, short: name, key: name.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '') || 'centerstudy' };
  }
  const parts = name.split(/\s+/);
  if (parts.length < 2) return { full: name, short: name, key: name.toLowerCase().replace(/[^a-z]/g, '') };
  const family = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(' ');
  return {
    full: `${family}, ${given}`,
    short: `${family}, ${given[0]}.`,
    key: family.toLowerCase().replace(/[^a-z]/g, ''),
  };
}

/** Publisher / venue line per source. */
export function citationVenue(source: string, chronicleNo?: string | null): string {
  const labels: Record<string, string> = {
    substack: 'Center Study (Substack)',
    gablog: 'GABlog (Center Study)',
    book: 'Anthropomorphics (Imperium Press)',
    pdf: 'Essays & Articles (Center Study)',
    ap: 'Anthropoetics',
    chronicle: 'Chronicles of Love & Resentment',
    reddit: 'Reddit',
    twitter: 'X / Twitter',
  };
  const base = labels[source] || 'Center Study';
  return source === 'chronicle' && chronicleNo ? `${base}, no. ${chronicleNo}` : base;
}

export function citationDate(dateStr: string | null): { year: string; full: string } {
  const d = parsePostDate(dateStr);
  if (!d) return { year: 'n.d.', full: 'n.d.' };
  return {
    year: String(d.getFullYear()),
    full: d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  };
}

export function bibtexKey(authorKey: string, year: string, slug: string): string {
  const slugPart = slug.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').slice(0, 24);
  const y = /^\d{4}$/.test(year) ? year : 'nd';
  return `${authorKey || 'centerstudy'}${y}_${slugPart}`;
}
