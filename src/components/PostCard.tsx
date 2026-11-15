import Link from 'next/link';
import { Post, ContentSource } from '@/lib/types';

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

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  gablog:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  book:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  pdf:       'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  reddit:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  twitter:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  chronicle: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  ap:        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex flex-col py-4 border-b border-gray-200 dark:border-gray-700 transition-colors overflow-hidden active:bg-gray-50 dark:active:bg-gray-800"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
              SOURCE_COLORS[post.source]
            }`}
          >
            {SOURCE_LABELS[post.source]}
          </span>
          {post.date && (
            <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{post.date}</span>
          )}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="font-serif font-medium text-[1.1875rem] text-gray-900 dark:text-gray-100 leading-[1.25] mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {post.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
    </Link>
  );
}
