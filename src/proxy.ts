import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirects from '@/data/slug-redirects.json';

// Old source-prefixed slug → current canonical slug (generated at build by
// scripts/generate-posts-cache.ts). Post URLs were standardized — the source
// prefix was stripped (/post/pdf-there-is-no-economy → /post/there-is-no-economy-pdf)
// — so already-shared links get a permanent (308) redirect to the new URL.
const MAP = redirects as Record<string, string>;

// In Next 16 "Middleware" is "Proxy"; the runtime contract is unchanged.
export function proxy(request: NextRequest) {
  const m = request.nextUrl.pathname.match(/^\/(post|api\/corpus)\/([^/]+)\/?$/);
  if (m) {
    const base = m[1];
    const slug = decodeURIComponent(m[2]);
    const canonical = MAP[slug];
    if (canonical) {
      const url = request.nextUrl.clone();
      url.pathname = `/${base}/${canonical}`;
      return NextResponse.redirect(url, 308);
    }
  }
  return NextResponse.next();
}

// Match ONLY legacy source-prefixed slugs (the redirect-map keys). Canonical
// /post/* slugs never start with a source word, so they don't match → skip
// middleware → stay ISR-cached (the page sets generateStaticParams). Legacy
// slugs 308-redirect to their canonical URL here.
// NOTE: matcher entries MUST be static string literals (no const/template).
export const config = {
  matcher: [
    '/post/:slug(chronicle-.*|gablog-.*|ap-.*|substack-.*|reddit-.*|twitter-.*|pdf-.*|book-.*|lecture-.*)',
    '/api/corpus/:slug(chronicle-.*|gablog-.*|ap-.*|substack-.*|reddit-.*|twitter-.*|pdf-.*|book-.*|lecture-.*)',
  ],
};
