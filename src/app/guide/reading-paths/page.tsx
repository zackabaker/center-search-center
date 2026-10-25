import type { Metadata } from 'next';
import Link from 'next/link';
import { READING_PATHS } from '@/data/guide/reading-paths';

export const metadata: Metadata = {
  title: 'Reading Paths — Center Study',
  description: `${READING_PATHS.length} reading paths through the Center Study archive.`,
};

export default function ReadingPathsPage() {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-10 pb-24">
      <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-gray-900 dark:text-white">Reading Paths</h1>

      <div className="grid sm:grid-cols-2 gap-3">
        {READING_PATHS.map((p) => (
          <Link
            key={p.slug}
            href={`/guide/reading-paths/${p.slug}`}
            className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {p.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{p.posts.length} texts</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
