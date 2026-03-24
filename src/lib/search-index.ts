import { Post } from './types';

export interface SearchEntry {
  slug: string;
  title: string;
  excerpt: string;
  source: Post['source'];
  date: string | null;
  titleWords: string[];
  contentWords: string[];
  content: string;
  readingTime: number;
}

export interface SearchResult {
  entry: SearchEntry;
  contextSnippet: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function uniqueWords(words: string[]): string[] {
  return [...new Set(words)];
}

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

export function buildSearchEntries(posts: Post[]): SearchEntry[] {
  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    source: post.source,
    date: post.date,
    titleWords: tokenize(post.title),
    contentWords: uniqueWords(tokenize(post.content)),
    content: post.content,
    readingTime: calcReadingTime(post.content),
  }));
}

function findMatchingSentence(content: string, query: string): string | null {
  const lowerQuery = query.toLowerCase();
  const sentences = content.split(/(?<=[.!?])\s+|(?:\n\n+)/);

  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(lowerQuery)) {
      const trimmed = sentence.trim();
      if (trimmed.length < 10) continue;
      if (trimmed.length <= 200) return trimmed;

      const matchIndex = trimmed.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, matchIndex - 80);
      const end = Math.min(trimmed.length, matchIndex + query.length + 80);

      let snippet = trimmed.slice(start, end);
      if (start > 0) snippet = '...' + snippet;
      if (end < trimmed.length) snippet = snippet + '...';
      return snippet;
    }
  }
  return null;
}

/**
 * Parse query for quoted phrases and individual terms.
 * "sacred kingship" → phraseSearch for exact match
 * sacred kingship → word-level matching
 */
function parseQuery(raw: string): { phrases: string[]; terms: string[] } {
  const phrases: string[] = [];
  const remaining = raw.replace(/"([^"]+)"/g, (_, phrase) => {
    phrases.push(phrase.toLowerCase());
    return '';
  });
  const terms = tokenize(remaining);
  return { phrases, terms };
}

export function searchEntries(
  entries: SearchEntry[],
  query: string
): SearchResult[] {
  const { phrases, terms } = parseQuery(query);
  if (phrases.length === 0 && terms.length === 0) return [];

  // For snippet extraction, use the raw query minus quotes
  const snippetQuery = phrases.length > 0 ? phrases[0] : query;

  const scored = entries.map((entry) => {
    let score = 0;
    const lowerTitle = entry.title.toLowerCase();
    const lowerContent = entry.content.toLowerCase();

    // Exact phrase matching (highest priority)
    for (const phrase of phrases) {
      if (lowerTitle.includes(phrase)) {
        score += 500;
      }
      if (lowerContent.includes(phrase)) {
        score += 50;
      }
    }

    // Word-level matching
    for (const term of terms) {
      if (entry.titleWords.some((w) => w === term)) {
        score += 100;
      } else if (entry.titleWords.some((w) => w.includes(term))) {
        score += 50;
      }

      if (lowerTitle.includes(query.toLowerCase().replace(/"/g, ''))) {
        score += 200;
      }

      if (entry.contentWords.some((w) => w === term)) {
        score += 10;
      } else if (entry.contentWords.some((w) => w.includes(term))) {
        score += 5;
      }
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map((s) => {
      const contextSnippet =
        findMatchingSentence(s.entry.content, snippetQuery) || s.entry.excerpt;
      return { entry: s.entry, contextSnippet };
    });
}

/** Get related posts by shared content words */
export function getRelatedEntries(
  target: SearchEntry,
  allEntries: SearchEntry[],
  limit = 5
): SearchEntry[] {
  const targetWords = new Set(target.contentWords.slice(0, 100));

  const scored = allEntries
    .filter((e) => e.slug !== target.slug)
    .map((entry) => {
      let overlap = 0;
      for (const w of entry.titleWords) {
        if (targetWords.has(w)) overlap += 10;
      }
      for (const w of entry.contentWords.slice(0, 100)) {
        if (targetWords.has(w)) overlap++;
      }
      return { entry, overlap };
    });

  return scored
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .filter((s) => s.overlap > 5)
    .map((s) => s.entry);
}
