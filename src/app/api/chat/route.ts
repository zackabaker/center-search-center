import Anthropic from '@anthropic-ai/sdk';
import { getAllPosts } from '@/lib/parser';
import { Post } from '@/lib/types';

const anthropic = new Anthropic();

const SYSTEM_PROMPT = `You are a research assistant for Generative Anthropology (GA), a field founded by Eric Gans.

You have been given a set of EXCERPTS from a corpus of GA texts (Substack posts, academic blog posts, books, and PDFs). Your job is to answer the user's question using ONLY direct quotes from these excerpts.

STRICT RULES:
1. ONLY use verbatim quotes from the provided excerpts. Put all quotes in quotation marks.
2. After each quote, cite the source in brackets like [Source Title].
3. You may write brief connecting sentences between quotes to make the answer coherent, but the substance must come from quotes.
4. If no excerpt answers the question, say: "I couldn't find a direct answer to that in the archive. Try rephrasing or searching for specific terms."
5. NEVER paraphrase, summarize, or invent content. If you're not quoting directly, you should only be writing brief transitions.
6. Include 2-5 relevant quotes if available. Quality over quantity.
7. At the end, list the sources you quoted with their type (Substack/GABlog/PDF/Book) so the user can find them.

The user is likely a scholar or student of GA. Be precise and helpful.`;

interface ChunkWithMeta {
  text: string;
  title: string;
  slug: string;
  source: string;
  score: number;
}

function chunkPost(post: Post): { text: string; title: string; slug: string; source: string }[] {
  // Split content into paragraphs
  const paragraphs = post.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50); // Skip very short fragments

  return paragraphs.map((text) => ({
    text,
    title: post.title,
    slug: post.slug,
    source: post.source,
  }));
}

function scoreChunk(chunkText: string, queryTerms: string[]): number {
  const lower = chunkText.toLowerCase();
  let score = 0;

  for (const term of queryTerms) {
    // Count occurrences of each term
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = lower.match(regex);
    if (matches) {
      score += matches.length * 10;
    }
  }

  // Bonus for chunks that contain multiple different query terms
  const uniqueMatches = queryTerms.filter((t) => lower.includes(t.toLowerCase()));
  if (uniqueMatches.length > 1) {
    score += uniqueMatches.length * 20;
  }

  // Bonus for density (shorter chunks with matches are more focused)
  if (score > 0 && chunkText.length < 500) {
    score += 5;
  }

  return score;
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

  // Take top 15 most relevant posts
  const topPosts = postScores
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map((p) => p.post);

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

  // Return top chunks sorted by score
  return allChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
}

function formatChunksForPrompt(chunks: ChunkWithMeta[]): string {
  const sourceLabels: Record<string, string> = {
    substack: 'Substack',
    gablog: 'GABlog',
    book: 'Book',
    pdf: 'PDF',
    glossary: 'Glossary',
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
    const chunks = retrieveChunks(message);

    // Build the user message with retrieved context
    const contextBlock = chunks.length > 0
      ? `Here are the most relevant excerpts from the GA archive:\n\n${formatChunksForPrompt(chunks)}\n\n---\n\nUser question: ${message}`
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
      model: 'claude-sonnet-4-20250514',
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
