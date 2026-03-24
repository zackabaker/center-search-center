'use client';

import { ContentSource } from '@/lib/types';

type FilterOption = 'all' | ContentSource;

interface FilterTabsProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
  counts: Record<FilterOption, number>;
}

const TABS: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'substack', label: 'Substack' },
  { key: 'gablog', label: 'GABlog' },
  { key: 'book', label: 'Book' },
  { key: 'pdf', label: 'PDFs' },
  { key: 'glossary', label: 'Glossary' },
];

export default function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {TABS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-full transition-colors whitespace-nowrap flex-shrink-0 ${
            active === key
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
          <span className="ml-1 sm:ml-1.5 opacity-70">{counts[key]}</span>
        </button>
      ))}
    </div>
  );
}
