export type ContentSource = 'substack' | 'gablog' | 'book' | 'pdf' | 'reddit' | 'twitter' | 'chronicle' | 'ap';

/** Sources hidden from getPublicPosts() — nothing hidden (all sources are publicly crawlable) */
export const HIDDEN_SOURCES: ContentSource[] = [];

/**
 * Archival sources — included in browse, stats, sitemap, and Google crawl,
 * but filtered from search results by default. Users can opt in via a toggle.
 */
export const ARCHIVAL_SOURCES: ContentSource[] = ['chronicle', 'ap'];

export interface Post {
  slug: string;
  /** Original source-prefixed slug (e.g. "pdf-there-is-no-economy"), kept so old
   *  shared URLs can 301-redirect to the current clean slug. Absent if unchanged. */
  legacySlug?: string;
  title: string;
  content: string;
  excerpt: string;
  date: string | null;
  source: ContentSource;
  /** Per-article author — used for 'ap' (Anthropoetics journal) where authorship varies */
  author?: string;
  likes?: number;
  url?: string;
}
