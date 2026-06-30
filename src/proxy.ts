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

// Only run the proxy on LEGACY source-prefixed slugs (the only ones in the
// redirect map). Canonical post URLs never start with a source word, so they
// skip middleware entirely and stay ISR/edge-cached — the proxy was forcing all
// /post/* pages to render uncached. (The ~6 canonical chronicle-NNN slugs that
// do start with "chronicle-" harmlessly fall through to next().)
// NOTE: matcher entries MUST be static string literals — Next can't parse a
// template literal or a referenced const here.
export const config = {
  matcher: [
    '/post/:slug(chronicle-.*|gablog-.*|ap-.*|substack-.*|reddit-.*|twitter-.*|pdf-.*|book-.*|lecture-.*)',
    '/api/corpus/:slug(chronicle-.*|gablog-.*|ap-.*|substack-.*|reddit-.*|twitter-.*|pdf-.*|book-.*|lecture-.*)',
  ],
};
