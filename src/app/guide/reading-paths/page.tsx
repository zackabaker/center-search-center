import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingPathFinder from '@/components/ReadingPathFinder';
import { READING_PATHS } from '@/data/guide/reading-paths';

export const metadata: Metadata = {
  title: 'Reading Paths — Center Study',
  description: 'Find your entry point into Center Study. AI-curated reading paths tailored to your interests and practice.',
};

export default function ReadingPathsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Find Your Reading Path</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          Center Study is a practice, not a curriculum. The entry point is wherever you already are. Describe what you are working on or stuck on — and get a reading path built for you.
        </p>
      </div>

      {/* Interactive finder */}
      <ReadingPathFinder />

      {/* Divider */}
      <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
          Or browse curated paths
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {READING_PATHS.map((path) => (
            <Link
              key={path.slug}
              href={`/guide/reading-paths/${path.slug}`}
              className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wide">{path.posture}</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{path.posts.length} texts</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm mb-1">
                {path.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{path.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
