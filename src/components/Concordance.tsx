'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TERM_TO_CONCEPT_SLUG } from '@/data/guide/concepts';

interface Term {
  word: string;
  count: number;
  isDomain: boolean;
}

interface Props {
  terms: Term[];
  /** Sidebar mode: no outer margins/borders, no <details> wrapper, terms always visible */
  compact?: boolean;
}

const INITIAL_SHOW = 10;

function TermList({
  terms,
  showAll,
  setShowAll,
}: {
  terms: Term[];
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  const maxCount = Math.max(...terms.map((t) => t.count));
  const visible = showAll ? terms : terms.slice(0, INITIAL_SHOW);
  const remaining = terms.length - INITIAL_SHOW;

  return (
    <div className="space-y-2">
      {visible.map(({ word, count, isDomain }) => {
        const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
        const conceptSlug = TERM_TO_CONCEPT_SLUG[word.toLowerCase()];
        const href = conceptSlug
          ? `/guide/concepts/${conceptSlug}`
          : `/search?q=${encodeURIComponent(word)}`;
        return (
          <div key={word} className="flex items-center gap-3">
            <Link
              href={href}
              className={`w-40 shrink-0 text-sm truncate hover:underline ${
                isDomain
                  ? 'font-bold text-gray-900 dark:text-gray-100'
                  : 'font-normal text-gray-700 dark:text-gray-300'
              }`}
            >
              {word}
            </Link>
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full ${
                  isDomain ? 'bg-blue-400 dark:bg-blue-500' : 'bg-gray-400 dark:bg-gray-500'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-10 text-right">
              {count}×
            </span>
          </div>
        );
      })}

      {!showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-2"
        >
          Show {remaining} more
        </button>
      )}
    </div>
  );
}

export default function Concordance({ terms, compact = false }: Props) {
  const [showAll, setShowAll] = useState(false);

  if (terms.length === 0) return null;

  // Compact / sidebar mode: no outer wrapper chrome, terms always visible
  if (compact) {
    return (
      <TermList terms={terms} showAll={showAll} setShowAll={setShowAll} />
    );
  }

  // Inline (below-article) mode: collapsible <details> with its own heading
  return (
    <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 print:hidden">
      <details
        onToggle={(e) => {
          if (!(e.currentTarget as HTMLDetailsElement).open) setShowAll(false);
        }}
      >
        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors list-none flex items-center gap-2 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 details-arrow transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Key terms in this post
        </summary>
        <div className="mt-4">
          <TermList terms={terms} showAll={showAll} setShowAll={setShowAll} />
        </div>
      </details>
    </div>
  );
}
