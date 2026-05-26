import { Suspense } from 'react';
import { getAllPosts } from '@/lib/parser';
import { buildSearchEntries } from '@/lib/search-index';
import SearchPageClient from './SearchPageClient';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Search',
  description: 'Full-text search across the Center Study archive',
};

export default function SearchPage() {
  // Build the search index on the server (runs once per ISR cycle, not on every client load).
  // Passes pre-tokenised SearchEntry[] to the client — no useMemo blocking the browser thread,
  // and no full post content in the serialised payload.
  const posts = getAllPosts().sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });
  const entries = buildSearchEntries(posts);

  return (
    <Suspense fallback={
      <main className="max-w-4xl w-full mx-auto px-4 py-10 text-center text-gray-400">
        Loading search…
      </main>
    }>
      <SearchPageClient entries={entries} totalPosts={posts.length} />
    </Suspense>
  );
}
