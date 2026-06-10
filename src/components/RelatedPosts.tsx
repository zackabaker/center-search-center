import Link from 'next/link';
import { ContentSource } from '@/lib/types';

// Presentational only. Related entries are computed SERVER-SIDE on the post
// page (which already builds the search-entry index for the sidebar) and
// passed as a slim array. This component previously received ALL 1,969 full
// posts as a client prop — ~31 MB serialized into every post page.

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-orange-100 text-orange-800',
  gablog:    'bg-blue-100 text-blue-800',
  book:      'bg-purple-100 text-purple-800',
  pdf:       'bg-green-100 text-green-800',
  reddit:    'bg-red-100 text-red-800',
  twitter:   'bg-slate-100 text-slate-700',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  ap:        'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack:  'Bouvard',
  gablog:    'GABlog',
  book:      'Book',
  pdf:       'Essay',
  reddit:    'Reddit',
  twitter:   'X / Twitter',
  chronicle: 'CLR',
  ap:        'AP Journal',
};

export interface RelatedPostItem {
  slug: string;
  title: string;
  source: ContentSource;
  date: string | null;
}

export default function RelatedPosts({ related }: { related: RelatedPostItem[] }) {
  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
        Related posts
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((entry) => (
          <Link
            key={entry.slug}
            href={`/post/${entry.slug}`}
            className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                {entry.title}
              </h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${SOURCE_COLORS[entry.source]}`}>
                {SOURCE_LABELS[entry.source]}
              </span>
            </div>
            {entry.date && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{entry.date}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
