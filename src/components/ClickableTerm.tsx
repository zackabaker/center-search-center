'use client';

import { useRouter } from 'next/navigation';
import { TERM_TO_CONCEPT_SLUG } from '@/data/guide/concepts';

interface ClickableTermProps {
  children: string;
  query?: string; // override the auto-generated Ask question (only used when no concept page)
  className?: string;
}

export default function ClickableTerm({ children, query, className = '' }: ClickableTermProps) {
  const router = useRouter();

  const conceptSlug = TERM_TO_CONCEPT_SLUG[children.toLowerCase()];

  const handleClick = () => {
    if (conceptSlug) {
      router.push(`/guide/concepts/${conceptSlug}`);
    } else {
      const q = query ?? `What is "${children}" in Center Study? Explain how it is derived, what work it does, and how it appears across the archive.`;
      router.push(`/ask?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      title={conceptSlug ? `View concept: ${children}` : `Ask AI about "${children}"`}
      className={`underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
