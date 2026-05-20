import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Timeline — Center Study Center',
  description: 'All dated Center Study posts grouped by year, newest first.',
};

const SOURCE_ABBREV: Record<ContentSource, string> = {
  substack: 'Sub',
  gablog: 'GA',
  book: 'Book',
  pdf: 'PDF',
  reddit: 'Reddit',
  twitter: 'X',
};

const SOURCE_COLOR: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TimelinePage() {
  const allPosts = getAllPosts();

  const dated = allPosts
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  // Group by year
  const byYear = new Map<string, typeof dated>();
  for (const post of dated) {
    const year = new Date(post.date!).getFullYear().toString();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }

  // Sort years newest-first
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          &larr; Home
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Timeline
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {dated.length} dated posts across the Center Study archive
        </p>
      </div>

      {/* Year groups */}
      <div className="space-y-10">
        {years.map((year) => {
          const posts = byYear.get(year)!;
          return (
            <section key={year}>
              {/* Sticky year header */}
              <div className="sticky top-14 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 py-2 mb-3 -mx-4 px-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{year}</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>

              {/* Posts in year */}
              <div className="space-y-px">
                {posts.map((post) => (
                  <div
                    key={post.slug}
                    className="group flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800/60 last:border-b-0"
                  >
                    {/* Date */}
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-14 flex-shrink-0 tabular-nums">
                      {formatShortDate(post.date!)}
                    </span>

                    {/* Source badge */}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${SOURCE_COLOR[post.source]}`}
                    >
                      {SOURCE_ABBREV[post.source]}
                    </span>

                    {/* Title */}
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug flex-1 min-w-0 truncate"
                    >
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
