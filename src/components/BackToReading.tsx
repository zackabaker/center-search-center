'use client';

import { useEffect, useState } from 'react';

// When the reader lands here from a term link inside a post, give them a
// one-click way back to exactly where they were reading. history.back()
// restores scroll position natively.
export default function BackToReading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const ref = document.referrer;
      if (ref && new URL(ref).origin === window.location.origin && ref.includes('/post/')) {
        setShow(true);
      }
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div className="sticky top-14 z-30 mb-5">
      <button
        onClick={() => window.history.back()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium shadow-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back to where you were reading
      </button>
    </div>
  );
}
