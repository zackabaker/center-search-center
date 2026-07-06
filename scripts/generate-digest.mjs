#!/usr/bin/env node
// Builds the weekly digest (markdown + minimal HTML) from texts added in the
// last N days: title, source, date, and a verbatim pull-quote each. Subscribers
// live in Redis (digest:subscribers, via /api/subscribe). Sending requires an
// email provider key (Buttondown or Resend) — until one exists this script
// produces the ready-to-send digest files.
//
//   node scripts/generate-digest.mjs [days=7]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = parseInt(process.argv[2] || '7', 10);

const cache = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/posts-cache.json'), 'utf8'));
const parse = (s) => {
  if (!s) return null;
  const d = new Date(s.replace(/(\d{1,2})(st|nd|rd|th)\b/gi, '$1'));
  return isNaN(d.getTime()) ? null : d;
};
const cutoff = Date.now() - DAYS * 86400_000;
const LABEL = { substack: 'Substack', gablog: 'GABlog', chronicle: 'Chronicle', ap: 'Anthropoetics', twitter: 'Thread', book: 'Anthropomorphics', pdf: 'Essay' };

const recent = cache
  .map((p) => ({ p, d: parse(p.date) }))
  .filter((x) => x.d && x.d.getTime() >= cutoff)
  .sort((a, b) => b.d - a.d);

if (recent.length === 0) {
  console.log(`No new texts in the last ${DAYS} days — no digest this week.`);
  process.exit(0);
}

const lines = [`# New in the Center Study archive`, ``, `*${recent.length} new text${recent.length > 1 ? 's' : ''} this week.*`, ``];
for (const { p, d } of recent) {
  const quote = (p.excerpt || p.content.slice(0, 220)).replace(/\s+/g, ' ').trim().replace(/[.…]*$/, '…');
  lines.push(`## ${p.title}`);
  lines.push(`*${LABEL[p.source] || p.source} · ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}*`);
  lines.push(``);
  lines.push(`> "${quote}"`);
  lines.push(``);
  lines.push(`Read: https://center.study/post/${p.slug}`);
  lines.push(``);
}
lines.push(`---`);
lines.push(`All new texts: https://center.study/new · Unsubscribe: reply with "unsubscribe".`);

const md = lines.join('\n');
const out = path.join(ROOT, '.digest');
fs.mkdirSync(out, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(out, `digest-${stamp}.md`), md);
console.log(md);
console.log(`\n✓ wrote .digest/digest-${stamp}.md (${recent.length} texts)`);
