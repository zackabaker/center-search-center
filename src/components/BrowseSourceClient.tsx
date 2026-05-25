'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';

interface Props {
  posts: Post[];
  source: string; // source slug, e.g. 'gablog' or 'threads'
  totalCount: number;
}

const PAGE_SIZE = 50;

function matchScore(post: Post, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q)
  );
}

// Group posts by year for dated sources
function groupByYear(posts: Post[]): [string, Post[]][] {
  const groups: Map<string, Post[]> = new Map();
  for (const p of posts) {
    const year = p.date ? new Date(p.date).getFullYear().toString() : 'Undated';
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(p);
  }
  // Sort years descending, 'Undated' last
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === 'Undated') return 1;
    if (b === 'Undated') return -1;
    return parseInt(b) - parseInt(a);
  });
}

export default function BrowseSourceClient({ posts, source, totalCount }: Props) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return posts;
    return posts.filter((p) => matchScore(p, q));
  }, [posts, query]);

  const isFiltering = query.trim().length > 0;

  // When filtering, show all matches (no pagination); when browsing, paginate
  const totalPages = isFiltering ? 1 : Math.ceil(posts.length / PAGE_SIZE);
  const displayPosts = isFiltering
    ? filtered
    : posts.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const hasDates = posts.some((p) => p.date);
  const useYearGroups = hasDates && !isFiltering && page === 0;

  // year groups only on first page when not filtering
  const yearGroups = useYearGroups ? groupByYear(displayPosts) : null;

  const handleQuery = (val: string) => {
    setQuery(val);
    setPage(0);
  };

  const backParam = `?back=/browse/${source}`;

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-5">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => handleQuery(e.target.value)}
          placeholder="Filter by title or topic…"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
        />
        {query && (
          <button
            onClick={() => handleQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-0.5 rounded"
            aria-label="Clear filter"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter result count */}
      {isFiltering && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {filtered.length === 0
            ? `No matches for "${query}"`
            : `${filtered.length} of ${totalCount} posts match "${query}"`}
        </p>
      )}

      {/* Post list */}
      {displayPosts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">No posts match &ldquo;{query}&rdquo;</p>
          <button
            onClick={() => handleQuery('')}
            className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filter
          </button>
        </div>
      ) : yearGroups ? (
        // Year-grouped layout (first page, unfiltered, dated source)
        <div className="space-y-8">
          {yearGroups.map(([year, yearPosts]) => (
            <div key={year}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {year}
                </span>
                <span className="text-[10px] text-gray-300 dark:text-gray-700">{yearPosts.length}</span>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {yearPosts.map((post, i) => (
                  <PostRow key={post.slug} post={post} backParam={backParam} isLast={i === yearPosts.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat list (filtered or undated source)
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {displayPosts.map((post, i) => (
            <PostRow key={post.slug} post={post} backParam={backParam} isLast={i === displayPosts.length - 1} />
          ))}
        </div>
      )}

      {/* Pagination (unfiltered view only) */}
      {!isFiltering && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Newer
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Older →
            </button>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}

function PostRow({
  post,
  backParam,
  isLast,
}: {
  post: Post;
  backParam: string;
  isLast: boolean;
}) {
  return (
    <Link
      href={`/post/${post.slug}${backParam}`}
      className={`group flex flex-col gap-1 p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors ${
        isLast ? '' : 'border-b border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug flex-1">
          {post.title}
        </h3>
        {post.date && (
          <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 tabular-nums">
            {post.date}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}
