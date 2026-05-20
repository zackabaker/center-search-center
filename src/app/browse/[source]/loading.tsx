export default function BrowseLoading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-4 w-24 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-4" />
        <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mb-2" />
        <div className="h-4 w-64 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>

      {/* Post list skeleton */}
      <div className="space-y-px">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="py-3 border-b border-gray-100 dark:border-gray-800 flex items-start gap-4"
          >
            <div className="h-4 w-20 rounded bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <div
                className="h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
                style={{ width: `${70 + (i % 5) * 6}%` }}
              />
              <div
                className="h-3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
                style={{ width: `${40 + (i % 4) * 8}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
