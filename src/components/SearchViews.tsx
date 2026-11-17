'use client';

import Link from 'next/link';
import { searchHref, type SearchView } from '@/lib/query-shape';

const VIEWS: { id: SearchView; label: string; hint: string }[] = [
  { id: 'exact', label: 'Exact words', hint: 'Every place these words appear' },
  { id: 'similar', label: 'Similar passages', hint: 'Passages that say something like this' },
  { id: 'answer', label: 'Answer', hint: 'A short answer, then the passages behind it' },
];

// The three ways to read one query. The site picks the first by the query's
// shape; these let the reader switch. `onPick` handles a switch in place (the
// search page flips between exact and similar without a navigation).
export default function SearchViews({
  q, active, onPick,
}: {
  q: string;
  active: SearchView;
  onPick?: (view: SearchView) => boolean;
}) {
  return (
    <nav aria-label="Ways to read this search" className="flex gap-5 sm:gap-6 border-b border-gray-900 dark:border-gray-200">
      {VIEWS.map((v) => (
        <Link
          key={v.id}
          href={searchHref(q, v.id)}
          title={v.hint}
          aria-current={v.id === active ? 'page' : undefined}
          onClick={(e) => { if (onPick && onPick(v.id)) e.preventDefault(); }}
          className={`flex items-center min-h-11 text-sm whitespace-nowrap transition-colors ${
            v.id === active
              ? 'font-semibold text-gray-900 dark:text-white shadow-[inset_0_-3px_0_var(--foreground)]'
              : 'font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {v.label}
        </Link>
      ))}
    </nav>
  );
}
