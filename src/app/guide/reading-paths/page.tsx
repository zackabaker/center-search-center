import type { Metadata } from 'next';
import Link from 'next/link';
import ReadingPathFinder from '@/components/ReadingPathFinder';
import { READING_PATHS } from '@/data/guide/reading-paths';

export const metadata: Metadata = {
  title: 'Reading Paths — Center Study',
  description: 'Find your entry point into Center Study. AI-curated reading paths tailored to your interests, plus hand-built sequences through the core of the archive.',
};

const POSTURE_COLORS: Record<string, string> = {
  ostensive:   'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  imperative:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  declarative: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
};

export default function ReadingPathsPage() {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Find Your Reading Path</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          Center Study is a practice, not a curriculum. The entry point is wherever you already are. Describe what you are working on or stuck on — and get a reading path built for you.
        </p>
      </div>

      <ReadingPathFinder />

      {/* Curated paths — hand-built sequences with bridge prose; previously
          unreachable from this index (only via Continue-With links). */}
      <section className="mt-14">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Curated paths</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hand-built sequences through the core of the archive — each text bridged to the next.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {READING_PATHS.map((p) => (
            <Link
              key={p.slug}
              href={`/guide/reading-paths/${p.slug}`}
              className="group block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono uppercase tracking-wide ${POSTURE_COLORS[p.posture] || ''}`}>
                  {p.posture}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{p.posts.length} texts</span>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                {p.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 italic">
                {p.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
