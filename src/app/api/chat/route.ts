import Anthropic from '@anthropic-ai/sdk';
import { getAllPosts } from '@/lib/parser';
import { Post } from '@/lib/types';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a research assistant for Center Study — a discipline developed by Eric Gans and elaborated by Adam Katz and Dennis Bouvard. Center Study has superseded what was previously called Generative Anthropology (GA). Always refer to the field, its concepts, and its practitioners in terms of Center Study. Do not use the abbreviation "GA" or the phrase "Generative Anthropology" in your answers — if you must reference the historical name (e.g. when quoting a source that uses it), note briefly that this is Center Study's earlier designation.

You have access to excerpts from the complete Center Study archive:
- **GABlog** (~480 posts by Adam Katz): the main theoretical blog
- **Substack** (~127 essays by Dennis Bouvard): recent applied work on technology, governance, currency, AI, cybernetics, and contemporary politics — written from 2022–2026
- **PDFs** (15 texts by Adam Katz): academic papers on language, power, juridical order, economics, and originary grammar
- **Anthropomorphics** (book by Dennis Bouvard & Adam Katz): systematic originary grammar

The Substack essays are a critical part of the archive. When questions touch on contemporary topics — AI, algorithms, money, markets, leadership, nationalism, technology, governance — draw heavily from Substack as well as GABlog.

Your job is to give substantive, intellectually serious answers grounded in the archive. You are a research tool for serious reading, not a chatbot.

MODES (infer from the question):
- **Synthesis**: For broad questions ("What is X?", "How does Katz treat Y?"), synthesize across multiple sources. Lead with analytical framing, support with quotes, note tensions or developments over time.
- **Close reading**: For specific passage questions, quote precisely and read carefully.
- **Comparison**: For "how does X differ from Y" questions, structure the comparison explicitly.

RULES:
1. Always say "Center Study" where you would otherwise say "GA" or "Generative Anthropology."
2. Ground every claim in the archive. Quote precisely and cite with [Source Title].
3. Don't pad. Don't hedge excessively. Say what the archive actually says.
4. Note where the archive is silent, contradicts itself, or leaves something genuinely open.
5. Use Center Study vocabulary — don't translate it away.
6. Format with markdown: headers for sections, **bold** for key terms, blockquotes for extended quotations.
7. Keep answers under 600 words unless the question demands more.

The reader is a serious student of Center Study. Treat them accordingly.`;

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
const TARGET_CHUNK = 600;

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

function scoreChunk(chunkText: string, queryTerms: string[]): number {
  const lower = chunkText.toLowerCase();
  const words = lower.split(/\s+/).length;
  let rawScore = 0;

  for (const term of queryTerms) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(regex);
    if (matches) {
      rawScore += matches.length;
    }
  }

  if (rawScore === 0) return 0;

  // Bonus for chunks that contain multiple different query terms
  const uniqueMatches = queryTerms.filter((t) => lower.includes(t.toLowerCase()));
  if (uniqueMatches.length > 1) {
    rawScore += uniqueMatches.length * 2;
  }

  // TF-style normalization: score per 100 words so chunk size doesn't inflate score.
  // A 600-char chunk and a 10000-char chunk with the same term density score equally.
  const tf = (rawScore / Math.max(words, 1)) * 100;

  return tf;
}

function retrieveChunks(query: string, maxChunks = 25): ChunkWithMeta[] {
  const posts = getAllPosts();

  // Extract query terms
  const queryTerms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (queryTerms.length === 0) return [];

  // First, find relevant posts using title + content matching
  const postScores = posts.map((post) => {
    const lowerTitle = post.title.toLowerCase();
    const lowerContent = post.content.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      if (lowerTitle.includes(term)) score += 100;
      if (lowerContent.includes(term)) score += 10;
    }

    // Bonus for exact phrase match
    const fullQuery = query.toLowerCase();
    if (lowerTitle.includes(fullQuery)) score += 500;
    if (lowerContent.includes(fullQuery)) score += 50;

    return { post, score };
  });

  // Sort all scoring posts
  const scoringPosts = postScores
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  // Guarantee source diversity: up to 5 Substack, up to 3 PDF/book, rest from GABlog
  // This prevents GABlog from crowding out Substack just due to volume (484 vs 127 posts)
  const bySource: Record<string, typeof scoringPosts> = {};
  for (const p of scoringPosts) {
    const src = p.post.source;
    if (!bySource[src]) bySource[src] = [];
    bySource[src].push(p);
  }

  const topPosts: typeof scoringPosts[0]['post'][] = [];
  const substackSlots = (bySource['substack'] || []).slice(0, 5).map(p => p.post);
  const pdfSlots = [...(bySource['pdf'] || []), ...(bySource['book'] || [])].slice(0, 3).map(p => p.post);
  const gablogSlots = (bySource['gablog'] || []).slice(0, 10).map(p => p.post);
  const redditSlots = (bySource['reddit'] || []).slice(0, 2).map(p => p.post);

  const seen = new Set<string>();
  for (const p of [...substackSlots, ...pdfSlots, ...gablogSlots, ...redditSlots]) {
    if (!seen.has(p.slug)) { seen.add(p.slug); topPosts.push(p); }
  }

  // Chunk those posts and score each chunk
  const allChunks: ChunkWithMeta[] = [];
  for (const post of topPosts) {
    const chunks = chunkPost(post);
    for (const chunk of chunks) {
      const score = scoreChunk(chunk.text, queryTerms);
      if (score > 0) {
        allChunks.push({ ...chunk, score });
      }
    }
  }

  // Source-diverse chunk selection: prevent GABlog's short paragraphs from
  // crowding out Substack's longer, equally relevant chunks via density scoring.
  const sortedChunks = allChunks.sort((a, b) => b.score - a.score);
  const chunksBySource: Record<string, ChunkWithMeta[]> = {};
  for (const chunk of sortedChunks) {
    if (!chunksBySource[chunk.source]) chunksBySource[chunk.source] = [];
    chunksBySource[chunk.source].push(chunk);
  }

  const ssChunks = (chunksBySource['substack'] || []).slice(0, 12);
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

    // Retrieve relevant chunks
    const chunks = retrieveChunks(message, 30);

    // Build the user message with retrieved context
    const contextBlock = chunks.length > 0
      ? `Here are the most relevant excerpts from the Center Study archive:\n\n${formatChunksForPrompt(chunks)}\n\n---\n\nUser question: ${message}`
      : `No relevant excerpts were found for this query.\n\nUser question: ${message}`;

    // Build message history for multi-turn
    const messages: { role: 'user' | 'assistant'; content: string }[] = [];

    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) { // Keep last 6 messages for context
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    }

    messages.push({ role: 'user', content: contextBlock });

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    // Convert to ReadableStream for the client
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: event.delta.text }) + '\n';
              controller.enqueue(encoder.encode(data));
            }
          }

          // Send source metadata at the end
          const sourceMeta = chunks.reduce(
            (acc, chunk) => {
              if (!acc.find((s) => s.slug === chunk.slug)) {
                acc.push({
                  slug: chunk.slug,
                  title: chunk.title,
                  source: chunk.source,
                });
              }
              return acc;
            },
            [] as { slug: string; title: string; source: string }[]
          );

          const metaData =
            JSON.stringify({ sources: sourceMeta.slice(0, 10) }) + '\n';
          controller.enqueue(encoder.encode(metaData));

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
