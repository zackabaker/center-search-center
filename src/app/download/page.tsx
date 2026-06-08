import { getAllPosts } from '@/lib/parser';
import { ContentSource } from '@/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';
import DownloadClient from './DownloadClient';

export const metadata: Metadata = {
  title: 'Download Archive — Center Study Center',
  description: 'Download the Center Study Center archive as JSON or plain text. Select individual sources or grab everything.',
};

// Revalidate hourly — corpus rarely changes
export const revalidate = 3600;

const SOURCE_META: Record<
  ContentSource,
  { label: string; description: string; color: string }
> = {
  substack: {
    label: 'Bouvard Substack',
    description: 'Essays and dispatches from the Substack newsletter',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  },
  gablog: {
    label: 'GABlog',
    description: 'Generative Anthropology Blog posts and essays',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  },
  book: {
    label: 'Anthropomorphics',
    description: 'Chapters from Adam Katz\'s book on systematic originary grammar',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  },
  pdf: {
    label: 'Essays & Articles',
    description: 'Academic papers, journal articles, introductory lectures, and longer works',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  reddit: {
    label: 'Reddit',
    description: 'Dialogue threads and Q&A discussions from Reddit',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
  twitter: {
    label: 'X / Twitter',
    description: 'Threads and notes from X (formerly Twitter)',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  },
  chronicle: {
    label: 'Chronicles of Love and Resentment',
    description: 'Eric Gans\'s weekly column on culture, desire, and the originary hypothesis (1996–2019)',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
};

export default function DownloadPage() {
  const allPosts = getAllPosts();
  const publicPosts = allPosts.filter((p) => p.source !== 'chronicle');
  const chronicles = allPosts
    .filter((p) => p.source === 'chronicle')
    .sort((a, b) => {
      // Sort by CLR number extracted from slug
      const numA = parseInt(a.slug.replace('chronicle-clr-', ''), 10) || 0;
      const numB = parseInt(b.slug.replace('chronicle-clr-', ''), 10) || 0;
      return numA - numB;
    });

  const bySource = publicPosts.reduce<Record<string, { count: number; words: number }>>(
    (acc, p) => {
      if (!acc[p.source]) acc[p.source] = { count: 0, words: 0 };
      acc[p.source].count += 1;
      acc[p.source].words += p.content.split(/\s+/).length;
      return acc;
    },
    {}
  );

  const publicSources = (['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'] as ContentSource[])
    .filter((id) => bySource[id]?.count > 0)
    .map((id) => ({
      id,
      label: SOURCE_META[id].label,
      description: SOURCE_META[id].description,
      color: SOURCE_META[id].color,
      count: bySource[id]?.count ?? 0,
      wordCount: bySource[id]?.words ?? 0,
    }));

  const totalCount = publicPosts.length;
  const totalWords = publicPosts.reduce((s, p) => s + p.content.split(/\s+/).length, 0);

  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-10 sm:py-16">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
          Download Archive
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          Export the full corpus — {totalCount.toLocaleString()} posts,{' '}
          {(totalWords / 1_000_000).toFixed(1)}M words — or pick the sources you need.
        </p>
      </header>

      <DownloadClient
        sources={publicSources}
        totalCount={totalCount}
        totalWords={totalWords}
      />

      {/* ── Chronicles of Love and Resentment ─────────────────────────────── */}
      <section className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chronicles of Love and Resentment
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 whitespace-nowrap mt-1">
              Eric Gans
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1">
            Eric Gans's weekly column, published on Anthropoetics from 1996 until his death in 2019.
            These posts are part of the historical archive and are not indexed in the main search.
          </p>
          {chronicles.length === 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 px-4 py-4 text-sm text-amber-800 dark:text-amber-300">
              <p className="font-medium mb-1">Chronicles not yet imported</p>
              <p className="text-amber-700 dark:text-amber-400">
                Run <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">node scripts/scrape-chronicles.mjs</code> to
                scrape and import all Chronicle posts from the Wayback Machine.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {chronicles.length.toLocaleString()} posts imported
            </p>
          )}
        </div>

        {chronicles.length > 0 && (
          <div className="space-y-1">
            {chronicles.map((post) => {
              const num = post.slug.replace('chronicle-clr-', '');
              return (
                <div key={post.slug} className="flex items-baseline gap-3 py-1.5 border-b border-gray-50 dark:border-gray-800/60 group">
                  <span className="text-xs font-mono text-gray-300 dark:text-gray-600 w-8 flex-shrink-0 text-right">
                    {num}
                  </span>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors flex-1 leading-snug"
                  >
                    {post.title}
                  </Link>
                  {post.date && (
                    <span className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap flex-shrink-0">
                      {post.date}
                    </span>
                  )}
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs text-gray-300 dark:text-gray-700 hover:text-gray-500 dark:hover:text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="View original on Anthropoetics"
                    >
                      ↗
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
