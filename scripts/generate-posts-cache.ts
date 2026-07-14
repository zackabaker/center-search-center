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

// ── Origin of Language chapter headings: structure the single-blob book ────────────────
// The scraped text has a front-matter TOC blob and body chapters that start
// mid-paragraph as "Chapter N. Title First sentence…". Promote chapter starts
// to real markdown headings (PostContent renders them as h3s and the reading
// ToC appears) and drop the redundant TOC blob.
{
  const ool = posts.find((p) => p.slug === 'the-origin-of-language');
  if (ool && !ool.content.includes('\n## Chapter')) {
    // Chapter titles from the TOC blob: "Chapter N: Title" pairs
    const tocMatch = ool.content.match(/Foreword(?: Chapter \d+: [^]*?)+(?=\n\n|$)/);
    const titles: Record<string, string> = {};
    for (const m of ool.content.matchAll(/Chapter (\d+): ([A-Z][^]*?)(?= Chapter \d+:|\n|$)/g)) {
      titles[m[1]] = m[2].trim();
    }
    let c = ool.content;
    for (const [num, title] of Object.entries(titles)) {
      const needle = `\n\nChapter ${num}. ${title} `;
      const at = c.indexOf(needle);
      if (at >= 0) {
        c = c.slice(0, at) + `\n\n## Chapter ${num}. ${title}\n\n` + c.slice(at + needle.length);
      }
    }
    // Drop the TOC blob paragraph (real ToC now generates from the headings)
    if (tocMatch) c = c.replace(tocMatch[0], '').replace(/\n{3,}/g, '\n\n');
    ool.content = c;
  }
}

// ── Anthropoetics endnotes: unblob the "N. text (back)" note runs ─────────
// 85 AP articles carry endnotes scraped as run-together paragraphs ending in
// "(back)" artifacts. Split them into one note per paragraph (bold number),
// strip the artifacts, and set a "## Notes" heading before the first note.
for (const p of posts) {
  if (p.source !== 'ap' || !p.content.includes('(back)')) continue;
  const paras = p.content.split(/\n\n+/);
  const out: string[] = [];
  let headed = false;
  for (const para of paras) {
    if (!/\(back\)/.test(para)) { out.push(para); continue; }
    // one or more notes run together, each ending with "(back)"
    const segs = para.split(/\(back\)\s*/).map((s) => s.trim()).filter(Boolean);
    // leading non-note text (rare) stays a normal paragraph
    for (const seg of segs) {
      const m = seg.match(/^(\d{1,2})\.\s+([^]*)$/);
      if (m) {
        if (!headed) { out.push('## Notes'); headed = true; }
        out.push(`**${m[1]}.** ${m[2].trim()}`);
      } else {
        out.push(seg);
      }
    }
  }
  p.content = out.join('\n\n');
}


console.time('write');
fs.writeFileSync(OUT, JSON.stringify(posts), 'utf-8');

// Old prefixed slug → current canonical slug, for proxy.ts redirects.
const redirects: Record<string, string> = {};
for (const p of posts) if (p.legacySlug && p.legacySlug !== p.slug) redirects[p.legacySlug] = p.slug;
// Retired legacy slugs whose source classification later changed — shared
// links must keep resolving even though no current post carries them.
redirects['book-the-origin-of-language'] = 'the-origin-of-language';
fs.writeFileSync(REDIRECTS, JSON.stringify(redirects), 'utf-8');
console.timeEnd('write');

const stat = fs.statSync(OUT);
const kb = (stat.size / 1024).toFixed(1);
console.log(`✓ ${posts.length} posts → posts-cache.json (${kb} KB)`);
console.log(`✓ ${Object.keys(redirects).length} legacy slugs → slug-redirects.json`);
