import { getAllPosts } from '@/lib/parser';
import SearchBar from '@/components/SearchBar';
import PostList from '@/components/PostList';
import DarkModeToggle from '@/components/DarkModeToggle';

export default function Home() {
  const posts = getAllPosts();

  const sorted = [...posts].sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 overflow-x-hidden">
      <header className="text-center mb-8 sm:mb-10">
        <div className="flex justify-end mb-2">
          <DarkModeToggle />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Center Search Center
        </h1>
        <p className="text-xs sm:text-base text-gray-500 mb-4 px-2">
          Search archive of Center Study Center, GABlog &amp; Anthropomorphics
        </p>
        <blockquote className="italic text-sm text-gray-400 dark:text-gray-500 mb-6 px-6 max-w-2xl mx-auto border-l-2 border-gray-200 dark:border-gray-700 text-left">
          &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it&rdquo;
        </blockquote>
        <SearchBar posts={sorted} />
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-3">
          New to Center Study?{' '}
          <a href="/intro" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline">
            Start here
          </a>
        </p>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">All posts</h2>
        <PostList posts={sorted} />
      </section>
    </main>
  );
}
