import { getPublicPosts } from '@/lib/parser';
import Link from 'next/link';
import SceneMark from '@/components/SceneMark';

const SOURCE_COLORS: Record<string, string> = {
  substack:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  gablog:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  book:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  pdf:       'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  reddit:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  twitter:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  ap:        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
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

      {/* Scene glyph — the site mark, gently circulating */}
      <div className="mb-8">
        <SceneMark size={64} spin speed={1} className="text-gray-300 dark:text-gray-600" />
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
          href="/search"
          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          Search
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
