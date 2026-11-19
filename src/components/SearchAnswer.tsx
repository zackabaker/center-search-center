'use client';

import Link from 'next/link';
import Markdown from '@/app/oracle/Markdown';
import { findConcept, searchHref } from '@/lib/query-shape';
import answers from '../../tutor/concept-answers.json';

// Under the concept card on a keyword search: when the search names a curated
// concept, the tutor's short answer for it (written ahead of time, so it is
// there at once); for any other search, one link to the AI answer, so it is
// plain that the same search can be read that way.
const ANSWERS = answers as Record<string, { q: string; a: string }>;

export default function SearchAnswer({ query, className = '' }: { query: string; className?: string }) {
  const q = query.trim();
  if (q.length < 2) return null;
  const concept = findConcept(q);
  const saved = concept ? ANSWERS[concept.slug] : undefined;
  if (!saved) {
    return (
      <p className={className}>
        <Link href={searchHref(q, 'answer')} className="text-sm font-medium text-gray-900 underline underline-offset-4 dark:text-gray-100">
          AI answer for “{q}” →
        </Link>
      </p>
    );
  }
  return (
    <section aria-label="AI answer" className={`rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-5 ${className}`}>
      <p className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">AI answer</p>
      <div className="mt-2">
        <Markdown text={saved.a} />
      </div>
      <Link href={`/oracle?ask=${encodeURIComponent(saved.q)}`} className="text-sm font-medium text-gray-900 underline underline-offset-4 dark:text-gray-100">
        Ask a follow-up →
      </Link>
    </section>
  );
}
