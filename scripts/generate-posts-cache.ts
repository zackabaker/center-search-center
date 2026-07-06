/**
 * Pre-serialize all parsed posts to JSON so the Next.js app can load them
 * in <200 ms instead of running the full 4-5 second parse on every cold start.
 *
 * Run automatically via the "prebuild" npm script.
 * Outputs:
 *   src/data/posts-cache.json     — all parsed posts (clean, standardized slugs)
 *   src/data/slug-redirects.json  — { oldPrefixedSlug: canonicalSlug } map, read
 *                                   by proxy.ts to 308-redirect already-shared URLs
 */

import fs from 'fs';
import path from 'path';
import { parseAllContent } from '../src/lib/parser';

const DATA = path.join(process.cwd(), 'src', 'data');
const OUT = path.join(DATA, 'posts-cache.json');
const REDIRECTS = path.join(DATA, 'slug-redirects.json');

console.time('parse');
const posts = parseAllContent();
console.timeEnd('parse');

// Anthropomorphics carries its publication year: the source files have no
// per-chapter dates, which broke chronology/JSON-LD for all 24 chapters.
for (const p of posts) if (p.source === 'book' && !p.date) p.date = '2020';

console.time('write');
fs.writeFileSync(OUT, JSON.stringify(posts), 'utf-8');

// Old prefixed slug → current canonical slug, for proxy.ts redirects.
const redirects: Record<string, string> = {};
for (const p of posts) if (p.legacySlug && p.legacySlug !== p.slug) redirects[p.legacySlug] = p.slug;
fs.writeFileSync(REDIRECTS, JSON.stringify(redirects), 'utf-8');
console.timeEnd('write');

const stat = fs.statSync(OUT);
const kb = (stat.size / 1024).toFixed(1);
console.log(`✓ ${posts.length} posts → posts-cache.json (${kb} KB)`);
console.log(`✓ ${Object.keys(redirects).length} legacy slugs → slug-redirects.json`);
