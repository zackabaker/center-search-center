'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Post, ContentSource } from '@/lib/types';
import {
  SearchResult,
  buildSearchEntries,
  searchEntries,
} from '@/lib/search-index';
import Link from 'next/link';

interface SearchBarProps {
  posts: Post[];
}

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'PDF',
  glossary: 'Glossary',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  glossary: 'bg-teal-100 text-teal-800',
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  // Strip quotes for highlighting
  const cleanQuery = query.replace(/"/g, '');
  if (!cleanQuery.trim()) return text;
  const escaped = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const RECENT_SEARCHES_KEY = 'csc-recent-searches';
const MAX_RECENT = 8;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  const recent = getRecentSearches().filter((s) => s !== query);
  recent.unshift(query);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const entries = useMemo(() => buildSearchEntries(posts), [posts]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const found = searchEntries(entries, query);
      setResults(found);
      setSelectedIndex(0);
      setIsSearching(false);
    }, 80);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, entries]);

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.children[selectedIndex] as HTMLElement;
      if (selected) selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const cleanQuery = query.replace(/"/g, '');
  const postUrl = (slug: string) =>
    `/post/${slug}?q=${encodeURIComponent(cleanQuery)}`;

  const navigateToResult = (slug: string, newTab: boolean) => {
    const url = postUrl(slug);
    if (query.trim()) {
      saveRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
    }
    if (newTab) {
      window.open(url, '_blank');
    } else {
      setIsOpen(false);
      setQuery('');
      window.location.href = url;
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(
        results[selectedIndex].entry.slug,
        e.metaKey || e.ctrlKey
      );
    }
  };

  const showRecent = !query && recentSearches.length > 0;

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setRecentSearches(getRecentSearches());
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="w-full max-w-xl mx-auto flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-gray-300 transition-colors cursor-text"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">⌘K</kbd>
      </button>
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
        Need deeper answers?{' '}
        <button
          onClick={() => {
            const chatBtn = document.querySelector<HTMLButtonElement>(
              'button[aria-label="Open GA assistant"]'
            );
            if (chatBtn) chatBtn.click();
          }}
          className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Try the AI Research Assistant →
        </button>
      </p>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh] sm:pt-[12vh] bg-black/50"
          onClick={() => { setIsOpen(false); setQuery(''); }}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden mx-2 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search all posts..."
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              {isSearching && (
                <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              )}
              <kbd
                className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => { setIsOpen(false); setQuery(''); }}
              >ESC</kbd>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs text-gray-400 border-b bg-gray-50 flex justify-between">
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                  <span>↑↓ navigate · Enter open · ⌘Enter new tab</span>
                </div>
                <ul ref={listRef} className="max-h-[60vh] overflow-y-auto py-1">
                  {results.map(({ entry, contextSnippet }, i) => (
                    <li key={entry.slug} className="group">
                      <div className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-50 ${i === selectedIndex ? 'bg-blue-50' : ''}`}>
                        <Link
                          href={postUrl(entry.slug)}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToResult(entry.slug, false);
                          }}
                          className="flex-1 min-w-0"
                        >
                          <div className="font-medium text-gray-900 truncate">
                            {highlightMatch(entry.title, query)}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {highlightMatch(contextSnippet, query)}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {entry.date && <span className="text-xs text-gray-400">{entry.date}</span>}
                            <span className="text-xs text-gray-400">{entry.readingTime} min read</span>
                          </div>
                        </Link>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${SOURCE_COLORS[entry.source]}`}>
                            {SOURCE_LABELS[entry.source]}
                          </span>
                          <a
                            href={postUrl(entry.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Open in new tab"
                            onClick={(e) => { e.stopPropagation(); saveRecentSearch(query.trim()); }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {query && !isSearching && results.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No results found for &ldquo;{query}&rdquo;
              </div>
            )}

            {/* Recent searches */}
            {showRecent && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs text-gray-400 flex justify-between items-center">
                  <span>Recent searches</span>
                  <button
                    onClick={() => { clearRecentSearches(); setRecentSearches([]); }}
                    className="hover:text-gray-600"
                  >Clear</button>
                </div>
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!query && !showRecent && (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                <p>Search across {posts.length} posts from Substack, GABlog &amp; Anthropomorphics</p>
                <p className="mt-2 text-xs">Tip: Use &ldquo;quotes&rdquo; for exact phrase matching</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
