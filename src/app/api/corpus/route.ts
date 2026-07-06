import { openCors, preflight } from '@/lib/cors';
import { getPublicPosts } from '@/lib/parser';

// Machine-readable index of the full archive.
// GET /api/corpus            → JSON index of every text
// GET /api/corpus?source=gablog,substack → filtered
//
// Each entry carries canonical URLs for the human page and the
// machine formats (json / md / txt). Designed for scrapers, archivists,
// and AI pipelines — see /llms.txt for the overview.

export const revalidate = 3600;

const BASE = 'https://center.study';

export function OPTIONS() {
  return preflight(openCors());
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceParam = searchParams.get('source');
  const sources = sourceParam ? new Set(sourceParam.split(',').map((s) => s.trim())) : null;

  const all = getPublicPosts();
  const posts = sources ? all.filter((p) => sources.has(p.source)) : all;

  const counts: Record<string, number> = {};
  for (const p of all) counts[p.source] = (counts[p.source] ?? 0) + 1;

  const body = {
    name: 'Center Study Center — corpus index',
    description:
      'Complete archive of Center Study / Generative Anthropology writings: Adam Katz (GABlog, essays, Anthropomorphics), Dennis Bouvard (Substack, threads), Eric Gans (Chronicles of Love and Resentment), and the Anthropoetics journal.',
    home: BASE,
    documentation: `${BASE}/llms.txt`,
    bulkDownload: `${BASE}/api/download?format=json`,
    totalTexts: posts.length,
    sources: counts,
    posts: posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      source: p.source,
      date: p.date ?? null,
      wordCount: p.content.split(/\s+/).length,
      html: `${BASE}/post/${p.slug}`,
      json: `${BASE}/api/corpus/${p.slug}`,
      markdown: `${BASE}/api/corpus/${p.slug}?format=md`,
      text: `${BASE}/api/corpus/${p.slug}?format=txt`,
    })),
  };

  return Response.json(body, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
