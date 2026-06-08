export type ContentSource = 'substack' | 'gablog' | 'book' | 'pdf' | 'reddit' | 'twitter' | 'chronicle';

/** Sources excluded from search, browse, and all public listings — only visible on /downloads */
export const HIDDEN_SOURCES: ContentSource[] = ['chronicle'];

export interface Post {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string | null;
  source: ContentSource;
  likes?: number;
  url?: string;
}
