// Everything the tutor is given besides the question: the canon (whole texts,
// paragraph-numbered), the index of key terms, and the prompt. All of it is
// read from the plain files under /tutor, so the prepared material stays
// independent of whichever model reads it.
import fs from 'fs';
import path from 'path';
import { getPublicPosts } from '../parser';
import { splitPostParagraphs } from '../post-paragraphs';
import type { Post } from '../types';
import canonList from '../../../tutor/canon.json';
import glossary from '../../../tutor/glossary.json';
import coverage from '../../../tutor/coverage.json';

const SOURCE_LABEL: Record<string, string> = {
  substack: 'Substack essay', gablog: 'GABlog post', book: 'Anthropomorphics', pdf: 'Essay or lecture',
  reddit: 'Reddit comment', twitter: 'X thread',
};

/** A rough token count for budgeting (this corpus runs about 1.9 tokens a word). */
export const estTokens = (text: string) => Math.round(text.split(/\s+/).length * 1.9);

export function renderWholeText(p: Post): string {
  const paras = splitPostParagraphs(p.content);
  const year = p.date ? new Date(p.date).getFullYear() : NaN;
  return (
    `<text title=${JSON.stringify(p.title)} url="/post/${p.slug}" kind="${SOURCE_LABEL[p.source] ?? p.source}"` +
    `${Number.isFinite(year) && year > 1990 ? ` year="${year}"` : ''}>\n` +
    paras.map((t, i) => `[p-${i + 1}] ${t.trim()}`).join('\n\n') +
    '\n</text>'
  );
}

let _posts: Map<string, Post> | null = null;
export function postBySlug(slug: string): Post | undefined {
  if (!_posts) _posts = new Map(getPublicPosts().map((p) => [p.slug, p]));
  return _posts.get(slug);
}

export const canonSlugs: Set<string> = new Set((canonList as { slug: string }[]).map((c) => c.slug));

let _canon: string | null = null;
export function canonText(): string {
  if (_canon) return _canon;
  const texts = [...canonSlugs].map(postBySlug).filter((p): p is Post => !!p).map(renderWholeText);
  _canon =
    'THE CANON: texts by Adam Katz, in full. Paragraph numbers are in square brackets; ' +
    'link a passage as <url>#p-<number>.\n\n' + texts.join('\n\n');
  return _canon;
}

type GlossaryRow = { term: string; slug: string; definition: { quote: string; title: string; url: string }; related: string[] };
type CoverageRow = { slug: string; paragraphs: number; texts: number; depth: string; fullest: { title: string; url: string }[] };

let _index: string | null = null;
export function indexText(): string {
  if (_index) return _index;
  const cov = new Map((coverage as CoverageRow[]).map((c) => [c.slug, c]));
  const rows = (glossary as GlossaryRow[]).map((g) => {
    const c = cov.get(g.slug);
    return (
      `${g.term}: "${g.definition.quote}" (${g.definition.title}, ${g.definition.url})` +
      (c
        ? ` | In the archive: ${c.depth}, ${c.paragraphs} paragraphs in ${c.texts} texts.` +
          ` Fullest: ${c.fullest.slice(0, 3).map((f) => `${f.title} (${f.url})`).join('; ')}.`
        : '') +
      (g.related.length ? ` | Related: ${g.related.join(', ')}.` : '')
    );
  });
  _index =
    'INDEX OF KEY TERMS: for each, a defining sentence in Katz’s words, how much the archive has on it ' +
    '(extensive, substantial, some, thin), where it is treated most fully, and related terms. The texts named ' +
    'under "Fullest" count as shown to you: you may recommend and link them.\n\n' + rows.join('\n');
  return _index;
}

let _prompt: string | null = null;
export function promptText(): string {
  if (!_prompt) _prompt = fs.readFileSync(path.join(process.cwd(), 'tutor', 'prompt.md'), 'utf-8').trim();
  return _prompt;
}
