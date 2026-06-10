import { getPublicPosts } from '@/lib/parser';

// Compiles the full text of the posts in a reading path into a single
// downloadable markdown file. GET /api/reading-path/download?slugs=a,b,c
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugsParam = searchParams.get('slugs');

  if (!slugsParam) {
    return Response.json({ error: 'slugs parameter is required' }, { status: 400 });
  }

  // Cap at 15 — reading paths are 6-10 texts; this is not a bulk-export endpoint
  const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 15);
  if (slugs.length === 0) {
    return Response.json({ error: 'No valid slugs' }, { status: 400 });
  }

  const allPosts = getPublicPosts();
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]));

  // Preserve the path's order; skip unknown slugs
  const posts = slugs.map((s) => bySlug.get(s)).filter((p) => p !== undefined);

  if (posts.length === 0) {
    return Response.json({ error: 'No matching texts found' }, { status: 404 });
  }

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

  const parts: string[] = [
    '# Center Study Reading Path',
    '',
    `${posts.length} texts · compiled from center.study`,
    '',
    '## Contents',
    '',
    ...posts.map((p, i) => `${i + 1}. ${p.title} (${SOURCE_LABELS[p.source] ?? p.source})`),
    '',
    '---',
    '',
  ];

  posts.forEach((p, i) => {
    parts.push(
      `# ${i + 1}. ${p.title}`,
      '',
      `*${SOURCE_LABELS[p.source] ?? p.source}${p.date ? ` · ${p.date}` : ''} · https://center.study/post/${p.slug}*`,
      '',
      p.content.trim(),
      '',
      '---',
      ''
    );
  });

  const body = parts.join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="center-study-reading-path.md"',
      'Cache-Control': 'no-store',
    },
  });
}
