export type ContentSource = 'substack' | 'gablog' | 'book' | 'pdf' | 'reddit' | 'twitter' | 'chronicle' | 'ap';

/** Sources hidden from getPublicPosts() — nothing hidden (all sources are publicly crawlable) */
export const HIDDEN_SOURCES: ContentSource[] = [];

/**
 * Archival sources — Eric Gans's Chronicles and Anthropoetics, hosted as
 * REFERENCE MATERIAL on what is primarily the Adam Katz archive. Included in
 * browse, stats, sitemap, feeds, and the open APIs (the archive hides
 * nothing), but search defaults to Katz sources (opt-in toggle) and discovery
 * surfaces subordinate and label the reference tier.
 */
export const ARCHIVAL_SOURCES: ContentSource[] = ['chronicle', 'ap'];

/** The Katz editorial corpus — what discovery modules draw from by default. */
export const KATZ_SOURCES: ContentSource[] = ['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'];

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
