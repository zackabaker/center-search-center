import Link from 'next/link';
import { CONCEPTS } from '@/data/guide/concepts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concept Pages — Introduction to Center Study',
  description: 'Core concepts of Center Study — each with originary definition, archive development, and exemplary passages.',
};

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

export default function ConceptsIndexPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <Link href="/guide" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          ← Introduction
        </Link>
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-4 mb-2">Layer II · Imperative</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Concept Pages</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          Attend to each concept. Not as a definition to be memorized but as a directed act of naming — pointing at something in the archive that was always there but needed a name. Each page links to the posts where the concept is most developed. Follow the links.
        </p>
      </div>

      <div className="space-y-10">
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{concept!.definition}</p>
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

      <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Link href="/guide/map" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all concepts as an interactive map →
        </Link>
      </div>
    </main>
  );
}
