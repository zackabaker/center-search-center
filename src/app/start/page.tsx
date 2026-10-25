import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Here — Center Study',
  description: 'Doors into the Center Study archive: lineage, lectures, concepts, search, browse, FAQ.',
};

// Door links — titles only.
const DOORS = [
  { href: '/lectures', label: 'Lecture series' },
  { href: '/concepts', label: 'Concepts' },
  { href: '/search', label: 'Search' },
  { href: '/browse', label: 'Browse' },
  { href: '/faq', label: 'FAQ' },
];

// Topic doors — each runs a search across the corpus.
const INTERESTS = [
  { label: 'Language & the sign', q: 'the originary scene' },
  { label: 'AI & data', q: 'artificial intelligence data' },
  { label: 'Money & value', q: 'money debt to the center' },
  { label: 'Sovereignty & succession', q: 'sovereignty succession' },
  { label: 'Religion & the sacred', q: 'the sacred' },
  { label: 'Resentment', q: 'resentment victimary' },
];

const sectionLabel = 'text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3';

export default function StartPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-gray-900 dark:text-white">
        Start Here
      </h1>

      {/* The lineage door */}
      <section className="mb-10">
        <Link
          href="/lineage"
          className="group block p-4 rounded-xl border border-gray-900 dark:border-gray-200 bg-gray-900 dark:bg-gray-900 hover:opacity-90 transition-opacity"
        >
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase tracking-widest">The Lineage</p>
          <p className="font-semibold text-white leading-snug group-hover:text-blue-300 dark:group-hover:text-blue-400 transition-colors">
            Girard → Gans → Katz
          </p>
        </Link>
      </section>

      {/* Doors */}
      <section className="mb-10">
        <p className={sectionLabel}>Go deeper</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DOORS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{d.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Interests */}
      <section className="mb-12">
        <p className={sectionLabel}>Interests</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((t) => (
            <Link
              key={t.label}
              href={`/search?q=${encodeURIComponent(t.q)}`}
              className="text-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
