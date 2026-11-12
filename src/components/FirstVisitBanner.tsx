'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Slim dismissible header shown on post pages to visitors who haven't been
// oriented yet. Renders nothing on the server and until mount (localStorage
// isn't available during SSR), nothing for the owner (csc-mine), and nothing
// once dismissed — following the /begin link also counts as dismissal.
export default function FirstVisitBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('csc-mine') === '1') return;
      if (localStorage.getItem('csc-intro-seen') === '1') return;
      setShow(true);
    } catch {
      // storage blocked (private mode) — stay hidden
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem('csc-intro-seen', '1');
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 text-sm print:hidden">
      <p className="text-gray-600 dark:text-gray-300">
        New to Center Study?{' '}
        <Link
          href="/begin"
          onClick={dismiss}
          className="font-medium text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
        >
          Getting started →
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-md p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
