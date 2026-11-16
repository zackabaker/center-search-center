import Link from 'next/link';
import { findConcept } from '@/lib/query-shape';

// First card of any search that names a curated concept: the quote-first
// concept page, before the raw results. The dark "Read about …" button is the
// affordance — without it readers took the card for a label, not a door.
export default function ConceptCard({ query, className = '' }: { query: string; className?: string }) {
  const concept = findConcept(query);
  if (!concept) return null;
  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 py-4 border-y border-gray-900 dark:border-gray-200 ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-xs font-mono uppercase tracking-widest text-gray-900 dark:text-gray-100 mb-1">Concept</span>
        <span className="block font-serif text-[1.5rem] leading-tight font-medium text-gray-900 dark:text-white">
          {concept.title}
        </span>
        <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
          Its definition in the author&rsquo;s words, key passages and key texts
        </span>
      </span>
      <span className="sm:ml-auto inline-flex items-center justify-center gap-2 min-h-11 px-4 flex-shrink-0 text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm group-hover:bg-gray-700 dark:group-hover:bg-gray-200 transition-colors">
        Read about {concept.title}
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}
