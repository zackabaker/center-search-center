'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Homepage chip: the single most recent unfinished text, if any. Renders
// nothing at all when there is nothing to continue — no empty module.
type Saved = { slug: string; title: string; anchor: string; pct: number; t: number };

export default function ContinueReading() {
  const [s, setS] = useState<Saved | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('csc-reading-latest');
      if (!raw) return;
      const saved: Saved = JSON.parse(raw);
      if (saved.pct >= 8 && saved.pct <= 92) setS(saved);
    } catch {}
  }, []);

  if (!s) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-6 text-center">
      <Link
        href={`/post/${s.slug}#${s.anchor}`}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-white dark:bg-gray-900"
      >
        <span className="text-gray-400 dark:text-gray-500">Continue reading</span>
        <span className="font-medium truncate max-w-[260px]">{s.title}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">{s.pct}%</span>
      </Link>
    </div>
  );
}
