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

  let entries = buildSearchEntries(posts);
  // scope=lite: title-searchable skeleton (~2% of the full payload) so the
  // first search is instant; the client streams the full index behind it.
  if (scope === 'lite') {
    entries = entries.map((e) => ({ ...e, contentWords: [], snippetContent: '', excerpt: '' }));
  }

  // The archive index covers 1,070 texts (855 Chronicles + 215 AP) and is
  // opt-in/secondary, so it's trimmed hard to keep the lazy download small
  // (was ~6.5 MB gzip). contentWords — the per-post unique-word list that
  // drives matching — is the bulk, so it's capped to the first 300 words of
  // each text; snippetContent (phrase match + snippet display) to 2,500 chars.
  // Effect: archive search matches on each text's opening (~first 1,000 words),
  // where the subject is established. The PRIMARY corpus is indexed in full.
  if (wantArchives) {
    for (const e of entries) {
      e.snippetContent = e.snippetContent.slice(0, 2500);
      e.contentWords = e.contentWords.slice(0, 300);
    }
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
