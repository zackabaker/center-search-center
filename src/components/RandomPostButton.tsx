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
          <Link
            key={post.slug}
            href={`/post/${post.slug}`}
            className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                {SOURCE_LABELS[post.source] ?? post.source}
                {post.date ? (() => { const m = post.date.match(/\b(19|20)\d{2}\b/); return m ? ` · ${m[0]}` : ''; })() : ''}
                {post.readingTime && !Number.isNaN(post.readingTime) ? ` · ${post.readingTime} min` : ''}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-snug line-clamp-2 transition-colors">
                {post.title}
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 dark:text-gray-700 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
