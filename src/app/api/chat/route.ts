import Anthropic from '@anthropic-ai/sdk';
import { getAllPosts } from '@/lib/parser';
import { Post } from '@/lib/types';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are an archival research assistant for Center Study — a discipline developed by Eric Gans and elaborated by Adam Katz and Dennis Bouvard. You have access to excerpts from the complete Center Study archive:
- **GABlog** (~480 posts by Adam Katz): the main theoretical blog
- **Substack** (~127 essays by Dennis Bouvard): recent applied work on technology, governance, currency, AI, cybernetics, and contemporary politics — written from 2022–2026
- **PDFs** (15 texts by Adam Katz): academic papers on language, power, juridical order, economics, and originary grammar
- **Anthropomorphics** (book by Dennis Bouvard & Adam Katz): systematic originary grammar

Your job is to surface the best direct quotes from the archive that address the question — functioning as an advanced semantic search, not a summarizer.

FORMAT (follow exactly):
For each relevant passage, output this block:

> "Exact quote copied verbatim from the excerpt — at least 2–4 full sentences."

**[Post Title]** · [Source Type]
[Read in context →](/post/{slug}?q={first+few+words+of+quote+url+encoded})

Rules for the link: use the Slug field from the excerpt header. URL-encode the first 4–5 words of the quote as the ?q= parameter (replace spaces with +, lowercase).

OUTPUT RULES:
⚠️ ACCURACY — READ FIRST: You may ONLY quote text that appears word-for-word in the excerpts provided above. Never continue, extend, or complete a quote from your own training knowledge — even if you believe you know how the passage continues. Every sentence in every blockquote must exist verbatim in the provided excerpt. If an excerpt ends mid-thought, stop the quote there. A fabricated sentence is worse than a short quote.

1. Extract 6–10 quotes from across the retrieved excerpts. Prioritize passages that most directly, specifically address the question.
2. Quotes must be verbatim — copied exactly from the excerpt text, nothing added, nothing from memory.
3. Each quote should be substantive: 2–5 sentences. Use shorter quotes if that's all the excerpt contains — do not pad with invented text.
4. When a single source has multiple highly relevant passages, include multiple quotes from it.
5. Do not write prose analysis, introductions, or summaries. Only quotes + citations + links.
6. Always say "Center Study" if you must name the field, never "GA" or "Generative Anthropology."
7. After all quotes, add one short paragraph (2–3 sentences max) under the heading **## Reading note** that identifies the most important source(s) and any key tension across the passages.

The reader wants to find passages they couldn't find with keyword search. Give them the richest, most relevant excerpts the archive contains.`;

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
  if (!_postsCache) _postsCache = getAllPosts();
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

  // Expand single-word terms through synonym map
  for (const term of baseTerms) {
    if (TERM_SYNONYMS[term]) {
      for (const s of TERM_SYNONYMS[term]) injected.add(s);
    }
  }

  // Merge: base terms (minus stop words) + all injected synonyms
  const all = new Set([...baseTerms, ...injected]);
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

function retrieveChunks(query: string, maxChunks = 25): ChunkWithMeta[] {
  const posts = getCachedPosts();

  const queryTerms = extractQueryTerms(query);
  const bigrams = extractBigrams(query);

  if (queryTerms.length === 0) return [];

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
  // Reddit excluded from Ask — too fragmentary for synthesis context

  const topPosts: (typeof scoringPosts[0]['post'])[] = [];
  const seen = new Set<string>();
  for (const p of [...substackSlots, ...pdfSlots, ...gablogSlots]) {
    if (!seen.has(p.slug)) { seen.add(p.slug); topPosts.push(p); }
  }

  // Chunk those posts and score each chunk
  const allChunks: ChunkWithMeta[] = [];
  for (const post of topPosts) {
    const chunks = chunkPost(post);
    for (const chunk of chunks) {
      const score = scoreChunk(chunk.text, queryTerms, bigrams);
      if (score > 0) {
        allChunks.push({ ...chunk, score });
      }
    }
  }

  // Source-diverse chunk selection: guarantee Substack representation
  const sortedChunks = allChunks.sort((a, b) => b.score - a.score);
  const chunksBySource: Record<string, ChunkWithMeta[]> = {};
  for (const chunk of sortedChunks) {
    if (!chunksBySource[chunk.source]) chunksBySource[chunk.source] = [];
    chunksBySource[chunk.source].push(chunk);
  }

  const ssChunks = (chunksBySource['substack'] || []).slice(0, 18);
  const pdfBookChunks = [
    ...(chunksBySource['pdf'] || []),
    ...(chunksBySource['book'] || []),
  ].slice(0, 6);
  const remaining = maxChunks - ssChunks.length - pdfBookChunks.length;
  const gablogChunks = (chunksBySource['gablog'] || []).slice(0, Math.max(remaining, 5));

  return [...ssChunks, ...pdfBookChunks, ...gablogChunks]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}

function formatChunksForPrompt(chunks: ChunkWithMeta[]): string {
  const sourceLabels: Record<string, string> = {
    substack: 'Substack',
    gablog: 'GABlog',
    book: 'Book',
    pdf: 'PDF',
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

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Retrieve relevant chunks (synchronous, in-memory)
    const chunks = retrieveChunks(message, 30);

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
      ? `Here are the most relevant excerpts from the Center Study archive:\n\n${formatChunksForPrompt(chunks)}\n\n---\n\nUser question: ${message}`
      : `No relevant excerpts were found for this query.\n\nUser question: ${message}`;

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
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
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
