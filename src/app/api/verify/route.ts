import { createHash } from 'crypto';
import { getPublicPosts } from '@/lib/parser';
import { openCors, preflight } from '@/lib/cors';
import { buildPhraseRegex, elisionSegments, makeSnippet } from '@/lib/phrase-match';
import QUOTES from '@/data/quotes.json';

// The public authority function: submit a quote, learn whether Adam Katz /
// Dennis Bouvard or Eric Gans actually wrote it — with attribution.
//
// POST { quote } → {
//   verified, sources: [{ slug, title, source, date, url, snippet }],
//   canonical: "/q/<id>" | null   // when it matches a curated quote page
// }
//
// Unlike /api/verify-quotes (the internal boolean oracle used by Ask), this
// endpoint is open to any origin and returns WHERE the words live. Elided
// quotes ("A … B") verify per segment; attribution comes from the first
// substantial segment. Matching is typography-tolerant via phrase-match.

const MAX_SOURCES = 5;

type Quote = { id: string; text: string };
let _quoteIds: Map<string, string> | null = null;
function quoteIdIndex(): Map<string, string> {
  if (!_quoteIds) {
    _quoteIds = new Map(
      (QUOTES as Quote[]).map((q) => [
        q.text.normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase(),
        q.id,
      ])
    );
  }
  return _quoteIds;
}

export async function POST(request: Request) {
  let quote: unknown;
  try {
    ({ quote } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers: openCors() });
  }
  if (typeof quote !== 'string' || quote.trim().length < 15 || quote.length > 2000) {
    return Response.json(
      { error: 'quote must be a string of 15–2000 characters' },
      { status: 400, headers: openCors() }
    );
  }

  const segments = elisionSegments(quote);
  const targets = segments.length > 0 ? segments : [quote.trim()];

  const regexes = targets.map((t) => buildPhraseRegex(t, 5000));
  if (regexes.some((r) => r === null)) {
    return Response.json(
      { verified: false, sources: [], canonical: null, note: 'quote too short to verify' },
      { headers: openCors() }
    );
  }

  const posts = getPublicPosts();

  // Every segment must appear somewhere in the corpus.
  const perSegment = regexes.map((re) => {
    const hits: { slug: string; index: number; len: number }[] = [];
    for (const p of posts) {
      re!.lastIndex = 0;
      const m = re!.exec(p.content);
      if (m) hits.push({ slug: p.slug, index: m.index, len: m[0].length });
      if (hits.length >= MAX_SOURCES) break;
    }
    return hits;
  });

  const verified = perSegment.every((hits) => hits.length > 0);

  // Attribute from the first segment's hits.
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const sources = verified
    ? perSegment[0].map((h) => {
        const p = bySlug.get(h.slug)!;
        return {
          slug: p.slug,
          title: p.title,
          source: p.source,
          date: p.date ?? null,
          url: `https://center.study/post/${p.slug}`,
          snippet: makeSnippet(p.content, h.index, h.len),
        };
      })
    : [];

  const canonicalId = quoteIdIndex().get(
    (quote as string).normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase()
  );

  return Response.json(
    {
      verified,
      sources,
      canonical: canonicalId ? `/q/${canonicalId}` : null,
      corpusVersion: corpusVersion(),
    },
    { headers: openCors({ 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' }) }
  );
}

// Stable identifier for "verified against which edition" — cheap hash of the
// corpus size + count, computed once per process.
let _cv: string | null = null;
function corpusVersion(): string {
  if (!_cv) {
    const posts = getPublicPosts();
    const totalLen = posts.reduce((n, p) => n + p.content.length, 0);
    _cv = 'v1-' + createHash('sha256').update(`${posts.length}:${totalLen}`).digest('hex').slice(0, 8);
  }
  return _cv;
}

export function OPTIONS() {
  return preflight(openCors());
}
