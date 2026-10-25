import type { Metadata } from 'next';
import { Suspense } from 'react';
import AskClient from './AskClient';

export const metadata: Metadata = {
  title: 'Ask the Archive',
  description: 'Put a question to the whole archive: the closest verbatim passages, retrieved by meaning, with a brief AI note.',
  robots: { index: false, follow: true },
};

export default function AskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <AskClient />
    </Suspense>
  );
}
