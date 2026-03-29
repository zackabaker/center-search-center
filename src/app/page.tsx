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
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10 overflow-x-hidden">
      <header className="text-center mb-6 sm:mb-8">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          Center Search Center
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          <a href="/intro" className="hover:text-blue-500 dark:hover:text-blue-400 hover:underline transition-colors">
            New to Center Study? Start here →
          </a>
        </p>
        <SearchBar posts={sorted} />
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-4">All posts</h2>
        <PostList posts={sorted} />
      </section>
    </main>
  );
}
