// Shown instantly while the post page SSRs — covers dynamic routes (twitter/reddit)
// that aren't pre-generated at build time.
export default function PostLoading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12">
      {/* Top nav skeleton */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="h-9 w-28 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>

      <article>
        <header className="mb-6 sm:mb-8">
          {/* Badge + meta row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-5 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-16 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-4 w-12 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>

          {/* Title */}
          <div className="space-y-2 mb-4">
            <div className="h-8 w-4/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-8 w-3/5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-8 w-24 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-8 w-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
        </header>

        {/* Content paragraphs */}
        <div className="space-y-4">
          {[100, 90, 95, 85, 92, 78, 88].map((w, i) => (
            <div key={i} className="space-y-2">
              <div
                className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
                style={{ width: `${w}%` }}
              />
              <div
                className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
                style={{ width: `${w - 8}%` }}
              />
              {i % 2 === 0 && (
                <div
                  className="h-4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"
                  style={{ width: `${w - 20}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </article>
    </main>
  );
}
