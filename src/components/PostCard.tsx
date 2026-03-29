import Link from 'next/link';
import { Post, ContentSource } from '@/lib/types';

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'PDF',
  glossary: 'Glossary',
  reddit: 'Reddit',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  glossary: 'bg-teal-100 text-teal-800',
  reddit: 'bg-red-100 text-red-800',
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="block p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white overflow-hidden"
    >
      <div className="flex items-start gap-2 mb-1.5">
        <span
          className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${
            SOURCE_COLORS[post.source]
          }`}
        >
          {SOURCE_LABELS[post.source]}
        </span>
        {post.date && (
          <span className="text-xs text-gray-400 whitespace-nowrap">{post.date}</span>
        )}
      </div>
      <h3 className="font-medium text-sm sm:text-base text-gray-900 leading-snug mb-1.5">
        {post.title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
    </Link>
  );
}
