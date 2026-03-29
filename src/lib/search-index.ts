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

const STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','up','about','into','through','is','are','was','were','be',
  'been','being','have','has','had','do','does','did','will','would','could',
  'should','may','might','must','can','this','that','these','those','it',
  'its','he','she','they','we','you','i','my','our','your','his','her',
  'their','what','which','who','when','where','how','why','all','any',
  'both','each','few','more','most','other','some','such','no','not',
  'only','same','so','than','too','very','just','as','if','then',
]);

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
      if (trimmed.length <= 220) return trimmed;
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

export interface ParsedQuery {
  phrases: string[];
  mustTerms: string[];
  notTerms: string[];
  orTerms: string[];
  orMode: boolean;
  raw: string;
}

export function parseQuery(raw: string): ParsedQuery {
  const phrases: string[] = [];
  let remaining = raw.replace(/"([^"]+)"/g, (_, phrase) => {
    phrases.push(phrase.toLowerCase().trim());
    return ' ';
  });

  const notTerms: string[] = [];
  remaining = remaining.replace(/(?:\bNOT\s+|-)(\w[\w'-]*)/gi, (_, term) => {
    notTerms.push(term.toLowerCase());
    return ' ';
  });

  const orMode = /\bOR\b/i.test(remaining);
  remaining = remaining.replace(/\b(?:AND|OR)\b/gi, ' ');

  const allTerms = tokenize(remaining);
  const mustTerms: string[] = [];
  const orTerms: string[] = [];

  if (orMode) {
    orTerms.push(...allTerms);
  } else {
    mustTerms.push(...allTerms);
  }

  const highlightRaw = phrases.length > 0
    ? phrases[0]
    : (mustTerms[0] || orTerms[0] || '');

  return { phrases, mustTerms, notTerms, orTerms, orMode, raw: highlightRaw };
}

export function countPostsWithTerm(entries: SearchEntry[], term: string): number {
  const lower = term.toLowerCase();
  return entries.filter((e) =>
    e.title.toLowerCase().includes(lower) || e.content.toLowerCase().includes(lower)
  ).length;
}

export function searchEntries(entries: SearchEntry[], query: string): SearchResult[] {
  const { phrases, mustTerms, notTerms, orTerms, orMode, raw } = parseQuery(query);
  if (phrases.length === 0 && mustTerms.length === 0 && orTerms.length === 0) return [];

  const snippetQuery = phrases.length > 0 ? phrases[0] : raw;

  const scored = entries.map((entry) => {
    let score = 0;
    const lowerTitle = entry.title.toLowerCase();
    const lowerContent = entry.content.toLowerCase();

    for (const notTerm of notTerms) {
      if (lowerTitle.includes(notTerm) || lowerContent.includes(notTerm)) {
        return { entry, score: -1 };
      }
    }

    for (const phrase of phrases) {
      if (lowerTitle.includes(phrase)) score += 600;
      else if (lowerContent.includes(phrase)) score += 60;
      else return { entry, score: -1 };
    }

    if (orMode) {
      let anyMatch = false;
      for (const term of orTerms) {
        if (lowerTitle.includes(term)) { score += 100; anyMatch = true; }
        else if (entry.contentWords.some((w) => w === term)) { score += 10; anyMatch = true; }
        else if (entry.contentWords.some((w) => w.startsWith(term))) { score += 5; anyMatch = true; }
      }
      if (!anyMatch && phrases.length === 0) return { entry, score: -1 };
    } else {
      for (const term of mustTerms) {
        if (lowerTitle.includes(term)) {
          score += 100;
        } else if (entry.contentWords.some((w) => w === term)) {
          score += 10;
        } else if (entry.contentWords.some((w) => w.startsWith(term))) {
          score += 5;
        } else if (phrases.length === 0) {
          return { entry, score: -1 };
        }
      }
    }

    return { entry, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 60)
    .map((s) => ({
      entry: s.entry,
      contextSnippet: findMatchingSentence(s.entry.content, snippetQuery) || s.entry.excerpt,
    }));
}

export function getSignificantTerms(
  entries: SearchEntry[],
  minCount = 5,
  topN = 600
): { term: string; count: number }[] {
  const freq = new Map<string, number>();
  for (const entry of entries) {
    const words = new Set(entry.contentWords);
    for (const word of words) {
      if (word.length < 4) continue;
      if (STOPWORDS.has(word)) continue;
      if (/^\d+$/.test(word)) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count }));
}

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
        if (targetWords.has(w) && !STOPWORDS.has(w)) overlap += 10;
      }
      for (const w of entry.contentWords.slice(0, 100)) {
        if (targetWords.has(w) && !STOPWORDS.has(w)) overlap++;
      }
      return { entry, overlap };
    });

  return scored
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .filter((s) => s.overlap > 5)
    .map((s) => s.entry);
}
