import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReadingListClient from './ReadingListClient';

export const metadata: Metadata = {
  title: 'Reading List — Center Study Center',
  description: 'Your saved posts and reading history.',
};

export default function ReadingListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ReadingListClient />
    </Suspense>
  );
}
