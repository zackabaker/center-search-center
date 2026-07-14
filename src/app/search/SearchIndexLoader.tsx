'use client';

import { useEffect, useState } from 'react';
import type { SearchEntry } from '@/lib/search-index';
import SearchPageClient from './SearchPageClient';
import TopLoadingBar from '@/components/TopLoadingBar';

// The pending query shown while the index streams in. Starts from the URL's
// ?q= (deep links, shared searches) — set after mount to avoid a hydration
// mismatch on the SSR shell.
function usePendingQuery(): [string, (v: string) => void] {
  const [q, setQ] = useState('');
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('q');
      if (fromUrl) setQ(fromUrl);
    } catch {}
  }, []);
  const update = (v: string) => {
    setQ(v);
    try {
      const url = new URL(window.location.href);
      if (v) url.searchParams.set('q', v);
      else url.searchParams.delete('q');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  };
  return [q, update];
}

// Fetches the search index as cached JSON instead of shipping it inside the
// page HTML. The page paints instantly; the index streams in behind a brief
// loading state and is browser/CDN-cached for subsequent visits.

export default function SearchIndexLoader() {
  const [data, setData] = useState<{ entries: SearchEntry[]; totalPosts: number } | null>(null);
  const [error, setError] = useState(false);
  const [pendingQ, setPendingQ] = usePendingQuery();

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/search-index?v=${process.env.NEXT_PUBLIC_INDEX_V}`)
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
    // Functional shell while the index streams in: the input is live and
    // ALWAYS shows the pending query — including one arriving via a shared
    // ?q= link — so the page never looks like it lost the user's search.
    return (
      <>
        <TopLoadingBar label="Loading search" />
        <main className="max-w-4xl w-full mx-auto px-4 pt-6 pb-24 sm:py-10">
          <div className="relative flex items-center border-2 border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 mb-3">
            <input
              type="text"
              autoFocus
              placeholder="Search the archive…"
              value={pendingQ}
              onChange={(e) => setPendingQ(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3.5 text-base sm:text-lg outline-none bg-transparent dark:text-white dark:placeholder-gray-500"
            />
            <span className="mr-3 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">indexing…</span>
          </div>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-8">
            {pendingQ
              ? <>Loading the full-text index — searching for &ldquo;{pendingQ}&rdquo; the moment it&rsquo;s ready.</>
              : <>Loading the full-text index — quick on wifi, cached after the first visit.
                 Type now; your search runs the moment it&rsquo;s ready.</>}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['deferral', 'the sacred', 'sovereignty', 'money', 'originary scene', 'resentment'].map((s) => (
              <button
                key={s}
                onClick={() => setPendingQ(s)}
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
