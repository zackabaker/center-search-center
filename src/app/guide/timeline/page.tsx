import { getAllPosts, getPublicPosts } from '@/lib/parser';
import type { Metadata } from 'next';
import TimelineDisplay from './TimelineDisplay';
import GoBack from '@/components/GoBack';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Timeline — Center Study Center',
  description: 'All dated Center Study posts grouped by year.',
};

export default function TimelinePage() {
  const allPosts = getPublicPosts();

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
    <main className="max-w-4xl w-full mx-auto px-4 pt-8 pb-24 sm:py-12">
      <div className="mb-6">
        <GoBack fallback="/browse" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm" />
      </div>

      <TimelineDisplay yearGroups={yearGroups} totalCount={dated.length} />
    </main>
  );
}
