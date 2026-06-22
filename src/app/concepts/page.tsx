import { getAllPosts, getPublicPosts } from '@/lib/parser';
import { buildSearchEntries, getSignificantTerms, GA_DOMAIN_VOCAB } from '@/lib/search-index';
import { CONCEPTS, TERM_TO_CONCEPT_SLUG } from '@/data/guide/concepts';
import { GLOSSARY } from '@/data/guide/glossary';
import GlossaryClient from '@/components/GlossaryClient';
import BackToReading from '@/components/BackToReading';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concepts & Glossary | Center Study Center',
  description: 'Core Center Study concepts with archive passages — plus an A–Z index of every significant term across the corpus.',
};

// ── Core Concepts tier structure (from /guide/concepts) ─────────────────────
const TIERS = [
  {
    label: 'The Scene and Its Elements',
    slugs: ['originary-scene', 'the-center', 'deferral', 'the-sacred', 'mimesis', 'desire', 'ritual', 'sparagmos'],
  },
  {
    label: 'Language and Grammar',
    slugs: ['ostensive-imperative-declarative', 'originary-grammar', 'the-sign', 'idiom'],
  },
  {
    label: 'Order and Distribution',
    slugs: ['nomos', 'succession', 'the-juridical', 'debt-and-credit', 'big-man', 'omnicentrism'],
  },
  {
    label: 'Practice and Institution',
    slugs: ['scenic-design', 'anthropomorphics', 'pointman-uninsurable', 'attentionality'],
  },
  {
    label: 'Pathology and Critique',
    slugs: ['resentment-victimary'],
  },
];

type View = 'core' | 'glossary' | 'az';

export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view: View = rawView === 'az' ? 'az' : rawView === 'glossary' ? 'glossary' : 'core';

  // Only run the expensive A–Z computation when that tab is active
  let azData: {
    byLetter: Record<string, { term: string; count: number; isGlossary: boolean }[]>;
    letters: string[];
    totalTerms: number;
    glossaryTerms: number;
    totalPosts: number;
  } | null = null;

  if (view === 'az') {
    const posts = getPublicPosts();
    const entries = buildSearchEntries(posts);
    const terms = getSignificantTerms(entries, 2, 800);

    const tagged = terms.map(({ term, count }) => {
      const isGlossary =
        GA_DOMAIN_VOCAB.has(term) ||
        [...GA_DOMAIN_VOCAB].some(
          (v) => (v.length >= 6 && term.startsWith(v)) || (term.length >= 6 && v.startsWith(term))
        );
      return { term, count, isGlossary };
    });

    const byLetter: Record<string, { term: string; count: number; isGlossary: boolean }[]> = {};
    for (const t of tagged) {
      const letter = t.term[0].toUpperCase();
      if (!/[A-Z]/.test(letter)) continue;
      if (!byLetter[letter]) byLetter[letter] = [];
      byLetter[letter].push(t);
    }

    azData = {
      byLetter,
      letters: Object.keys(byLetter).sort(),
      totalTerms: tagged.length,
      glossaryTerms: tagged.filter((t) => t.isGlossary).length,
      totalPosts: posts.length,
    };
  }

  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ← Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Concepts &amp; Glossary</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The vocabulary of Center Study — core concepts treated in depth, a glossary
          of {GLOSSARY.length} working terms with usage from the corpus, and an A–Z index.
        </p>
      </div>

      {/* Shown when the reader arrived from a post via a term link */}
      <BackToReading />

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
        <Link
          href="/concepts"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            view === 'core'
              ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
              : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Core Concepts
        </Link>
        <Link
          href="/concepts?view=glossary"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            view === 'glossary'
              ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
              : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Glossary
        </Link>
        <Link
          href="/concepts?view=az"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            view === 'az'
              ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
              : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          A–Z Index
        </Link>
        <Link
          href="/guide/map"
          className="px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors -mb-px inline-flex items-center gap-1"
        >
          Concept Map
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* ── Glossary tab ──────────────────────────────────────────────────── */}
      {view === 'glossary' && <GlossaryClient entries={GLOSSARY} />}

      {/* ── Core Concepts tab ─────────────────────────────────────────────── */}
      {view === 'core' && (
        <div className="space-y-10">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Each concept page collects real passages from the archive where the concept is named and
            developed. Follow the links. The definitions are in the texts themselves.
          </p>
          {TIERS.map(({ label, slugs }) => {
            const tierConcepts = slugs.map((s) => CONCEPTS.find((c) => c.slug === s)).filter(Boolean);
            return (
              <section key={label}>
                <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  {label}
                </h2>
                <div className="space-y-2">
                  {tierConcepts.map((concept) => (
                    <Link
                      key={concept!.slug}
                      href={`/guide/concepts/${concept!.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {concept!.title}
                          </h3>
                          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">{concept!.subtitle}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {concept!.passages[0]
                            ? `"${concept!.passages[0].text.slice(0, 120)}${concept!.passages[0].text.length > 120 ? '…' : ''}"`
                            : concept!.subtitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400 dark:text-gray-500">{concept!.posts.length} posts</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── A–Z Index tab ─────────────────────────────────────────────────── */}
      {view === 'az' && azData && (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-6 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              Center Study glossary term ({azData.glossaryTerms})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              Corpus term ({azData.totalTerms - azData.glossaryTerms})
            </span>
            <span className="ml-auto text-gray-400">{azData.totalTerms.toLocaleString()} terms across {azData.totalPosts.toLocaleString()} posts — click any term to Ask AI</span>
          </div>

          {/* Alphabet jump bar */}
          <div className="flex flex-wrap gap-1 mb-8 sticky top-4 z-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur py-2 rounded-lg border border-gray-100 dark:border-gray-800 px-2">
            {azData.letters.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="text-xs font-mono px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Term grid by letter */}
          <div className="space-y-10">
            {azData.letters.map((letter) => (
              <section key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                <h2 className="text-xl font-bold text-gray-200 dark:text-gray-700 mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">{letter}</h2>
                <div className="columns-2 sm:columns-3 md:columns-4 gap-x-6">
                  {azData!.byLetter[letter]
                    .sort((a, b) => a.term.localeCompare(b.term))
                    .map(({ term, count, isGlossary }) => {
                      // Prefer concept page, fall back to Ask AI
                      const conceptSlug = TERM_TO_CONCEPT_SLUG[term.toLowerCase()];
                      const href = conceptSlug
                        ? `/guide/concepts/${conceptSlug}`
                        : `/ask?q=${encodeURIComponent(`What is "${term}" in Center Study?`)}`;
                      return (
                        <div key={term} className="break-inside-avoid mb-1.5">
                          <Link
                            href={href}
                            className="group inline-flex items-baseline gap-1.5 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 self-center mr-0.5 ${isGlossary ? 'bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <span className="text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{term}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-blue-400 dark:group-hover:text-blue-500">{count}</span>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Blue dots mark terms from the{' '}
              <a href="https://theglossary.home.blog/generative-anthropology/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Center Study Glossary
              </a>
              . Numbers = posts containing the term.
            </p>
          </div>
        </>
      )}

    </main>
  );
}
