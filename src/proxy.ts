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
  // /study — the owner's private analytics console. Gated here, before any
  // rendering: a request either carries the long-lived cookie, or presents
  // ?key= once (checked against the STUDY_KEY env var) and gets the cookie
  // set. Everything else sees a plain 404. Fails CLOSED when the env var is
  // absent — the repo is public, so the key can only ever live in the
  // environment. The cookie is set for the whole site (path '/') because the
  // raw-log API GETs check it too (src/lib/study-auth.ts).
  if (request.nextUrl.pathname === '/study' || request.nextUrl.pathname.startsWith('/study/')) {
    const key = process.env.STUDY_KEY;
    if (key && request.cookies.get('csc-study')?.value === key) {
      return NextResponse.next();
    }
    if (key && request.nextUrl.searchParams.get('key') === key) {
      const url = request.nextUrl.clone();
      url.searchParams.delete('key');
      const res = NextResponse.redirect(url);
      res.cookies.set('csc-study', key, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
      return res;
    }
    return new NextResponse('Not found', { status: 404 });
  }

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
    '/study',
    '/study/:path*',
  ],
};
