import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developers & AI agents',
  description:
    'The center.study public API: full-text corpus access, semantic search, server-side embeddings, feeds, and the corpus manifest — open CORS, no keys, built for AI agents.',
  alternates: { canonical: 'https://center.study/developers' },
};

const H = 'text-xl font-semibold mt-10 mb-3 text-gray-900 dark:text-white';
const P = 'text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl';
const CODE = 'block text-[13px] leading-relaxed bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-x-auto font-mono text-gray-800 dark:text-gray-200 mb-4';

export default function DevelopersPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Developers &amp; AI agents</h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-6">
        No API keys; open CORS on all read endpoints. Machine-readable
        spec at <a href="/openapi.json" className="text-blue-600 dark:text-blue-400 hover:underline">/openapi.json</a>,
        orientation for LLMs at <a href="/llms.txt" className="text-blue-600 dark:text-blue-400 hover:underline">/llms.txt</a>.
      </p>

      <h2 className={H}>Corpus</h2>
      <pre className={CODE}>{`# list all texts (slug, title, source, date, words)
curl https://center.study/api/corpus

# one text — JSON with full content + format links
curl https://center.study/api/corpus/the-discourse-of-the-center

# plain text / markdown renditions
curl "https://center.study/api/corpus/the-discourse-of-the-center?format=txt"

# versioned manifest with per-text SHA-256 (Corpus v1.0)
curl https://center.study/corpus-manifest.json`}</pre>

      <h2 className={H}>Semantic search</h2>
      <p className={P}>
        Embedding happens server-side (bge-small); you send plain text.
      </p>
      <pre className={CODE}>{`curl -X POST https://center.study/api/semantic \\
  -H "content-type: application/json" \\
  -d '{"q": "how does money relate to the sacred", "full": true}'
# → { results: [{ slug, title, source, text, score }] }  (top ~24 passages)

# raw 384-dim query embedding, if you want to do your own math
curl -X POST https://center.study/api/embed \\
  -H "content-type: application/json" -d '{"q": "deferral"}'`}</pre>

      <h2 className={H}>Verbatim search &amp; quote verification</h2>
      <p className={P}>
        Both endpoints are open to any origin.
      </p>
      <pre className={CODE}>{`# find an exact phrase anywhere in the corpus (typography-tolerant)
curl "https://center.study/api/grep?q=the%20deferral%20of%20violence"
# → { phrase, totalPosts, totalOccurrences, posts: [{ slug, title, source, date, count, snippet }] }

# verify a quote verbatim, with sources ("A … B" verifies per segment)
curl -X POST https://center.study/api/verify \\
  -H "content-type: application/json" \\
  -d '{"quote": "the deferral of violence through representation"}'
# → { verified, sources: [{ slug, title, url, snippet, date }], canonical }
# canonical points at the /q/<id> quote page when the quote is a curated one`}</pre>

      <h2 className={H}>Structured vocabulary</h2>
      <p className={P}>
        Concept and glossary pages carry DefinedTerm JSON-LD; every definition is a verbatim corpus quote.
      </p>
      <pre className={CODE}>{`https://center.study/concepts           # concept hubs (DefinedTerm JSON-LD on each)
https://center.study/concepts/glossary  # term glossary with sources`}</pre>

      <h2 className={H}>Feeds &amp; discovery</h2>
      <pre className={CODE}>{`https://center.study/feed.xml          # everything
https://center.study/feed/substack     # per-source (gablog, chronicle, ap, …)
https://center.study/new               # latest additions (HTML)
https://center.study/sitemap.xml       # ~2,100 URLs
https://center.study/llms.txt          # orientation for language models`}</pre>

      <h2 className={H}>Ground rules</h2>
      <p className={P}>
        Quote verbatim and link the source text (every paragraph has a stable{' '}
        <code className="text-sm">#p-N</code>{' '}anchor). Cite the edition as{' '}
        <em>Center Study Corpus</em>{' '}v1.0 (2026) — see{' '}
        <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">about</Link>.
        Rate limits apply; identify your agent in the User-Agent string.
      </p>
    </main>
  );
}
