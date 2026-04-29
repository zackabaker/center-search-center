'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post, ContentSource } from '@/lib/types';
import {
  buildSearchEntries,
  searchEntries,
  countPostsWithTerm,
  SearchResult,
} from '@/lib/search-index';
import FilterTabs from '@/components/FilterTabs';

type FilterOption = 'all' | ContentSource;

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book', pdf: 'PDF', reddit: 'Reddit',
};
const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  reddit: 'bg-red-100 text-red-800',
};

const RECENT_KEY = 'csc-recent-searches';
const MAX_RECENT = 8;
function getRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
}
function saveRecent(q: string) {
  const r = getRecent().filter((s) => s !== q);
  r.unshift(q);
  localStorage.setItem(RECENT_KEY, JSON.stringify(r.slice(0, MAX_RECENT)));
}

function highlight(text: string, query: string) {
  const clean = query.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
  if (!clean) return text;
  const escaped = clean.split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  if (!escaped) return text;
  // \b ensures whole-word-only highlights — "test" won't light up inside "latest"
  const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
  const parts = text.split(regex);
  // Odd-indexed parts are the captured matches (guaranteed by split with capturing group)
  return parts.map((part, i) =>
    i % 2 === 1
      ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{part}</mark>
      : part
  );
}

const PAGE_SIZE = 30;

export default function SearchPageClient({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const liveDebounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [committed, setCommitted] = useState(initialQ);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [corpusCount, setCorpusCount] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const entries = useMemo(() => buildSearchEntries(posts), [posts]);

  // Load recent searches
  useEffect(() => { setRecentSearches(getRecent()); }, []);

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Run search when committed query changes — search-index is in-memory, runs synchronously
  useEffect(() => {
    if (!committed.trim()) {
      setResults([]);
      setCorpusCount(null);
      setIsSearching(false);
      return;
    }
    const found = searchEntries(entries, committed);
    const cleanQ = committed.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
    const firstTerm = cleanQ.split(/\s+/)[0];
    setResults(found);
    setPage(0);
    setCorpusCount(firstTerm ? countPostsWithTerm(entries, firstTerm) : null);
    setIsSearching(false);
  }, [committed, entries]);

  // Update URL when committed query changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (committed.trim()) {
      url.searchParams.set('q', committed.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }, [committed]);

  // Immediate commit (Enter, Search button, recent searches)
  const handleSubmit = useCallback((q: string) => {
    const trimmed = q.trim();
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    setIsSearching(false);
    setCommitted(trimmed);
    if (trimmed) { saveRecent(trimmed); setRecentSearches(getRecent()); }
  }, []);

  // Live search: commit after 200 ms of inactivity
  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (liveDebounceRef.current) clearTimeout(liveDebounceRef.current);
    if (!value.trim()) {
      setCommitted('');
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    liveDebounceRef.current = setTimeout(() => {
      setCommitted(value.trim());
    }, 200);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(query); }
    if (e.key === 'Escape') { setQuery(''); setCommitted(''); inputRef.current?.blur(); }
  };

  // Filter results by source
  const filtered = useMemo(
    () => filter === 'all' ? results : results.filter((r) => r.entry.source === filter),
    [results, filter]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const counts: Record<FilterOption, number> = useMemo(() => ({
    all: results.length,
    substack: results.filter((r) => r.entry.source === 'substack').length,
    gablog: results.filter((r) => r.entry.source === 'gablog').length,
    book: results.filter((r) => r.entry.source === 'book').length,
    pdf: results.filter((r) => r.entry.source === 'pdf').length,
    reddit: results.filter((r) => r.entry.source === 'reddit').length,
  }), [results]);

  const handleFilterChange = (f: FilterOption) => { setFilter(f); setPage(0); };

  const postUrl = (slug: string) =>
    `/post/${slug}${committed.trim() ? `?q=${encodeURIComponent(committed.trim())}` : ''}`;

  const hasQuery = committed.trim().length > 0;
  const hasResults = filtered.length > 0;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Loading bar — shown while search is running */}
      {isSearching && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gray-100 overflow-hidden">
          <div className="h-full bg-gray-700 animate-[loading-bar_1.2s_ease-in-out_infinite]" style={{width: '60%', animation: 'loadbar 1.1s ease-in-out infinite'}} />
          <style>{`@keyframes loadbar{0%{transform:translateX(-100%)}100%{transform:translateX(280%)}}`}</style>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Home</Link>
      </div>

      {/* Search input — always visible, full width */}
      <div className="mb-6">
        <div className="relative flex items-center border-2 border-gray-200 focus-within:border-gray-400 rounded-xl bg-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder='Search… try "originary scene" AND resentment'
            className="flex-1 px-3 py-3.5 text-base sm:text-lg outline-none bg-transparent"
          />
          {isSearching && (
            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-3" />
          )}
          {query && (
            <button
              onClick={() => { setQuery(''); setCommitted(''); inputRef.current?.focus(); }}
              className="mr-3 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleSubmit(query)}
            className="mr-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* Operator hints */}
        <div className="flex flex-wrap gap-2 mt-2">
          {['"exact phrase"', 'term AND term', 'term NOT term', 'term OR term'].map((tip) => (
            <button
              key={tip}
              onClick={() => { setQuery(tip); inputRef.current?.focus(); }}
              className="px-2 py-0.5 bg-gray-100 rounded text-[11px] text-gray-500 hover:bg-gray-200 font-mono transition-colors"
            >
              {tip}
            </button>
          ))}
        </div>
      </div>

      {/* Results area */}
      {hasQuery && (
        <>
          {/* Stats + filter tabs */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-500">
                {hasResults ? (
                  <>
                    <span className="font-medium text-gray-900">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
                    {corpusCount !== null && (
                      <span className="text-gray-400"> · term in <span className="text-gray-600">{corpusCount}</span> of {posts.length} posts</span>
                    )}
                  </>
                ) : isSearching ? (
                  'Searching…'
                ) : (
                  `No results for "${committed}"`
                )}
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">⌘K anywhere</span>
            </div>
            {hasResults && <FilterTabs active={filter} onChange={handleFilterChange} counts={counts} />}
          </div>

          {/* Result list */}
          {hasResults && (
            <div className="space-y-3">
              {pageItems.map(({ entry, contextSnippet }) => (
                <div key={entry.slug} className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_COLORS[entry.source]}`}>
                          {SOURCE_LABELS[entry.source]}
                        </span>
                        {entry.date && <span className="text-xs text-gray-400">{entry.date}</span>}
                        <span className="text-xs text-gray-400">{entry.readingTime} min read</span>
                      </div>
                      <Link
                        href={postUrl(entry.slug)}
                        className="block font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-1.5"
                      >
                        {highlight(entry.title, committed)}
                      </Link>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {highlight(contextSnippet, committed)}
                      </p>
                    </div>
                    {/* Always visible on mobile, hover-only on desktop */}
                    <a
                      href={postUrl(entry.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all sm:opacity-0 sm:group-hover:opacity-100 text-xs font-medium"
                      title="Open"
                    >
                      Open
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  if (i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1) {
                    return (
                      <button key={i} onClick={() => setPage(i)}
                        className={`w-8 h-8 text-sm rounded-lg ${i === page ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                        {i + 1}
                      </button>
                    );
                  }
                  if ((i === 1 && page > 3) || (i === totalPages - 2 && page < totalPages - 4)) {
                    return <span key={i} className="px-1 text-gray-400">…</span>;
                  }
                  return null;
                })}
              </div>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                Next
              </button>
              <span className="text-xs text-gray-400 ml-2">
                {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
            </div>
          )}

          {/* No results tips */}
          {!hasResults && !isSearching && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-base mb-2">No results for &ldquo;{committed}&rdquo;</p>
              <p className="text-sm">Try removing AND/NOT operators, or use fewer terms.</p>
              {recentSearches.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs mb-2">Recent searches:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {recentSearches.map((s) => (
                      <button key={s} onClick={() => { setQuery(s); handleSubmit(s); }}
                        className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!hasQuery && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm mb-4">Search across {posts.length} posts from Substack, GABlog, Books &amp; PDFs</p>
          {recentSearches.length > 0 && (
            <div>
              <p className="text-xs mb-3">Recent searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {recentSearches.map((s) => (
                  <button key={s} onClick={() => { setQuery(s); handleSubmit(s); }}
                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 hover:bg-gray-200">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
