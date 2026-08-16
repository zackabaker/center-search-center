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
  // Ensure data files are bundled into serverless function output.
  // posts-cache.json is created by the prebuild script and must be
  // available at runtime; ga_context.txt is the fallback source.
  outputFileTracingIncludes: {
    // OG-card routes readFile() the Lora/Geist-Mono TTFs at runtime; that path
    // is dynamic so tracing misses it — include the font dir on every route
    // that renders an opengraph-image (root, post, concept).
    "/**": ["./src/data/**", "./src/assets/fonts/**"],
    // The corpus vectors (~50 MB) are bundled ONLY into the semantic-search
    // function — never into every route — so they can't bloat or break others.
    "/api/semantic": ["./vectors/**"],
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
    ];
  },

  async redirects() {
    return [
      // www → apex as a permanent 308 (Vercel's domain-level redirect is a 307).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.center.study' }],
        destination: 'https://center.study/:path*',
        permanent: true,
      },
      // Concept slugs renamed July 2026 (article dropped); both were briefly in
      // the sitemap, so keep permanent redirects.
      { source: '/guide/concepts/the-event', destination: '/guide/concepts/event', permanent: true },
      { source: '/guide/concepts/the-market', destination: '/guide/concepts/market', permanent: true },
      // /follow page removed July 2026 — its two links live in the site footer.
      { source: '/follow', destination: '/about', permanent: true },
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
      // Bare /guide/glossary (parent of the ~94 live term pages) had no page
      // and 404ed while its sibling /guide/concepts redirects.
      { source: '/guide/glossary', destination: '/concepts/glossary', permanent: false },
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
