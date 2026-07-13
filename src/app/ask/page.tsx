import type { Metadata } from 'next';
import { Suspense } from 'react';
import AskClient from './AskClient';
import ANSWERS from '@/data/answers.json';

export const metadata: Metadata = {
  title: 'Ask the Archive',
  description: 'Ask questions across the complete Center Study archive. Synthesized answers grounded in the texts.',
  robots: { index: false, follow: true },
};

export default function AskPage() {
  // Owner-reviewed static answers — instant to open, zero generation cost.
  // The empty state offers these FIRST; live generation is the fallback.
  const reviewed = Object.entries(ANSWERS as Record<string, { question: string }>)
    .slice(0, 6)
    .map(([slug, a]) => ({ slug, question: a.question }));
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <AskClient reviewed={reviewed} />
    </Suspense>
  );
}
