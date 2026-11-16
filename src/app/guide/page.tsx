import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide',
  description:
    'The ways into the archive: reading paths, concepts and glossary, search, lectures, and the complete text collections.',
};

const RESOURCES = [
  { href: '/guide/reading-paths', title: 'Reading paths', cta: 'Browse the paths' },
  { href: '/concepts', title: 'Concepts & Glossary', cta: 'Browse the vocabulary' },
  { href: '/search', title: 'Search', cta: 'Search the archive' },
  { href: '/ask', title: 'Ask AI', cta: 'Ask a question' },
  { href: '/browse', title: 'Archive', cta: 'Browse the archive' },
  { href: '/lectures', title: 'Lectures', cta: 'Start the lectures' },
  { href: '/lineage', title: 'The Lineage', cta: 'Trace the lineage' },
  { href: '/generative-anthropology', title: 'Generative Anthropology', cta: 'Read the overview' },
  { href: '/companies', title: 'On Companies', cta: 'Read the excerpts' },
  { href: '/faq', title: 'FAQ', cta: 'Read the FAQ' },
  { href: '/download', title: 'Download', cta: 'Download the corpus' },
];

// Topic doors (moved here from the retired /start page) — each runs a search
// across the corpus.
const INTERESTS = [
  { label: 'Language & the sign', q: 'the originary scene' },
  { label: 'AI & data', q: 'artificial intelligence data' },
  { label: 'Money & value', q: 'money debt to the center' },
  { label: 'Sovereignty & succession', q: 'sovereignty succession' },
  { label: 'Religion & the sacred', q: 'the sacred' },
  { label: 'Resentment', q: 'resentment victimary' },
];

export default function GuidePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          How to use this site
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          1,900+ texts over 30 years. The ways in:
        </p>
      </div>

      {/* The rest of the resources */}
      <div className="grid sm:grid-cols-2 gap-x-8 mb-12 border-t border-gray-900 dark:border-gray-200">
        {RESOURCES.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group block py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-serif text-[1.375rem] leading-tight font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {r.title}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {r.cta}
            </span>
          </Link>
        ))}
      </div>

      {/* Topic doors */}
      <section className="mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          By interest
        </h2>
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

      {/* Tips */}
      <section>
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
          Reading tips
        </h2>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          <li className="flex gap-3">
            <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">→</span>
            <span>
              Inside any text, dotted-underlined terms link to the concept and
              glossary pages. Turn these off with the &ldquo;terms&rdquo; toggle in the
              reading controls; following one always offers a one-click way back to
              where you were reading.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">→</span>
            <span>
              Every text has citation, save, and share tools — plus a clean plain-text
              view (add <code className="text-xs">/text</code>{' '}to any post URL, or use the
              corpus API) you can hand to a text-to-speech app or an AI.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">→</span>
            <span>
              Reading controls (top right of any text) set font size and sepia/night
              modes; your preferences persist.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gray-300 dark:text-gray-600 flex-shrink-0">→</span>
            <span>
              Texts you open are remembered locally — your reading path progress and
              saved texts live in your browser, no account needed.
            </span>
          </li>
        </ul>
      </section>
    </main>
  );
}
