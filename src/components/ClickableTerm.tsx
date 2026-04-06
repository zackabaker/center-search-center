'use client';

import { useRouter } from 'next/navigation';

interface ClickableTermProps {
  children: string;
  query?: string; // override the auto-generated question
  className?: string;
}

export default function ClickableTerm({ children, query, className = '' }: ClickableTermProps) {
  const router = useRouter();
  const q = query ?? `What is "${children}" in Center Study? Explain how it is derived, what work it does, and how it appears across the archive.`;

  return (
    <button
      onClick={() => router.push(`/ask?q=${encodeURIComponent(q)}`)}
      title={`Ask the archive about "${children}"`}
      className={`underline decoration-dotted underline-offset-2 hover:decoration-solid hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
