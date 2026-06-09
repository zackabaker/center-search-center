import { getAllPosts, getPublicPosts } from '@/lib/parser';
import Link from 'next/link';

const SOURCE_COLORS: Record<string, string> = {
  substack:  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  reddit:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  twitter:   'bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300',
  ap:        'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};
const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Book',
  pdf: 'Essay', reddit: 'Reddit', twitter: 'X', ap: 'AP Journal',
};

export default function NotFound() {
  const posts = getPublicPosts();

  // Pick 4 posts spread across the archive so we get variety
  const suggestions = posts.length >= 4
    ? [0, 1, 2, 3].map((i) => posts[Math.floor((posts.length / 4) * i + posts.length / 8)])
    : posts.slice(0, 4);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">

      {/* Concentric-circles logo */}
      <div className="mb-8 opacity-30">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-gray-900 dark:text-white" />
          <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-gray-900 dark:text-white" />
          <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="1.5" className="text-gray-900 dark:text-white" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" className="text-gray-900 dark:text-white" />
        </svg>
      </div>

      {/* Copy */}
      <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        The sign was emitted
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 text-center max-w-sm">
        but the referent has departed. The page you&rsquo;re looking for doesn&rsquo;t exist — try searching or reading something instead.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          ← Home
        </Link>
        <Link
          href="/search"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          Search
        </Link>
        <Link
          href="/ask"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          Ask AI
        </Link>
      </div>

      {/* Random post suggestions */}
      {suggestions.length > 0 && (
        <div className="w-full max-w-md">
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 text-center">
            You might read
          </p>
          <div className="space-y-2">
            {suggestions.map((post) => (
              <Link
                key={post.slug}
                href={`/post/${post.slug}`}
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900 transition-colors group"
              >
                <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 ${SOURCE_COLORS[post.source] ?? ''}`}>
                  {SOURCE_LABELS[post.source] ?? post.source}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug line-clamp-2">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
