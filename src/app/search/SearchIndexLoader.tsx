'use client';

import { useEffect, useState } from 'react';
import type { SearchEntry } from '@/lib/search-index';
import SearchPageClient from './SearchPageClient';
import TopLoadingBar from '@/components/TopLoadingBar';

// Fetches the search index as cached JSON instead of shipping it inside the
// page HTML. The page paints instantly; the index streams in behind a brief
// loading state and is browser/CDN-cached for subsequent visits.

export default function SearchIndexLoader() {
  const [data, setData] = useState<{ entries: SearchEntry[]; totalPosts: number } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/search-index')
      .then((r) => {
        if (!r.ok) throw new Error('index fetch failed');
        return r.json();
      })
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <main className="max-w-4xl w-full mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-3">Search index failed to load.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!data) {
    // Functional shell while the index streams in: the input is live (what you
    // type is written to ?q= and searched the moment the index lands) and the
    // suggested queries give a first-time visitor something to do besides
    // stare at a spinner.
    const setQ = (v: string) => {
      try {
        const url = new URL(window.location.href);
        if (v) url.searchParams.set('q', v);
        else url.searchParams.delete('q');
        window.history.replaceState(null, '', url.toString());
      } catch {}
    };
    return (
      <>
        <TopLoadingBar label="Loading search" />
        <main className="max-w-4xl w-full mx-auto px-4 pt-6 pb-24 sm:py-10">
          <div className="relative flex items-center border-2 border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 mb-3">
            <input
              type="text"
              autoFocus
              placeholder="Search the archive…"
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 px-4 py-3.5 text-base sm:text-lg outline-none bg-transparent dark:text-white dark:placeholder-gray-500"
            />
            <span className="mr-3 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">indexing…</span>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-8">
            Loading the full-text index — quick on wifi, cached after the first visit.
            Type now; your search runs the moment it&rsquo;s ready.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['deferral', 'the sacred', 'sovereignty', 'money', 'originary scene', 'resentment'].map((s) => (
              <button
                key={s}
                onClick={() => setQ(s)}
                className="px-2.5 py-1 border border-gray-200 dark:border-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:border-gray-400 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </main>
      </>
    );
  }

  return <SearchPageClient entries={data.entries} totalPosts={data.totalPosts} />;
}
