// The tutor's corpus: every paragraph of the public Katz texts, addressed the
// same way the reader addresses it (/post/<slug>#p-N). One definition, used by
// the build script (which embeds these paragraphs) and by retrieval at runtime,
// so a vector's key always names the paragraph it was made from.
//
// Katz sources only, by owner decision (2026-11-19): Gans's Chronicles and
// Anthropoetics stay out of the tutor's retrieval.
import { splitPostParagraphs } from '../post-paragraphs';
import { KATZ_SOURCES, type Post } from '../types';

export interface TutorParagraph {
  key: string; // `${slug}#${n}` — n is the reader's paragraph number
  slug: string;
  n: number;
  title: string;
  source: string;
  date: string | null;
  author: string;
  url: string; // /post/<slug>#p-<n>
  text: string;
}

// Headings and fragments carry no argument to retrieve.
const MIN_CHARS = 80;

export function buildTutorParagraphs(posts: Post[]): TutorParagraph[] {
  const out: TutorParagraph[] = [];
  for (const p of posts) {
    if (!KATZ_SOURCES.includes(p.source)) continue;
    const paras = splitPostParagraphs(p.content);
    for (let i = 0; i < paras.length; i++) {
      const text = paras[i].trim();
      if (text.length < MIN_CHARS || /^#{1,6}\s/.test(text)) continue;
      const n = i + 1;
      out.push({
        key: `${p.slug}#${n}`,
        slug: p.slug,
        n,
        title: p.title,
        source: p.source,
        date: p.date,
        author: p.author ?? 'Adam Katz',
        url: `/post/${p.slug}#p-${n}`,
        text,
      });
    }
  }
  return out;
}
