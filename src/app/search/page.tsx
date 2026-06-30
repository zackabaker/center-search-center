import { Suspense } from 'react';
import SearchIndexLoader from './SearchIndexLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Full-text search across the Center Study archive',
  // Unbounded ?q= result pages are thin/duplicative — keep them out of the index
  // but let crawlers follow through to the real posts.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  // The search index is fetched client-side from /api/search-index (cached
  // JSON) rather than serialized into this page's HTML — embedding it here
  // produced a ~16 MB document that blocked first paint.
  return (
    <Suspense fallback={
      <main className="max-w-4xl w-full mx-auto px-4 py-10 text-center text-gray-400">
        Loading search…
      </main>
    }>
      <SearchIndexLoader />
    </Suspense>
  );
}
