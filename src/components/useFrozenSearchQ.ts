'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

// ?q= is stripped from the address bar once a highlight is applied (so a
// share from the browser never leaks the reader's search query). This hook
// preserves the ORIGINAL q for the current page so the highlight view — and
// the "Back to results" link — survive the strip. It lets go of the frozen
// value only on a real navigation (pathname change) or when a new non-empty
// q arrives for the same page.
export function useFrozenSearchQ(): string {
  const pathname = usePathname();
  const live = useSearchParams().get('q') ?? '';
  const frozen = useRef<{ path: string; q: string } | null>(null);
  if (
    frozen.current === null ||
    frozen.current.path !== pathname ||
    (live !== '' && live !== frozen.current.q)
  ) {
    frozen.current = { path: pathname, q: live };
  }
  return frozen.current.q;
}
