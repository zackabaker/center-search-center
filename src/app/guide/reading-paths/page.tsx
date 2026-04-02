import Link from 'next/link';
import { READING_PATHS } from '@/data/guide/reading-paths';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reading Paths — Introduction to Center Study',
  description: 'Curated reading sequences through the Center Study archive — ordered, bridged, and contextualized.',
};

const POSTURE_COLORS = {
  ostensive:   'bg-blue-50 text-blue-700 border-blue-200',
  imperative:  'bg-amber-50 text-amber-700 border-amber-200',
  declarative: 'bg-green-50 text-green-700 border-green-200',
};

export default function ReadingPathsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <Link href="/guide" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Introduction</Link>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-4 mb-2">Layer III · Declarative</p>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Reading Paths</h1>
        <p className="text-gray-500 leading-relaxed max-w-2xl">
          Each path is a curated sequence through the archive — ordered, bridged, and contextualized. Each path has a rhetorical posture: ostensive (pointing), imperative (directing), or declarative (claiming). Begin with <strong>The Foundation</strong> if you are new. The paths converge; all of them eventually open onto the others.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {READING_PATHS.map((path) => (
          <Link
            key={path.slug}
            href={`/guide/reading-paths/${path.slug}`}
            className="group block p-5 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono uppercase tracking-wide ${POSTURE_COLORS[path.posture]}`}>
                {path.posture}
              </span>
              <span className="text-xs text-gray-400">{path.posts.length} texts</span>
            </div>
            <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {path.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{path.subtitle}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-400">
        <p>
          Every text in the archive appears in at least one reading path.{' '}
          <Link href="/guide/timeline" className="text-blue-500 hover:underline">View the full chronological archive →</Link>
        </p>
      </div>
    </main>
  );
}
