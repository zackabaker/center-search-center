import { getAllPosts } from '@/lib/parser';
import { buildSearchEntries, getSignificantTerms } from '@/lib/search-index';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentSource } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Corpus Statistics',
  description: 'Statistics and analytics for the Center Study Center archive',
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'Essays & Articles', reddit: 'Reddit',
  twitter: 'X / Twitter',
};
const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  gablog:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  book:     'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  reddit:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  twitter:  'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
};

export default function StatsPage() {
  const posts = getAllPosts();
  const entries = buildSearchEntries(posts);

  const totalWords = posts.reduce((sum, p) => sum + p.content.split(/\s+/).length, 0);

  const bySource = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.source] = (acc[p.source] || 0) + 1;
    return acc;
  }, {});

  // Words per source
  const wordsBySource = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.source] = (acc[p.source] || 0) + p.content.split(/\s+/).length;
    return acc;
  }, {});

  const byYear = posts.reduce<Record<string, number>>((acc, p) => {
    if (!p.date) return acc;
    const year = p.date.slice(0, 4);
    if (/^\d{4}$/.test(year)) acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});
  const years = Object.keys(byYear).sort();
  const maxYearCount = Math.max(...Object.values(byYear), 1);

  const topTerms = getSignificantTerms(entries, 5, 20);

  const avgWords = Math.round(totalWords / posts.length);
  const totalReadingMinutes = Math.round(totalWords / 200);
  const noDates = posts.filter((p) => !p.date).length;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Archive</Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Corpus Statistics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Analytics for the Center Study Center archive</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: 'Total Posts', value: posts.length.toLocaleString() },
          { label: 'Total Words', value: totalWords.toLocaleString() },
          { label: 'Avg. Words/Post', value: avgWords.toLocaleString() },
          { label: 'Hours of Reading', value: Math.round(totalReadingMinutes / 60).toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* By source */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Posts by Source</h2>
          <div className="space-y-2.5">
            {(Object.entries(bySource) as [ContentSource, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([src, count]) => (
                <div key={src} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[src]} w-20 text-center flex-shrink-0`}>
                    {SOURCE_LABELS[src]}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                      style={{ width: `${(count / posts.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-10 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Words by source */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Words by Source</h2>
          <div className="space-y-2.5">
            {(Object.entries(bySource) as [ContentSource, number][])
              .sort((a, b) => (wordsBySource[b[0]] || 0) - (wordsBySource[a[0]] || 0))
              .map(([src, count]) => {
                const words = wordsBySource[src] || 0;
                const avg = count > 0 ? Math.round(words / count) : 0;
                const maxWords = Math.max(...Object.values(wordsBySource));
                return (
                  <div key={src} className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[src]} w-20 text-center flex-shrink-0`}>
                      {SOURCE_LABELS[src]}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                        style={{ width: `${(words / maxWords) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-28 text-right text-xs">
                      {words.toLocaleString()} w · {avg.toLocaleString()} avg
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Total words · avg words/post</p>
        </div>

        {/* Top terms */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top 20 Terms</h2>
          <div className="space-y-1.5">
            {topTerms.map(({ term, count }) => (
              <div key={term} className="flex items-center gap-2">
                <Link
                  href={`/ask?q=${encodeURIComponent(`What is "${term}" in Center Study?`)}`}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline w-32 truncate flex-shrink-0"
                >
                  {term}
                </Link>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-300 dark:bg-blue-600 rounded-full"
                    style={{ width: `${(count / topTerms[0].count) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Count = posts containing the term · Click to Ask AI.
          </p>
        </div>
      </div>

      {/* Posts per year */}
      {years.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Publication Timeline</h2>
          <div className="flex items-end gap-1.5 h-32">
            {years.map((year) => {
              const count = byYear[year] || 0;
              const pct = (count / maxYearCount) * 100;
              return (
                <div key={year} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{count}</span>
                  <div
                    className="w-full bg-gray-700 dark:bg-gray-400 rounded-t"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    title={`${year}: ${count} posts`}
                  />
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate w-full text-center">{year}</span>
                </div>
              );
            })}
          </div>
          {noDates > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">{noDates} posts have no date (not included above).</p>
          )}
        </div>
      )}

      <div className="text-center">
        <Link href="/guide/concepts" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mr-3">
          Browse concepts →
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:opacity-80 transition-opacity">
          Search the archive →
        </Link>
      </div>
    </main>
  );
}
