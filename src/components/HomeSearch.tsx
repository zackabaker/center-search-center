'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SceneMark from '@/components/SceneMark';
import RollingLoader from '@/components/RollingLoader';
import Link from 'next/link';
import { searchHref } from '@/lib/query-shape';
import starters from '../../tutor/starters.json';

// Under the box: questions worth asking, each opening the tutor's saved
// answer (owner direction, 2026-11-19: these replace the single-word search
// suggestions). The list is the tutor's own starter list.
const QUESTIONS = starters as { id: string; q: string }[];

export default function HomeSearch() {
  const [query, setQuery] = useState('');
  // One box, no mode toggle (owner direction, 2026-11-16): the query's shape
  // picks the first view — a word or phrase gets exact matches, a sentence
  // gets similar passages, a question gets an answer. See lib/query-shape.
  const [isNavigating, setIsNavigating] = useState(false);
  const [compact, setCompact] = useState(false);
  const router = useRouter();

  // Shorter placeholder on phones so it doesn't truncate next to the button.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // icon speeds up as the user engages: idle → typing → launched.
  // Typing must be UNMISTAKABLY alive (8× ≈ 2.25s/rotation) — at 3× the
  // reaction was too subtle to register as a response to input.
  const iconSpeed = isNavigating ? 12 : query.length > 0 ? 8 : 1;

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

  const navigate = (q: string) => {
    setIsNavigating(true);
    const go = () => router.push(searchHref(q));
    setTimeout(() => {
      // The transition is decoration; the navigation must not depend on it.
      // A hidden tab aborts the transition (and delays its callback), so go
      // straight there in that case, and swallow the aborted-transition
      // rejections that otherwise surface as unhandled errors.
      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        document.visibilityState === 'visible'
      ) {
        const vt = (document as Document & {
          startViewTransition: (cb: () => void) => { ready?: Promise<unknown>; finished?: Promise<unknown> };
        }).startViewTransition(go);
        vt?.ready?.catch(() => {});
        vt?.finished?.catch(() => {});
      } else {
        go();
      }
    }, 160);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim());
  };

  return (
    <>
      {/* Icon — desktop only; on mobile it pushed the search bar below the
          fold, so it's hidden there to keep search visible */}
      <div
        className="mx-auto mb-6 hidden sm:flex justify-center"
        style={{ viewTransitionName: 'center-icon' } as React.CSSProperties}
      >
        <SceneMark size={80} spin speed={iconSpeed} className="text-gray-400 dark:text-gray-500" />
      </div>
      {/* Small top margin on mobile so the search sits comfortably below the CTA */}
      <div className="h-2 sm:hidden" />

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        {/* Search bar — tall, prominent */}
        <div className="relative flex items-center border-2 border-gray-200 dark:border-gray-700 focus-within:border-gray-500 dark:focus-within:border-gray-400 rounded-2xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={compact ? 'A word, a phrase, a question…' : 'Search a word or phrase, or ask a question…'}
            className="flex-1 px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-w-0"
            autoComplete="off"
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
            className="mr-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors flex-shrink-0 disabled:opacity-60 whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Starter questions. Once a search is launched they give way to the
            rolling loader (owner direction, 2026-11-17): suggestions under a
            search that is already running read as noise. The chips keep
            their space (transparent, not `invisible`: a global rule keeps
            buttons visible) so nothing below jumps. */}
        <div className="mt-4 relative">
          <div className={isNavigating ? 'opacity-0 pointer-events-none' : undefined} aria-hidden={isNavigating || undefined}>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2">Or start with a question</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {QUESTIONS.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/oracle/a/${s.id}`}
                    tabIndex={isNavigating ? -1 : undefined}
                    className="block h-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    {s.q}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {isNavigating && (
            <div className="absolute inset-x-0 top-2">
              <RollingLoader label={query.trim() ? <>Searching for &ldquo;{query.trim()}&rdquo;&hellip;</> : <>Opening search&hellip;</>} />
            </div>
          )}
        </div>
      </form>
    </>
  );
}
