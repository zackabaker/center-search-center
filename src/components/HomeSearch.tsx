'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedSearchIcon from '@/components/AnimatedSearchIcon';

type Mode = 'search' | 'ask';

// Suggested starter queries — mix of core theory and contemporary applications
const SUGGESTIONS = [
  'the center',
  'resentment',
  'deferral',
  'succession',
  'sovereignty',
  'AI',
  'media',
  'money',
  'debt',
  'power',
  'scapegoating',
  'prediction markets',
  'technology',
  'governance',
  'names',
];

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('search');
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // icon speeds up as the user engages: idle → typing → launched
  const iconSpeed = isNavigating ? 10 : query.length > 0 ? 3 : 1;

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

  const navigate = (q: string, m: Mode) => {
    setIsNavigating(true);
    const go = () => {
      if (m === 'ask') {
        router.push(q ? `/ask?q=${encodeURIComponent(q)}` : '/ask');
      } else {
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
      }
    };
    setTimeout(() => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as Document & { startViewTransition: (cb: () => void) => void })
          .startViewTransition(go);
      } else {
        go();
      }
    }, 160);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim(), mode);
  };

  const handleSuggestion = (term: string) => {
    setQuery(term);
    navigate(term, mode);
  };

  return (
    <>
      {/* Icon */}
      <div
        className="mx-auto mb-6 flex justify-center"
        style={{ viewTransitionName: 'center-icon' } as React.CSSProperties}
      >
        <AnimatedSearchIcon size={80} speed={iconSpeed} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        {/* Mode toggle */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMode('search')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'search'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Keyword Search
            </button>
            <button
              type="button"
              onClick={() => setMode('ask')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'ask'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              ✦ Ask AI
            </button>
          </div>
        </div>

        {/* Search bar — tall, prominent */}
        <div className="relative flex items-center border-2 border-gray-200 dark:border-gray-700 focus-within:border-gray-500 dark:focus-within:border-gray-400 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'ask'
                ? 'Ask a question about the archive…'
                : 'Search for a concept or phrase…'
            }
            className="flex-1 px-5 py-4 text-lg outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            autoComplete="off"
            autoFocus
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-2 mr-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={isNavigating}
            className="mr-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors flex-shrink-0 disabled:opacity-60"
          >
            {mode === 'ask' ? 'Ask' : 'Search'}
          </button>
        </div>

        {/* Suggested terms */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2">Try searching for</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestion(term)}
                className="px-3 py-1.5 text-xs rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </form>
    </>
  );
}
