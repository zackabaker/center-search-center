import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import redirects from '@/data/slug-redirects.json';
import { getUser, isOwnerUser } from '@/lib/auth';
import { aiCrawlerFamily } from '@/lib/ai-agents';
import { getKV } from '@/lib/kv';

// AI crawlers and agents don't run JavaScript, so no client tracker ever sees
// them. Count them here instead — per family per day, plus which paths each
// family fetches — for the "AI systems reading the archive" panel on
// /analytics. Aggregates only; the user-agent is classified and discarded.
async function countCrawler(family: string, path: string): Promise<void> {
  try {
    const kv = getKV();
    if (!kv) return;
    const dk = `crawler:day:${new Date().toISOString().slice(0, 10)}`;
    const pipe = kv.pipeline();
    pipe.hincrby(dk, family, 1);
    pipe.expire(dk, 60 * 60 * 24 * 400);
    pipe.zincrby(`crawler:paths:${family}`, 1, path);
    await pipe.exec();
  } catch {
    /* best-effort — never affect the response */
  }
}

// Old source-prefixed slug → current canonical slug (generated at build by
// scripts/generate-posts-cache.ts). Post URLs were standardized — the source
// prefix was stripped (/post/pdf-there-is-no-economy → /post/there-is-no-economy-pdf)
// — so already-shared links get a permanent (308) redirect to the new URL.
const MAP = redirects as Record<string, string>;

// In Next 16 "Middleware" is "Proxy"; the runtime contract is unchanged.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  // The last matcher entry routes AI-agent requests through here (and only
  // those — readers and search engines never touch the proxy for it). Count
  // in the background and fall through to the normal handling below.
  // ?_probe is the self-test: it answers with the classification instead of
  // the page and never counts toward a real family (?_probe=count exercises
  // the write under the throwaway family "probe", which the console ignores).
  const family = aiCrawlerFamily(request.headers.get('user-agent'));
  if (family) {
    const p = request.nextUrl.pathname;
    const probe = request.nextUrl.searchParams.get('_probe');
    if (probe !== null) {
      if (probe === 'count') event.waitUntil(countCrawler('probe', p.slice(0, 200)));
      return NextResponse.json({ aiAgent: family });
    }
    const isPage = !/\.[a-z0-9]{2,5}$/i.test(p) || p.endsWith('.txt') || p.endsWith('.xml');
    if (isPage) event.waitUntil(countCrawler(family, p.slice(0, 200)));
  }

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
    // AI crawlers/agents ONLY (user-agent condition) — everyone else skips
    // the proxy on these paths, exactly as before. Tokens mirror
    // src/lib/ai-agents.ts; the value is matched against the whole header.
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value:
            '.*(ChatGPT-User|Claude-User|Perplexity-User|MistralAI-User|OAI-SearchBot|Claude-SearchBot|PerplexityBot|DuckAssistBot|YouBot|GPTBot|ClaudeBot|anthropic-ai|Claude-Web|meta-externalagent|Amazonbot|Bytespider|CCBot|cohere-ai|Diffbot).*',
        },
      ],
    },
  ],
};
