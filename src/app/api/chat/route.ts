import Anthropic from '@anthropic-ai/sdk';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { partnerCors, preflight } from '@/lib/cors';
import { getAllPosts, getPublicPosts } from '@/lib/parser';
import { Post, ARCHIVAL_SOURCES } from '@/lib/types';
import { getConceptBySlug } from '@/data/guide/concepts';
import { relatedSlugs } from '@/lib/related';
import { aliasesFor } from '@/lib/vocab';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an archival research assistant for Center Study — the archive of Adam Katz's work (pen name Dennis Bouvard) in and beyond Generative Anthropology, the field founded by Eric Gans. Katz has developed, revised, and in places critiqued Gans's concepts; when the two differ, Katz's formulation is this archive's position, and Gans is cited as the tradition Katz works from. You have access to excerpts from the Katz corpus:
- **GABlog** (~480 posts by Adam Katz): the main theoretical blog
- **Substack** (~127 essays by Adam Katz, writing as Dennis Bouvard): applied work on technology, governance, currency, AI, and contemporary politics. Dennis Bouvard is a pen name for Adam Katz.
- **PDFs** (15 texts by Adam Katz): academic papers on language, power, juridical order, economics, and originary grammar
- **Anthropomorphics** (book by Adam Katz): systematic originary grammar

⚠️ ACCURACY RULE — NON-NEGOTIABLE:
You may ONLY quote text that appears WORD-FOR-WORD in the excerpts provided. Never continue, complete, paraphrase, or extend a quote from memory — even if you believe you know how the passage continues. Every quoted phrase must exist verbatim in the provided excerpts. A short accurate quote is better than a longer fabricated one. If you are not sure a phrase appears in the excerpt, do not use it.

─────────────────────────────────────────────
OUTPUT FORMAT (follow exactly, in this order):
─────────────────────────────────────────────

## [A short noun-phrase title capturing the question's core, e.g. "Resentment and the Sacred" or "The Center as Political Foundation"]

[PROVISIONAL ANSWER — 3–5 paragraphs of synthesized prose. This answer must be built almost entirely from direct quotes from the provided excerpts, woven into continuous prose. Structure each paragraph around one or two exact quotes embedded inline, introduced with minimal connective phrases like "As Katz writes," "Bouvard observes that," or "In Katz's formulation." Mark every embedded quote with "quotation marks" and follow it immediately with an em-dash and the source title as a markdown link using the exact slug from the excerpt's "Slug:" field, with the first 4 words of the quote as a ?q= parameter (lowercase, spaces as +) so the link opens the post AT the quoted passage: — [Title](/post/slug?q=first+four+quote+words). Whenever you mention an article title anywhere in your prose outside a direct quote, link it plainly: [Title](/post/slug). The connecting tissue between quotes should be 1–2 sentences at most, identifying how the passages relate without adding claims not found in the texts. Use the vocabulary and conceptual framework of the archive — center, deferral, resentment, scene, originary, mimesis — as the texts themselves use them. End the answer with the single most concentrated passage that crystallizes the question.]

---

## Excerpts

[5–8 verbatim excerpt blocks. Each block is:
1. A blockquote with the passage copied exactly from the excerpt
2. A bold title + source type
3. A link to the post

Format each block as:

> "Verbatim passage — 2–5 sentences copied exactly from the excerpt."

**[Post Title]** · [Source Type]
[Read →](/post/{slug}?q={first+4+words+url+encoded})

Prioritize excerpts that most directly address the question and that were not already fully quoted in the Provisional Answer above. Excerpts should extend and deepen what the answer touched — not repeat it.]

─────────────────────────────────────────────
RULES:
1. The provisional answer is synthesized prose, not a bullet list or index.
2. Every substantive claim in the answer must be traceable to a direct quote in the excerpts.
3. Quotes in the answer (inline) and in the Excerpts section must be verbatim.
4. Do not introduce ideas, claims, or examples not present in the provided excerpts.
5. Always say "Center Study" for the field; Katz by surname for the author. You may use "Bouvard" when referring to the Substack voice/persona, but note that Bouvard is a pen name for Katz if relevant.
6. If an excerpt is marked as reference material by Eric Gans, attribute it explicitly ("As Gans writes in the Chronicles…") and never blur it into Katz's voice; Katz's own formulations take precedence when they differ.
6. The tone should match the archive: precise, conceptual, scene-focused, not academic-jargon-y.
7. URL-encode the ?q= parameter: spaces become +, all lowercase.`;

interface ChunkWithMeta {
  text: string;
  title: string;
  slug: string;
  source: string;
  score: number;
}

// Target chunk size in characters. GABlog posts are stored as single blocks
// (no paragraph breaks in ga_context.txt), so we sentence-split large blocks
// to get comparable chunk sizes across all sources.
// 1200 chars ≈ 180–200 words — large enough that a 3–4 sentence quote usually
// fits inside one chunk, reducing the chance Claude reaches past the excerpt.
const TARGET_CHUNK = 1200;

function sentenceChunk(text: string): string[] {
  // Split on sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+["']?\s*/g) || [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > TARGET_CHUNK && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim().length > 50) chunks.push(current.trim());
  return chunks;
}

function chunkPost(post: Post): { text: string; title: string; slug: string; source: string }[] {
  // Split on paragraph breaks first
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50);

  const chunks: string[] = [];
  for (const para of paragraphs) {
    if (para.length > TARGET_CHUNK * 1.5) {
      // Large single-block paragraph (typical of GABlog) — sentence-chunk it
      chunks.push(...sentenceChunk(para));
    } else {
      chunks.push(para);
    }
  }

  return chunks.map((text) => ({
    text,
    title: post.title,
    slug: post.slug,
    source: post.source,
  }));
}

// Common English stop words — filtered out of query terms to reduce noise
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one',
  'our', 'out', 'had', 'has', 'his', 'him', 'its', 'who', 'did', 'get', 'how', 'may',
  'say', 'she', 'use', 'way', 'also', 'back', 'been', 'does', 'from', 'have', 'here',
  'into', 'just', 'know', 'like', 'look', 'made', 'make', 'more', 'most', 'move',
  'much', 'need', 'only', 'over', 'said', 'same', 'than', 'that', 'them', 'then',
  'they', 'this', 'time', 'very', 'what', 'when', 'with', 'will', 'your', 'about',
  'after', 'again', 'being', 'could', 'doing', 'every', 'first', 'going', 'great',
  'other', 'right', 'since', 'some', 'still', 'there', 'these', 'think', 'those',
  'through', 'under', 'where', 'which', 'while', 'would', 'their', 'does', 'both',
  'each', 'even', 'from', 'give', 'good', 'help', 'high', 'keep', 'last', 'lets',
  'long', 'look', 'make', 'many', 'mean', 'might', 'must', 'next', 'often', 'play',
  'real', 'seem', 'show', 'such', 'talk', 'tell', 'turn', 'upon', 'used', 'well',
  'were', 'whether', 'within', 'without',
]);

// Synonym/alias map: checked against the FULL query string (for multi-word phrases)
// AND against each individual term. Expansion happens BEFORE length filtering so
// short terms like "ai" (2 chars) still get their synonyms injected.
const TERM_SYNONYMS: Record<string, string[]> = {
  // AI / technology
  'ai':                       ['artificial intelligence', 'algorithm', 'algorithmic', 'machine learning', 'neural', 'automation'],
  'artificial intelligence':  ['ai', 'artificial intelligence', 'algorithm', 'algorithmic', 'machine learning', 'neural'],
  'llm':                      ['llm', 'llms', 'large language model', 'large language models', 'language model', 'language models'],
  'llms':                     ['llm', 'llms', 'large language model', 'large language models', 'language model', 'language models'],
  'large language model':     ['llm', 'llms', 'large language model', 'large language models', 'language model'],
  'language model':           ['llm', 'llms', 'large language model', 'large language models', 'language model'],
  'gpt':                      ['gpt', 'chatgpt', 'large language model', 'llm', 'openai'],
  'chatgpt':                  ['gpt', 'chatgpt', 'large language model', 'llm', 'openai'],
  'algorithm':                ['algorithm', 'algorithmic', 'ai', 'artificial intelligence', 'machine'],
  'technology':               ['technology', 'technological', 'digital', 'internet', 'platform', 'network', 'software'],
  'internet':                 ['internet', 'web', 'digital', 'online', 'network', 'platform'],
  'social media':             ['social media', 'twitter', 'facebook', 'platform', 'network'],
  // Money / economics
  'money':                    ['money', 'currency', 'monetary', 'dollar', 'exchange', 'debt', 'credit', 'economic', 'market'],
  'currency':                 ['currency', 'money', 'monetary', 'dollar', 'exchange', 'debt', 'credit'],
  'dollar':                   ['dollar', 'currency', 'money', 'monetary', 'reserve'],
  'economic':                 ['economic', 'economics', 'economy', 'market', 'money', 'currency', 'exchange', 'trade'],
  'market':                   ['market', 'markets', 'exchange', 'economic', 'economy', 'trade', 'price'],
  'debt':                     ['debt', 'credit', 'money', 'currency', 'monetary', 'obligation'],
  'inflation':                ['inflation', 'monetary', 'currency', 'dollar', 'price', 'money'],
  'capitalism':               ['capitalism', 'market', 'economic', 'exchange', 'capital', 'liberal'],
  // Governance / politics
  'politics':                 ['politics', 'political', 'governance', 'government', 'sovereignty', 'state', 'power', 'authority'],
  'governance':               ['governance', 'government', 'politics', 'political', 'sovereignty', 'state', 'authority'],
  'sovereignty':              ['sovereignty', 'sovereign', 'state', 'power', 'governance', 'authority'],
  'democracy':                ['democracy', 'democratic', 'liberal', 'politics', 'governance', 'election'],
  'nationalism':              ['nationalism', 'national', 'nation', 'sovereignty', 'state', 'identity'],
  'leadership':               ['leadership', 'leader', 'authority', 'power', 'command', 'succession'],
  'power':                    ['power', 'authority', 'sovereignty', 'command', 'dominance', 'hierarchy'],
  'law':                      ['law', 'juridical', 'legal', 'justice', 'order', 'rights', 'norm'],
  'war':                      ['war', 'conflict', 'violence', 'military', 'geopolitical'],
  // Center Study core concepts
  'generative anthropology':  ['generative anthropology', 'center study', 'originary', 'originary hypothesis'],
  'ga':                       ['generative anthropology', 'center study', 'originary'],
  'center study':             ['center study', 'generative anthropology', 'originary'],
  'originary':                ['originary', 'originary hypothesis', 'originary scene', 'center study'],
  'resentment':               ['resentment', 'ressentiment', 'jealousy', 'envy', 'mimetic', 'grievance'],
  'sacred':                   ['sacred', 'ritual', 'sacrifice', 'religion', 'transcendent', 'center'],
  'mimesis':                  ['mimesis', 'mimetic', 'imitation', 'desire', 'appropriation'],
  'desire':                   ['desire', 'mimetic', 'mimesis', 'appropriation', 'appetite', 'wanting'],
  'language':                 ['language', 'linguistic', 'sign', 'signification', 'speech', 'ostensive', 'imperative', 'declarative'],
  'sign':                     ['sign', 'signification', 'language', 'ostensive', 'symbol', 'meaning'],
  'scene':                    ['scene', 'scenic', 'originary scene', 'center', 'attention'],
  'attention':                ['attention', 'attentional', 'attentionality', 'scene', 'focus'],
  'human':                    ['human', 'humanity', 'anthropological', 'anthropology', 'homo sapiens'],
  'violence':                 ['violence', 'violent', 'conflict', 'war', 'sacrifice', 'resentment'],
  'ethics':                   ['ethics', 'ethical', 'moral', 'morality', 'responsibility', 'good'],
  'community':                ['community', 'social', 'group', 'society', 'collective', 'communal'],
  'religion':                 ['religion', 'religious', 'sacred', 'ritual', 'transcendent', 'faith', 'god'],
  'liberal':                  ['liberal', 'liberalism', 'progressive', 'left', 'woke', 'democratic', 'modern'],
  'woke':                     ['woke', 'progressive', 'liberal', 'identity', 'victimhood', 'resentment'],
  // Cybernetics / systems
  'cybernetics':              ['cybernetics', 'feedback', 'control', 'system', 'complexity', 'network'],
  'feedback':                 ['feedback', 'cybernetics', 'control', 'system', 'loop'],
  'complexity':               ['complexity', 'complex', 'system', 'network', 'emergence'],
};

// Module-level cache: parse once per process lifetime (survives across API requests in dev/prod)
let _postsCache: ReturnType<typeof getAllPosts> | null = null;
function getCachedPosts() {
  if (!_postsCache) _postsCache = getPublicPosts();
  return _postsCache;
}

function extractQueryTerms(query: string): string[] {
  const lowerQuery = query.toLowerCase();

  // First pass: inject synonyms for short/multi-word terms BEFORE length filtering
  // so "AI" (2 chars) still gets its synonyms
  const injected = new Set<string>();
  for (const [key, synonyms] of Object.entries(TERM_SYNONYMS)) {
    if (lowerQuery.includes(key)) {
      for (const s of synonyms) injected.add(s);
    }
  }

  // Extract individual terms from the query
  const baseTerms = lowerQuery
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w)); // length > 1 (not 2) to catch "ai"

  // Expand single-word terms through the synonym map, plus the shared
  // conservative alias layer (src/lib/vocab.ts) used by keyword search —
  // one vocabulary, two consumers.
  for (const term of baseTerms) {
    if (TERM_SYNONYMS[term]) {
      for (const s of TERM_SYNONYMS[term]) injected.add(s);
    }
    for (const s of aliasesFor(term)) injected.add(s);
  }

  // De-pluralize: for each base term that ends in a common plural suffix,
  // also add the singular so "transmissions" matches "transmission",
  // "passages" matches "passage", etc.
  const depluralized = new Set<string>();
  for (const term of baseTerms) {
    if (term.length >= 5 && term.endsWith('s') && !term.endsWith('ss')) {
      // ies → y (e.g. identities → identity)
      if (term.endsWith('ies')) depluralized.add(term.slice(0, -3) + 'y');
      // ions → ion (e.g. transmissions → transmission)
      else if (term.endsWith('ions')) depluralized.add(term.slice(0, -1));
      // plain plural: strip trailing s (e.g. scenes → scene, passages → passage)
      else depluralized.add(term.slice(0, -1));
    }
    // Also add gerund/past forms: "attenuated" → "attenuate", "deferring" → "defer"
    if (term.length >= 6 && term.endsWith('ing')) depluralized.add(term.slice(0, -3));
    if (term.length >= 6 && term.endsWith('ed')) depluralized.add(term.slice(0, -2));
  }

  // Merge: base terms + synonym injections + de-pluralized forms
  const all = new Set([...baseTerms, ...injected, ...depluralized]);
  return Array.from(all).filter((w) => w.trim().length > 0);
}

// Extract meaningful 2-word phrases from the query for phrase-matching bonus
function extractBigrams(query: string): string[] {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

function scoreChunk(chunkText: string, queryTerms: string[], bigrams: string[]): number {
  const lower = chunkText.toLowerCase();
  const words = lower.split(/\s+/).length;
  let rawScore = 0;

  for (const term of queryTerms) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      rawScore += matches.length;
    }
  }

  if (rawScore === 0) return 0;

  // Bigram phrase match bonus — a chunk containing the exact phrase gets a boost
  for (const bigram of bigrams) {
    if (lower.includes(bigram)) rawScore += 5;
  }

  // Bonus for chunks that contain multiple different content query terms
  const uniqueMatches = queryTerms.filter((t) => lower.includes(t));
  if (uniqueMatches.length > 1) {
    rawScore += uniqueMatches.length * 2;
  }

  // Soft normalization: use sqrt(words) instead of linear words.
  // This prevents very long chunks from being harshly penalized (Substack essays)
  // while still preventing short dense chunks from dominating unfairly.
  const normalized = rawScore / Math.sqrt(Math.max(words, 1));

  return normalized;
}

// Semantic retrieval half of hybrid Ask: embed the question server-side (via
// /api/semantic → /api/embed) and return the closest passages. Hard 4s budget —
// a cold embed lambda must never hold the answer hostage; on any failure the
// lexical path proceeds alone, exactly as before.
async function semanticRetrieve(
  query: string,
  origin: string
): Promise<{ slug: string; title: string; source: string; text: string; score: number }[]> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(`${origin}/api/semantic`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify({ q: query, full: true, sources: ['substack', 'gablog', 'book', 'pdf', 'twitter'] }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data.results) ? data.results : [];
  } catch {
    return [];
  }
}

async function retrieveChunks(query: string, maxChunks = 25, origin?: string): Promise<ChunkWithMeta[]> {
  // POLICY (not accident): Ask answers from the Katz corpus. Gans's
  // Chronicles/Anthropoetics are reference material — searchable via the
  // archives toggle and the open APIs, but not blended into synthesized
  // answers, where attribution would blur.
  const posts = getCachedPosts().filter((p) => !ARCHIVAL_SOURCES.includes(p.source));

  const queryTerms = extractQueryTerms(query);
  const bigrams = extractBigrams(query);

  if (queryTerms.length === 0) return [];

  // Kick off semantic retrieval in parallel with the lexical scoring below.
  const semanticPromise = origin ? semanticRetrieve(query, origin) : Promise.resolve([]);

  // Post-level scoring: title matches weighted higher, content matches count occurrences.
  // Substack gets a 1.5x multiplier to compensate for indirect, essayistic titles
  // that don't always contain the exact query term.
  const postScores = posts.map((post) => {
    const lowerTitle = post.title.toLowerCase();
    const lowerContent = post.content.toLowerCase();
    const isSubstack = post.source === 'substack';
    let score = 0;

    for (const term of queryTerms) {
      // Count occurrences in content (not just binary yes/no)
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const contentMatches = (lowerContent.match(new RegExp(escaped, 'gi')) || []).length;
      if (lowerTitle.includes(term)) score += 80;
      score += Math.min(contentMatches, 20) * 10; // cap at 20 occurrences to avoid runaway scores
    }

    // Bigram phrase match bonus at post level
    for (const bigram of bigrams) {
      if (lowerTitle.includes(bigram)) score += 150;
      if (lowerContent.includes(bigram)) score += 30;
    }

    // Exact full-query match
    const fullQuery = query.toLowerCase();
    if (lowerTitle.includes(fullQuery)) score += 500;
    if (lowerContent.includes(fullQuery)) score += 100;

    // Substack boost: Bouvard's essays use indirect, essayistic language
    // that doesn't always contain exact query terms in the title
    if (isSubstack && score > 0) score *= 1.5;

    return { post, score };
  });

  // Sort all scoring posts
  const scoringPosts = postScores
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  // Guarantee source diversity: up to 10 Substack, up to 3 PDF/book, rest from GABlog
  const bySource: Record<string, typeof scoringPosts> = {};
  for (const p of scoringPosts) {
    const src = p.post.source;
    if (!bySource[src]) bySource[src] = [];
    bySource[src].push(p);
  }

  const substackSlots = (bySource['substack'] || []).slice(0, 10).map(p => p.post);
  const pdfSlots = [...(bySource['pdf'] || []), ...(bySource['book'] || [])].slice(0, 3).map(p => p.post);
  const gablogSlots = (bySource['gablog'] || []).slice(0, 10).map(p => p.post);
  // Twitter: include top 5 matching threads — pithy compressed ideas worth surfacing
  const twitterSlots = (bySource['twitter'] || []).slice(0, 5).map(p => p.post);
  // Reddit excluded — too fragmentary for synthesis context

  const topPosts: (typeof scoringPosts[0]['post'])[] = [];
  const seen = new Set<string>();
  for (const p of [...substackSlots, ...pdfSlots, ...gablogSlots, ...twitterSlots]) {
    if (!seen.has(p.slug)) { seen.add(p.slug); topPosts.push(p); }
  }

  // Semantic widening: pull in essays similar to the strongest lexical hits via
  // precomputed post-to-post neighbours (related.json). No query embedding —
  // pure lookup, graceful if the index is missing. Surfaces essays that are
  // *about* the question in words the keyword search didn't match.
  const relatedSet = new Set<string>();
  const postBySlug = new Map(posts.map((p) => [p.slug, p]));
  for (const seed of topPosts.slice(0, 5)) {
    if (relatedSet.size >= 8) break;
    for (const nslug of relatedSlugs(seed.slug, 3)) {
      if (relatedSet.size >= 8) break;
      if (seen.has(nslug) || relatedSet.has(nslug)) continue;
      const np = postBySlug.get(nslug);
      if (np) { relatedSet.add(nslug); topPosts.push(np); }
    }
  }

  // Chunk those posts and score each chunk
  const allChunks: ChunkWithMeta[] = [];
  for (const post of topPosts) {
    const chunks = chunkPost(post);
    let postHasScoredChunk = false;
    for (const chunk of chunks) {
      const score = scoreChunk(chunk.text, queryTerms, bigrams);
      if (score > 0) {
        allChunks.push({ ...chunk, score });
        postHasScoredChunk = true;
      }
    }
    // No lexical chunk match. Semantic neighbours get a mid-range baseline so
    // their best passages actually surface (without outranking real keyword
    // hits); title-only lexical matches keep the tiny 0.1 floor.
    if (!postHasScoredChunk && chunks.length > 0) {
      const baseline = relatedSet.has(post.slug) ? 0.5 : 0.1;
      for (const chunk of chunks.slice(0, 2)) {
        allChunks.push({ ...chunk, score: baseline });
      }
    }
  }

  // Hybrid merge: fold in the semantic passages. Cosine (≈0.55–0.9) maps to
  // 0.4 + cos·0.8 ≈ 0.85–1.1 — above the no-lexical-match baselines, below
  // strong keyword hits, so meaning-matches surface without drowning exact
  // matches. Questions phrased with zero keyword overlap now retrieve real
  // passages instead of weak title-match fallbacks.
  const semantic = await semanticPromise;
  const seenSemantic = new Set<string>();
  let added = 0;
  for (const s of semantic) {
    if (added >= 8) break;
    const key = `${s.slug}:${s.text.slice(0, 60)}`;
    if (seenSemantic.has(key)) continue;
    seenSemantic.add(key);
    // Skip if a lexical chunk already covers this exact passage
    if (allChunks.some((c) => c.slug === s.slug && c.text.slice(0, 60) === s.text.slice(0, 60))) continue;
    allChunks.push({
      slug: s.slug,
      title: s.title,
      source: s.source as ChunkWithMeta['source'],
      text: s.text,
      score: 0.4 + s.score * 0.8,
    } as ChunkWithMeta);
    added++;
  }

  // Source-diverse chunk selection: guarantee Substack representation
  const sortedChunks = allChunks.sort((a, b) => b.score - a.score);
  const chunksBySource: Record<string, ChunkWithMeta[]> = {};
  for (const chunk of sortedChunks) {
    if (!chunksBySource[chunk.source]) chunksBySource[chunk.source] = [];
    chunksBySource[chunk.source].push(chunk);
  }

  const ssChunks = (chunksBySource['substack'] || []).slice(0, 15);
  const pdfBookChunks = [
    ...(chunksBySource['pdf'] || []),
    ...(chunksBySource['book'] || []),
  ].slice(0, 6);
  const twitterChunks = (chunksBySource['twitter'] || []).slice(0, 4);
  const remaining = maxChunks - ssChunks.length - pdfBookChunks.length - twitterChunks.length;
  const gablogChunks = (chunksBySource['gablog'] || []).slice(0, Math.max(remaining, 5));

  return [...ssChunks, ...pdfBookChunks, ...gablogChunks, ...twitterChunks]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}

function formatChunksForPrompt(chunks: ChunkWithMeta[]): string {
  const sourceLabels: Record<string, string> = {
    substack: 'Substack',
    gablog: 'GABlog',
    book: 'Book',
    pdf: 'PDF',
    twitter: 'X / Twitter',
    // Defensive: if a Gans chunk ever reaches the prompt, it arrives labeled.
    chronicle: 'Chronicle of Love & Resentment (Eric Gans — reference)',
    ap: 'Anthropoetics (reference)',
  };

  return chunks
    .map((chunk, i) => {
      const sourceType = sourceLabels[chunk.source] || chunk.source;
      return `--- EXCERPT ${i + 1} ---
Source: "${chunk.title}" [${sourceType}]
Slug: ${chunk.slug}

${chunk.text}`;
    })
    .join('\n\n');
}

export function OPTIONS(request: Request) {
  const cors = partnerCors(request);
  return preflight(cors ?? {});
}

export async function POST(request: Request) {
  // ── Abuse guards: browser-origin + per-IP rate limit ──────────────────
  // This endpoint spends Anthropic credits per request. Headerless clients
  // (curl/scripts) are rejected; each IP gets a small per-minute budget.
  const cors = partnerCors(request);
  if (cors === null && !isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden — this endpoint is limited to partner origins; see /developers' }, { status: 403 });
  }
  {
    const limited = rateLimit(`chat:${clientIp(request)}`, 10, 60_000);
    if (!limited.ok) {
      return Response.json(
        { error: 'Too many requests — slow down a little.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
      );
    }
  }

  try {
    const { message, history, concept } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Build concept seed context if a concept slug was passed
    let conceptContextBlock = '';
    if (concept && typeof concept === 'string') {
      const conceptData = getConceptBySlug(concept);
      if (conceptData && conceptData.passages.length > 0) {
        const passageText = conceptData.passages
          .map((p, i) => {
            const slug = (p as { sourceSlug?: string }).sourceSlug ?? '';
            const gans = /^(clr-|ap\d)/.test(slug) && !/katz/.test(slug);
            return `[Concept passage ${i + 1}] From "${p.source}"${gans ? ' (Eric Gans — reference material; attribute to Gans if quoted)' : ''}:\n"${p.text}"`;
          })
          .join('\n\n');
        conceptContextBlock = `CONCEPT CONTEXT: The user is reading the concept page for "${conceptData.title}" and has asked a related question. These are the defining passages for this concept — treat them as high-priority anchors when synthesizing your answer:\n\n${passageText}\n\n---\n\n`;
      }
    }

    // Retrieve relevant chunks (synchronous, in-memory)
    const chunks = await retrieveChunks(message, 30, new URL(request.url).origin);

    // Build source metadata NOW (before starting the Claude API call)
    // so we can send it to the client immediately as the first stream event.
    // Each source gets the best-matching chunk text as a readable snippet.
    const sourceMeta = chunks.reduce(
      (acc, chunk) => {
        if (!acc.find((s) => s.slug === chunk.slug)) {
          // Trim the snippet to the first complete sentence(s) up to ~180 chars
          const raw = chunk.text.replace(/\s+/g, ' ').trim();
          const snippet = raw.length <= 180
            ? raw
            : raw.slice(0, 180).replace(/\s+\S*$/, '') + '…';
          acc.push({
            slug: chunk.slug,
            title: chunk.title,
            source: chunk.source,
            snippet,
          });
        }
        return acc;
      },
      [] as { slug: string; title: string; source: string; snippet: string }[]
    );

    // Build the user message with retrieved context
    const contextBlock = chunks.length > 0
      ? `${conceptContextBlock}Here are the most relevant excerpts from the Center Study archive:\n\n${formatChunksForPrompt(chunks)}\n\n---\n\nUser question: ${message}`
      : `${conceptContextBlock}No relevant excerpts were found for this query.\n\nUser question: ${message}`;

    // Build message history for multi-turn
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: 'user', content: contextBlock });

    // Start Claude stream (takes ~500ms for first token)
    const stream = await anthropic.messages.stream({
      // The answer is a synthesis (3–5 paragraphs) FOLLOWED BY a "## Excerpts"
      // block of 5–8 verbatim passages. At 3000 a verbose synthesis consumed the
      // whole budget and the response was cut off before the excerpts ever
      // streamed — so the UI showed a summary with no quotes. Sonnet 4.6 allows
      // up to 64K output; give ample room for both halves.
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // ── Send sources FIRST, before any AI text ──────────────────────
          // Client receives these immediately and renders post cards while
          // the AI response streams in below them.
          const metaFirst = JSON.stringify({ sources: sourceMeta.slice(0, 8) }) + '\n';
          controller.enqueue(encoder.encode(metaFirst));

          // ── Stream AI text ───────────────────────────────────────────────
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: event.delta.text }) + '\n';
              controller.enqueue(encoder.encode(data));
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        ...(cors ?? {}),
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
