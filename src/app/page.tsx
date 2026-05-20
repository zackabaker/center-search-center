import HomeSearch from '@/components/HomeSearch';
import DarkModeToggle from '@/components/DarkModeToggle';
import RandomPostButton from '@/components/RandomPostButton';
import Link from 'next/link';
import { getAllPosts } from '@/lib/parser';

// Revalidate daily — "on this day" section needs to refresh
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

const BROWSE_SOURCES = [
  { source: 'gablog',    label: 'GABlog',       description: "Katz's theoretical blog — originary grammar in development", color: 'hover:border-blue-400 dark:hover:border-blue-600' },
  { source: 'substack',  label: 'Substack',     description: "Bouvard's applied essays on AI, governance, and technology",  color: 'hover:border-orange-400 dark:hover:border-orange-600' },
  { source: 'pdf',       label: 'PDFs',          description: 'Academic papers, lectures, and longer works',                  color: 'hover:border-green-400 dark:hover:border-green-600' },
  { source: 'book',      label: 'Book',          description: 'Anthropomorphics — systematic originary grammar',              color: 'hover:border-purple-400 dark:hover:border-purple-600' },
  { source: 'reddit',    label: 'Reddit',        description: 'Discussions from r/Absolutistneoreaction',                     color: 'hover:border-red-400 dark:hover:border-red-600' },
  { source: 'twitter',   label: 'X / Twitter',   description: 'Threads and notes',                                            color: 'hover:border-slate-400 dark:hover:border-slate-600' },
];

export default function Home() {
  // "On this day" — posts published on today's month/day in any past year
  const today = new Date();
  const allPosts = getAllPosts();

  // Slugs for random post button — exclude twitter/reddit (too short)
  const randomSlugs = allPosts
    .filter((p) => p.source !== 'twitter' && p.source !== 'reddit')
    .map((p) => p.slug);
  const onThisDay = allPosts.filter((p) => {
    if (!p.date) return false;
    try {
      const d = new Date(p.date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    } catch { return false; }
  });

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
            <Link href="/browse/gablog" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Browse
            </Link>
            <Link href="/guide/timeline" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Timeline
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          <RandomPostButton slugs={randomSlugs} />
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

      {/* Browse by source */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Browse by source</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Explore the full archive organized by where it came from</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/author/katz" className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Katz →
              </Link>
              <Link href="/author/bouvard" className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Bouvard →
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BROWSE_SOURCES.map(({ source, label, description, color }) => (
              <Link
                key={source}
                href={`/browse/${source}`}
                className={`group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 ${color} hover:shadow-sm transition-all bg-white dark:bg-gray-900`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* On this day */}
      {onThisDay.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">On this day</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Published on {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} in past years
              </p>
            </div>
            <div className="space-y-2">
              {onThisDay.map((post) => (
                <Link
                  key={post.slug}
                  href={`/post/${post.slug}`}
                  className="group flex items-center gap-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <span className="text-xs text-gray-400 w-10 shrink-0 font-mono">
                    {new Date(post.date!).getFullYear()}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600'}`}>
                    {SOURCE_LABELS[post.source] || post.source}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {post.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
