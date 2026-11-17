import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirects from '@/data/slug-redirects.json';
import { getUser, isOwnerUser } from '@/lib/auth';

// Old source-prefixed slug → current canonical slug (generated at build by
// scripts/generate-posts-cache.ts). Post URLs were standardized — the source
// prefix was stripped (/post/pdf-there-is-no-economy → /post/there-is-no-economy-pdf)
// — so already-shared links get a permanent (308) redirect to the new URL.
const MAP = redirects as Record<string, string>;

// In Next 16 "Middleware" is "Proxy"; the runtime contract is unchanged.
export function proxy(request: NextRequest) {
  // /study → /analytics: the console moved (owner direction, 2026-11-16).
  // Permanent redirect, query preserved so the ?key= flow still lands.
  if (request.nextUrl.pathname === '/study' || request.nextUrl.pathname.startsWith('/study/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/analytics' + request.nextUrl.pathname.slice('/study'.length);
    return NextResponse.redirect(url, 308);
  }

  // /analytics — the owner's private console. Gated here, before any
  // rendering. Three ways in, checked in order:
  //   1. The owner's Google session (signed csc-session cookie, owner email —
  //      src/lib/auth.ts; proxy runs on the Node runtime in Next 16, so the
  //      HMAC verify works here).
  //   2. The long-lived key cookie.
  //   3. ?key= once (checked against the STUDY_KEY env var); sets the cookie.
  // Everything else sees a plain 404. Fails CLOSED when nothing is configured
  // — the repo is public, so the key can only ever live in the environment.
  // The cookie is set for the whole site (path '/') because the raw-log API
  // GETs check it too (src/lib/analytics-auth.ts).
  if (request.nextUrl.pathname === '/analytics' || request.nextUrl.pathname.startsWith('/analytics/')) {
    if (isOwnerUser(getUser(request))) {
      return NextResponse.next();
    }
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
    '/analytics',
    '/analytics/:path*',
  ],
};
