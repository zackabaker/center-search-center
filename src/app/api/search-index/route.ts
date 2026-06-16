import { getPublicPosts } from '@/lib/parser';
import { ARCHIVAL_SOURCES } from '@/lib/types';
import { buildSearchEntries } from '@/lib/search-index';

// The client-side search index as a separately cached JSON document.
// Previously this was serialized into the /search page HTML (~16 MB),
// blocking first paint. As a separate fetch it loads async, gzips well,
// and the browser + CDN cache it across visits.

export const revalidate = 3600;

export async function GET(request: Request) {
  // Default scope is the core corpus (+ threads, which are filtered in/out
  // client-side). scope=archives returns the Chronicles + AP Journal index,
  // fetched lazily only when the reader toggles those sources into search.
  const scope = new URL(request.url).searchParams.get('scope');
  const wantArchives = scope === 'archives';

  const posts = getPublicPosts()
    .filter((p) => wantArchives ? ARCHIVAL_SOURCES.includes(p.source) : !ARCHIVAL_SOURCES.includes(p.source))
    .sort((a, b) => {
      if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return a.title.localeCompare(b.title);
    });

  const entries = buildSearchEntries(posts);

  // The archive index is large (850+ Chronicles); trim per-entry snippet text
  // to keep the lazy payload reasonable. Word-level matching is unaffected
  // (contentWords is built from the full text); only phrase/snippet matching
  // is limited to the opening of each archival text.
  if (wantArchives) {
    for (const e of entries) e.snippetContent = e.snippetContent.slice(0, 8000);
  }

  return Response.json(
    { entries, totalPosts: posts.length },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
