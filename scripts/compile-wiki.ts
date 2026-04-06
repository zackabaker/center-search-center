#!/usr/bin/env node
/**
 * compile-wiki.ts
 *
 * Reads the entire Center Study archive and compiles it into an Obsidian-compatible wiki:
 *   wiki/
 *     _index.md              Master index — all posts, all concepts
 *     posts/                 One .md per archive post (summary + concepts + quotes)
 *     concepts/              One .md per Center Study concept (synthesized from archive)
 *     _synthesis/
 *       themes.md            Cross-cutting themes
 *       chronology.md        Intellectual development over time
 *
 * Usage:
 *   npx tsx scripts/compile-wiki.ts [--only-posts] [--only-concepts] [--limit N]
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

// ── helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

function excerpt(content: string, maxLen = 300): string {
  const cleaned = content.replace(/Thanks for reading[^]*?Subscribe/g, '').trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

// ── types ─────────────────────────────────────────────────────────────────────

interface Post {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string | null;
  source: string;
  wordCount: number;
}

// ── parse archive ─────────────────────────────────────────────────────────────

function parseGABlog(text: string): Post[] {
  const posts: Post[] = [];
  const entries = text.split(/\n\nTitle: /);
  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if (i === 0) { if (entry.startsWith('Title: ')) entry = entry.slice(7); else continue; }
    const titleEnd = entry.indexOf('\n');
    if (titleEnd === -1) continue;
    const title = entry.slice(0, titleEnd).trim();
    const articleIdx = entry.indexOf('Article: ');
    const content = (articleIdx !== -1 ? entry.slice(articleIdx + 9) : entry.slice(titleEnd + 1)).trim();
    if (!title || !content) continue;
    posts.push({ slug: 'gablog-' + slugify(title), title, content, excerpt: excerpt(content), date: null, source: 'GABlog', wordCount: content.split(/\s+/).length });
  }
  return posts;
}

function parseSubstack(text: string): Post[] {
  const posts: Post[] = [];
  const entries = text.split(/^# /m);
  for (const entry of entries) {
    if (!entry.trim()) continue;
    const lines = entry.split('\n');
    const title = lines[0].trim();
    if (!title) continue;
    let date: string | null = null;
    let contentStart = 1;
    for (let i = 1; i < lines.length && i < 8; i++) {
      const line = lines[i].trim();
      const dm = line.match(/^\*\*([A-Z][a-z]+ \d{1,2}, \d{4})\*\*$/);
      if (dm) { date = dm[1]; contentStart = i + 1; continue; }
      if (line.match(/^\*\*Likes:\*\*/)) { contentStart = i + 1; continue; }
      if (line === '') continue;
      if (!line.startsWith('**')) { contentStart = i; break; }
    }
    const content = lines.slice(contentStart).join('\n').trim();
    if (!content) continue;
    posts.push({ slug: 'substack-' + slugify(title), title, content, excerpt: excerpt(content), date, source: 'Substack', wordCount: content.split(/\s+/).length });
  }
  return posts;
}

function parseBook(dataDir: string): Post[] {
  const bookPath = path.join(dataDir, 'anthropomorphics.md');
  if (!fs.existsSync(bookPath)) return [];
  const content = fs.readFileSync(bookPath, 'utf-8').replace(/^#[^\n]*\n+/, '').trim();
  return [{ slug: 'book-anthropomorphics', title: 'Anthropomorphics: An Originary Grammar of the Center', content, excerpt: excerpt(content), date: null, source: 'Book', wordCount: content.split(/\s+/).length }];
}

function parsePDFs(publicDir: string): Post[] {
  const pdfDir = path.join(publicDir, 'pdfs');
  if (!fs.existsSync(pdfDir)) return [];
  const PDF_TITLES: Record<string, string> = {
    'the-origin-of-language': 'The Origin of Language',
    'talk-of-the-center-adam-katz': 'Talk of the Center',
    'event-origin-center': 'Event, Origin, Center',
    'originary-technics': 'Originary Technics',
    'there-is-no-economy': 'There Is No Economy but Only the Debt to the Center',
    'linguistic-turn-generative-literacy': 'The Linguistic Turn and Generative Literacy',
    'esthetic-sacred-originary-modernity': 'The Esthetic, the Sacred, and Originary Modernity',
    'power-and-paradox': 'Power and Paradox',
    'generative-anthropology-one-big-discipline': 'Generative Anthropology as the One Big Discipline',
    'attentionality-originary-ethics': 'Attentionality and Originary Ethics',
    'introduction-to-disciplinarity': 'An Introduction to Disciplinarity',
    'mimesis-center-auto-immunology': 'Mimesis, the Center and Auto-Immunology',
    'nemesis-jouvenelian-liberal-model': 'Nemesis — The Jouvenelian vs. the Liberal Model',
    'why-generative-anthropology': 'Why Generative Anthropology',
    'the-anthropoetics-of-power': 'The Anthropoetics of Power',
  };
  return fs.readdirSync(pdfDir).filter(f => f.endsWith('.txt')).map(f => {
    const base = f.replace('.txt', '');
    const content = fs.readFileSync(path.join(pdfDir, f), 'utf-8');
    const title = PDF_TITLES[base] || base.replace(/-/g, ' ');
    return { slug: 'pdf-' + slugify(base), title, content, excerpt: excerpt(content), date: null, source: 'PDF (Katz)', wordCount: content.split(/\s+/).length };
  });
}

function loadAllPosts(root: string): Post[] {
  const dataDir = path.join(root, 'src', 'data');
  const publicDir = path.join(root, 'public');
  const raw = fs.readFileSync(path.join(dataDir, 'ga_context.txt'), 'utf-8');

  const gablogMatch = raw.match(/<generative_anthropology_blog>([\s\S]*?)<\/generative_anthropology_blog>/);
  const substackMatch = raw.match(/<dennis_bouvard_substack>([\s\S]*?)<\/dennis_bouvard_substack>/);

  return [
    ...(gablogMatch ? parseGABlog(gablogMatch[1]) : []),
    ...parseBook(dataDir),
    ...(substackMatch ? parseSubstack(substackMatch[1]) : []),
    ...parsePDFs(publicDir),
  ];
}

// ── Claude calls ──────────────────────────────────────────────────────────────

const client = new Anthropic();

const HAIKU = 'claude-haiku-4-5-20251001';
const SONNET = 'claude-sonnet-4-6';

async function generatePostWikiPage(post: Post, allPostTitles: string[]): Promise<string> {
  const prompt = `You are compiling a personal Obsidian wiki about Center Study (Generative Anthropology).

Given this archive text, write a wiki page for it. The page should:
1. Start with a YAML frontmatter block with: title, source, date (if any), wordCount, tags (3-6 Center Study concept tags)
2. Write a **Summary** section (3-5 sentences capturing the core argument)
3. Write a **Key Concepts** section listing 4-8 Center Study terms used, each with a one-line gloss
4. Write a **Notable Passages** section with 2-3 direct quotes (under 40 words each) that are particularly sharp or representative
5. Write a **Connections** section listing 3-6 related posts from the archive using [[wikilinks]] — pick titles from the list below that are genuinely thematically related
6. Write a **Questions Raised** section with 2-3 genuine intellectual questions the text opens

Format all concept names as [[concept name]] wikilinks. Keep the whole page under 600 words.

Archive post titles (for [[wikilinks]] in Connections):
${allPostTitles.slice(0, 80).join('\n')}

---
SOURCE: ${post.source}
TITLE: ${post.title}
DATE: ${post.date || 'undated'}
WORD COUNT: ${post.wordCount}

CONTENT:
${post.content.slice(0, 4000)}`;

  const msg = await client.messages.create({
    model: HAIKU,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: string; text: string }).text;
}

const GA_CONCEPTS = [
  { slug: 'the-center', name: 'The Center' },
  { slug: 'originary-scene', name: 'The Originary Scene' },
  { slug: 'deferral', name: 'Deferral' },
  { slug: 'the-sacred', name: 'The Sacred' },
  { slug: 'resentment', name: 'Resentment' },
  { slug: 'the-sign', name: 'The Sign' },
  { slug: 'mimesis', name: 'Mimesis' },
  { slug: 'ostensive-imperative-declarative', name: 'Ostensive / Imperative / Declarative' },
  { slug: 'nomos', name: 'Nomos' },
  { slug: 'succession', name: 'Succession' },
  { slug: 'the-juridical', name: 'The Juridical' },
  { slug: 'debt-and-credit', name: 'Debt and Credit' },
  { slug: 'scenic-design', name: 'Scenic Design' },
  { slug: 'attentionality', name: 'Attentionality' },
  { slug: 'victimary', name: 'The Victimary' },
  { slug: 'sovereignty', name: 'Sovereignty' },
  { slug: 'originary-grammar', name: 'Originary Grammar' },
  { slug: 'the-ethical', name: 'The Ethical / Aesthetico-Ethical' },
  { slug: 'pointman', name: 'The Pointman' },
];

async function generateConceptArticle(concept: { slug: string; name: string }, relevantPosts: Post[]): Promise<string> {
  const postDigests = relevantPosts.slice(0, 12).map(p =>
    `### ${p.title} (${p.source})\n${p.excerpt}`
  ).join('\n\n');

  const prompt = `You are compiling an Obsidian wiki on Center Study (Center Study — Adam Katz, Dennis Bouvard, Eric Gans).

Write a comprehensive concept article for: **${concept.name}**

Structure:
1. YAML frontmatter: title, type: concept, tags, related_concepts (list of concept slugs)
2. **Definition** — the originary/GA definition in 2-3 sentences. Be precise; draw from the archive.
3. **Originary Derivation** — how this concept is derived from the originary scene (2-3 paragraphs). Link related concepts with [[wikilinks]].
4. **Development in the Archive** — how Katz/Bouvard develop and complicate this concept (2-3 paragraphs with [[post title]] citations).
5. **Key Tensions** — 2-3 tensions or open questions this concept generates within GA.
6. **Archive References** — bulleted list of the most relevant texts, formatted as [[post title]] (source).

Keep total under 800 words. Use [[wikilinks]] for all Center Study concepts and post titles.

Relevant archive texts:
${postDigests}`;

  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: string; text: string }).text;
}

async function generateThemesSynthesis(posts: Post[]): Promise<string> {
  const sample = posts
    .sort(() => Math.random() - 0.5)
    .slice(0, 30)
    .map(p => `- **${p.title}** (${p.source}): ${p.excerpt}`)
    .join('\n');

  const prompt = `You are compiling an Obsidian wiki for Center Study (Generative Anthropology).

Based on samples from the archive below, write a **Themes** synthesis article that:
1. YAML frontmatter: title: "Thematic Overview", type: synthesis, tags
2. Identifies 6-8 major recurring themes across the whole archive (each with a paragraph)
3. Notes how themes intersect — use [[wikilinks]] for concepts and post titles
4. Ends with a "Live Questions" section: 4-5 questions the archive keeps raising but not resolving

Archive sample:
${sample}

Keep total under 1000 words.`;

  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 1800,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: string; text: string }).text;
}

async function generateChronologySynthesis(posts: Post[]): Promise<string> {
  const dated = posts
    .filter(p => p.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
  const undated = posts.filter(p => !p.date);

  const timeline = dated.map(p => `- ${p.date} — **${p.title}** (${p.source}): ${p.excerpt.slice(0, 120)}`).join('\n');

  const prompt = `You are compiling an Obsidian wiki for Center Study (Generative Anthropology).

Write an **Intellectual Chronology** article:
1. YAML frontmatter: title: "Intellectual Chronology", type: synthesis, tags
2. Brief intro: what can chronological reading reveal about how the thinking developed?
3. For each rough period (group years naturally), write 2-3 sentences characterizing what was being worked on and how the concepts shifted. Use [[post title]] citations and [[concept]] wikilinks.
4. A section on undated texts and where they likely fit
5. End: "What changed?" — summarize the intellectual arc in a paragraph

Dated archive:
${timeline.slice(0, 6000)}

Undated count: ${undated.length} texts (GABlog, book, PDFs)

Keep total under 900 words.`;

  const msg = await client.messages.create({
    model: SONNET,
    max_tokens: 1600,
    messages: [{ role: 'user', content: prompt }],
  });

  return (msg.content[0] as { type: string; text: string }).text;
}

async function generateIndex(posts: Post[], concepts: { slug: string; name: string }[]): Promise<string> {
  const bySource: Record<string, Post[]> = {};
  for (const p of posts) {
    if (!bySource[p.source]) bySource[p.source] = [];
    bySource[p.source].push(p);
  }

  const sourceBlocks = Object.entries(bySource).map(([src, ps]) => {
    const sorted = [...ps].sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.title.localeCompare(b.title);
    });
    return `## ${src} (${ps.length})\n\n` + sorted.map(p =>
      `- [[${p.title}]]${p.date ? ` — ${p.date}` : ''}`
    ).join('\n');
  }).join('\n\n');

  const conceptBlock = concepts.map(c => `- [[${c.name}]]`).join('\n');

  return `---
title: Center Study Wiki — Master Index
type: index
total_posts: ${posts.length}
total_concepts: ${concepts.length}
generated: ${new Date().toISOString().slice(0, 10)}
---

# Center Study Wiki

> *"The only thing we are ever talking about is how we are going about deferring violence."* — Adam Katz

A compiled wiki of the Center Study archive — GABlog, Substack (Dennis Bouvard), Katz PDFs, and Anthropomorphics. Generated by LLM from raw archive text. Updated incrementally.

## Navigation

- [[Thematic Overview]] — Cross-cutting themes across the archive
- [[Intellectual Chronology]] — How the thinking developed over time

## Concepts (${concepts.length})

${conceptBlock}

## Archive by Source

${sourceBlocks}
`;
}

// ── rate-limited parallel execution ──────────────────────────────────────────

async function throttle<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      results[idx] = await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const onlyPosts = args.includes('--only-posts');
  const onlyConcepts = args.includes('--only-concepts');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;

  const root = path.resolve(__dirname, '..');
  const wikiDir = path.join(root, 'wiki');
  const postsDir = path.join(wikiDir, 'posts');
  const conceptsDir = path.join(wikiDir, 'concepts');
  const synthDir = path.join(wikiDir, '_synthesis');

  for (const d of [wikiDir, postsDir, conceptsDir, synthDir]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  console.log('📚 Loading archive…');
  const allPosts = loadAllPosts(root);
  const posts = isFinite(limit) ? allPosts.slice(0, limit) : allPosts;
  console.log(`   ${posts.length} posts loaded (${allPosts.length} total)`);

  const allTitles = allPosts.map(p => p.title);

  // ── Generate post pages ──────────────────────────────────────────────────
  if (!onlyConcepts) {
    console.log(`\n📝 Generating post wiki pages (${posts.length} posts, concurrency=5)…`);
    let done = 0;
    const tasks = posts.map(post => async () => {
      const outPath = path.join(postsDir, `${post.slug}.md`);
      if (fs.existsSync(outPath)) { done++; process.stdout.write(`\r   ${done}/${posts.length} (skipped cached)`); return; }
      const md = await generatePostWikiPage(post, allTitles);
      fs.writeFileSync(outPath, md, 'utf-8');
      done++;
      process.stdout.write(`\r   ${done}/${posts.length} — ${post.title.slice(0, 50)}`);
    });
    await throttle(tasks, 5);
    console.log('\n   ✓ Post pages done');
  }

  // ── Generate concept articles ────────────────────────────────────────────
  if (!onlyPosts) {
    console.log(`\n🧠 Generating concept articles (${GA_CONCEPTS.length} concepts)…`);
    let done = 0;
    const tasks = GA_CONCEPTS.map(concept => async () => {
      const outPath = path.join(conceptsDir, `${concept.slug}.md`);
      if (fs.existsSync(outPath)) { done++; process.stdout.write(`\r   ${done}/${GA_CONCEPTS.length} (skipped cached)`); return; }
      // Find relevant posts by keyword match
      const keywords = concept.name.toLowerCase().split(/[\s\/]+/).filter(k => k.length > 3);
      const relevant = allPosts
        .filter(p => keywords.some(kw => p.content.toLowerCase().includes(kw) || p.title.toLowerCase().includes(kw)))
        .sort((a, b) => {
          const aScore = keywords.filter(kw => a.content.toLowerCase().includes(kw)).length;
          const bScore = keywords.filter(kw => b.content.toLowerCase().includes(kw)).length;
          return bScore - aScore;
        })
        .slice(0, 15);
      const md = await generateConceptArticle(concept, relevant);
      fs.writeFileSync(outPath, md, 'utf-8');
      done++;
      process.stdout.write(`\r   ${done}/${GA_CONCEPTS.length} — ${concept.name}`);
    });
    await throttle(tasks, 3);
    console.log('\n   ✓ Concept articles done');

    // ── Synthesis articles ─────────────────────────────────────────────────
    console.log('\n🔗 Generating synthesis articles…');

    const themesPath = path.join(synthDir, 'themes.md');
    if (!fs.existsSync(themesPath)) {
      process.stdout.write('   themes…');
      const themes = await generateThemesSynthesis(allPosts);
      fs.writeFileSync(themesPath, themes, 'utf-8');
      console.log(' ✓');
    } else { console.log('   themes… (cached)'); }

    const chronoPath = path.join(synthDir, 'chronology.md');
    if (!fs.existsSync(chronoPath)) {
      process.stdout.write('   chronology…');
      const chrono = await generateChronologySynthesis(allPosts);
      fs.writeFileSync(chronoPath, chrono, 'utf-8');
      console.log(' ✓');
    } else { console.log('   chronology… (cached)'); }
  }

  // ── Index ────────────────────────────────────────────────────────────────
  console.log('\n📋 Writing master index…');
  const indexMd = await generateIndex(allPosts, GA_CONCEPTS);
  fs.writeFileSync(path.join(wikiDir, '_index.md'), indexMd, 'utf-8');
  console.log('   ✓ _index.md written');

  console.log(`\n✅ Wiki compiled → ${wikiDir}`);
  console.log(`   Open the wiki/ folder in Obsidian as a vault.`);
  console.log(`   ${fs.readdirSync(postsDir).length} post pages, ${fs.readdirSync(conceptsDir).length} concept articles, 2 synthesis docs`);
}

main().catch(err => { console.error(err); process.exit(1); });
