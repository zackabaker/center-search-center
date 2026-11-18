export default function AnalyticsLoading() {
  // /analytics is a big, fully-dynamic console page (live KV + GSC + X reads)
  // with no client-side loading state of its own — without this, clicking
  // into it from the nav looks like nothing happened for a second or more
  // while the server render runs.
  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">
      <div className="mb-6">
        <div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-4" />
        <div className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
            style={{ width: `${55 + (i % 4) * 10}%` }}
          />
        ))}
      </div>
    </main>
  );
}
