import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Archive — Center Study Center',
  description: 'Browse the complete Center Study archive: GABlog, Substack, PDFs, Anthropomorphics, Reddit, and Twitter.',
};

export const revalidate = 3600;

const SOURCES = [
  {
    slug: 'gablog',
    label: 'GABlog',
    author: 'Adam Katz',
    description: 'The primary theoretical blog — originary grammar, the center through history, scenic design, succession, and more. 25+ years of continuous development.',
    color: 'border-blue-200 dark:border-blue-900/50 hover:border-blue-400 dark:hover:border-blue-600',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-400',
  },
  {
    slug: 'substack',
    label: 'Substack',
    author: 'Dennis Bouvard (Adam Katz)',
    description: 'Applied Center Study: AI, governance, money, media, succession, contemporary politics. Written under the pen name Dennis Bouvard.',
    color: 'border-orange-200 dark:border-orange-900/50 hover:border-orange-400 dark:hover:border-orange-600',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    dot: 'bg-orange-400',
  },
  {
    slug: 'pdf',
    label: 'PDFs',
    author: 'Adam Katz',
    description: 'Academic papers, lectures, and longer works. Includes The Anthropoetics of Power, Originary Technics, Attentionality and Originary Ethics, and more.',
    color: 'border-green-200 dark:border-green-900/50 hover:border-green-400 dark:hover:border-green-600',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    dot: 'bg-green-400',
  },
  {
    slug: 'book',
    label: 'Anthropomorphics',
    author: 'Adam Katz',
    description: 'The systematic treatment — an originary grammar of the center. Derives language, personhood, institutions, and the human sciences from the originary scene.',
    color: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-600',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    dot: 'bg-purple-400',
  },
  {
    slug: 'lecture',
    label: 'Lecture Series',
    author: 'Adam Katz',
    description: 'Five introductory lectures for Center Study: Origin, Mimetic, Deferral of Violence, The Center, The Sign. A sequential unfolding of the core concepts.',
    color: 'border-amber-200 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-600',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
] as const;

// Research archive: reply threads and tweet collections have limited UX
// Kept for researchers via the download section; not surfaced in main browse
const RESEARCH_SOURCES = [
  {
    slug: 'reddit',
    label: 'Reddit',
    author: 'Adam Katz',
    description: 'Posts and discussions from r/Absolutistneoreaction. Note: reply context is limited without the full thread.',
  },
  {
    slug: 'twitter',
    label: 'X / Twitter',
    author: 'Adam Katz',
    description: 'Threads, notes, and aphorisms. Compressed formulations developed at length elsewhere.',
  },
] as const;

export default async function BrowsePage() {
  const posts = getAllPosts();

  const countsBySource = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.source] = (acc[p.source] ?? 0) + 1;
    return acc;
  }, {});

  // Most recent 5 posts per source (posts already sorted newest-first from parser)
  const recentBySource: Record<string, typeof posts> = {};
  for (const source of SOURCES.map(s => s.slug)) {
    recentBySource[source] = posts.filter(p => p.source === source).slice(0, 3);
  }

  const totalNonTwitter = posts.filter(p => p.source !== 'twitter').length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ← Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Archive</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {totalNonTwitter.toLocaleString()} texts across 6 venues
            <span className="text-gray-400 dark:text-gray-600 ml-1">(+{countsBySource['twitter'] ?? 0} tweets)</span>
          </p>
          <Link
            href="/download"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download archive
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link href="/search" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
          Full-text search
        </Link>
        <Link href="/guide/timeline" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
          Timeline view
        </Link>
        <Link href="/stats" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
          Archive stats
        </Link>
        <Link href="/guide/reading-paths" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
          Reading paths
        </Link>
        <Link href="/lectures" className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-900 dark:hover:text-amber-200 transition-all">
          Lecture series
        </Link>
      </div>

      {/* Source cards */}
      <div className="space-y-5">
        {SOURCES.map((source) => {
          const count = countsBySource[source.slug] ?? 0;
          const recent = recentBySource[source.slug] ?? [];
          return (
            <div key={source.slug} className={`rounded-2xl border bg-white dark:bg-gray-900 transition-all ${source.color}`}>
              <div className="p-5 sm:p-6">
                {/* Source header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${source.dot}`} />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{source.label}</h2>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${source.badge}`}>
                        {count.toLocaleString()} posts
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{source.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      {source.description}
                    </p>
                  </div>
                  <Link
                    href={`/browse/${source.slug}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Browse all
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Recent posts from this source */}
                {recent.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-3">
                    {recent.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/post/${post.slug}`}
                        className="flex items-center gap-2 group"
                      >
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {post.title}
                        </span>
                        {post.date && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-600 flex-shrink-0 ml-auto">
                            {new Date(post.date).getFullYear()}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Research archive — collapsed by default */}
      <details className="mt-10 group">
        <summary className="flex items-center gap-2 cursor-pointer list-none text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 transition-transform group-open:rotate-90"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Research archive
          <span className="text-xs text-gray-300 dark:text-gray-700">
            — Reddit &amp; X threads (limited UX; full data in{' '}
            <Link href="/download" className="underline hover:text-gray-500 dark:hover:text-gray-500">download</Link>)
          </span>
        </summary>

        <div className="mt-4 space-y-3 pl-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed max-w-2xl">
            Reddit and Twitter/X posts are included in the archive but have UX limitations: replies lack context and thread structure is lost. The full data is available in the{' '}
            <Link href="/download" className="text-blue-600 dark:text-blue-400 hover:underline">download section</Link>
            {' '}for researchers who want the complete corpus.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {RESEARCH_SOURCES.map((source) => {
              const count = countsBySource[source.slug] ?? 0;
              return (
                <div key={source.slug} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{source.label}</span>
                      <span className="ml-2 text-xs text-gray-400 dark:text-gray-600">{count.toLocaleString()} posts</span>
                    </div>
                    <Link
                      href={`/browse/${source.slug}`}
                      className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      Browse →
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{source.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </details>

    </main>
  );
}
