'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Year chips for the big dated archives (Chronicles, AP). Client component so
// the ACTIVE chip can come from useSearchParams — reading searchParams in the
// server page would opt the whole route into per-request rendering and void
// its ISR cache (the /post generateStaticParams lesson, hub edition).
export default function YearNav({ years, src }: { years: number[]; src: string }) {
  const sp = useSearchParams();
  const from = sp.get('from');
  const to = sp.get('to');
  const activeYear = from && from === to ? parseInt(from, 10) : undefined;

  if (years.length <= 1) return null;

  return (
    <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-1.5 min-w-max">
        <Link
          href={`/browse/${src}`}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium tabular-nums transition-colors ${
            activeYear === undefined
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </Link>
        {years.map((y) => (
          <Link
            key={y}
            href={`/browse/${src}?from=${y}&to=${y}`}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium tabular-nums transition-colors ${
              activeYear === y
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {y}
          </Link>
        ))}
      </div>
    </div>
  );
}
