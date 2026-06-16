import { getPublicPosts } from '@/lib/parser';
import { isSameOrigin } from '@/lib/rate-limit';

// Verifies that quoted strings exist VERBATIM in the corpus.
// POST { quotes: string[] } → { verified: boolean[] }
//
// Used by Ask AI after an answer finishes streaming — one request per
// completed answer, never on page loads. Costs no AI tokens; the check is
// a normalized substring search against a module-cached corpus string.

let _normCorpus: string | null = null;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getNormCorpus(): string {
  if (_normCorpus === null) {
    // ~30 MB normalized; built once per server process, same lifecycle as
    // the posts cache itself. V8 substring search over it takes ~10-50 ms.
    _normCorpus = getPublicPosts().map((p) => normalize(p.content)).join('\n');
  }
  return _normCorpus;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let quotes: unknown;
  try {
    ({ quotes } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!Array.isArray(quotes) || quotes.length === 0 || quotes.length > 30) {
    return Response.json({ error: 'quotes must be an array of 1-30 strings' }, { status: 400 });
  }

  const corpus = getNormCorpus();
  const verified = quotes.map((q) => {
    if (typeof q !== 'string' || q.length < 20 || q.length > 1000) return false;
    const nq = normalize(q);
    if (nq.length < 15) return false;
    return corpus.includes(nq);
  });

  return Response.json({ verified });
}
