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
        The whole corpus — 1,969 texts, 5M+ words of Center Study and Generative Anthropology —
        is open for programmatic use. No API keys. Open CORS on all read endpoints. Machine-readable
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
        Query the corpus by meaning. Embedding happens server-side (bge-small); you send plain text.
      </p>
      <pre className={CODE}>{`curl -X POST https://center.study/api/semantic \\
  -H "content-type: application/json" \\
  -d '{"q": "how does money relate to the sacred", "full": true}'
# → { results: [{ slug, title, source, text, score }] }  (top ~24 passages)

# raw 384-dim query embedding, if you want to do your own math
curl -X POST https://center.study/api/embed \\
  -H "content-type: application/json" -d '{"q": "deferral"}'`}</pre>

      <h2 className={H}>Ask (synthesized answers)</h2>
      <p className={P}>
        POST <code className="text-sm">{`{ message }`}</code> to <code className="text-sm">/api/chat</code> for a streamed,
        verbatim-cited answer (ndjson: first line <code className="text-sm">{`{sources}`}</code>, then{' '}
        <code className="text-sm">{`{text}`}</code> deltas). Each call bills a model request, so browser use is limited
        to first-party origins; server-to-server calls are rate-limited. Want your origin allowlisted? Ask via <Link href="/follow" className="text-blue-600 dark:text-blue-400 hover:underline">the contact channels</Link>.
        Twenty canonical questions are pre-answered as static pages under{' '}
        <Link href="/answers" className="text-blue-600 dark:text-blue-400 hover:underline">/answers</Link>.
      </p>

      <h2 className={H}>Structured vocabulary</h2>
      <pre className={CODE}>{`# 175 term definitions (verbatim quotes + sources) driving the site's hover cards
curl https://center.study/api/corpus  # texts
curl https://center.study/concepts    # 41 concept hubs (DefinedTerm JSON-LD on each)
# term → definition payload used by the site itself:
curl https://center.study/_next/data 2>/dev/null || true  # or fetch /guide/concepts/[slug] pages`}</pre>

      <h2 className={H}>Feeds &amp; discovery</h2>
      <pre className={CODE}>{`https://center.study/feed.xml          # everything
https://center.study/feed/substack     # per-source (gablog, chronicle, ap, …)
https://center.study/new               # latest additions (HTML)
https://center.study/sitemap.xml       # ~2,100 URLs
https://center.study/llms.txt          # orientation for language models`}</pre>

      <h2 className={H}>Ground rules</h2>
      <p className={P}>
        Quote verbatim and link the source text (every paragraph has a stable{' '}
        <code className="text-sm">#p-N</code> anchor). Cite the edition as{' '}
        <em>Center Study Corpus</em> v1.0 (2026) — see{' '}
        <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">about</Link>. Rate limits are
        generous but present; be a good citizen and identify your agent in the User-Agent string.
      </p>
    </main>
  );
}
