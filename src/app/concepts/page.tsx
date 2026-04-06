import { getAllPosts } from '@/lib/parser';
import { buildSearchEntries, getSignificantTerms, GA_DOMAIN_VOCAB } from '@/lib/search-index';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concept Index',
  description: 'A–Z index of Center Study concepts and terms across the archive',
};

const CORE_CONCEPTS: { label: string; query: string }[] = [
  { label: 'The Center', query: 'What is "the center" in Center Study?' },
  { label: 'Originary Scene', query: 'What is the originary scene in Center Study?' },
  { label: 'Deferral', query: 'What is deferral in Center Study?' },
  { label: 'Desire', query: 'What is desire and mimetic desire in Center Study?' },
  { label: 'Resentment', query: 'What is resentment in Center Study?' },
  { label: 'The Periphery', query: 'What is the periphery in Center Study?' },
  { label: 'Idiom', query: 'What is idiom in Center Study?' },
  { label: 'The Scenic', query: 'What is the scenic in Center Study?' },
  { label: 'Singularized Succession in Perpetuity', query: 'What is singularized succession in perpetuity in Center Study?' },
  { label: 'The Victimary', query: 'What is the victimary in Center Study?' },
  { label: 'Originary Hypothesis', query: 'What is the originary hypothesis in Center Study?' },
  { label: 'The Ostensive', query: 'What is the ostensive sign in Center Study?' },
  { label: 'The Imperative', query: 'What is the imperative sign in Center Study?' },
  { label: 'The Declarative', query: 'What is the declarative sign in Center Study?' },
  { label: 'Originary Grammar', query: 'What is originary grammar in Center Study?' },
];

export default function ConceptsPage() {
  const posts = getAllPosts();
  const entries = buildSearchEntries(posts);
  const terms = getSignificantTerms(entries, 2, 800);

  // Tag each term as a core GA glossary term or a corpus-derived term
  const tagged = terms.map(({ term, count }) => {
    const isGlossary =
      GA_DOMAIN_VOCAB.has(term) ||
      [...GA_DOMAIN_VOCAB].some(
        (v) => (v.length >= 6 && term.startsWith(v)) || (term.length >= 6 && v.startsWith(term))
      );
    return { term, count, isGlossary };
  });

  // Group by first letter
  const byLetter: Record<string, { term: string; count: number; isGlossary: boolean }[]> = {};
  for (const t of tagged) {
    const letter = t.term[0].toUpperCase();
    if (!/[A-Z]/.test(letter)) continue;
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(t);
  }
  const letters = Object.keys(byLetter).sort();

  const totalTerms = tagged.length;
  const glossaryTerms = tagged.filter((t) => t.isGlossary).length;
  const totalPosts = posts.length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Back to search</Link>
        <div className="flex items-end justify-between mt-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Concept Index</h1>
            <p className="text-gray-500 text-sm">
              {totalTerms.toLocaleString()} terms across {totalPosts.toLocaleString()} posts —
              focused on the vocabulary of Center Study.
            </p>
          </div>
          <Link href="/stats" className="text-sm text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
            Corpus stats →
          </Link>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Center Study glossary term ({glossaryTerms})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-300" />
            Corpus term ({totalTerms - glossaryTerms})
          </span>
          <span className="ml-auto">Numbers = post count · Click to search</span>
        </div>
      </div>

      {/* Core Concepts */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Core Concepts</h2>
        <div className="flex flex-wrap gap-2">
          {CORE_CONCEPTS.map(({ label, query }) => (
            <Link
              key={label}
              href={`/ask?q=${encodeURIComponent(query)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all text-sm text-gray-800 group"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
              {label}
              <svg className="h-3 w-3 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
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
                .map(({ term, count, isGlossary }) => (
                  <div key={term} className="break-inside-avoid mb-1.5">
                    <Link
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="group inline-flex items-baseline gap-1.5 text-sm hover:text-blue-600 transition-colors"
                    >
                      <span
                        className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 self-center mr-0.5 ${
                          isGlossary ? 'bg-blue-400' : 'bg-gray-300'
                        }`}
                      />
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
          Blue dots mark terms from the{' '}
          <a
            href="https://theglossary.home.blog/generative-anthropology/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Center Study Glossary
          </a>
          . Numbers indicate how many posts contain the term.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 transition-colors">
          Search the archive →
        </Link>
      </div>
    </main>
  );
}
