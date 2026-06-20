/**
 * Corpus health check — runs at prebuild, AFTER generate-posts-cache.
 *
 * Asserts invariants on the parsed corpus so a parser change can't silently
 * reintroduce the problems fixed over time (comment spam, Substack
 * subscription boilerplate, giant unparagraphed walls, leftover HTML,
 * dropped/duplicated posts). Exits non-zero on any failure, which fails the
 * build before a regression ships.
 *
 * Run directly: npx tsx scripts/check-corpus.ts
 */

import fs from 'fs';
import path from 'path';

interface Post {
  slug: string;
  title: string;
  content: string;
  source: string;
  url?: string;
  author?: string;
}

const CACHE = path.join(process.cwd(), 'src', 'data', 'posts-cache.json');

const errors: string[] = [];
const warnings: string[] = [];
function err(m: string) { errors.push(m); }
function warn(m: string) { warnings.push(m); }

if (!fs.existsSync(CACHE)) {
  console.error('✗ posts-cache.json missing — run generate-posts-cache first');
  process.exit(1);
}
const posts: Post[] = JSON.parse(fs.readFileSync(CACHE, 'utf-8'));

// ── 1. Count + sources ────────────────────────────────────────────────────
if (posts.length < 1900 || posts.length > 2200) {
  err(`post count ${posts.length} outside expected range 1900–2200 (parser may have dropped or duplicated content)`);
}
const EXPECTED_SOURCES = ['gablog', 'substack', 'book', 'pdf', 'reddit', 'twitter', 'chronicle', 'ap'];
const bySource: Record<string, number> = {};
for (const p of posts) bySource[p.source] = (bySource[p.source] ?? 0) + 1;
for (const s of EXPECTED_SOURCES) {
  if (!bySource[s]) err(`source "${s}" has 0 posts — a parser likely failed`);
}

// ── 2. Duplicate slugs ────────────────────────────────────────────────────
const seen = new Set<string>();
for (const p of posts) {
  if (seen.has(p.slug)) err(`duplicate slug: ${p.slug}`);
  seen.add(p.slug);
}

// ── 2b. Duplicate posts (same source + URL + body) ────────────────────────
// Catches a post captured twice in the source dump even when slug-dedup has
// masked it with a "-N" suffix. Keyed like the parser's dedup: alphanumeric
// body so trivial markdown diffs still collapse; book chapters share the book
// URL but differ in body, so they don't collide.
const seenContent = new Set<string>();
for (const p of posts) {
  if (!p.url) continue;
  const key = `${p.source}|${p.url}|${p.content.replace(/[^a-z0-9]+/gi, '').toLowerCase()}`;
  if (seenContent.has(key)) err(`duplicate post (same source+URL+body): ${p.slug}`);
  seenContent.add(key);
}

// ── 3. Empty / broken posts ───────────────────────────────────────────────
for (const p of posts) {
  if (!p.title?.trim()) err(`empty title: ${p.slug}`);
  if (!p.content?.trim()) err(`empty content: ${p.slug}`);
}

// ── 4. Comment spam must stay gone ────────────────────────────────────────
const SPAM = /\b(buy soma|cheap soma|tenuate|tramadol|buy xanax|cheap xanax|ultram|cialis|phentermine|animal porn|adult clips|glory hole|casino online|payday loans?|replica watch)\b/gi;
for (const p of posts) {
  const hits = (p.content.match(SPAM) || []).length;
  if (hits >= 3) err(`spam paragraph re-appeared in ${p.slug} (${hits} signatures)`);
}

// ── 5. Substack subscription boilerplate must stay stripped ───────────────
for (const p of posts) {
  if (p.source !== 'substack') continue;
  for (const para of p.content.split(/\n\n+/)) {
    const t = para.replace(/\s+/g, ' ').trim();
    if (/^(subscribe( now)?|share)(\s+(subscribe|share))*$/i.test(t) ||
        /^thanks for reading\b.{0,80}\bsubscribe\b/i.test(t)) {
      err(`Substack boilerplate re-appeared in ${p.slug}: "${t.slice(0, 50)}"`);
      break;
    }
  }
}

// ── 6. No leftover HTML tags / entities in content ────────────────────────
for (const p of posts) {
  if (/<\/?(p|div|span|a|br|em|strong|h[1-6]|ul|li|blockquote|img)\b[^>]*>/i.test(p.content)) {
    err(`leftover HTML tag in ${p.slug}`); break;
  }
}
for (const p of posts) {
  if (/&(amp|lt|gt|quot|nbsp|#\d+|#x[0-9a-f]+);/i.test(p.content)) {
    warn(`undecoded HTML entity in ${p.slug}`); break;
  }
}

// ── 7. No giant unparagraphed walls ───────────────────────────────────────
// The paragraphizer splits blocks > ~1800 chars; a handful of AP items have no
// sentence breaks to split on. Allow a small, named set; flag anything new.
const GIANT_ALLOW = new Set(['ap1202-muja07', 'ap1102-muja', 'rendering-is-the-stay-of-frenzy-ou-ga-po']);
const GIANT = 3500;
for (const p of posts) {
  const maxPara = Math.max(0, ...p.content.split(/\n\n+/).map((x) => x.length));
  if (maxPara > GIANT && !GIANT_ALLOW.has(p.slug)) {
    err(`giant unparagraphed block (${maxPara} chars) in ${p.slug}`);
  }
}

// ── 8. Spot-checks on known-fixed posts ───────────────────────────────────
const tine = posts.find((p) => p.slug === 'there-is-no-economy-pdf');
if (!tine) err('there-is-no-economy-pdf is missing');
else {
  const bq = tine.content.split(/\n\n+/).filter((x) => x.startsWith('> ')).length;
  if (bq < 20) err(`"There Is No Economy" lost its blockquotes (${bq} < 20)`);
  if (tine.author !== 'Adam Katz & Zack Baker') err(`"There Is No Economy" lost its co-author (got ${tine.author})`);
}

// ── Report ────────────────────────────────────────────────────────────────
console.log(`Corpus health check — ${posts.length} posts:`, bySource);
for (const w of warnings) console.warn('⚠ ' + w);
if (errors.length) {
  console.error(`\n✗ ${errors.length} corpus health error(s):`);
  for (const e of errors) console.error('  • ' + e);
  process.exit(1);
}
console.log(`✓ corpus health OK${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
