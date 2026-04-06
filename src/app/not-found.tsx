import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          The sign was emitted but the referent has departed. Try the archive, or ask the archive what you were looking for.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm hover:opacity-80 transition-opacity"
          >
            ← Back to archive
          </Link>
          <Link
            href="/ask"
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            Ask the archive
          </Link>
        </div>
      </div>
    </main>
  );
}
