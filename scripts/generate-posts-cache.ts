/**
 * Pre-serialize all parsed posts to JSON so the Next.js app can load them
 * in <200 ms instead of running the full 4-5 second parse on every cold start.
 *
 * Run automatically via the "prebuild" npm script.
 * Output: src/data/posts-cache.json
 */

import fs from 'fs';
import path from 'path';
import { parseAllContent } from '../src/lib/parser';

const OUT = path.join(process.cwd(), 'src', 'data', 'posts-cache.json');

console.time('parse');
const posts = parseAllContent();
console.timeEnd('parse');

console.time('write');
fs.writeFileSync(OUT, JSON.stringify(posts), 'utf-8');
console.timeEnd('write');

const stat = fs.statSync(OUT);
const kb = (stat.size / 1024).toFixed(1);
console.log(`✓ ${posts.length} posts → posts-cache.json (${kb} KB)`);
