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
    // The fallback renders during hydration — on a phone connection a blank
    // div here showed as a long white flash before the UI popped in.
    <Suspense
      fallback={
        <div className="h-[calc(100vh-3rem)] bg-white dark:bg-gray-950 flex items-center justify-center">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 animate-pulse">
            Ask AI
          </p>
        </div>
      }
    >
      <AskClient />
    </Suspense>
  );
}
