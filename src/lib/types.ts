export type ContentSource = 'substack' | 'gablog' | 'book' | 'pdf' | 'reddit';

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
