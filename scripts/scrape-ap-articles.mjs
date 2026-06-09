/**
 * Anthropoetics Journal Scraper
 *
 * Scrapes all articles from the Anthropoetics journal via the Wayback Machine.
 * The journal (anthropoetics.ucla.edu) is a WordPress site with articles
 * organized in category pages per issue.
 *
 * URL structure:
 *   Issue listing : https://anthropoetics.ucla.edu/{issueCode}/
 *                   (e.g. https://anthropoetics.ucla.edu/ap0101/)
 *   Article       : https://anthropoetics.ucla.edu/{issueCode}/{slug}/
 *
 * Article listing HTML:
 *   <strong>Author Name</strong> - <a href="...">Title</a>
 *
 * Article content: <section class="entry-content cf" ...>...</section>
 *
 * Usage:
 *   node scripts/scrape-ap-articles.mjs
 *
 * Environment:
 *   DELAY_MS=1500      ms between requests (default: 1500)
 *   RESUME=1           skip articles already in ap_articles.json
 *   DRY_RUN=1          discover issues/articles only, don't fetch content
 *   ISSUE=ap0101       only scrape this one issue
 *   WAYBACK_TS=20251116070722  Wayback snapshot timestamp (default)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src', 'data', 'ap_articles.json');

const DELAY_MS   = parseInt(process.env.DELAY_MS || '1500', 10);
const RESUME     = process.env.RESUME   === '1';
const DRY_RUN    = process.env.DRY_RUN  === '1';
const ONLY_ISSUE = process.env.ISSUE    || null;
const WAYBACK_TS = process.env.WAYBACK_TS || '20251116070722';

const WB_BASE = `https://web.archive.org/web/${WAYBACK_TS}`;
const AP_BASE  = 'https://anthropoetics.ucla.edu';

// ── Utilities ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function fetch(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 6) return reject(new Error('Too many redirects'));
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; center-study-archiver/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 30000,
    }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
        const loc = res.headers.location;
        if (!loc) return reject(new Error(`Redirect with no Location from ${url}`));
        const next = loc.startsWith('http') ? loc : new URL(loc, url).toString();
        res.resume();
        return fetch(next, redirects + 1).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(chunks).toString('utf-8') }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&hellip;/g, '…');
}

/** Discover all issue codes from the main anthro index page */
function discoverIssueCodes(html) {
  // URLs like: anthropoetics.ucla.edu/ap0101
  const matches = html.match(/anthropoetics\.ucla\.edu\/(ap\d{4})/g) || [];
  const codes = [...new Set(matches.map(m => m.split('/').pop()))];
  return codes.sort();
}

/**
 * Parse article listings from an issue page.
 * Returns array of { author, title, articleSlug }
 *
 * Issue page HTML has list items like:
 *   <li>
 *     <strong>Author Name</strong> - <a href="...ap0101/bench101/">Title</a>
 *   </li>
 *
 * URLs are rewritten by Wayback Machine to include the full web.archive.org prefix.
 */
function parseIssueArticles(html, issueCode) {
  const articles = [];

  // Find all <li> items
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch;

  while ((liMatch = liRe.exec(html)) !== null) {
    const liContent = liMatch[1];

    // Skip short or irrelevant items
    if (liContent.length < 20) continue;

    // Extract ALL <a> links from this <li>
    const allLinks = [];
    const aRe = /href="([^"]+)"[^>]*rel="bookmark"[^>]*>([\s\S]*?)<\/a>/gi;
    let aMatch;
    while ((aMatch = aRe.exec(liContent)) !== null) {
      allLinks.push({ href: aMatch[1], text: stripTags(aMatch[2]).trim() });
    }

    // Filter to article links: URL must contain issueCode and not be a PDF query
    const articleLinks = allLinks.filter(l =>
      l.href.includes(issueCode) && !l.href.includes('?pdf=') && l.text.length > 3
    );

    if (articleLinks.length === 0) continue;
    const link = articleLinks[0];

    // Extract article slug from the URL
    // URL format (Wayback): http://web.archive.org/web/.../https://anthropoetics.ucla.edu/ap0101/gans/
    // or direct: https://anthropoetics.ucla.edu/ap0101/gans/
    const slugMatch = link.href.match(new RegExp(`/${issueCode}/([^/?#]+)/?`));
    if (!slugMatch) continue;
    const articleSlug = slugMatch[1].trim();
    if (!articleSlug || articleSlug.length < 2) continue;

    const title = decodeEntities(link.text);
    if (!title || title.length < 3) continue;

    // Extract author from <strong>...</strong>
    const strongMatch = liContent.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
    // Default to 'Eric Gans' for unsigned items (Benchmarks editorial column)
    let author = 'Eric Gans';
    if (strongMatch) {
      const parsed = decodeEntities(stripTags(strongMatch[1])).trim();
      if (parsed && parsed.length >= 2) author = parsed;
    }

    articles.push({ author, title, articleSlug });
  }

  // Also catch any article links NOT in <li> blocks (some issues list differently)
  // Look for <strong>Author</strong> - <a href="...issueCode/slug/">Title</a> pattern
  const directRe = new RegExp(
    `<strong[^>]*>([^<]+)<\/strong>\\s*-\\s*(?:<[^>]+>\\s*)*<a[^>]+href="([^"]*${issueCode}/([^/?#"]+)/?[^"]*)"[^>]*>\\s*([^<]+)`,
    'gi'
  );
  let directMatch;
  while ((directMatch = directRe.exec(html)) !== null) {
    const author = decodeEntities(directMatch[1].trim());
    const href   = directMatch[2];
    const slug   = directMatch[3].trim();
    const title  = decodeEntities(directMatch[4].trim());

    if (!slug || !title || title.length < 3 || href.includes('?pdf=')) continue;
    articles.push({ author, title, articleSlug: slug });
  }

  // Deduplicate by articleSlug
  const seen = new Set();
  return articles.filter(a => {
    if (seen.has(a.articleSlug)) return false;
    seen.add(a.articleSlug);
    return true;
  });
}

/**
 * Extract prose content from an AP journal article page.
 * Content lives in <section class="entry-content cf">...</section>
 */
function extractContent(html) {
  // Strip scripts/styles first
  let body = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  // Find the entry-content section
  const sectionMatch = body.match(
    /<section[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/section>/i
  );

  let raw = '';
  if (sectionMatch) {
    raw = sectionMatch[1];
  } else {
    // Fallback: try <div class="entry-content">
    const divMatch = body.match(
      /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    );
    if (divMatch) {
      raw = divMatch[1];
    } else {
      // Last resort: extract from <article>
      const articleMatch = body.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      raw = articleMatch ? articleMatch[1] : body;
    }
  }

  // Strip nested nav/footer/sidebar elements
  raw = raw
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '');

  // Convert block-level tags to line breaks
  raw = raw
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/blockquote>/gi, '\n\n')
    .replace(/<\/tr>/gi, '\n');

  // Strip remaining tags
  let text = stripTags(raw);

  // Decode entities
  text = decodeEntities(text);

  // Normalise whitespace
  text = text
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Remove obvious cruft lines
  const cleaned = text.split('\n').filter(line => {
    const t = line.trim();
    if (!t) return true;
    if (t.length < 3) return false;
    if (/^(Share|Subscribe|Home|About|Search|Contact|Back to top|Print|Anthropoetics)$/.test(t)) return false;
    if (/^Page \d+/.test(t)) return false;
    return true;
  });

  return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Compute approximate date string from issue code */
function issueDate(issueCode) {
  const vol  = parseInt(issueCode.slice(2, 4), 10);
  const iss  = parseInt(issueCode.slice(4, 6), 10);
  // Vol 1 = 1995, each subsequent volume adds 1 year
  const year = 1994 + vol;
  return iss === 1 ? `Spring ${year}` : `Fall ${year}`;
}

// ── Scrape one issue ──────────────────────────────────────────────────────────

async function scrapeIssue(issueCode, existingSlugs) {
  const issueUrl = `${WB_BASE}/${AP_BASE}/${issueCode}/`;
  console.log(`  Fetching: ${issueUrl}`);

  let html;
  try {
    const res = await fetch(issueUrl);
    if (res.statusCode !== 200) {
      console.log(`  → HTTP ${res.statusCode} — skipping ${issueCode}`);
      return [];
    }
    html = res.body;
  } catch (err) {
    console.log(`  → Error: ${err.message} — skipping`);
    return [];
  }

  const articleList = parseIssueArticles(html, issueCode);
  console.log(`  Found ${articleList.length} articles`);

  if (DRY_RUN) {
    for (const a of articleList) {
      console.log(`    ${a.author} — ${a.title} [/${issueCode}/${a.articleSlug}/]`);
    }
    return [];
  }

  const date = issueDate(issueCode);
  const vol  = parseInt(issueCode.slice(2, 4), 10);
  const iss  = parseInt(issueCode.slice(4, 6), 10);
  const results = [];

  for (const info of articleList) {
    const slug = `ap-${issueCode}-${slugify(info.articleSlug)}`;

    if (RESUME && existingSlugs.has(slug)) {
      console.log(`    [skip] ${slug}`);
      continue;
    }

    const articleUrl = `${WB_BASE}/${AP_BASE}/${issueCode}/${info.articleSlug}/`;
    console.log(`    Fetching: ${info.author} — ${info.title}`);
    await sleep(DELAY_MS);

    let content = '';
    try {
      let res = await fetch(articleUrl);
      if (res.statusCode !== 200) {
        // Try a different Wayback timestamp as fallback
        const fallbackTs = '20200601000000';
        const fallbackUrl = `https://web.archive.org/web/${fallbackTs}/${AP_BASE}/${issueCode}/${info.articleSlug}/`;
        console.log(`      → HTTP ${res.statusCode}, trying fallback timestamp…`);
        await sleep(500);
        res = await fetch(fallbackUrl);
        if (res.statusCode !== 200) {
          console.log(`      → Still ${res.statusCode} — skipping`);
          continue;
        }
      }
      content = extractContent(res.body);
    } catch (err) {
      console.log(`      → Error: ${err.message} — skipping`);
      continue;
    }

    if (!content || content.length < 150) {
      console.log(`      → Too short (${content.length} chars) — skipping`);
      continue;
    }

    results.push({
      slug,
      issueCode,
      volume: vol,
      issue: iss,
      author: info.author,
      title: info.title,
      date,
      content,
      url: `https://anthropoetics.ucla.edu/${issueCode}/${info.articleSlug}/`,
    });

    console.log(`      ✓ ${content.length} chars`);
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Anthropoetics Journal Scraper');
  console.log(`DELAY_MS=${DELAY_MS} RESUME=${RESUME} DRY_RUN=${DRY_RUN} WAYBACK_TS=${WAYBACK_TS}`);
  if (ONLY_ISSUE) console.log(`ISSUE filter: ${ONLY_ISSUE}`);
  console.log('');

  // Load existing if resuming
  let existing = [];
  const existingSlugs = new Set();
  if ((RESUME || !ONLY_ISSUE) && fs.existsSync(OUTPUT)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT, 'utf-8'));
      for (const a of existing) existingSlugs.add(a.slug);
      if (RESUME) console.log(`Resuming — ${existing.length} articles already scraped\n`);
    } catch {
      console.log('Could not parse existing ap_articles.json — starting fresh\n');
    }
  }

  // Discover issues from the main anthro page
  let issues = [];
  if (ONLY_ISSUE) {
    issues = [ONLY_ISSUE];
  } else {
    console.log('Discovering issues from anthro index…');
    try {
      const res = await fetch(`${WB_BASE}/${AP_BASE}/anthro/`);
      if (res.statusCode === 200) {
        issues = discoverIssueCodes(res.body);
        console.log(`Found ${issues.length} issues: ${issues.join(', ')}\n`);
      } else {
        console.log(`Could not fetch anthro index (HTTP ${res.statusCode}) — using built-in list`);
        // Fallback: hardcode known issues
        issues = [
          'ap0101','ap0102','ap0201','ap0202','ap0301','ap0302',
          'ap0401','ap0402','ap0501','ap0502','ap0601','ap0602',
          'ap0701','ap0702','ap0801','ap0802','ap0901','ap0902',
          'ap1001','ap1002','ap1101','ap1102','ap1201','ap1202',
          'ap1301','ap1302','ap1303','ap1401','ap1402','ap1501',
          'ap1502','ap1601','ap1602','ap1701','ap1702','ap1801',
          'ap1802','ap1901','ap1902','ap2001','ap2002','ap2101',
          'ap2102','ap2201','ap2202','ap2301','ap2302','ap2401',
          'ap2402','ap2501','ap2502','ap2601','ap2602','ap2701',
          'ap2702','ap2801','ap2802','ap2901','ap2902','ap3001',
        ];
      }
    } catch (err) {
      console.log(`Error fetching anthro index: ${err.message} — using built-in list`);
      issues = ['ap0101','ap0102'];
    }
    await sleep(DELAY_MS);
  }

  const allNew = [];

  for (const issueCode of issues) {
    console.log(`\nIssue: ${issueCode} (${issueDate(issueCode)})`);
    await sleep(DELAY_MS);

    const articles = await scrapeIssue(issueCode, existingSlugs);
    allNew.push(...articles);

    // Save after each issue (incremental)
    if (!DRY_RUN) {
      const merged = [...existing, ...allNew];
      const seen = new Set();
      const deduped = merged.filter(a => {
        if (seen.has(a.slug)) return false;
        seen.add(a.slug);
        return true;
      });
      fs.writeFileSync(OUTPUT, JSON.stringify(deduped, null, 2));
      if (articles.length > 0) {
        console.log(`  → ${deduped.length} total articles saved`);
      }
    }
  }

  console.log(`\nDone! ${allNew.length} new articles scraped, ${existing.length + allNew.length} total`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
