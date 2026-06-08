'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ContentSource } from '@/lib/types';

interface TimelinePost {
  slug: string;
  title: string;
  date: string;
  source: ContentSource;
}

interface Props {
  yearGroups: { year: string; posts: TimelinePost[] }[];
  totalCount: number;
}

const SOURCE_ABBREV: Record<ContentSource, string> = {
  substack: 'Sub',
  gablog: 'GA',
  book: 'Book',
  pdf: 'Essay',
  reddit: 'Reddit',
  twitter: 'X',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

const SOURCE_COLOR: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter: 'bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-300',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TimelineDisplay({ yearGroups, totalCount }: Props) {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const displayGroups = order === 'desc' ? yearGroups : [...yearGroups].reverse();

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
            Timeline
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalCount} dated posts across the Center Study archive
          </p>
        </div>

        {/* Sort toggle */}
        <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex-shrink-0">
          <button
            onClick={() => setOrder('desc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              order === 'desc'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Newest first
          </button>
          <button
            onClick={() => setOrder('asc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              order === 'asc'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Oldest first
          </button>
        </div>
      </div>

      {/* Year groups */}
      <div className="space-y-10">
        {displayGroups.map(({ year, posts }) => {
          const displayPosts = order === 'asc' ? [...posts].reverse() : posts;
          return (
            <section key={year}>
              <div className="sticky top-14 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 py-2 mb-3 -mx-4 px-4">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{year}</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>

              <div className="space-y-px">
                {displayPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/post/${post.slug}`}
                    className="group flex items-start gap-3 py-3 min-h-[44px] border-b border-gray-50 dark:border-gray-800/60 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900/40 -mx-2 px-2 rounded transition-colors"
                  >
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-14 flex-shrink-0 tabular-nums pt-0.5">
                      {formatShortDate(post.date)}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5 ${SOURCE_COLOR[post.source]}`}>
                      {SOURCE_ABBREV[post.source]}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug flex-1 min-w-0">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
