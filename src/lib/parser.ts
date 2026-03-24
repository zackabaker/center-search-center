import fs from 'fs';
import path from 'path';
import { Post, ContentSource } from './types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function excerpt(content: string, maxLen = 200): string {
  const cleaned = content
    .replace(/Thanks for reading[^]*?Subscribe/g, '')
    .replace(/\*\*.*?\*\*/g, '')
    .trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
}

function parseGABlogPosts(text: string): Post[] {
  const posts: Post[] = [];
  const entries = text.split(/\n\nTitle: /);

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if (i === 0) {
      // First entry might start with "Title: " directly
      if (entry.startsWith('Title: ')) {
        entry = entry.slice(7);
      } else {
        continue;
      }
    }

    const titleEnd = entry.indexOf('\n');
    if (titleEnd === -1) continue;

    const title = entry.slice(0, titleEnd).trim();
    let content = '';

    const articleMatch = entry.indexOf('Article: ');
    if (articleMatch !== -1) {
      content = entry.slice(articleMatch + 9).trim();
    } else {
      content = entry.slice(titleEnd + 1).trim();
    }

    if (!title || !content) continue;

    const slug = 'gablog-' + slugify(title);
    posts.push({
      slug,
      title,
      content,
      excerpt: excerpt(content),
      date: null,
      source: 'gablog' as ContentSource,
    });
  }

  return posts;
}

function parseBook(): Post[] {
  const bookPath = path.join(process.cwd(), 'src', 'data', 'anthropomorphics.md');
  if (!fs.existsSync(bookPath)) return [];

  const content = fs.readFileSync(bookPath, 'utf-8');
  // Strip the markdown title line for the excerpt
  const contentBody = content.replace(/^#[^\n]*\n+/, '').trim();

  return [{
    slug: 'book-anthropomorphics',
    title: 'Anthropomorphics: An Originary Grammar of the Center',
    content: contentBody,
    excerpt: excerpt(contentBody),
    date: null,
    source: 'book' as ContentSource,
  }];
}

function parseSubstackPosts(text: string): Post[] {
  const posts: Post[] = [];
  // Split on markdown headings
  const entries = text.split(/^# /m);

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const lines = entry.split('\n');
    const title = lines[0].trim();
    if (!title) continue;

    let date: string | null = null;
    let likes: number | undefined;
    let contentStart = 1;

    for (let i = 1; i < lines.length && i < 8; i++) {
      const line = lines[i].trim();
      // Date line: **Mon DD, YYYY** or **Month DD, YYYY**
      const dateMatch = line.match(/^\*\*([A-Z][a-z]+ \d{1,2}, \d{4})\*\*$/);
      if (dateMatch) {
        date = dateMatch[1];
        contentStart = i + 1;
        continue;
      }
      // Likes line: **Likes:** N
      const likesMatch = line.match(/^\*\*Likes:\*\*\s*(\d+)/);
      if (likesMatch) {
        likes = parseInt(likesMatch[1], 10);
        contentStart = i + 1;
        continue;
      }
      if (line === '') continue;
      // Once we hit non-metadata content, stop
      if (!line.startsWith('**')) {
        contentStart = i;
        break;
      }
    }

    const content = lines.slice(contentStart).join('\n').trim();
    const substackSlug = slugify(title);

    posts.push({
      slug: 'substack-' + substackSlug,
      title,
      content,
      excerpt: excerpt(content),
      date,
      source: 'substack' as ContentSource,
      likes,
      url: `https://dennisbouvard.substack.com/p/${substackSlug}`,
    });
  }

  return posts;
}

// Custom metadata for PDFs: map filename (without extension) to title and source override
const PDF_METADATA: Record<string, { title: string; source?: ContentSource }> = {
  'the-origin-of-language': {
    title: 'The Origin of Language',
    source: 'book',
  },
  'why-generative-anthropology': {
    title: 'Why Generative Anthropology (Peter Goldman)',
  },
  'the-anthropoetics-of-power': {
    title: 'The Anthropoetics of Power',
  },
  'talk-of-the-center-adam-katz': {
    title: 'Talk of the Center (Adam Katz)',
  },
  'event-origin-center': {
    title: 'Event, Origin, Center (Adam Katz)',
  },
  'originary-technics': {
    title: 'Originary Technics (Adam Katz)',
  },
  'there-is-no-economy': {
    title: 'There Is No Economy but Only the Debt to the Center',
  },
};

function parseGlossary(): Post[] {
  const glossaryPath = path.join(process.cwd(), 'src', 'data', 'glossary.json');
  if (!fs.existsSync(glossaryPath)) return [];

  const entries: { term: string; definition: string }[] = JSON.parse(
    fs.readFileSync(glossaryPath, 'utf-8')
  );

  return entries.map((entry) => ({
    slug: 'glossary-' + slugify(entry.term),
    title: entry.term,
    content: `${entry.term}: ${entry.definition}`,
    excerpt: entry.definition,
    date: null,
    source: 'glossary' as ContentSource,
  }));
}

function parsePDFs(): Post[] {
  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(pdfDir)) return [];

  const posts: Post[] = [];
  const txtFiles = fs.readdirSync(pdfDir).filter((f) => f.endsWith('.txt'));

  for (const txtFile of txtFiles) {
    const content = fs.readFileSync(path.join(pdfDir, txtFile), 'utf-8');
    const baseName = txtFile.replace('.txt', '');
    const meta = PDF_METADATA[baseName];
    const title = meta?.title || baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const source = meta?.source || ('pdf' as ContentSource);
    const prefix = source === 'book' ? 'book' : 'pdf';

    posts.push({
      slug: `${prefix}-${slugify(baseName)}`,
      title,
      content,
      excerpt: excerpt(content),
      date: null,
      source,
      url: `/pdfs/${baseName}.pdf`,
    });
  }

  return posts;
}

export function parseAllContent(): Post[] {
  const filePath = path.join(process.cwd(), 'src', 'data', 'ga_context.txt');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const gablogMatch = raw.match(/<generative_anthropology_blog>([\s\S]*?)<\/generative_anthropology_blog>/);
  const substackMatch = raw.match(/<dennis_bouvard_substack>([\s\S]*?)<\/dennis_bouvard_substack>/);

  const allPosts: Post[] = [];

  if (gablogMatch) allPosts.push(...parseGABlogPosts(gablogMatch[1]));
  allPosts.push(...parseBook());
  if (substackMatch) allPosts.push(...parseSubstackPosts(substackMatch[1]));
  allPosts.push(...parseGlossary());
  allPosts.push(...parsePDFs());

  // Deduplicate slugs
  const seenSlugs = new Map<string, number>();
  for (const post of allPosts) {
    const baseSlug = post.slug;
    const count = seenSlugs.get(baseSlug) || 0;
    if (count > 0) post.slug = `${baseSlug}-${count}`;
    seenSlugs.set(baseSlug, count + 1);
  }

  return allPosts;
}

export function getAllPosts(): Post[] {
  return parseAllContent();
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug);
}
