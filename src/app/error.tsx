'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-xl w-full mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Something went wrong
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        The sign was emitted, but the rendering failed.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-gray-300 dark:text-gray-700 font-mono">
          {error.digest}
        </p>
      )}
    </main>
  );
}
