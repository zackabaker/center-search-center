import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide',
  description:
    'How to use the Center Study Center: AI reading paths, the introduction, concepts and glossary, Ask AI, full-text search, and the complete archive.',
};

const RESOURCES = [
  {
    href: '/intro',
    title: 'Introduction',
    body: 'The full introduction to Center Study: the originary hypothesis, the intellectual lineage, and why the discourse is built the way it is. (New here? The 10-minute Start Here is the quicker way in.)',
    cta: 'Read the introduction',
  },
  {
    href: '/ask',
    title: 'Ask AI',
    body: 'Ask any question and get a narrative answer synthesized from the full corpus, with the passages it drew on. The fastest way to test the discourse against your own questions.',
    cta: 'Ask a question',
  },
  {
    href: '/concepts',
    title: 'Concepts & Glossary',
    body: 'The vocabulary, two ways: core concepts treated in depth with archive passages, and a glossary of working terms with usage drawn from the texts.',
    cta: 'Browse the vocabulary',
  },
  {
    href: '/search',
    title: 'Search',
    body: 'Full-text search across 1,900+ texts. Every result links to the exact passage, and any term inside a text links back into the vocabulary.',
    cta: 'Search the archive',
  },
  {
    href: '/browse',
    title: 'Archive',
    body: 'Browse by source (GABlog, Substack, essays, the book, threads), by topic, or by decade — plus the Chronicles of Love & Resentment and Anthropoetics journal archives.',
    cta: 'Browse the archive',
  },
  {
    href: '/download',
    title: 'Download',
    body: 'The full corpus as plain text or markdown — for offline reading, e-readers, or loading into an AI assistant.',
    cta: 'Download the corpus',
  },
  {
    href: '/generative-anthropology',
    title: 'Generative Anthropology',
    body: 'The parent discipline: Eric Gans, the originary hypothesis, and how Center Study extends it. The best single page to share with someone who knows Girard.',
    cta: 'Read the overview',
  },
  {
    href: '/lineage',
    title: 'The Lineage',
    body: 'Girard → Gans → Katz, told in their own words: how mimetic theory became generative anthropology became Center Study.',
    cta: 'Trace the lineage',
  },
  {
    href: '/lectures',
    title: 'Lectures',
    body: 'Five short introductory lectures, in order — the closest thing to a course. Each pairs a talk with the texts it draws on.',
    cta: 'Start the lectures',
  },
  {
    href: '/faq',
    title: 'FAQ',
    body: 'Direct answers to the questions newcomers actually ask — who writes this, how it relates to Girard, where to begin, and what the unusual terms mean.',
    cta: 'Read the FAQ',
  },
];

export default function GuidePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          How to use this site
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          The archive is large — 1,900+ texts over 30 years. These are the ways in,
          roughly in the order a new reader will want them.
        </p>
      </div>

      {/* Flagship: reading paths */}
      <Link
        href="/guide/reading-paths"
        className="block rounded-2xl bg-gray-900 dark:bg-white p-6 mb-8 group transition-transform hover:-translate-y-0.5"
      >
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Reading paths
        </p>
        <h2 className="text-xl font-bold text-white dark:text-gray-900 mb-2">
          Get a personal reading path
        </h2>
        <p className="text-sm text-gray-300 dark:text-gray-600 leading-relaxed max-w-xl mb-3">
          Tell the AI what you work on or what you are stuck on — law, AI, money,
          writing, leadership, anything — and get a sequenced path of 6–10 texts
          built from the archive. The path is saved and follows you from text to
          text, tracking your progress.
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white dark:text-gray-900">
          Build your path
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>

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
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2">
              {r.body}
            </p>
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
