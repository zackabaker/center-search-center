import type { Metadata } from 'next';
import { Suspense } from 'react';
import IdiomsClient from './IdiomsClient';

export const metadata: Metadata = {
  title: 'Idiom Archive',
  description: 'The passages you have saved from the Center Study archive.',
  // Personal, per-reader page — nothing here for a search engine.
  robots: { index: false, follow: false },
};

export default function IdiomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <IdiomsClient />
    </Suspense>
  );
}
