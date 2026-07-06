#!/usr/bin/env node
// Builds public/corpus-manifest.json — the fixity record for the corpus
// edition: per-text SHA-256 over normalized content, plus counts and version.
// This is what makes the corpus citable as a versioned dataset (and what the
// Zenodo deposit snapshots).
//
//   node scripts/build-manifest.mjs [version]

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = process.argv[2] || '1.0';

const cache = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/posts-cache.json'), 'utf8'));
const sha = (s) => crypto.createHash('sha256').update(s.replace(/\s+/g, ' ').trim(), 'utf8').digest('hex');

const texts = cache.map((p) => ({
  slug: p.slug,
  title: p.title,
  source: p.source,
  date: p.date || null,
  words: (p.content || '').split(/\s+/).length,
  sha256: sha(p.content || ''),
  url: `https://center.study/post/${p.slug}`,
}));

const manifest = {
  name: 'Center Study Corpus',
  version: VERSION,
  generated: new Date().toISOString().slice(0, 10),
  publisher: 'Center Study Center (center.study)',
  authors: ['Adam Katz (pen name Dennis Bouvard)', 'Eric Gans', 'various (Anthropoetics)'],
  license: 'All texts © their authors; archived with permission at center.study.',
  counts: {
    texts: texts.length,
    words: texts.reduce((n, t) => n + t.words, 0),
    bySources: texts.reduce((a, t) => { a[t.source] = (a[t.source] || 0) + 1; return a; }, {}),
  },
  citation: `Center Study Corpus v${VERSION} (2026), center.study. Per-text: Author, "Title," venue, date; in Center Study Corpus v${VERSION}, center.study/post/slug#p-N.`,
  texts,
};

fs.writeFileSync(path.join(ROOT, 'public/corpus-manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`✓ corpus-manifest.json v${VERSION}: ${texts.length} texts, ${(manifest.counts.words / 1e6).toFixed(1)}M words`);
