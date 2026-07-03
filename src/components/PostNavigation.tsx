import Link from 'next/link';

interface NavPost {
  slug: string;
  title: string;
  date: string | null;
}

interface Props {
  prev: NavPost | null;
  next: NavPost | null;
  source: string;
}

const SOURCE_LABELS: Record<string, string> = {
  substack: 'the Substack',
  gablog: 'the GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  reddit: 'the threads',
  twitter: 'the threads',
  chronicle: 'the Chronicles of Love & Resentment',
  ap: 'the Anthropoetics Journal',
  lecture: 'the Lecture Series',
};

export default function PostNavigation({ prev, next, source }: Props) {
  if (!prev && !next) return null;

  const sourceLabel = SOURCE_LABELS[source] ?? source;

  return (
    <nav className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 print:hidden">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        More from {sourceLabel}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          {prev ? (
            <Link
              href={`/post/${prev.slug}`}
              className="group flex flex-col h-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">← Previous</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {prev.title}
              </span>
              {prev.date && (
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{prev.date}</span>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
        <div>
          {next ? (
            <Link
              href={`/post/${next.slug}`}
              className="group flex flex-col h-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900 text-right"
            >
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">Next →</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {next.title}
              </span>
              {next.date && (
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">{next.date}</span>
              )}
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </nav>
  );
}
