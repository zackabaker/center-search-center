import { getAllPosts, getPublicPosts } from '@/lib/parser';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = 'https://center.study';

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard Substack', gablog: 'GABlog', book: 'Anthropomorphics',
  pdf: 'PDF', reddit: 'Reddit', twitter: 'X / Twitter',
  chronicle: 'Reference — Chronicles of Love & Resentment (Eric Gans)',
  ap: 'Reference — Anthropoetics Journal',
};

function xmlEscape(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = getPublicPosts()
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 60);

  const items = posts.map((post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${BASE_URL}/post/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date!).toUTCString()}</pubDate>
      <category>${xmlEscape(SOURCE_LABELS[post.source] || post.source)}</category>
      <description>${xmlEscape(post.excerpt)}</description>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Center Study Center</title>
    <link>${BASE_URL}</link>
    <description>The Center Study archive — writings of Adam Katz (Dennis Bouvard), with reference material by Eric Gans</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
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
