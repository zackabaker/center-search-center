import { getPublicPosts } from '@/lib/parser';
import { openCors, preflight } from '@/lib/cors';
import { buildPhraseRegex, makeSnippet } from '@/lib/phrase-match';

// Full-corpus phrase search with attribution.
//
// The client-side keyword index only phrase-matches the first 20,000 chars of
// each text (267 of ~1,970 posts are longer — 23% of corpus text, concentrated
// in exactly the long texts people quote from). This endpoint scans FULL
// content server-side and returns per-post matches with true counts and a raw
// snippet, so an exact quote from deep in a Chronicle is findable — the core
// promise of a verbatim-first site.
//
// GET /api/grep?q=phrase → { phrase, posts: [{slug,title,source,date,count,snippet}], totalPosts, totalOccurrences }
//
// Matching is punctuation/typography-tolerant: the phrase's words must appear
// in order, separated only by non-alphanumerics (covers curly quotes, dashes,
// line breaks). Open CORS — it serves public text, like /api/corpus.

export const revalidate = 86400;

const MAX_POSTS = 50;

type Hit = { slug: string; title: string; source: string; date: string; count: number; snippet: string };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').slice(0, 300).trim();
  if (q.length < 4) {
    return Response.json({ error: 'q must be at least 4 characters' }, { status: 400, headers: openCors() });
  }

  let re: RegExp;
  try {
    const built = buildPhraseRegex(q);
    if (!built) {
      return Response.json({ error: 'phrase too short or too long' }, { status: 400, headers: openCors() });
    }
    re = built;
  } catch {
    return Response.json({ error: 'invalid phrase' }, { status: 400, headers: openCors() });
  }

  const hits: Hit[] = [];
  let totalOccurrences = 0;
  for (const p of getPublicPosts()) {
    re.lastIndex = 0;
    const first = re.exec(p.content);
    if (!first) continue;
    // Count remaining occurrences without allocating all matches
    let count = 1;
    while (re.exec(p.content) !== null) count++;
    totalOccurrences += count;
    hits.push({
      slug: p.slug,
      title: p.title,
      source: p.source,
      date: p.date ?? '',
      count,
      snippet: makeSnippet(p.content, first.index, first[0].length),
    });
  }

  hits.sort((a, b) => b.count - a.count);

  return Response.json(
    {
      phrase: q,
      totalPosts: hits.length,
      totalOccurrences,
      posts: hits.slice(0, MAX_POSTS),
    },
    {
      headers: openCors({
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      }),
    }
  );
}

export function OPTIONS() {
  return preflight(openCors());
}
