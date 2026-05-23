import { getAllPosts } from '@/lib/parser';
import { ContentSource } from '@/lib/types';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'PDF',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
  lecture: 'Lecture Series',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourcesParam = searchParams.get('sources');
  const format = (searchParams.get('format') || 'json') as 'json' | 'txt';

  const requestedSources = sourcesParam
    ? (sourcesParam.split(',').filter(Boolean) as ContentSource[])
    : null;

  const allPosts = getAllPosts();
  const posts = requestedSources
    ? allPosts.filter((p) => requestedSources.includes(p.source))
    : allPosts;

  const filename =
    format === 'txt' ? 'center-archive.txt' : 'center-archive.json';

  if (format === 'txt') {
    const divider = '─'.repeat(80);
    const text = [
      `Center Study Center — Archive Export`,
      `Exported: ${new Date().toISOString()}`,
      `Posts: ${posts.length}`,
      `Sources: ${requestedSources ? requestedSources.map((s) => SOURCE_LABELS[s]).join(', ') : 'All'}`,
      '',
      divider,
      '',
      ...posts.map((p) =>
        [
          `TITLE: ${p.title}`,
          `SOURCE: ${SOURCE_LABELS[p.source]}`,
          p.date ? `DATE: ${p.date}` : '',
          p.url ? `URL: ${p.url}` : '',
          '',
          p.content,
          '',
          divider,
          '',
        ]
          .filter((line) => line !== null)
          .join('\n')
      ),
    ].join('\n');

    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  // JSON format
  const data = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    source: p.source,
    sourceLabel: SOURCE_LABELS[p.source],
    date: p.date ?? null,
    url: p.url ?? null,
    content: p.content,
  }));

  const json = JSON.stringify(
    {
      exported: new Date().toISOString(),
      count: data.length,
      sources: requestedSources ?? 'all',
      posts: data,
    },
    null,
    2
  );

  return new Response(json, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
