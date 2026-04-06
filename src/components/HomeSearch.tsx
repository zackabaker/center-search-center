'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'ask' | 'search';

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('ask');
  const router = useRouter();

  // ⌘K / Ctrl+K → go to search mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (mode === 'ask') {
      if (q) router.push(`/ask?q=${encodeURIComponent(q)}`);
      else router.push('/ask');
    } else {
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      else router.push('/search');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center border-2 border-gray-200 dark:border-gray-700 focus-within:border-gray-400 dark:focus-within:border-gray-500 rounded-xl bg-white dark:bg-gray-900 transition-colors">
        {/* Mode toggle — left inside the bar */}
        <div className="flex items-center gap-0.5 ml-2 my-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMode('ask')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'ask'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Ask
          </button>
          <button
            type="button"
            onClick={() => setMode('search')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              mode === 'search'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Search
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2 flex-shrink-0" />

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === 'ask'
              ? 'Ask a question about the archive…'
              : 'Search for a term or phrase…'
          }
          className="flex-1 py-3 text-base outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400"
          autoComplete="off"
        />

        {/* Submit arrow */}
        <button
          type="submit"
          className="mr-2 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0"
          title={mode === 'ask' ? 'Ask the archive' : 'Search'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-2">
        {mode === 'ask' ? (
          <>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Ask</span> synthesizes an answer from the archive
          </>
        ) : (
          <>
            <span className="text-gray-600 dark:text-gray-300 font-medium">Search</span> finds matching texts by keyword
          </>
        )}
      </p>
    </form>
  );
}
