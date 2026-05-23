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
    slug: 'reddit',
    label: 'Reddit',
    author: 'Adam Katz',
    description: 'Posts and discussions from r/Absolutistneoreaction — shorter-form theory, Q&A, and debate.',
    color: 'border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-600',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    dot: 'bg-red-400',
  },
  {
    slug: 'twitter',
    label: 'X / Twitter',
    author: 'Adam Katz',
    description: 'Threads, notes, and aphorisms from X (formerly Twitter). Compressed formulations of ideas developed at length elsewhere.',
    color: 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500',
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
    dot: 'bg-slate-400',
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
            {totalNonTwitter.toLocaleString()} texts across 5 venues
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

    </main>
  );
}
