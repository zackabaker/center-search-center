import { Suspense } from 'react';
import { getAllPosts } from '@/lib/parser';
import SearchPageClient from './SearchPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Full-text search across the Center Study archive',
};

export default function SearchPage() {
  const posts = getAllPosts().sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date && !b.date) return -1;
    if (!a.date && b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <Suspense fallback={
      <main className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-400">
        Loading search…
      </main>
    }>
      <SearchPageClient posts={posts} />
    </Suspense>
  );
}
