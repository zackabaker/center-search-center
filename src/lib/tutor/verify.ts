// Checks an answer against the archive: does every link point at a real text
// (and a real paragraph), and does every quoted phrase that is followed by a
// link actually appear in the text it cites? Used after each answer and by
// the eval script.
import { splitPostParagraphs } from '../post-paragraphs';
import { postBySlug } from './context';

export interface TutorCheck {
  links: number;
  badLinks: string[]; // hrefs that don't resolve
  quotes: number;
  badQuotes: { quote: string; href: string; inText: boolean }[]; // not in the cited paragraph
}

const norm = (s: string) =>
  s.normalize('NFKC').toLowerCase()
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, '-')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function resolve(href: string): { paras: string[]; n: number | null } | null {
  const m = /^\/post\/([a-z0-9-]+)(?:\?[^#]*)?(?:#p-(\d+))?$/i.exec(href);
  if (!m) return null;
  const post = postBySlug(m[1]);
  if (!post) return null;
  const paras = splitPostParagraphs(post.content);
  const n = m[2] ? Number(m[2]) : null;
  if (n !== null && (n < 1 || n > paras.length)) return null;
  return { paras, n };
}

export function checkAnswer(answer: string): TutorCheck {
  const out: TutorCheck = { links: 0, badLinks: [], quotes: 0, badQuotes: [] };
  for (const m of answer.matchAll(/\]\((\/[^)\s]+)\)/g)) {
    const href = m[1];
    if (!href.startsWith('/post/')) continue;
    out.links++;
    if (!resolve(href) && !out.badLinks.includes(href)) out.badLinks.push(href);
  }
  // A quotation followed (within a few characters) by a linked source.
  for (const m of answer.matchAll(/["“]([^"“”]{20,900})["”][\s,.;:]*\(?\s*\[[^\]]+\]\((\/post\/[^)\s]+)\)/g)) {
    const [, quote, href] = m;
    const r = resolve(href);
    if (!r) continue; // already reported as a bad link
    out.quotes++;
    // An elided quotation ("A … B") is checked piece by piece.
    // Editorial brackets ("updat[ing]", "[the center]") break a piece the same way:
    // the word they touch is dropped and the text either side is checked.
    const pieces = quote
      .split(/\s*(?:…|\.\.\.|\S*\[[^\]]*\]\S*)\s*/)
      .map(norm)
      .filter((p) => p.length >= 12);
    const inParas = (ps: string[]) => { const t = norm(ps.join(' ')); return pieces.every((p) => t.includes(p)); };
    let near = r.n === null ? r.paras : r.paras.slice(Math.max(0, r.n - 2), r.n + 1); // the paragraph and its neighbours
    // A quotation that runs across paragraphs is cited with several links in a row.
    const rest = answer.slice((m.index ?? 0) + m[0].length);
    for (const more of (/^(?:\s*(?:,|and)\s*\[[^\]]+\]\(\/post\/[^)\s]+\))+/.exec(rest)?.[0] ?? '').matchAll(/\((\/post\/[^)\s]+)\)/g)) {
      const r2 = resolve(more[1]);
      if (r2) near = near.concat(r2.n === null ? r2.paras : r2.paras.slice(Math.max(0, r2.n - 2), r2.n + 1));
    }
    if (!inParas(near)) out.badQuotes.push({ quote: quote.slice(0, 200), href, inText: inParas(r.paras) });
  }
  return out;
}
