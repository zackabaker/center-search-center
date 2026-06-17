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
    return (
      <>
        <TopLoadingBar label="Loading search" />
        <main className="max-w-4xl w-full mx-auto px-4 py-10">
          <div className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse mb-6" />
          <div className="flex gap-2 mb-8">
            {[80, 64, 72, 56].map((w, i) => (
              <div key={i} className="h-7 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ width: w }} />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            Loading the search index…
          </p>
        </main>
      </>
    );
  }

  return <SearchPageClient entries={data.entries} totalPosts={data.totalPosts} />;
}
