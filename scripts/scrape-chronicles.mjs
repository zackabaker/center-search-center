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
 *   DELAY_MS=1500       Milliseconds between requests (default 1500)
 *   START_NUM=1         First Chronicle number to attempt (default 1)
 *   END_NUM=700         Last Chronicle number to attempt (default 700)
 *   RESUME=1            Skip entries already in chronicles.json (default 1)
 *
 * The script tries the Wayback Machine CDX API first to discover which numbers
 * have archived snapshots, then fetches each one. On rate-limit (429) it waits
 * and retries. Results are written incrementally so you can Ctrl-C and resume.
 *
 * The Wayback Machine can be slow/unreliable from automated scripts. If you're
 * getting lots of 429s, increase DELAY_MS to 3000 or higher, or run from a
 * different network / time of day.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'chronicles.json');

const DELAY_MS = parseInt(process.env.DELAY_MS || '1500', 10);
const START_NUM = parseInt(process.env.START_NUM || '1', 10);
const END_NUM = parseInt(process.env.END_NUM || '700', 10);
const RESUME = process.env.RESUME !== '0';

// Known Wayback Machine snapshot timestamps for specific posts (from CDX)
// Used as fallback if CDX discovery fails
const KNOWN_SNAPSHOTS = {
  642: '20191228190034',
  649: '20200930160340',
  667: '20200804141524',
  677: '20201122185635',
};

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function fetch(url, { timeout = 20000 } = {}) {
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
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── HTML parsing ──────────────────────────────────────────────────────────────

function stripTags(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rdquo;/g, '“')
    .replace(/&ldquo;/g, '“')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/\s{3,}/g, '\n\n')
    .trim();
}

function parsePost(html, num, url) {
  // Remove Wayback Machine toolbar
  html = html.replace(/<!-- BEGIN WAYBACK TOOLBAR[\s\S]*?END WAYBACK TOOLBAR -->/gi, '');
  html = html.replace(/<div id="wm-ipp[\s\S]*?<\/div>/gi, '');

  // ── Title ──
  let title = null;

  // Try WordPress entry-title class first
  const entryTitleMatch = html.match(/<[^>]+class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i);
  if (entryTitleMatch) title = stripTags(entryTitleMatch[1]).trim();

  // Try <h1> inside article/main
  if (!title) {
    const h1Match = html.match(/<article[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) title = stripTags(h1Match[1]).trim();
  }

  // Try any <h1>
  if (!title) {
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) title = stripTags(h1[1]).trim();
  }

  // Try <title> tag (strip " | Anthropoetics" suffix)
  if (!title) {
    const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleTag) title = stripTags(titleTag[1]).split('|')[0].trim();
  }

  if (!title) title = `Chronicle of Love and Resentment #${num}`;

  // ── Date ──
  let date = null;
  // WordPress datetime: <time class="entry-date" datetime="2019-05-12">May 12, 2019</time>
  const timeMatch = html.match(/<time[^>]+datetime="(\d{4}-\d{2}-\d{2})"[^>]*>([\s\S]*?)<\/time>/i);
  if (timeMatch) {
    date = timeMatch[2].trim().replace(/<[^>]+>/g, '').trim() || timeMatch[1];
  }

  // Fallback: look for date in meta
  if (!date) {
    const metaDate = html.match(/<meta[^>]+(?:article:published_time|dcterms\.date)[^>]+content="(\d{4}-\d{2}-\d{2})/i);
    if (metaDate) {
      const d = new Date(metaDate[1]);
      date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  // ── Content ──
  let content = '';

  // Try .entry-content
  const entryContentMatch = html.match(/<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/article|<div[^>]+class="[^"]*(?:entry-meta|post-footer))/i);
  if (entryContentMatch) {
    content = stripTags(entryContentMatch[1]);
  }

  // Try article element content
  if (!content || content.length < 100) {
    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch) {
      content = stripTags(articleMatch[1]);
    }
  }

  // Try .post-content
  if (!content || content.length < 100) {
    const postContentMatch = html.match(/<div[^>]+class="[^"]*(?:post-content|page-content|the-content)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (postContentMatch) content = stripTags(postContentMatch[1]);
  }

  // Fallback: strip everything between <body> and </body>
  if (!content || content.length < 100) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) content = stripTags(bodyMatch[1]);
  }

  // Clean up the content
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
    .trim();

  return { num, title, date, content, url };
}

// ── CDX Discovery ─────────────────────────────────────────────────────────────

async function discoverUrlsFromCDX() {
  console.log('Trying CDX API to discover snapshot URLs...');
  const snapshots = {};

  try {
    // Fetch in smaller batches to avoid timeouts
    for (let from = START_NUM; from <= END_NUM; from += 100) {
      const to = Math.min(from + 99, END_NUM);
      const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=anthropoetics.ucla.edu/views/*&output=json&fl=original,timestamp&filter=statuscode:200&collapse=urlkey&matchType=prefix&limit=500&from=20000101&to=20260101`;

      try {
        const { status, body } = await fetch(cdxUrl, { timeout: 15000 });
        if (status === 200 && body.length > 10) {
          const data = JSON.parse(body);
          for (const row of data.slice(1)) {
            const [origUrl, ts] = row;
            const m = origUrl.match(/\/views\/(\d+)\/?$/);
            if (m) {
              const num = parseInt(m[1], 10);
              if (num >= START_NUM && num <= END_NUM) {
                if (!snapshots[num] || ts > snapshots[num].ts) {
                  snapshots[num] = { ts, url: origUrl };
                }
              }
            }
          }
          console.log(`CDX batch ${from}-${to}: found ${Object.keys(snapshots).length} snapshots so far`);
          break; // One query gets all of them if it works
        }
      } catch (e) {
        console.log(`CDX batch ${from}-${to} failed: ${e.message}`);
      }
      await sleep(2000);
    }
  } catch (e) {
    console.log(`CDX discovery failed: ${e.message}`);
  }

  return snapshots;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Chronicles of Love and Resentment Scraper ===');
  console.log(`Range: ${START_NUM}–${END_NUM}, delay: ${DELAY_MS}ms, resume: ${RESUME}`);

  // Load existing data if resuming
  let existing = [];
  if (RESUME && fs.existsSync(OUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
      console.log(`Resuming — ${existing.length} entries already saved`);
    } catch { existing = []; }
  }
  const done = new Set(existing.map(e => e.num));

  // Try CDX discovery
  const cdxSnapshots = await discoverUrlsFromCDX();
  const cdxCount = Object.keys(cdxSnapshots).length;
  console.log(`CDX: found ${cdxCount} archived snapshots`);

  // Build list of numbers to scrape
  const toScrape = [];
  for (let num = START_NUM; num <= END_NUM; num++) {
    if (done.has(num)) continue;
    if (cdxCount > 0 && !cdxSnapshots[num]) {
      // CDX found snapshots but not this number — skip it (it likely doesn't exist)
      continue;
    }
    toScrape.push(num);
  }

  console.log(`\nTo scrape: ${toScrape.length} posts`);
  if (toScrape.length === 0) {
    console.log('Nothing to do — all done!');
    return;
  }

  const results = [...existing];
  let ok = 0, skip = 0, fail = 0;

  for (let i = 0; i < toScrape.length; i++) {
    const num = toScrape[i];
    const pct = ((i + 1) / toScrape.length * 100).toFixed(1);
    process.stdout.write(`[${i+1}/${toScrape.length} ${pct}%] CLR #${num} ... `);

    // Build Wayback URL
    const ts = cdxSnapshots[num]?.ts || KNOWN_SNAPSHOTS[num] || '20190101000000';
    const origUrl = cdxSnapshots[num]?.url || `https://anthropoetics.ucla.edu/views/${num}/`;
    // Normalise the original URL (remove :80)
    const cleanOrigUrl = origUrl.replace(/:80\//, '/').replace(/^http:/, 'https:');
    const waybackUrl = `https://web.archive.org/web/${ts}/${cleanOrigUrl}`;

    let retries = 3;
    let success = false;

    while (retries > 0 && !success) {
      try {
        const { status, body } = await fetch(waybackUrl);

        if (status === 200 && body.length > 1000) {
          const entry = parsePost(body, num, cleanOrigUrl);
          if (entry.content.length > 50) {
            results.push(entry);
            ok++;
            process.stdout.write(`✓ ${entry.title.slice(0, 50)}\n`);
            success = true;
          } else {
            process.stdout.write(`⚠ too short (${entry.content.length} chars)\n`);
            skip++;
            success = true;
          }
        } else if (status === 429) {
          const wait = DELAY_MS * 5;
          process.stdout.write(`429 rate limited — waiting ${wait}ms... `);
          await sleep(wait);
          retries--;
        } else if (status === 404) {
          process.stdout.write(`404 not found\n`);
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
      results.sort((a, b) => a.num - b.num);
      fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
    }

    await sleep(DELAY_MS);
  }

  // Final save
  results.sort((a, b) => a.num - b.num);
  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));

  console.log(`\n=== Done ===`);
  console.log(`✓ ${ok} posts scraped`);
  console.log(`- ${skip} skipped (not found / too short)`);
  console.log(`✗ ${fail} failed`);
  console.log(`Total in file: ${results.length}`);
  console.log(`\nFile written to: ${OUT_PATH}`);
  console.log('\nNext steps:');
  console.log('  1. Run: node scripts/generate-posts-cache.ts  (if it exists)');
  console.log('  2. Redeploy to Vercel — chronicles will appear on /download');
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
