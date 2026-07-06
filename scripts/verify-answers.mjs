#!/usr/bin/env node
// Verify every quoted passage in src/data/answers.json against the corpus and
// AUTO-REPAIR near-misses: when the model smoothed a quote (fixed a typo,
// normalized a word), locate the true passage and splice the exact corpus text
// back into the answer. Quotes with internal ellipses verify per-segment.
//
//   node scripts/verify-answers.mjs           # report
//   node scripts/verify-answers.mjs --repair  # repair in place + report
//
// Exit code 1 if any quote remains unverified (answer should be regenerated).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPAIR = process.argv.includes('--repair');

const answers = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/answers.json'), 'utf8'));
const cache = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/posts-cache.json'), 'utf8'));

// ── normalization with raw-offset map ───────────────────────────────────────
function normChar(c) {
  if (c === '‘' || c === '’') return "'";
  if (c === '“' || c === '”') return '"';
  if (c === '–' || c === '—') return '-';
  return c.toLowerCase();
}
function normWithMap(raw) {
  let n = '';
  const map = [];
  let lastWasSpace = true;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (/\s/.test(c)) {
      if (!lastWasSpace) { n += ' '; map.push(i); lastWasSpace = true; }
      continue;
    }
    lastWasSpace = false;
    n += normChar(c);
    map.push(i);
  }
  return { n: n.trim() === n ? n : n, map };
}
const normQ = (s) => {
  let n = '';
  let lastWasSpace = true;
  for (const c of s) {
    if (/\s/.test(c)) { if (!lastWasSpace) { n += ' '; lastWasSpace = true; } continue; }
    lastWasSpace = false;
    n += normChar(c);
  }
  return n.replace(/\s+$/, '');
}

// Pre-normalize all posts once.
const POSTS = cache.map((p) => {
  const { n, map } = normWithMap(p.content || '');
  return { slug: p.slug, raw: p.content || '', n, map };
});

// ── quote extraction (curly pairs first, then straight pairs on remainder) ──
function extractQuotes(text) {
  const out = [];
  const push = (q) => {
    // Mis-paired captures (mixed “/" quote chars) drag in citation markdown —
    // truncate at the citation instead of discarding the real quote before it.
    const cut = q.split(/\s+—\s*\[|\]\(/)[0];
    if (cut.length >= 40) out.push({ quote: cut });
  };
  const curly = /“([^”]{40,}?)”/g;
  let m;
  let masked = text;
  while ((m = curly.exec(text)) !== null) {
    push(m[1]);
    masked = masked.replace(m[0], '░'.repeat(m[0].length));
  }
  // Straight quotes: scope pairing to a single line so one stray quote mark
  // can't flip pairing parity for the rest of the document.
  const straight = /"([^"\n]{40,}?)"/g;
  for (const line of masked.split('\n')) {
    straight.lastIndex = 0;
    while ((m = straight.exec(line)) !== null) {
      if (/\*\*|░|Read →/.test(m[1])) continue;
      push(m[1]);
    }
  }
  return out;
}

// segments: split on ellipsis markers; only segments with ≥6 words need verifying
const segmentsOf = (q) =>
  q.split(/…|\.\.\./).map((s) => s.replace(/^[\s,;:—–-]+|[\s,;:—–-]+$/g, '')).filter((s) => s.split(/\s+/).length >= 6);

function findVerbatim(seg) {
  const nseg = normQ(seg);
  for (const p of POSTS) if (p.n.includes(nseg)) return { post: p, idx: p.n.indexOf(nseg) };
  return null;
}

// Fuzzy repair, indel-proof: anchor the segment by its first and last 6-word
// shingles in the same post (in order, within a sane distance), then extract
// the raw corpus span between them. An inserted/deleted word between the
// anchors doesn't matter — the span IS the corpus text.
function repairSegment(seg) {
  const nseg = normQ(seg);
  const words = nseg.split(' ');
  if (words.length < 12) return null;
  const K = 6;
  // try a few anchor offsets in case the smoothing touched the edges
  const headOffsets = [0, 1, 2];
  const tailOffsets = [0, 1, 2];
  for (const p of POSTS) {
    for (const ho of headOffsets) {
      const headShingle = words.slice(ho, ho + K).join(' ');
      const headAt = p.n.indexOf(headShingle);
      if (headAt === -1) continue;
      for (const to of tailOffsets) {
        const tailWords = words.slice(words.length - K - to, words.length - to);
        if (tailWords.length < K) continue;
        const tailShingle = tailWords.join(' ');
        const searchFrom = headAt + headShingle.length;
        const tailAt = p.n.indexOf(tailShingle, searchFrom - headShingle.length);
        if (tailAt === -1 || tailAt < headAt) continue;
        const spanNormLen = tailAt + tailShingle.length - headAt;
        // sanity: corpus span within ±30% of the quoted segment's length
        if (spanNormLen < nseg.length * 0.6 || spanNormLen > nseg.length * 1.4) continue;
        const rawStart = p.map[headAt];
        const endNorm = Math.min(tailAt + tailShingle.length - 1, p.map.length - 1);
        const rawEnd = p.map[endNorm] + 1;
        let rawText = p.raw.slice(rawStart, rawEnd).replace(/\s+/g, ' ').trim();
        rawText = rawText.replace(/^["“”]+|["“”]+$/g, '');
        if (normQ(rawText) && POSTS.some((pp) => pp.n.includes(normQ(rawText)))) {
          return rawText;
        }
      }
    }
  }
  return null;
}

let totalQ = 0, ok = 0, repaired = 0, failedTotal = 0;
const failing = {};

for (const [slug, a] of Object.entries(answers)) {
  const quotes = extractQuotes(a.answer);
  totalQ += quotes.length;
  const fails = [];
  for (const { quote } of quotes) {
    const segs = segmentsOf(quote);
    if (segs.length === 0) { ok++; continue; } // too short to judge
    const bad = segs.filter((s) => !findVerbatim(s));
    if (bad.length === 0) { ok++; continue; }

    if (REPAIR) {
      let fixedAll = true;
      for (const seg of bad) {
        const fix = repairSegment(seg);
        if (fix && normQ(fix) !== normQ(seg)) {
          a.answer = a.answer.split(seg).join(fix);
          repaired++;
        } else if (!fix) {
          fixedAll = false;
        }
      }
      if (fixedAll) { ok++; continue; }
    }
    fails.push(...bad);
  }
  if (fails.length) { failing[slug] = fails; failedTotal += fails.length; }
}

if (REPAIR) {
  fs.writeFileSync(path.join(ROOT, 'src/data/answers.json'), JSON.stringify(answers, null, 2) + '\n');
}

console.log(`quotes: ${totalQ} | verified: ${ok} | repaired: ${repaired} | still failing: ${failedTotal}`);
for (const [slug, fails] of Object.entries(failing)) {
  console.log(`⚠ ${slug} (${fails.length}):`);
  for (const f of fails.slice(0, 3)) console.log(`   ✗ "${f}…"`);
}
const outIdx = process.argv.indexOf('--out');
if (outIdx > -1) fs.writeFileSync(process.argv[outIdx + 1], JSON.stringify(failing, null, 1));
process.exit(failedTotal > 0 ? 1 : 0);
