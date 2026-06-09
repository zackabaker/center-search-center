/**
 * scripts/scrape-chronicles.mjs
 *
 * Scrapes all Eric Gans "Chronicles of Love and Resentment" posts from the
 * Wayback Machine and writes them to src/data/chronicles.json.
 *
 * Usage:
 *   node scripts/scrape-chronicles.mjs
 *
 * Options (env vars):
 *   DELAY_MS=1200       Milliseconds between requests (default 1200)
 *   RESUME=1            Skip entries already in chronicles.json (default 1)
 *   CATEGORY_TS=20251116071649  Timestamp of the category page snapshot
 *
 * Strategy:
 *   1. Fetch the Wayback Machine snapshot of the category/views page — this
 *      single page lists all ~855 chronicle slugs (vwNNN format).
 *   2. For each slug, fetch https://web.archive.org/web/<TS>/https://anthropoetics.ucla.edu/views/<slug>/
 *      following any 302 redirects to the actual snapshot timestamp.
 *   3. Parse title (h1.entry-title), date and number (<h4>No. NNN: Date</h4>),
 *      and content (<section class="entry-content">).
 *   4. Save incrementally every 10 posts — Ctrl-C safe, resume with RESUME=1.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'chronicles.json');

const DELAY_MS = parseInt(process.env.DELAY_MS || '1200', 10);
const RESUME = process.env.RESUME !== '0';
const CATEGORY_TS = process.env.CATEGORY_TS || '20251116071649';
const CATEGORY_URL = `https://web.archive.org/web/${CATEGORY_TS}/https://anthropoetics.ucla.edu/category/views/`;

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetchRaw(url, { timeout = 25000 } = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf-8'),
      }));
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function fetch(url, opts = {}, depth = 0) {
  if (depth > 6) throw new Error('Too many redirects');
  const res = await fetchRaw(url, opts);
  if (res.status >= 300 && res.status < 400 && res.headers.location) {
    const loc = res.headers.location;
    const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
    return fetch(next, opts, depth + 1);
  }
  return res;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── HTML parsing ──────────────────────────────────────────────────────────────

function decodeEntities(html) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '“')
    .replace(/&ldquo;/g, '”')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function stripTags(html) {
  return decodeEntities(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s{3,}/g, '  ').trim();
}

function parseChronicle(html, vwSlug) {
  // Remove Wayback Machine toolbar
  html = html.replace(/<!-- BEGIN WAYBACK TOOLBAR[\s\S]*?END WAYBACK TOOLBAR -->/gi, '');
  html = html.replace(/<div\s+id="wm-ipp[^>]*>[\s\S]*?<\/div>/gi, '');

  // ── Number + Date from <h4>No. NNN: Day, Month Nth, Year</h4> ──
  let num = null;
  let date = null;
  const h4Match = html.match(/<h4[^>]*>\s*No\.\s*(\d+):\s*([\s\S]*?)\s*<\/h4>/i);
  if (h4Match) {
    num = parseInt(h4Match[1], 10);
    // Date text like "Saturday, November 8th, 2025"
    date = decodeEntities(h4Match[2].replace(/<[^>]+>/g, '').trim());
    // Normalise ordinal suffixes: "8th" -> keep as-is (fine for display)
  }
  if (!num) {
    // Fallback: extract number from slug
    const m = vwSlug.match(/vw(\d+)/);
    if (m) num = parseInt(m[1], 10);
  }

  // ── Title ──
  let title = null;
  const entryTitleMatch = html.match(/<h1[^>]+class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i);
  if (entryTitleMatch) title = decodeEntities(entryTitleMatch[1].replace(/<[^>]+>/g, '').trim());
  if (!title) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) title = decodeEntities(h1[1].replace(/<[^>]+>/g, '').trim());
  }
  if (!title) {
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleTag) title = decodeEntities(titleTag[1].split('|')[0].split('–')[0].trim());
  }
  if (!title) title = `Chronicle of Love and Resentment #${num ?? vwSlug}`;

  // ── Content from <section class="entry-content"> ──
  let content = '';
  const sectionMatch = html.match(/<section[^>]+class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
  if (sectionMatch) {
    content = stripTags(sectionMatch[1]);
  }

  // Fallback: div.entry-content
  if (!content || content.length < 100) {
    const divMatch = html.match(/<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (divMatch) content = stripTags(divMatch[1]);
  }

  // Fallback: article element
  if (!content || content.length < 100) {
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) content = stripTags(articleMatch[1]);
  }

  // Clean up content
  content = content
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join('\n\n')
    .trim();

  // Remove navigation artifacts
  content = content
    .replace(/^(Home|About|Archive|Search|Menu|Navigation|Skip to content)\s*/gim, '')
    .replace(/\s*(Next|Previous|Newer|Older)\s*(Post|Chronicle|Entry)\s*$/gim, '')
    .replace(/Subscribe to Chronicles RSS\s*/gi, '')
    .replace(/Share\s*\|\s*/gi, '')
    .trim();

  const url = `https://anthropoetics.ucla.edu/views/${vwSlug}/`;
  return { num, vwSlug, title, date, content, url };
}

// ── Fetch all slugs from the category listing ─────────────────────────────────

async function getAllSlugs() {
  console.log(`Fetching category page: ${CATEGORY_URL}`);
  const { status, body } = await fetch(CATEGORY_URL);
  if (status !== 200) throw new Error(`Category page returned HTTP ${status}`);

  const slugSet = new Set();
  for (const m of body.matchAll(/\/views\/(vw\d+)\/?/gi)) {
    slugSet.add(m[1]);
  }

  const slugs = [...slugSet].sort((a, b) => {
    const na = parseInt(a.replace('vw', ''), 10);
    const nb = parseInt(b.replace('vw', ''), 10);
    return na - nb;
  });

  console.log(`Found ${slugs.length} chronicle slugs (${slugs[0]} – ${slugs[slugs.length - 1]})`);
  return slugs;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Chronicles of Love and Resentment Scraper ===');
  console.log(`Delay: ${DELAY_MS}ms  |  Resume: ${RESUME}`);

  // Load existing data if resuming
  let existing = [];
  if (RESUME && fs.existsSync(OUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
      console.log(`Resuming — ${existing.length} entries already saved`);
    } catch { existing = []; }
  }
  const done = new Set(existing.map(e => e.vwSlug || `vw${e.num}`));

  // Get full slug list from category page
  const allSlugs = await getAllSlugs();
  const toScrape = allSlugs.filter(s => !done.has(s));

  console.log(`\nTo scrape: ${toScrape.length} posts (${done.size} already done)`);
  if (toScrape.length === 0) {
    console.log('Nothing to do — all done!');
    return;
  }

  const results = [...existing];
  let ok = 0, skip = 0, fail = 0;

  for (let i = 0; i < toScrape.length; i++) {
    const vwSlug = toScrape[i];
    const pct = ((i + 1) / toScrape.length * 100).toFixed(1);
    process.stdout.write(`[${i+1}/${toScrape.length} ${pct}%] ${vwSlug} ... `);

    const waybackUrl = `https://web.archive.org/web/${CATEGORY_TS}/https://anthropoetics.ucla.edu/views/${vwSlug}/`;
    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const { status, body } = await fetch(waybackUrl);

        if (status === 200 && body.length > 1000) {
          const entry = parseChronicle(body, vwSlug);
          if (entry.content.length > 50) {
            results.push(entry);
            ok++;
            process.stdout.write(`✓ #${entry.num} ${entry.title.slice(0, 55)}\n`);
            success = true;
          } else {
            process.stdout.write(`⚠ content too short (${entry.content.length} chars)\n`);
            skip++;
            success = true;
          }
        } else if (status === 429) {
          const wait = DELAY_MS * 6;
          process.stdout.write(`429 rate limited — waiting ${wait}ms... `);
          await sleep(wait);
          retries--;
        } else if (status === 404) {
          process.stdout.write(`404\n`);
          skip++;
          success = true;
        } else {
          process.stdout.write(`HTTP ${status}\n`);
          skip++;
          success = true;
        }
      } catch (e) {
        process.stdout.write(`error: ${e.message} — retrying... `);
        retries--;
        await sleep(DELAY_MS * 2);
      }
    }

    if (!success) {
      process.stdout.write(`failed after retries\n`);
      fail++;
    }

    // Save incrementally every 10 posts
    if ((i + 1) % 10 === 0) {
      const sorted = [...results].sort((a, b) => (a.num ?? 0) - (b.num ?? 0));
      fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2));
      process.stdout.write(`  [saved ${results.length} entries]\n`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  const sorted = [...results].sort((a, b) => (a.num ?? 0) - (b.num ?? 0));
  fs.writeFileSync(OUT_PATH, JSON.stringify(sorted, null, 2));

  console.log(`\n=== Done ===`);
  console.log(`✓ ${ok} posts scraped`);
  console.log(`- ${skip} skipped (not found / too short)`);
  console.log(`✗ ${fail} failed after retries`);
  console.log(`Total in file: ${results.length}`);
  console.log(`\nFile: ${OUT_PATH}`);
  console.log('\nNext steps:');
  console.log('  1. git add src/data/chronicles.json && git commit -m "feat: import chronicles"');
  console.log('  2. git push — chronicles will appear on /download after redeploy');
}

main().catch(e => {
  console.error('\nFatal error:', e);
  process.exit(1);
});
