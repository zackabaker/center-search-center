'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SOURCE_LABELS: Record<string, string> = {
  gablog: 'GABlog',
  substack: 'Substack',
  pdf: 'PDF',
  book: 'Anthropomorphics',
  lecture: 'Lecture',
};

interface PostPick {
  slug: string;
  title: string;
  source: string;
  date: string | null;
  readingTime: number;
}

export default function RandomPostButton() {
  const [picks, setPicks] = useState<PostPick[]>([]);
  const [loading, setLoading] = useState(false);

  async function shuffle() {
    setLoading(true);
    try {
      const res = await fetch('/api/random?n=3');
      const data = await res.json();
      setPicks(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { shuffle(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Discover
        </h3>
        <button
          onClick={shuffle}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Shuffle
        </button>
      </div>

      <div className="space-y-2">
        {picks.length === 0 && !loading && null}
        {loading && picks.length === 0 && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        )}
        {picks.map((post) => (
          <div
            key={post.slug}
            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                {SOURCE_LABELS[post.source] ?? post.source}
                {post.date ? ` · ${new Date(post.date).getFullYear()}` : ''}
                {` · ${post.readingTime} min`}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
                {post.title}
              </p>
            </div>
            <Link
              href={`/post/${post.slug}/text`}
              className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12m-3.536-9.536a5 5 0 000 7.072" />
              </svg>
              Listen
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
