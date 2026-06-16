'use client';

import { ContentSource } from '@/lib/types';

type FilterOption = 'all' | ContentSource;

interface FilterTabsProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
  counts: Record<FilterOption, number>;
}

// All sources in display order. A source tab appears only when it has results,
// so Reddit/X and Chronicles/AP tabs surface only once toggled into search.
const SOURCE_TABS: { key: ContentSource; label: string }[] = [
  { key: 'gablog', label: 'GABlog' },
  { key: 'substack', label: 'Substack' },
  { key: 'pdf', label: 'Essays & Articles' },
  { key: 'book', label: 'Book' },
  { key: 'reddit', label: 'Reddit' },
  { key: 'twitter', label: 'X' },
  { key: 'chronicle', label: 'Chronicles' },
  { key: 'ap', label: 'AP Journal' },
];

export default function FilterTabs({ active, onChange, counts }: FilterTabsProps) {
  const tabs: { key: FilterOption; label: string }[] = [
    { key: 'all', label: 'All' },
    ...SOURCE_TABS.filter(({ key }) => (counts[key] ?? 0) > 0),
  ];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      {tabs.map(({ key, label }) => (
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
