import { notFound } from 'next/navigation';
import Link from 'next/link';
import { READING_PATHS, getPathBySlug } from '@/data/guide/reading-paths';
import ActivePathTracker from '@/components/ActivePathTracker';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return READING_PATHS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) return {};
  return {
    title: `${path.title} — Center Study Reading Paths`,
    description: path.subtitle,
  };
}

const SOURCE_COLORS: Record<string, string> = {
  GABlog:   'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  PDF:      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Book:     'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

const POSTURE_COLORS = {
  ostensive:   'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  imperative:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  declarative: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
};

export default async function ReadingPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) notFound();

  const opensPaths = path.opensOnto
    .map((s) => READING_PATHS.find((p) => p.slug === s))
    .filter(Boolean);

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10">
      <ActivePathTracker pathSlug={path.slug} />
      <div className="mb-8">
        <Link href="/guide/reading-paths" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          ← Reading paths
        </Link>
        <div className="flex items-center gap-3 mt-4 mb-2">
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest">Reading Path</p>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono uppercase tracking-wide ${POSTURE_COLORS[path.posture]}`}>
            {path.posture}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 text-gray-900 dark:text-white">{path.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm italic">{path.subtitle}</p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-700 dark:border-gray-400 px-5 py-4 rounded-r-xl mb-10">
        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Introduction</p>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{path.intro}</p>
      </div>

      {/* Post sequence */}
      <section className="mb-10">
        <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
          The Sequence — {path.posts.length} texts
        </h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />

          <div className="space-y-0">
            {path.posts.map((post, i) => (
              <div key={post.slug} className="relative">
                {/* Post card */}
                <div className="ml-10 pl-4 pb-2">
                  <div className="flex items-start gap-3 group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all">
                    {/* Step number */}
                    <div className="absolute -left-0.5 top-4 w-9 h-9 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold flex-shrink-0 z-10">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${SOURCE_COLORS[post.source] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {post.source}
                        </span>
                      </div>
                      <Link
                        href={`/post/${post.slug}`}
                        className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bridge note */}
                {post.bridge && i < path.posts.length - 1 && (
                  <div className="ml-10 pl-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="absolute left-3.5 top-0 bottom-0 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic pl-1">{post.bridge}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion — where the path leaves you, and where to go next */}
      {path.conclusion && (
        <div className="bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-700 dark:border-gray-400 px-5 py-4 rounded-r-xl mb-10">
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Where this leaves you</p>
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{path.conclusion}</p>
        </div>
      )}

      {/* Continue with */}
      {opensPaths.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Continue With</h2>
          <div className="flex flex-wrap gap-2">
            {opensPaths.map((p) => (
              <Link
                key={p!.slug}
                href={`/guide/reading-paths/${p!.slug}`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                {p!.title} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center justify-between text-sm">
        <Link href="/guide/reading-paths" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">← All paths</Link>
        <Link href="/guide/concepts" className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Concept pages →</Link>
      </div>
    </main>
  );
}
