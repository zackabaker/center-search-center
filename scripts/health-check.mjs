#!/usr/bin/env node
// Production health contract for center.study — run after deploys / on a
// schedule. Exits non-zero when a check fails so CI can alert.
//
//   node scripts/health-check.mjs [base-url]

const BASE = process.argv[2] || 'https://center.study';
let failures = 0;

function ok(name, cond, detail = '') {
  if (cond) console.log(`  ✓ ${name}`);
  else { failures++; console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

async function get(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual', ...opts });
  const body = opts.head ? '' : await res.text();
  return { res, body };
}

// A permanent redirect must be a 308 AND land on the intended page — a 308 to
// the wrong place (or to another host) is as broken as no redirect at all.
async function redirects(name, from, to) {
  const { res } = await get(from);
  const loc = res.headers.get('location');
  const target = loc ? new URL(loc, `${BASE}${from}`) : null;
  const landed = target && target.origin === new URL(BASE).origin && target.pathname === to;
  ok(`${name} → 308 ${to}`, res.status === 308 && landed, `got ${res.status} → ${loc || 'no location'}`);
}

console.log(`Health check against ${BASE}\n`);

// ── Core pages return 200 ────────────────────────────────────────────────────
// /begin and /lectures are the destinations of the retired /start and /intro
// (see Redirects below).
for (const path of ['/', '/begin', '/lectures', '/guide', '/concepts', '/browse', '/faq', '/lineage', '/trending', '/generative-anthropology', '/guide/concepts/the-center', '/guide/concepts/power']) {
  const { res } = await get(path);
  ok(`200 ${path}`, res.status === 200, `got ${res.status}`);
}

// ── Post page: cached + parseable JSON-LD + real 404s ───────────────────────
{
  const { res, body } = await get('/post/the-discourse-of-the-center');
  ok('200 /post/the-discourse-of-the-center', res.status === 200, `got ${res.status}`);
  const cache = res.headers.get('x-vercel-cache') || '';
  ok('post is edge-cached (HIT/PRERENDER/STALE)', ['HIT', 'PRERENDER', 'STALE'].includes(cache), `x-vercel-cache: ${cache || 'absent'} (MISS is expected once after deploy)`);
  const ldBlocks = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  ok('post has JSON-LD', ldBlocks.length >= 2, `found ${ldBlocks.length}`);
  let parsed = 0;
  for (const [, json] of ldBlocks) { try { JSON.parse(json); parsed++; } catch {} }
  ok('post JSON-LD parses', parsed === ldBlocks.length, `${parsed}/${ldBlocks.length}`);
}
{
  const { res } = await get('/post/zzz-health-check-not-a-real-slug');
  ok('garbage post slug → 404', res.status === 404, `got ${res.status}`);
}

// ── Redirects ────────────────────────────────────────────────────────────────
await redirects('renamed concept slug', '/guide/concepts/the-event', '/guide/concepts/event');
await redirects('legacy post slug', '/post/gablog-the-discourse-of-the-center', '/post/the-discourse-of-the-center');
// Retired entry pages (next.config.ts): /start was folded into /begin, the one
// canonical first-visit page (2026-11); /intro went with the AI-prose cleanup
// (2026-10) and points at the lecture series.
await redirects('retired /start', '/start', '/begin');
await redirects('retired /intro', '/intro', '/lectures');

// ── Sitemap hygiene ──────────────────────────────────────────────────────────
{
  const { res, body } = await get('/sitemap.xml');
  ok('200 /sitemap.xml', res.status === 200, `got ${res.status}`);
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // Core-only sitemap since 2026-11 (src/app/sitemap.ts): static + concept +
  // glossary + reading-path pages and the Katz core posts, ~890 URLs. The
  // floor catches a lost corpus; the ceiling catches the ~960 quote stubs or
  // ~1,300 archival reprints leaking back in, which is what de-indexed the
  // site. Core posts grow slowly, so 1200 leaves years of headroom.
  ok('sitemap has 700–1200 URLs (core only)', urls.length >= 700 && urls.length <= 1200, `${urls.length}`);
  const stubs = urls.filter((u) => u.startsWith(`${BASE}/q/`));
  ok('sitemap omits /q/ quote stubs', stubs.length === 0, `${stubs.length} listed`);
  ok('sitemap lists /begin, not the redirecting /start or /intro',
    urls.includes(`${BASE}/begin`) && !urls.includes(`${BASE}/start`) && !urls.includes(`${BASE}/intro`));
  const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
  ok('sitemap has no duplicate URLs', dupes.length === 0, dupes.slice(0, 3).join(', '));
  ok('sitemap omits redirecting /guide/concepts index', !urls.includes(`${BASE}/guide/concepts`));
}

// ── Feeds + robots ───────────────────────────────────────────────────────────
{
  const { res, body } = await get('/feed.xml');
  ok('200 /feed.xml', res.status === 200, `got ${res.status}`);
  ok('feed looks like RSS', body.includes('<rss') || body.includes('<feed'), '');
}
{
  const { res, body } = await get('/robots.txt');
  ok('200 /robots.txt', res.status === 200, `got ${res.status}`);
  ok('robots references sitemap', body.toLowerCase().includes('sitemap'), '');
}

// ── Metadata sanity ──────────────────────────────────────────────────────────
{
  const { body } = await get('/');
  ok('home has single <main>', (body.match(/<main/g) || []).length === 1);
  ok('home description not stale', !body.includes('700+ texts'), 'still says 700+');
  const doubled = body.includes('Center Study Center | Center Study Center');
  ok('no doubled title suffix on home', !doubled);
}
{
  const { body } = await get('/begin');
  const title = body.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'none';
  ok('/begin has its own title', body.includes('<title>Getting Started'), `got "${title}"`);
}

console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
