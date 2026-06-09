import { getAllPosts } from '@/lib/parser';
import { ContentSource } from '@/lib/types';
import Link from 'next/link';
import type { Metadata } from 'next';
import DownloadClient from './DownloadClient';

export const metadata: Metadata = {
  title: 'Download Archive — Center Study Center',
  description: 'Download the Center Study Center archive as JSON or plain text. Select individual sources or grab everything.',
};

// Force dynamic — content changes on corpus updates and must not be cached stale
export const dynamic = 'force-dynamic';

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
  ap: {
    label: 'Anthropoetics Journal',
    description: 'Peer-reviewed journal of Generative Anthropology — articles by Van Oort, Bartlett, Dennis, Ludwigs, and others (1995–2016)',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
  },
};

export default function DownloadPage() {
  const allPosts = getAllPosts();

  const bySource = allPosts.reduce<Record<string, { count: number; words: number }>>(
    (acc, p) => {
      if (!acc[p.source]) acc[p.source] = { count: 0, words: 0 };
      acc[p.source].count += 1;
      acc[p.source].words += p.content.split(/\s+/).length;
      return acc;
    },
    {}
  );

  // Standard sources — always shown and selected by default
  const standardSources = (['substack', 'gablog', 'book', 'pdf', 'reddit', 'twitter'] as ContentSource[])
    .filter((id) => bySource[id]?.count > 0)
    .map((id) => ({
      id,
      label: SOURCE_META[id].label,
      description: SOURCE_META[id].description,
      color: SOURCE_META[id].color,
      count: bySource[id]?.count ?? 0,
      wordCount: bySource[id]?.words ?? 0,
    }));

  // Archival sources — shown but unchecked by default
  const archivalSources = (['chronicle', 'ap'] as ContentSource[])
    .filter((id) => bySource[id]?.count > 0)
    .map((id) => ({
      id,
      label: SOURCE_META[id].label,
      description: SOURCE_META[id].description,
      color: SOURCE_META[id].color,
      count: bySource[id]?.count ?? 0,
      wordCount: bySource[id]?.words ?? 0,
      optional: true as const,
    }));

  const allSources = [...standardSources, ...archivalSources];

  const totalCount = standardSources.reduce((s, x) => s + x.count, 0);
  const totalWords = standardSources.reduce((s, x) => s + x.wordCount, 0);

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
          Archival sources are available but unchecked by default.
        </p>
      </header>

      <DownloadClient
        sources={allSources}
        totalCount={totalCount}
        totalWords={totalWords}
      />
    </main>
  );
}
