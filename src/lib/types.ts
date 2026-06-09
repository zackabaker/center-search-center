export type ContentSource = 'substack' | 'gablog' | 'book' | 'pdf' | 'reddit' | 'twitter' | 'chronicle' | 'ap';

/** Sources excluded from search, browse, and all public listings — only visible on /downloads */
export const HIDDEN_SOURCES: ContentSource[] = ['chronicle', 'ap'];

export interface Post {
  slug: string;
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
