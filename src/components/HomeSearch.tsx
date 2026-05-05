'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedSearchIcon from '@/components/AnimatedSearchIcon';

type Mode = 'search' | 'ask';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setIsNavigating(true); // icon jumps to speed 10 immediately

    const navigate = () => {
      if (mode === 'ask') {
        if (q) router.push(`/ask?q=${encodeURIComponent(q)}`);
        else router.push('/ask');
      } else {
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
        else router.push('/search');
      }
    };

    // Brief pause so the speed-up is visible, then trigger view transition
    setTimeout(() => {
      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as Document & { startViewTransition: (cb: () => void) => void })
          .startViewTransition(navigate);
      } else {
        navigate();
      }
    }, 160);
  };

  return (
    <>
      {/* Icon — reacts to state; shared view-transition-name with the search bar icon */}
      <div
        className="mx-auto mb-6 flex justify-center"
        style={{ viewTransitionName: 'center-icon' } as React.CSSProperties}
      >
        <AnimatedSearchIcon size={80} speed={iconSpeed} />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setMode('search')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
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
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                mode === 'ask'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              AI Search
            </button>
          </div>
        </div>

        <div className="relative flex items-center border-2 border-gray-200 dark:border-gray-700 focus-within:border-gray-400 dark:focus-within:border-gray-500 rounded-xl bg-white dark:bg-gray-900 transition-colors">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === 'ask'
                ? 'Ask a question about the archive…'
                : 'Search for a term or phrase…'
            }
            className="flex-1 px-4 py-3 text-base outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400"
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={isNavigating}
            className="mr-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors flex-shrink-0 disabled:opacity-60"
          >
            {mode === 'ask' ? 'AI Search' : 'Search'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-2">
          {mode === 'ask'
            ? 'AI retrieves the best quotes from the archive'
            : 'Keyword search finds matching texts instantly'}
        </p>
      </form>
    </>
  );
}
