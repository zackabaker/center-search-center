'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Homepage strip for returning readers: continue your reading path and/or
// jump to your saved texts. Renders nothing for first-time visitors.
// Reads csc-ai-path, csc-read-posts, csc-reading-list (all localStorage).

interface PathPost {
  slug: string;
  title: string;
}

export default function WelcomeBack() {
  const [state, setState] = useState<{
    next: PathPost | null;
    readCount: number;
    total: number;
    savedCount: number;
  } | null>(null);

  useEffect(() => {
    try {
      const read: string[] = JSON.parse(localStorage.getItem('csc-read-posts') || '[]');
      const readSet = new Set(read);

      let next: PathPost | null = null;
      let readCount = 0;
      let total = 0;
      const rawPath = localStorage.getItem('csc-ai-path');
      if (rawPath) {
        const path = JSON.parse(rawPath) as { posts?: PathPost[] };
        if (path?.posts?.length) {
          total = path.posts.length;
          readCount = path.posts.filter((p) => readSet.has(p.slug)).length;
          next = path.posts.find((p) => !readSet.has(p.slug)) ?? null;
        }
      }

      const saved: unknown[] = JSON.parse(localStorage.getItem('csc-reading-list') || '[]');
      const savedCount = Array.isArray(saved) ? saved.length : 0;

      if (next || savedCount > 0) {
        setState({ next, readCount, total, savedCount });
      }
    } catch {}
  }, []);

  if (!state) return null;

  return (
    <div className="max-w-xl mx-auto px-4 pb-8 -mt-2">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 flex items-center gap-3 flex-wrap">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 flex-shrink-0">
          Welcome back
        </p>
        <div className="flex items-center gap-4 flex-wrap text-sm">
          {state.next && (
            <Link
              href={`/post/${state.next.slug}`}
              className="group inline-flex items-center gap-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="text-gray-400 dark:text-gray-500 tabular-nums text-xs flex-shrink-0">
                {state.readCount}/{state.total}
              </span>
              <span className="font-medium group-hover:underline leading-snug">
                Continue: {state.next.title}
              </span>
              <span className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0">→</span>
            </Link>
          )}
          {!state.next && state.total > 0 && (
            <Link
              href="/guide/reading-paths"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              Path complete — build a new one →
            </Link>
          )}
          {state.savedCount > 0 && (
            <Link
              href="/reading-list"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {state.savedCount} saved {state.savedCount === 1 ? 'text' : 'texts'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
