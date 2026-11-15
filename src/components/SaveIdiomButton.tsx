'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isSaved, saveIdiom } from '@/lib/idioms';

interface Props {
  text: string;
  slug: string;
  title: string;
  source: string;
  anchor: string | null;
  className?: string;
}

// "Save this idiom to your archive." Once saved it becomes a link to the archive,
// so the reader can go and see what they have kept.
export default function SaveIdiomButton({ text, slug, title, source, anchor, className = '' }: Props) {
  const [saved, setSaved] = useState(false);
  useEffect(() => { setSaved(isSaved(slug, text)); }, [slug, text]);

  const base =
    'inline-flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 rounded-lg border transition-colors';

  if (saved) {
    return (
      <Link
        href="/idioms"
        className={`${base} border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 ${className}`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        Saved — open your idiom archive →
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => { saveIdiom({ text, slug, title, source, anchor }); setSaved(true); }}
      className={`${base} border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white ${className}`}
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" /></svg>
      Save this idiom to your archive
    </button>
  );
}
