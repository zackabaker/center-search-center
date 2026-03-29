import { getAllPosts } from '@/lib/parser';
import { buildSearchEntries, getSignificantTerms } from '@/lib/search-index';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concept Index',
  description: 'A–Z index of significant terms and concepts across the Generative Anthropology archive',
};

export default function ConceptsPage() {
  const posts = getAllPosts();
  const entries = buildSearchEntries(posts);
  const terms = getSignificantTerms(entries, 5, 600);

  // Group by first letter
  const byLetter: Record<string, { term: string; count: number }[]> = {};
  for (const t of terms) {
    const letter = t.term[0].toUpperCase();
    if (!/[A-Z]/.test(letter)) continue;
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(t);
  }
  const letters = Object.keys(byLetter).sort();

  const totalTerms = terms.length;
  const totalPosts = posts.length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Back to search</Link>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Concept Index</h1>
            <p className="text-gray-500 text-sm">
              {totalTerms.toLocaleString()} significant terms across {totalPosts.toLocaleString()} posts.{' '}
              Click any term to search for it.
            </p>
          </div>
          <Link href="/stats" className="text-sm text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
            Corpus stats →
          </Link>
        </div>
      </div>

      {/* Alphabet jump bar */}
      <div className="flex flex-wrap gap-1 mb-8 sticky top-4 z-10 bg-white/90 backdrop-blur py-2 rounded-lg border border-gray-100 px-2">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="text-xs font-mono px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>

      {/* Term grid by letter */}
      <div className="space-y-10">
        {letters.map((letter) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-300 mb-3 border-b border-gray-100 pb-1">{letter}</h2>
            <div className="columns-2 sm:columns-3 md:columns-4 gap-x-6">
              {byLetter[letter]
                .sort((a, b) => a.term.localeCompare(b.term))
                .map(({ term, count }) => (
                  <div key={term} className="break-inside-avoid mb-1.5">
                    <Link
                      href={`/?q=${encodeURIComponent(term)}`}
                      className="group inline-flex items-baseline gap-1.5 text-sm hover:text-blue-600 transition-colors"
                    >
                      <span className="text-gray-800 group-hover:text-blue-600">{term}</span>
                      <span className="text-[10px] text-gray-400 group-hover:text-blue-400">{count}</span>
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-4">
          Terms appearing in at least 5 posts. Numbers indicate post count.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors">
          Search the archive →
        </Link>
      </div>
    </main>
  );
}
