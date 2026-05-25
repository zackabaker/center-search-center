import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Archive — Center Study Center',
  description: 'Browse the complete Center Study archive: GABlog, Substack, Essays & Articles, Anthropomorphics, and Threads & Q&A.',
};

export const revalidate = 3600;

const SOURCE_TABS = [
  { slug: 'gablog',   label: 'GABlog',          dot: 'bg-blue-400'   },
  { slug: 'substack', label: 'Substack',         dot: 'bg-orange-400' },
  { slug: 'threads',  label: 'Threads & Q&A',    dot: 'bg-violet-400' },
  { slug: 'pdf',      label: 'Essays',           dot: 'bg-green-400'  },
  { slug: 'book',     label: 'Anthropomorphics', dot: 'bg-purple-400' },
  { slug: 'all',      label: 'All',              dot: 'bg-gray-400'   },
] as const;

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
    label: 'Essays & Articles',
    author: 'Adam Katz',
    description: 'Academic papers, journal articles, introductory lectures, and longer works. Includes The Anthropoetics of Power, Originary Technics, NER and JCRT articles, and the five introductory lectures.',
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
    slug: 'threads',
    label: 'Threads & Q&A',
    author: 'Dennis Bouvard (Adam Katz)',
    description: 'Reddit dialogues and X threads — long-form responses, Q&A exchanges with full question context, and applied thinking across social media.',
    color: 'border-violet-200 dark:border-violet-900/50 hover:border-violet-400 dark:hover:border-violet-600',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    dot: 'bg-violet-400',
    isVirtual: true, // combines reddit + twitter
  },
] as const;

export default async function BrowsePage() {
  const posts = getAllPosts();

  const countsBySource = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.source] = (acc[p.source] ?? 0) + 1;
    return acc;
  }, {});

  // Threads count = reddit + twitter
  const threadsCount = (countsBySource['reddit'] ?? 0) + (countsBySource['twitter'] ?? 0);

  // Most recent 3 posts per source
  const recentBySource: Record<string, typeof posts> = {};
  for (const s of SOURCES) {
    if (s.slug === 'threads') {
      recentBySource['threads'] = posts
        .filter((p) => p.source === 'reddit' || p.source === 'twitter')
        .slice(0, 3);
    } else {
      recentBySource[s.slug] = posts.filter((p) => p.source === s.slug).slice(0, 3);
    }
  }

  const totalAll = posts.length;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mt-2 mb-1 text-gray-900 dark:text-white">Archive</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {totalAll.toLocaleString()} texts across 5 venues
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/search" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Full-text search
            </Link>
            <span className="text-gray-200 dark:text-gray-800">·</span>
            <Link href="/browse/all" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              All sources chronologically
            </Link>
            <span className="text-gray-200 dark:text-gray-800">·</span>
            <Link href="/reading-list" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Reading list
            </Link>
            <span className="text-gray-200 dark:text-gray-800">·</span>
            <Link href="/download" className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download corpus
            </Link>
          </div>
        </div>
      </div>

      {/* ── Source tab strip — big tappable pills, scrollable on mobile ─────── */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-8">
        <div className="flex gap-2 min-w-max">
          {SOURCE_TABS.map((tab) => (
            <Link
              key={tab.slug}
              href={`/browse/${tab.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tab.dot}`} />
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Source cards */}
      <div className="space-y-5">
        {SOURCES.map((source) => {
          const count = source.slug === 'threads' ? threadsCount : (countsBySource[source.slug] ?? 0);
          const recent = recentBySource[source.slug] ?? [];

          return (
            <div key={source.slug} className={`rounded-2xl border bg-white dark:bg-gray-900 transition-all ${source.color}`}>
              <div className="p-5 sm:p-6">
                {/* Source header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${source.dot}`} />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{source.label}</h2>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${source.badge}`}>
                        {count.toLocaleString()} posts
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{source.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      {source.description}
                    </p>
                  </div>
                  <Link
                    href={`/browse/${source.slug}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Browse
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* Recent posts from this source */}
                {recent.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-gray-100 dark:border-gray-800 pt-3">
                    {recent.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/post/${post.slug}?back=/browse/${source.slug}`}
                        className="flex items-center gap-2 group py-0.5"
                      >
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {post.title}
                        </span>
                        {post.date && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-600 flex-shrink-0 ml-auto tabular-nums">
                            {post.date.match(/\b(19|20)\d{2}\b/)?.[0] ?? ''}
                          </span>
                        )}
                      </Link>
                    ))}
                    <Link
                      href={`/browse/${source.slug}`}
                      className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors pt-1"
                    >
                      All {count} posts →
                    </Link>
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
