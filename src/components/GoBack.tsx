'use client';

import { useRouter } from 'next/navigation';

interface Props {
  label?: string;
  className?: string;
}

/**
 * Smart back button: uses browser history (router.back()) so the user
 * returns to wherever they actually came from — concept list, ask page,
 * post page, etc. — rather than a hardcoded destination.
 */
export default function GoBack({ label = '← Back', className = '' }: Props) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={className || 'text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'}
    >
      {label}
    </button>
  );
}
