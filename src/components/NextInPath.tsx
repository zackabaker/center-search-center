import Link from 'next/link';
import { READING_PATHS } from '@/data/guide/reading-paths';

interface Props {
  slug: string;
}

export default function NextInPath({ slug }: Props) {
  // Find the first reading path that contains this slug
  for (const path of READING_PATHS) {
    const idx = path.posts.findIndex((p) => p.slug === slug);
    if (idx === -1) continue;

    const isLast = idx === path.posts.length - 1;

    if (isLast) {
      // Honor the path's own opensOnto: completing a path should open the
      // next door, not dump the reader at a dead /guide#anchor.
      const nextPath = path.opensOnto
        .map((s) => READING_PATHS.find((p) => p.slug === s))
        .find(Boolean);
      return (
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Reading path</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Completed: {path.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {nextPath && (
              <Link
                href={`/guide/reading-paths/${nextPath.slug}`}
                className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Continue: {nextPath.title} →
              </Link>
            )}
            <Link
              href="/guide/reading-paths"
              className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              All reading paths
            </Link>
          </div>
        </div>
      );
    }

    const nextPost = path.posts[idx + 1];
    return (
      <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
          Next in {path.title}
        </p>
        <Link
          href={`/post/${nextPost.slug}`}
          className="group flex items-center justify-between gap-3"
        >
          <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-snug">
            {nextPost.title}
          </span>
          <span className="flex-shrink-0 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            →
          </span>
        </Link>
      </div>
    );
  }

  // Post not in any reading path — render nothing
  return null;
}
