'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export interface PathCandidate {
  pathSlug: string;
  pathTitle: string;
  isLast: boolean;
  nextSlug: string | null;
  nextTitle: string | null;
  continuePathSlug: string | null;
  continuePathTitle: string | null;
}

// Renders the first candidate on the server (no hydration mismatch, no-JS
// fallback = the long-standing first-match behavior), then after mount swaps
// to the path the reader actually entered through (csc-reading-path, written
// by ActivePathTracker on the path page) when that path also claims this post.
export default function NextInPathPicker({ candidates }: { candidates: PathCandidate[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('csc-reading-path');
      if (!stored) return;
      const idx = candidates.findIndex((c) => c.pathSlug === stored);
      if (idx > 0) setActive(idx);
    } catch {}
  }, [candidates]);

  const c = candidates[active];
  if (!c) return null;

  if (c.isLast) {
    return (
      <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Reading path</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Completed: {c.pathTitle}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {c.continuePathSlug && (
            <Link
              href={`/guide/reading-paths/${c.continuePathSlug}`}
              className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Continue: {c.continuePathTitle} →
            </Link>
          )}
          <Link
            href="/guide/reading-paths"
            className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            All reading paths
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
        Next in {c.pathTitle}
      </p>
      <Link
        href={`/post/${c.nextSlug}`}
        className="group flex items-center justify-between gap-3"
      >
        <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">
          {c.nextTitle}
        </span>
        <span className="flex-shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          →
        </span>
      </Link>
    </div>
  );
}
