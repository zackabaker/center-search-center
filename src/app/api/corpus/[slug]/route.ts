import { getPostBySlug, getPublicPosts } from '@/lib/parser';

// Single text in machine formats.
// GET /api/corpus/<slug>             → JSON (metadata + full content)
// GET /api/corpus/<slug>?format=md   → text/markdown with front matter
// GET /api/corpus/<slug>?format=txt  → text/plain
//
// CORS-open and cacheable — point a scraper or an AI at it directly.

export const revalidate = 3600;

const BASE = 'https://center.study';

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
  chronicle: 'Chronicles of Love and Resentment',
  ap: 'Anthropoetics Journal',
};

function authorFor(source: string, author?: string): string {
  if (author) return author; // explicit override (per-article AP, co-authored, etc.)
  if (source === 'ap') return 'Various authors';
  if (source === 'chronicle') return 'Eric Gans';
  if (source === 'substack' || source === 'reddit' || source === 'twitter') return 'Dennis Bouvard (Adam Katz)';
  return 'Adam Katz';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Old source-prefixed slugs are 308-redirected to the canonical URL in proxy.ts
  // before reaching here. Only public posts are exposed.
  if (!post || !getPublicPosts().some((p) => p.slug === slug)) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') ?? 'json';
  const author = authorFor(post.source, post.author);
  const canonical = `${BASE}/post/${post.slug}`;

  const common = {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    'Access-Control-Allow-Origin': '*',
  };

  if (format === 'md') {
    const md = [
      '---',
      `title: ${JSON.stringify(post.title)}`,
      `author: ${JSON.stringify(author)}`,
      `source: ${SOURCE_LABELS[post.source] ?? post.source}`,
      ...(post.date ? [`date: ${JSON.stringify(post.date)}`] : []),
      `canonical: ${canonical}`,
      ...(post.url ? [`original: ${post.url}`] : []),
      '---',
      '',
      `# ${post.title}`,
      '',
      post.content.trim(),
      '',
    ].join('\n');
    return new Response(md, {
      headers: { ...common, 'Content-Type': 'text/markdown; charset=utf-8' },
    });
  }

  if (format === 'txt') {
    const txt = [
      post.title,
      `by ${author} — ${SOURCE_LABELS[post.source] ?? post.source}${post.date ? `, ${post.date}` : ''}`,
      canonical,
      '',
      post.content.trim(),
      '',
    ].join('\n');
    return new Response(txt, {
      headers: { ...common, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return Response.json(
    {
      slug: post.slug,
      title: post.title,
      author,
      source: post.source,
      sourceLabel: SOURCE_LABELS[post.source] ?? post.source,
      date: post.date ?? null,
      wordCount: post.content.split(/\s+/).length,
      canonical,
      original: post.url ?? null,
      formats: {
        markdown: `${BASE}/api/corpus/${post.slug}?format=md`,
        text: `${BASE}/api/corpus/${post.slug}?format=txt`,
      },
      content: post.content,
    },
    { headers: common }
  );
}
