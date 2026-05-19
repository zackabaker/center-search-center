import HomeSearch from '@/components/HomeSearch';
import DarkModeToggle from '@/components/DarkModeToggle';
import Link from 'next/link';

// Cache this page for 24 hours — no need to re-parse the corpus on every visit
export const revalidate = 86400;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  pdf: 'PDF',
  book: 'Book',
};

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

// Hand-picked entry points — good starting places for a new reader
const FEATURED = [
  {
    slug: 'substack-the-prospects-of-the-hypothesis',
    title: 'The Prospects of the Hypothesis',
    source: 'substack',
    description: 'What it means to carry the originary hypothesis forward, and what kind of thinking it demands.',
  },
  {
    slug: 'pdf-power-and-paradox',
    title: 'Power and Paradox',
    source: 'pdf',
    description: 'A systematic account of power from the originary scene through sovereignty and political order.',
  },
  {
    slug: 'substack-learncoin',
    title: 'Learncoin',
    source: 'substack',
    description: 'On AI, currency, and the anthropology of value — Center Study applied to the digital economy.',
  },
  {
    slug: 'substack-originary-hypothesis-as-mobius-strip',
    title: 'Originary Hypothesis as Möbius Strip',
    source: 'substack',
    description: 'The paradox at the origin: why the hypothesis repels the very understanding it demands.',
  },
  {
    slug: 'gablog-sovereign-commands-anarchistic-demands',
    title: 'Sovereign Commands, Anarchistic Demands',
    source: 'gablog',
    description: 'The originary distinction between command and demand, and its consequences for political thought.',
  },
  {
    slug: 'gablog-power-and-paradox',
    title: 'Power and Paradox',
    source: 'gablog',
    description: 'Katz on the irreducible paradox of power: how authority is constituted through the very resentment it generates.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Top nav */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
            Center Study Center
          </span>
          <div className="flex items-center gap-4">
            <Link href="/intro" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Intro
            </Link>
            <Link href="/ask" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Ask AI
            </Link>
            <Link href="/guide/concepts" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Concepts
            </Link>
            <Link href="/reading-list" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Reading List
            </Link>
            <Link href="/download" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Download
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
          Center Study Center
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-8 max-w-lg mx-auto leading-relaxed">
          &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it&rdquo;
        </p>

        <HomeSearch />
      </header>

      {/* Navigation cards */}
      <div className="max-w-3xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/intro"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <span className="text-xl">📖</span>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Intro</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Introduction to Center Study</p>
            </div>
          </Link>
          <Link
            href="/ask"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-900 dark:border-white bg-gray-900 dark:bg-white hover:opacity-80 transition-all"
          >
            <span className="text-xl">💬</span>
            <div className="text-center">
              <p className="text-sm font-medium text-white dark:text-gray-900">Ask AI</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 hidden sm:block">Quotes from the archive</p>
            </div>
          </Link>
          <Link
            href="/guide/concepts"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <span className="text-xl">🗂</span>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Concepts</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Key vocabulary index</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured posts */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Start reading</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">A few good entry points into the archive</p>
            </div>
            <Link href="/search" className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Browse all texts →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[post.source]}`}>
                    {SOURCE_LABELS[post.source]}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
