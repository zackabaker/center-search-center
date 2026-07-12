import { getPublicPosts } from '@/lib/parser';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = 'https://center.study';

// Real sources that get their own feed (virtual sources like threads/all excluded).
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

function xmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET(_req: Request, { params }: { params: Promise<{ source: string }> }) {
  const { source } = await params;
  const label = SOURCE_LABELS[source];
  if (!label) return new Response('Unknown feed', { status: 404 });

  const posts = getPublicPosts()
    .filter((p) => p.source === source && p.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 60);

  const items = posts.map((post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${BASE_URL}/post/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date!).toUTCString()}</pubDate>
      <category>${xmlEscape(label)}</category>
      <description>${xmlEscape(post.excerpt)}</description>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Center Study Center — ${xmlEscape(label)}</title>
    <link>${BASE_URL}/browse/${source}</link>
    <description>${xmlEscape(label)} from center.study — ${source === 'chronicle' || source === 'ap' ? 'reference material by Eric Gans, hosted on the Adam Katz archive' : 'writings of Adam Katz (Dennis Bouvard)'}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed/${source}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
