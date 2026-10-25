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
    description: `${path.title}: ${path.posts.length} texts.`,
  };
}

export default async function ReadingPathPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) notFound();

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10">
      <ActivePathTracker pathSlug={path.slug} />
      <div className="mb-8">
        <Link href="/guide/reading-paths" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          ← Reading paths
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mt-4 text-gray-900 dark:text-white">{path.title}</h1>
      </div>

      <ol className="list-decimal pl-6 space-y-3">
        {path.posts.map((post) => (
          <li key={post.slug} className="text-gray-900 dark:text-gray-100">
            <Link
              href={`/post/${post.slug}`}
              className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.title}
            </Link>{' '}
            <span className="text-sm text-gray-500 dark:text-gray-400">({post.source})</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
