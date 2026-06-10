'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Companion to the AI reading path (see ReadingPathFinder): if the reader has
// a saved path and this post is part of it, show where they are and what's
// next — the path follows them through the archive like a course.

interface PathPost {
  slug: string;
  source: string;
  title: string;
  note: string;
}

interface SavedPath {
  title: string;
  posts: PathPost[];
}

export default function AiPathNext({ slug }: { slug: string }) {
  const [state, setState] = useState<{
    pathTitle: string;
    index: number;
    total: number;
    next: PathPost | null;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('csc-ai-path');
      if (!raw) return;
      const path = JSON.parse(raw) as SavedPath;
      if (!path?.posts?.length) return;
      const idx = path.posts.findIndex((p) => p.slug === slug);
      if (idx === -1) return;
      setState({
        pathTitle: path.title,
        index: idx,
        total: path.posts.length,
        next: idx + 1 < path.posts.length ? path.posts[idx + 1] : null,
      });
    } catch {}
  }, [slug]);

  if (!state) return null;

  return (
    <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm print:hidden">
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400">
          Your reading path
        </p>
        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
          {state.index + 1} of {state.total}
        </span>
      </div>

      {state.next ? (
        <>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Up next:</p>
          <Link
            href={`/post/${state.next.slug}`}
            className="group flex items-center justify-between gap-3"
          >
            <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {state.next.title}
            </span>
            <span className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              →
            </span>
          </Link>
          {state.next.note && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic leading-relaxed">
              {state.next.note}
            </p>
          )}
        </>
      ) : (
        <>
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
            That completes &ldquo;{state.pathTitle}&rdquo; — well done.
          </p>
          <Link
            href="/guide/reading-paths"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Review your path or build a new one
          </Link>
        </>
      )}
    </div>
  );
}
