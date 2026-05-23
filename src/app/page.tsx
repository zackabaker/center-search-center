import HomeSearch from '@/components/HomeSearch';
import Link from 'next/link';
import { getAllPosts } from '@/lib/parser';

// Revalidate daily — "on this day" section needs to refresh
export const revalidate = 86400;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  pdf: 'PDF',
  book: 'Book',
  lecture: 'Lecture',
};

const SOURCE_COLORS: Record<string, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  lecture:  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

// Curated entry points grouped by reader interest
const FEATURED_GROUPS = [
  {
    label: 'New to Center Study',
    description: 'Start here',
    posts: [
      {
        slug: 'gablog-the-discourse-of-the-center',
        title: 'The Discourse of the Center',
        source: 'gablog',
        description: 'The foundational statement: we are beings bound to the center. Everything else follows from here.',
      },
      {
        slug: 'substack-the-prospects-of-the-hypothesis',
        title: 'The Prospects of the Hypothesis',
        source: 'substack',
        description: 'What it means to carry the originary hypothesis forward, and what kind of thinking it demands.',
      },
      {
        slug: 'substack-the-transdisciplinarity-of-the-hypothesis',
        title: 'The Transdisciplinarity of the Hypothesis',
        source: 'substack',
        description: 'Why the originary hypothesis cuts across every discipline — and why that is not a weakness.',
      },
    ],
  },
  {
    label: 'Political Theory',
    description: 'Center, sovereignty, succession',
    posts: [
      {
        slug: 'pdf-power-and-paradox',
        title: 'Power and Paradox',
        source: 'pdf',
        description: 'The anthropology of power: how authority arises from the originary scene and cannot escape its founding paradox.',
      },
      {
        slug: 'gablog-sovereign-commands-anarchistic-demands',
        title: 'Sovereign Commands, Anarchistic Demands',
        source: 'gablog',
        description: 'The originary distinction between command and demand, and its consequences for political order.',
      },
      {
        slug: 'substack-singularized-succession-in-perpetuity',
        title: 'Singularized Succession in Perpetuity',
        source: 'substack',
        description: 'The central political problem: how power passes without violence. Center Study\'s most urgent proposal.',
      },
    ],
  },
  {
    label: 'AI, Money, Governance',
    description: 'Contemporary applications',
    posts: [
      {
        slug: 'substack-data-exchange',
        title: 'Data Exchange',
        source: 'substack',
        description: 'Converting assets into data: the political economy of the center in the age of AI.',
      },
      {
        slug: 'substack-a-new-model-of-power',
        title: 'A New Model of Power',
        source: 'substack',
        description: 'A concrete proposal for new institutions grounded in the originary hypothesis.',
      },
      {
        slug: 'substack-learncoin',
        title: 'Learncoin',
        source: 'substack',
        description: 'On AI, currency, and the anthropology of value — Center Study applied to the digital economy.',
      },
    ],
  },
];

const BROWSE_SOURCES = [
  { source: 'gablog',    label: 'GABlog',          description: "Katz's theoretical blog — originary grammar in development", color: 'hover:border-blue-400 dark:hover:border-blue-600',   href: '/browse/gablog' },
  { source: 'substack',  label: 'Substack',        description: "Bouvard's applied essays on AI, governance, and technology",  color: 'hover:border-orange-400 dark:hover:border-orange-600', href: '/browse/substack' },
  { source: 'pdf',       label: 'PDFs',             description: 'Academic papers and longer works',                            color: 'hover:border-green-400 dark:hover:border-green-600',   href: '/browse/pdf' },
  { source: 'book',      label: 'Book',             description: 'Anthropomorphics — systematic originary grammar',             color: 'hover:border-purple-400 dark:hover:border-purple-600', href: '/browse/book' },
  { source: 'lecture',   label: 'Lecture Series',   description: 'Five introductory lectures: Origin → Mimetic → Deferral → Center → Sign', color: 'hover:border-amber-400 dark:hover:border-amber-600', href: '/lectures' },
];

export default function Home() {
  // "On this day" — posts published on today's month/day in any past year
  const today = new Date();
  const allPosts = getAllPosts();

  const onThisDay = allPosts.filter((p) => {
    if (!p.date) return false;
    try {
      const d = new Date(p.date);
      return d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
    } catch { return false; }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
          Center Study Center
        </h1>
        <HomeSearch />
      </header>

      {/* Navigation cards — hidden on mobile (bottom nav handles it) */}
      <div className="hidden sm:block max-w-3xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/intro"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            {/* Book-open icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Start</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Introduction to Center Study</p>
            </div>
          </Link>
          <Link
            href="/ask"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            {/* Chat-bubble icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Ask AI</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Get a narrative answer</p>
            </div>
          </Link>
          <Link
            href="/concepts"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            {/* Tag/label icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Concepts</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Key vocabulary index</p>
            </div>
          </Link>
          <Link
            href="/guide/reading-paths"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            {/* Map/path icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6-3m0 13l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 10m0-3v13" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Reading Paths</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Curated reading sequences</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured posts — grouped by reader interest */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Start reading</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Curated entry points by topic</p>
            </div>
            <Link href="/search" className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Browse all texts →
            </Link>
          </div>

          <div className="space-y-8">
            {FEATURED_GROUPS.map((group, idx) => (
              <div key={group.label} className={idx > 0 ? 'hidden sm:block' : ''}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h3 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    {group.label}
                  </h3>
                  <span className="text-xs text-gray-300 dark:text-gray-700">{group.description}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.posts.map((post) => (
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
            ))}
          </div>
        </div>
      </div>

      {/* Browse by source — hidden on mobile (Browse tab handles it) */}
      <div className="hidden sm:block border-t border-gray-100 dark:border-gray-800">
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
            {BROWSE_SOURCES.map(({ source, label, description, color, href }) => (
              <Link
                key={source}
                href={href}
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
