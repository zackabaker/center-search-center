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
    description: 'Chapters from Eric Gans\'s book Anthropomorphics',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  },
  pdf: {
    label: 'PDFs',
    description: 'Scanned papers, lectures, and documents',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  },
  reddit: {
    label: 'Reddit',
    description: 'Posts and discussions from r/GenerativeAnthropology',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
  twitter: {
    label: 'X / Twitter',
    description: 'Threads and notes from X (formerly Twitter)',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  },
};

export default function DownloadPage() {
  const posts = getAllPosts();

  const bySource = posts.reduce<Record<string, { count: number; words: number }>>(
    (acc, p) => {
      if (!acc[p.source]) acc[p.source] = { count: 0, words: 0 };
      acc[p.source].count += 1;
      acc[p.source].words += p.content.split(/\s+/).length;
      return acc;
    },
    {}
  );

  const sources = (Object.keys(SOURCE_META) as ContentSource[])
    .filter((id) => bySource[id]?.count > 0)
    .map((id) => ({
      id,
      label: SOURCE_META[id].label,
      description: SOURCE_META[id].description,
      color: SOURCE_META[id].color,
      count: bySource[id]?.count ?? 0,
      wordCount: bySource[id]?.words ?? 0,
    }));

  const totalCount = posts.length;
  const totalWords = posts.reduce((s, p) => s + p.content.split(/\s+/).length, 0);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
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
        sources={sources}
        totalCount={totalCount}
        totalWords={totalWords}
      />
    </main>
  );
}
