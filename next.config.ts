import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Report-only while we confirm nothing legitimate is blocked; the model CDN,
  // Substack embed, and Vercel analytics are the known external dependencies.
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: blob:",
      "frame-src https://dennisbouvard.substack.com https://www.youtube-nocookie.com",
      "worker-src 'self' blob:",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  // Per-deploy cache-buster for the search-index fetches. The index is
  // build-baked, so clients can cache it as immutable for a year — this token
  // in the URL is what rolls it over on deploy. VERCEL_GIT_COMMIT_SHA exists
  // on every Vercel build; Date.now() covers local dev.
  env: {
    NEXT_PUBLIC_INDEX_V: (process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now())).slice(0, 12),
  },
  // Scoped per-route bundling of runtime data files. Everything with a
  // statically analyzable read path — posts-cache.json, post-meta.json,
  // related.json, slug-redirects.json, concept-passages.json — is traced into
  // exactly the functions that import its reader, automatically; only reads
  // tracing CANNOT see are listed here. Never add a catch-all "/**" data
  // include: that once put all ~72 MB of src/data (raw source dumps included)
  // into every serverless function and pushed /api/embed to 2/3 of Vercel's
  // 250 MB limit.
  outputFileTracingIncludes: {
    // OG-card routes readFile() the Lora/Geist-Mono TTFs at runtime; that path
    // is dynamic so tracing misses it — include the font dir on every route
    // that renders an opengraph-image (root, post, q, concept, glossary).
    "/opengraph-image": ["./src/assets/fonts/**"],
    "/**/opengraph-image": ["./src/assets/fonts/**"],
    // The corpus vectors (~50 MB) are bundled ONLY into the semantic-search
    // function — never into every route — so they can't bloat or break others.
    "/api/semantic": ["./vectors/**"],
    // The tutor's paragraph vectors (~27 MB), read at runtime from a path
    // tracing can't see — bundled only into the tutor's own functions.
    "/api/tutor/**": ["./tutor/index/keys.json", "./tutor/index/vectors.f32.bin", "./tutor/prompt.md"],
    // The search box's Answer view runs on the tutor too.
    "/api/chat": ["./tutor/index/keys.json", "./tutor/index/vectors.f32.bin", "./tutor/prompt.md"],
    // The embedding model (~33 MB) lives ONLY in /api/embed — /api/semantic
    // calls it over HTTP for raw-text mode. onnxruntime-node's native binding
    // is resolved at runtime (tracing misses it), so include the linux builds
    // explicitly.
    "/api/embed": [
      "./models/**",
      "./node_modules/onnxruntime-node/bin/napi-v3/linux/**",
    ],
  },

  async rewrites() {
    return [
      // Clean standalone URL for the essay, served by its self-contained HTML.
      // The long vanity domain (thereisnoeconomybutonlythedebttothecenter.com)
      // can redirect here. Keeps the URL clean — no .html, no site chrome.
      { source: '/there-is-no-economy', destination: '/original/there-is-no-economy.html' },
      // Shareable seminar invitation: /invite IS the syllabus PDF (per owner,
      // the designed HTML treatments read worse than the document). Clean URL,
      // inline PDF; the file lives in public/.
      { source: '/invite', destination: '/writing-companies-into-existence.pdf' },
    ];
  },

  async redirects() {
    return [
      // Archive-first cleanup (2026-10): AI-prose surfaces removed; preserve
      // inbound links with permanent redirects to the surviving routes.
      { source: '/intro', destination: '/lectures', permanent: true },
      // The Avalon talk page lived at /avalon for its first day (2026-11-12,
      // sitemapped) before being renamed to its descriptive URL.
      { source: '/avalon', destination: '/intro-center-study-zack-baker', permanent: true },
      { source: '/ask/:slug', destination: '/search', permanent: true },
      { source: '/answers', destination: '/search', permanent: true },
      { source: '/the-center-of-everything', destination: '/begin', permanent: true },
      { source: '/animal-communication', destination: '/begin', permanent: true },
      // Entry-page consolidation (2026-11): /start was a thinner duplicate of
      // /guide; /begin is the one canonical first-visit page.
      { source: '/start', destination: '/begin', permanent: true },
      // www → apex as a permanent 308 (Vercel's domain-level redirect is a 307).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.center.study' }],
        destination: 'https://center.study/:path*',
        permanent: true,
      },
      // Concept slugs renamed July 2026 (article dropped); both were briefly in
      // the sitemap, so keep permanent redirects.
      { source: '/guide/concepts/the-event', destination: '/concepts/event', permanent: true },
      { source: '/guide/concepts/the-market', destination: '/concepts/market', permanent: true },
      // /follow page removed July 2026 — its two links live in the site footer.
      { source: '/follow', destination: '/about', permanent: true },
      // The short-lived public /sessions page became the private /study
      // console (2026-10-29). The destination is key-gated in src/proxy.ts.
      { source: '/sessions', destination: '/study', permanent: false },
      // Bare /q has no index page — quotes are reached from terms/concepts/verify.
      { source: '/q', destination: '/concepts', permanent: false },
      // The numbered series' home is the Chronicles browse hub.
      { source: '/chronicles', destination: '/browse/chronicle', permanent: false },
      // "awe" removed from the glossary July 2026 (no Katz definition exists;
      // policy: no reference-defined terms). Briefly indexed, so redirect.
      { source: '/guide/glossary/awe', destination: '/concepts', permanent: true },
      // Glossary moved to its own static route July 2026 (?view=glossary made
      // /concepts dynamic per-request). Browsers keep the #fragment across
      // the redirect, so term deep-links keep landing.
      {
        source: '/concepts',
        has: [{ type: 'query', key: 'view', value: 'glossary' }],
        destination: '/concepts/glossary',
        permanent: true,
      },
      // Concept & glossary detail pages moved out of /guide (2026-11) into one
      // /concepts tree. ~135 of the old URLs were sitemapped and indexed, so
      // the wildcards are permanent 308s. The specific redirects above
      // (the-event, the-market, awe) stay ahead of these — first match wins.
      { source: '/guide/concepts', destination: '/concepts', permanent: false },
      { source: '/guide/glossary', destination: '/concepts/glossary', permanent: false },
      { source: '/guide/concepts/:slug', destination: '/concepts/:slug', permanent: true },
      { source: '/guide/glossary/:slug', destination: '/concepts/glossary/:slug', permanent: true },
    ];
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Long-lived cache for Next.js static chunks — ONLY in production, where
      // filenames are content-hashed so immutable caching is safe. Applying it
      // in dev makes the browser hold stale chunks for a year and breaks HMR /
      // hard refreshes (Next warns about this), so skip it during development.
      ...(isProd
        ? [{
            source: '/_next/static/(.*)',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
          }]
        : []),
      {
        // Static files in /public (PDFs, images, etc.)
        source: '/(.*)\\.(pdf|png|jpg|jpeg|gif|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
