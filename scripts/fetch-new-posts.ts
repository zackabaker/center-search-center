/**
 * Fetch new Substack posts via RSS and append to ga_context.txt
 *
 * Run: npx tsx scripts/fetch-new-posts.ts
 *
 * This script:
 * 1. Reads the existing ga_context.txt to find known Substack post titles
 * 2. Fetches the RSS feed for new posts
 * 3. Scrapes full content from each new post URL
 * 4. Appends new posts to the Substack section of ga_context.txt
 */

import fs from 'fs';
import path from 'path';

const FEED_URL = 'https://dennisbouvard.substack.com/feed';
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'ga_context.txt');

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

async function fetchRSS(): Promise<FeedItem[]> {
  const res = await fetch(FEED_URL);
  const xml = await res.text();

  const items: FeedItem[] = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || itemXml.match(/<title>(.*?)<\/title>/)?.[1]
      || '';
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    const content = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || '';

    items.push({ title, link, pubDate, content });
  }

  return items;
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    // Decode ALL numeric HTML entities (&#8217; → ', &#8220; → ", etc.)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&hellip;/g, '…')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

async function main() {
  console.log('Fetching RSS feed...');
  const items = await fetchRSS();
  console.log(`Found ${items.length} items in feed`);

  const data = fs.readFileSync(DATA_FILE, 'utf-8');

  // Find existing titles
  const existingTitles = new Set<string>();
  const titleRegex = /^# (.+)$/gm;
  let match;
  while ((match = titleRegex.exec(data)) !== null) {
    existingTitles.add(match[1].trim().toLowerCase());
  }

  const newItems = items.filter(
    (item) => !existingTitles.has(item.title.trim().toLowerCase())
  );

  if (newItems.length === 0) {
    console.log('No new posts found.');
    return;
  }

  console.log(`Found ${newItems.length} new post(s):`);
  newItems.forEach((item) => console.log(`  - ${item.title}`));

  // Build new entries
  const entries = newItems.map((item) => {
    const plainContent = htmlToPlainText(item.content);
    const date = formatDate(item.pubDate);
    return `# ${item.title}\n\n**${date}**\n\n**Likes:** 0\n\n${plainContent}`;
  });

  // Insert before </dennis_bouvard_substack>
  const insertionPoint = data.indexOf('</dennis_bouvard_substack>');
  if (insertionPoint === -1) {
    console.error('Could not find </dennis_bouvard_substack> tag');
    process.exit(1);
  }

  const newData =
    data.slice(0, insertionPoint) +
    entries.join('\n') +
    '\n' +
    data.slice(insertionPoint);

  fs.writeFileSync(DATA_FILE, newData, 'utf-8');
  console.log(`Appended ${newItems.length} new post(s) to ${DATA_FILE}`);
}

main().catch(console.error);
