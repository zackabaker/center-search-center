import { getAllPosts } from '@/lib/parser';
import HomeSearch from '@/components/HomeSearch';
import PostList from '@/components/PostList';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const posts = getAllPosts();

  const sorted = [...posts].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 overflow-x-hidden">
      <header className="text-center mb-6 sm:mb-8">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          Center Search Center
        </h1>
        <blockquote className="italic text-sm text-gray-400 dark:text-gray-500 mb-5 px-4 max-w-xl mx-auto border-l-2 border-gray-200 dark:border-gray-700 text-left">
          &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it&rdquo;
        </blockquote>
        <HomeSearch />
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400 dark:text-gray-500">
          <a href="/intro" className="hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors">
            New to Center Study? Start here →
          </a>
          <span className="hidden sm:inline text-gray-200 dark:text-gray-700">|</span>
          <a href="/concepts" className="hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors">
            Concept index
          </a>
          <span className="hidden sm:inline text-gray-200 dark:text-gray-700">|</span>
          <a href="/stats" className="hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors">
            Corpus stats
          </a>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">All posts</h2>
        <PostList posts={sorted} />
      </section>
    </main>
  );
}
