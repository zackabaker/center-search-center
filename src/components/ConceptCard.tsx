import Link from 'next/link';
import { findConcept } from '@/lib/query-shape';

// First card of any search that names a curated concept: the quote-first
// concept page, before the raw results.
export default function ConceptCard({ query, className = '' }: { query: string; className?: string }) {
  const concept = findConcept(query);
  if (!concept) return null;
  return (
    <Link
      href={`/guide/concepts/${concept.slug}`}
      className={`group flex items-baseline gap-3 py-3.5 border-y border-gray-900 dark:border-gray-200 ${className}`}
    >
      <span className="text-xs font-mono uppercase tracking-widest text-gray-900 dark:text-gray-100 flex-shrink-0">Concept</span>
      <span className="min-w-0">
        <span className="block font-serif text-[1.375rem] leading-tight font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {concept.title}
        </span>
        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Its definition in the author&rsquo;s words, key passages and key texts
        </span>
      </span>
    </Link>
  );
}
