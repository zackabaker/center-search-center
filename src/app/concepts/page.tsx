import { CONCEPTS } from '@/data/guide/concepts';
import { GLOSSARY } from '@/data/guide/glossary';
import GlossaryClient from '@/components/GlossaryClient';
import BackToReading from '@/components/BackToReading';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concepts & Glossary',
  description: 'Core Center Study concepts and a glossary of working terms, each defined with verbatim passages from the corpus.',
  alternates: { canonical: 'https://center.study/concepts' },
};

// ── Core Concepts tier structure (from /guide/concepts) ─────────────────────
const TIERS = [
  {
    label: 'The Scene and Its Elements',
    slugs: ['originary-scene', 'the-event', 'the-center', 'deferral', 'the-sacred', 'mimesis', 'desire', 'charisma', 'ritual', 'sparagmos'],
  },
  {
    label: 'Language and Grammar',
    slugs: ['ostensive-imperative-declarative', 'originary-grammar', 'the-sign', 'narrative', 'idiom', 'idiomclining'],
  },
  {
    label: 'Order and Distribution',
    slugs: ['nomos', 'succession', 'firstness', 'sovereignty', 'power', 'the-juridical', 'debt-and-credit', 'money', 'capital', 'big-man', 'omnicentrism'],
  },
  {
    label: 'Practice and Institution',
    slugs: ['scenic-design', 'technology', 'anthropomorphics', 'media', 'the-market', 'disciplinarity', 'justice', 'pointman-uninsurable', 'attentionality'],
  },
  {
    label: 'Pathology and Critique',
    slugs: ['resentment-victimary', 'scapegoating', 'liberalism', 'katechon'],
  },
];

type View = 'core' | 'glossary';

export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view: View = rawView === 'glossary' ? 'glossary' : 'core';

  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ← Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Concepts &amp; Glossary</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The vocabulary of Center Study — core concepts treated in depth, and a glossary
          of {GLOSSARY.length} working terms with usage drawn from the corpus.
        </p>
      </div>

      {/* Shown when the reader arrived from a post via a term link */}
      <BackToReading />

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        <Link
          href="/concepts"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap shrink-0 transition-colors -mb-px ${
            view === 'core'
              ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
              : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Core Concepts
        </Link>
        <Link
          href="/concepts?view=glossary"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap shrink-0 transition-colors -mb-px ${
            view === 'glossary'
              ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
              : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Glossary
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

    </main>
  );
}
