import Anthropic from '@anthropic-ai/sdk';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { getPublicPosts } from '@/lib/parser';

const anthropic = new Anthropic();

// Build a compact index of the archive for the recommendation system.
// Cached at module level — posts are static (loaded from JSON), so this is safe
// and avoids re-parsing 700+ posts on every request.
let _cachedArchiveIndex: string | null = null;
function getArchiveIndex(): string {
  if (!_cachedArchiveIndex) _cachedArchiveIndex = buildArchiveIndex();
  return _cachedArchiveIndex;
}

function buildArchiveIndex(): string {
  const posts = getPublicPosts();

  // Group by source for clarity
  const substack = posts.filter((p) => p.source === 'substack');
  const gablog   = posts.filter((p) => p.source === 'gablog');
  const pdf      = posts.filter((p) => p.source === 'pdf');
  const book     = posts.filter((p) => p.source === 'book');

  // Short excerpt: first 120 chars of content, stripped of markdown
  const excerpt = (content: string) =>
    content.replace(/#+\s/g, '').replace(/\n+/g, ' ').trim().slice(0, 120).replace(/\s+\S*$/, '…');

  const fmt = (arr: typeof posts, label: string, description: string) =>
    arr.length === 0 ? '' :
    `## ${label} — ${description} (${arr.length} texts)\n` +
    arr.map((p) => `- ${p.slug} | ${label} | ${p.title} — ${excerpt(p.content)}`).join('\n');

  return [
    fmt(substack, 'Substack', 'applied work on AI, governance, money, technology, language — written as Dennis Bouvard'),
    fmt(gablog,   'GABlog',   'theoretical archive on originary hypothesis, scene, language, politics'),
    fmt(pdf,      'PDF',      'academic papers on originary grammar, juridical order, economics'),
    fmt(book,     'Book',     'Anthropomorphics — systematic originary grammar'),
  ].filter(Boolean).join('\n\n');
}

const SYSTEM_PROMPT = `You are a reading path curator for Center Study — a discipline developed by Eric Gans and Adam Katz (also known as Dennis Bouvard — the same person writing under two names) that analyzes all human practices through the originary scene: the moment at which the first sign deferred violence and constituted the human community. Center Study operates from the premise that there is no field of human endeavor — technology, economics, law, poetry, medicine, leadership, AI — that is not legible through this lens.

Your role is to have a brief, focused conversation with the reader to understand their interests and what they are stuck on, then generate a personalized reading path from the actual archive.

CONVERSATION STRUCTURE — STRICT:
1. If the reader's first message names any interest, field, or problem at all, ask ONE short clarifying question (under 60 words). If their first message is already specific, skip the question and generate the path immediately.
2. After the reader's second message, you MUST generate the reading path. NEVER ask a second question under any circumstances — even if their answer is vague, work with what you have and make reasonable choices. A conversation never contains more than one question from you.

READING PATH FORMAT:
When generating the reading path, use EXACTLY this format with no deviations:

---READING PATH START---
**[PATH TITLE]** — for [reader's interest/domain]

[2-3 sentences on why these texts, what thread connects them]

1. slug-exactly-as-in-index | GABlog | Title of Post
   *One sentence on what this text does for the reader's specific interest*

2. slug-exactly-as-in-index | Substack | Title of Post
   *One sentence*

[continue for 6-10 texts]

**After this path:** one sentence on what opens next
---READING PATH END---

RULES:
- Only recommend texts from the ARCHIVE INDEX provided. Copy the slug EXACTLY as it appears in the index (the first field, e.g. gablog-some-slug).
- The source label in the second field must be one of exactly: GABlog, Substack, PDF, Book — match the section header it came from.
- Use the excerpt in the index to match posts to the reader's specific interest — do not default to the same well-known titles every time.
- Mix sources (Substack, GABlog, PDF, Book) — do not recommend only GABlog.
- For any interest touching AI, technology, governance, money, markets: include Substack posts prominently.
- The path should build — each text should prepare the reader for the next.
- Keep framing in Center Study terms. Do not translate Center Study vocabulary away.
- Be concrete about what the reader will get from each text.
- Every path must be genuinely tailored to the reader's stated interest. Two different interests must produce two meaningfully different paths.
- Always include the closing ---READING PATH END--- marker.

The reader's field or interest is the entry point. Center Study has no limits — it can enter any domain and translate it into originary grammar. Your job is to find that thread.`;

export async function POST(request: Request) {
  // ── Abuse guards: browser-origin + per-IP rate limit ──────────────────
  // This endpoint spends Anthropic credits per request. Headerless clients
  // (curl/scripts) are rejected; each IP gets a small per-minute budget.
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  {
    const limited = rateLimit(`reading-path:${clientIp(request)}`, 6, 60_000);
    if (!limited.ok) {
      return Response.json(
        { error: 'Too many requests — slow down a little.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfterSeconds) } }
      );
    }
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages are required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    // Get cached archive index (built once per server process)
    const archiveIndex = getArchiveIndex();

    // Inject archive index into the first user message as context
    const messagesWithContext = messages.map((msg: { role: string; content: string }, i: number) => {
      if (i === 0 && msg.role === 'user') {
        return {
          role: 'user' as const,
          content: `ARCHIVE INDEX:\n${archiveIndex}\n\n---\n\nReader message: ${msg.content}`,
        };
      }
      return { role: msg.role as 'user' | 'assistant', content: msg.content };
    });

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: messagesWithContext,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
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
    console.error('Reading path API error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
