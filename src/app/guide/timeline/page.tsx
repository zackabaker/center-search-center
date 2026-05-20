import { getAllPosts } from '@/lib/parser';
import Link from 'next/link';
import type { Metadata } from 'next';
import TimelineDisplay from './TimelineDisplay';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Timeline — Center Study Center',
  description: 'All dated Center Study posts grouped by year.',
};

export default function TimelinePage() {
  const allPosts = getAllPosts();

  const dated = allPosts
    .filter((p) => p.date)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  // Group by year, newest first
  const byYear = new Map<string, typeof dated>();
  for (const post of dated) {
    const year = new Date(post.date!).getFullYear().toString();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(post);
  }
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));

  const yearGroups = years.map((year) => ({
    year,
    posts: byYear.get(year)!.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date!,
      source: p.source,
    })),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 pt-8 pb-24 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <TimelineDisplay yearGroups={yearGroups} totalCount={dated.length} />
    </main>
  );
}
