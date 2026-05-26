'use client';

import { useRouter } from 'next/navigation';

interface Props {
  label?: string;
  className?: string;
  /** Fallback URL when there is no browser history to go back to (e.g. direct link). */
  fallback?: string;
}

/**
 * Smart back button: uses browser history (router.back()) so the user
 * returns to wherever they actually came from — concept list, ask page,
 * post page, etc. — rather than a hardcoded destination.
 * Falls back to `fallback` URL (default '/') when there is no history.
 */
export default function GoBack({ label = '← Back', className = '', fallback = '/' }: Props) {
  const router = useRouter();

  function handleBack() {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={handleBack}
      className={className || 'text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors'}
    >
      {label}
    </button>
  );
}
