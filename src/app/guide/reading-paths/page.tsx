import type { Metadata } from 'next';
import ReadingPathFinder from '@/components/ReadingPathFinder';

export const metadata: Metadata = {
  title: 'Reading Paths — Center Study',
  description: 'Find your entry point into Center Study. AI-curated reading paths tailored to your interests and practice.',
};

export default function ReadingPathsPage() {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">Find Your Reading Path</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          Center Study is a practice, not a curriculum. The entry point is wherever you already are. Describe what you are working on or stuck on — and get a reading path built for you.
        </p>
      </div>

      <ReadingPathFinder />
    </main>
  );
}
