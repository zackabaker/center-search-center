import { getAllPosts } from '@/lib/parser';
import HomeSearch from '@/components/HomeSearch';
import PostList from '@/components/PostList';
import DarkModeToggle from '@/components/DarkModeToggle';
import CenterIcon from '@/components/CenterIcon';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();

  const sorted = [...posts].sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">

      {/* Top nav */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
            Center Study Center
          </span>
          <div className="flex items-center gap-4">
            <Link href="/intro" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Intro
            </Link>
            <Link href="/ask" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Ask
            </Link>
            <Link href="/guide/concepts" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Concepts
            </Link>
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-4 pt-14 pb-12 text-center">
        <CenterIcon />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5">
          Center Study Center
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-8 max-w-lg mx-auto leading-relaxed">
          &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it&rdquo;
        </p>

        <HomeSearch />
      </header>

      {/* Navigation cards */}
      <div className="max-w-3xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/intro"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <span className="text-xl">📖</span>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Intro</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Introduction to Center Study</p>
            </div>
          </Link>
          <Link
            href="/ask"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-900 dark:border-white bg-gray-900 dark:bg-white hover:opacity-80 transition-all"
          >
            <span className="text-xl">💬</span>
            <div className="text-center">
              <p className="text-sm font-medium text-white dark:text-gray-900">Ask</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 hidden sm:block">Synthesized answers</p>
            </div>
          </Link>
          <Link
            href="/guide/concepts"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <span className="text-xl">🗂</span>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Concepts</p>
              <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Key vocabulary index</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Archive */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Browse the Archive</h2>
              <p className="text-sm text-gray-400 mt-0.5">{posts.length} texts — GABlog, Substack, PDFs, book</p>
            </div>
            <Link href="/stats" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Corpus stats →
            </Link>
          </div>
          <PostList posts={sorted} />
        </div>
      </div>

    </div>
  );
}
