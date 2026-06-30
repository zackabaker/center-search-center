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

// /post/* legacy redirects are handled IN the post page (permanentRedirect) so
// that /post/* is not tied to middleware and can stay statically/ISR cached.
// The proxy now only covers the /api/corpus JSON endpoint (an API route, which
// is dynamic regardless), redirecting its legacy source-prefixed slugs.
// NOTE: matcher entries MUST be static string literals.
export const config = {
  matcher: ['/api/corpus/:slug(chronicle-.*|gablog-.*|ap-.*|substack-.*|reddit-.*|twitter-.*|pdf-.*|book-.*|lecture-.*)'],
};
