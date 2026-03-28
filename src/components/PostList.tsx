'use client';

import { useState, useMemo } from 'react';
import { Post, ContentSource } from '@/lib/types';
import PostCard from './PostCard';
import FilterTabs from './FilterTabs';

type FilterOption = 'all' | ContentSource;
const PAGE_SIZE = 30;

export default function PostList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.source === filter)),
    [posts, filter]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const counts: Record<FilterOption, number> = {
    all: posts.length,
    substack: posts.filter((p) => p.source === 'substack').length,
    gablog: posts.filter((p) => p.source === 'gablog').length,
    book: posts.filter((p) => p.source === 'book').length,
    pdf: posts.filter((p) => p.source === 'pdf').length,
    glossary: posts.filter((p) => p.source === 'glossary').length,
    reddit: posts.filter((p) => p.source === 'reddit').length,
  };

  const handleFilterChange = (f: FilterOption) => {
    setFilter(f);
    setPage(0);
  };

  return (
    <div>
      <div className="mb-6">
        <FilterTabs active={filter} onChange={handleFilterChange} counts={counts} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => {
              // Show first, last, and pages near current
              if (
                i === 0 ||
                i === totalPages - 1 ||
                Math.abs(i - page) <= 1
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 text-sm rounded-lg ${
                      i === page
                        ? 'bg-gray-900 text-white'
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              }
              if (i === 1 && page > 3) {
                return <span key={i} className="px-1 text-gray-400">...</span>;
              }
              if (i === totalPages - 2 && page < totalPages - 4) {
                return <span key={i} className="px-1 text-gray-400">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>

          <span className="text-[10px] sm:text-xs text-gray-400 ml-1 sm:ml-2">
            {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
        </div>
      )}
    </div>
  );
}
