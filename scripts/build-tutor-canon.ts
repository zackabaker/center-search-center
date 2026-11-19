/**
 * The tutor's canon: the texts loaded whole into every conversation.
 * Owner's shape (2026-11-19): Substack-first — everything recent, the best of
 * the earlier years — plus the lectures, the pinned texts, the best GABlog
 * posts and a few Anthropomorphics chapters and essays.
 *
 * Writes tutor/canon.json, which is then the owner's to edit by hand; this
 * script is a one-off drafting aid and is not part of the build.
 */
import fs from 'fs';
import path from 'path';
import type { Post } from '../src/lib/types';

const ROOT = process.cwd();
const posts: Post[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'posts-cache.json'), 'utf-8'));
const ranked: { slug: string; source: string; score: number }[] =
  JSON.parse(fs.readFileSync(path.join(ROOT, 'tutor', 'canon-candidates.json'), 'utf-8'));
const pins: string[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'tutor', 'canon-pins.json'), 'utf-8')).pinned;
const pop = JSON.parse(fs.readFileSync(path.join(ROOT, 'tutor', 'popularity.json'), 'utf-8')) as { mostViewedAllTime: string[]; recentlyPopular: string[] };
const popular = new Set([...pop.mostViewedAllTime, ...pop.recentlyPopular]);
const score = new Map(ranked.map((r) => [r.slug, r.score]));
const bySlug = new Map(posts.map((p) => [p.slug, p]));

const RECENT_FROM = new Date('2024-01-01').getTime();
const EARLIER_SUBSTACK = 30;
const GABLOG = 14;
const ESSAYS = [
  'there-is-no-economy-pdf', 'linguistic-turn-generative-literacy',
  // The long academic essays, at the owner's request.
  'the-anthropoetics-of-power', 'power-and-paradox-pdf', 'attentionality-originary-ethics',
  'generative-anthropology-one-big-discipline', 'event-origin-center',
];

const chosen = new Map<string, string>();
const take = (slug: string, why: string) => { if (bySlug.has(slug) && !chosen.has(slug)) chosen.set(slug, why); };

for (const s of pins) take(s, 'named by the owner');
const substack = posts.filter((p) => p.source === 'substack');
for (const p of substack) if (new Date(p.date ?? 0).getTime() >= RECENT_FROM) take(p.slug, 'recent Substack (2024 on)');
// Earlier Substack: what readers open and like, then what the glossary leans on.
const earlier = substack
  .filter((p) => !chosen.has(p.slug))
  .map((p) => ({ p, s: (popular.has(p.slug) ? 10 : 0) + (p.likes ?? 0) * 2.5 + (score.get(p.slug) ?? 0) }))
  .sort((a, b) => b.s - a.s);
for (const { p } of earlier.slice(0, EARLIER_SUBSTACK)) take(p.slug, 'earlier Substack: most read, liked or cited');
for (const r of ranked.filter((r) => r.source === 'gablog').slice(0, GABLOG)) take(r.slug, 'GABlog: most read or cited');
// The whole of Anthropomorphics, chapter by chapter in the book's order (the
// single-file copy of the book would duplicate them).
for (const p of posts) if (p.source === 'book' && p.slug !== 'anthropomorphics-book') take(p.slug, 'Anthropomorphics (the whole book)');
for (const s of ESSAYS) take(s, 'essay');

const canon = [...chosen.entries()].map(([slug, why]) => {
  const p = bySlug.get(slug)!;
  return { slug, title: p.title, source: p.source, date: p.date, words: p.content.split(/\s+/).length, why };
});
fs.writeFileSync(path.join(ROOT, 'tutor', 'canon.json'), '[\n' + canon.map((c) => '  ' + JSON.stringify(c)).join(',\n') + '\n]\n');
const left = substack.filter((p) => !chosen.has(p.slug));
console.log(`${canon.length} texts, ${canon.reduce((a, c) => a + c.words, 0).toLocaleString('en-US')} words; ${substack.length - left.length}/${substack.length} Substack essays in`);
