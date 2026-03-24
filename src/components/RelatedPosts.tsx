'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Post, ContentSource } from '@/lib/types';
import { buildSearchEntries, getRelatedEntries } from '@/lib/search-index';

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  glossary: 'bg-teal-100 text-teal-800',
};

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Book',
  pdf: 'PDF',
  glossary: 'Glossary',
};

export default function RelatedPosts({
  currentSlug,
  allPosts,
}: {
  currentSlug: string;
  allPosts: Post[];
}) {
  const related = useMemo(() => {
    const entries = buildSearchEntries(allPosts);
    const current = entries.find((e) => e.slug === currentSlug);
    if (!current) return [];
    return getRelatedEntries(current, entries);
  }, [currentSlug, allPosts]);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Related posts
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {related.map((entry) => (
          <Link
            key={entry.slug}
            href={`/post/${entry.slug}`}
            className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium text-gray-900 leading-snug">
                {entry.title}
              </h4>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${SOURCE_COLORS[entry.source]}`}>
                {SOURCE_LABELS[entry.source]}
              </span>
            </div>
            {entry.date && (
              <p className="text-xs text-gray-400 mt-1">{entry.date}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
