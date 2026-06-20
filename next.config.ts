import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  // Ensure data files are bundled into serverless function output.
  // posts-cache.json is created by the prebuild script and must be
  // available at runtime; ga_context.txt is the fallback source.
  outputFileTracingIncludes: {
    "/**": ["./src/data/**"],
    // The corpus vectors (~50 MB) are bundled ONLY into the semantic-search
    // function — never into every route — so they can't bloat or break others.
    "/api/semantic": ["./vectors/**"],
  },

  async rewrites() {
    return [
      // Clean standalone URL for the essay, served by its self-contained HTML.
      // The long vanity domain (thereisnoeconomybutonlythedebttothecenter.com)
      // can redirect here. Keeps the URL clean — no .html, no site chrome.
      { source: '/there-is-no-economy', destination: '/original/there-is-no-economy.html' },
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
