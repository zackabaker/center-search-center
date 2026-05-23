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
      return (
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Reading path</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Completed: {path.title}
          </p>
          <Link
            href={`/guide#${path.slug}`}
            className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back to reading paths
          </Link>
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
