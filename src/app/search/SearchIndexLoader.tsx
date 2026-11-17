'use client';

import { useEffect, useState } from 'react';
import { hydrateWireEntries, type SearchEntry } from '@/lib/search-index';
import SearchPageClient from './SearchPageClient';
import TopLoadingBar from '@/components/TopLoadingBar';
import RollingLoader from '@/components/RollingLoader';
import SceneMark from '@/components/SceneMark';

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
      .then((d) => {
        if (cancelled) return;
        // The wire format ships only what the client can't derive; rebuild
        // full entries (contentWords, titleWords, excerpt) here, off the
        // interaction path, before the search UI mounts.
        setData({ entries: hydrateWireEntries(d.entries), totalPosts: d.totalPosts });
      })
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
          {/* Same header and box as the loaded search page (SearchPageClient),
              element for element, so nothing moves when the index arrives. */}
          <div className="-mx-4 px-4 pt-3 pb-3 bg-[var(--background)] border-b border-gray-200 dark:border-gray-800">
            <div className="relative flex items-center border-[1.5px] border-gray-900 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-300">
              <div className="ml-3 flex-shrink-0">
                <SceneMark size={24} spin speed={8} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                autoFocus
                placeholder="Search the archive…"
                value={pendingQ}
                onChange={(e) => setPendingQ(e.target.value)}
                className="flex-1 min-w-0 px-3 py-3.5 text-base sm:text-lg outline-none bg-transparent dark:text-white dark:placeholder-gray-500"
              />
              <span
                aria-hidden
                className="mr-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg flex-shrink-0 opacity-60"
              >
                Search
              </span>
            </div>
          </div>
          {/* No suggestion chips here (owner direction, 2026-11-17): a search
              is already under way, so the only thing to show is that it is
              running. */}
          <RollingLoader
            className="mt-10"
            label={pendingQ
              ? <>Searching for &ldquo;{pendingQ}&rdquo;&hellip;</>
              : <>Loading the archive&hellip;</>}
          />
        </main>
      </>
    );
  }

  return <SearchPageClient entries={data.entries} totalPosts={data.totalPosts} />;
}
