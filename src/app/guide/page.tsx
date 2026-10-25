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
  { href: '/faq', title: 'FAQ', cta: 'Read the FAQ' },
  { href: '/download', title: 'Download', cta: 'Download the corpus' },
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
      <div className="grid sm:grid-cols-2 gap-3 mb-12">
        {RESOURCES.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1.5">
              {r.title}
            </h3>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {r.cta} →
            </span>
          </Link>
        ))}
      </div>

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
