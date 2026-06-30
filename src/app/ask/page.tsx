import type { Metadata } from 'next';
import { Suspense } from 'react';
import AskClient from './AskClient';

export const metadata: Metadata = {
  title: 'Ask the Archive',
  description: 'Ask questions across the complete Center Study archive. Synthesized answers grounded in the texts.',
  robots: { index: false, follow: true },
};

export default function AskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-950" />}>
      <AskClient />
    </Suspense>
  );
}
