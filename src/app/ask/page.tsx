import type { Metadata } from 'next';
import { Suspense } from 'react';
import AskClient from './AskClient';

export const metadata: Metadata = {
  title: 'Ask AI',
  description: 'Put a question to the whole archive: the closest verbatim passages, retrieved by meaning, with a brief AI note.',
  robots: { index: false, follow: true },
};

// The page reads its search params on the server ON PURPOSE, although only the
// client component uses them. A fully static page is cached by Next's client
// router as one entry for every ?q=, and that entry remembers the first
// question's URL — so asking a second question (home box → back → ask again)
// navigated to the FIRST question's URL and showed its answer (Next 16.2.1).
// Awaiting searchParams makes the route vary by query, so each question gets
// its own entry.
export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
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
