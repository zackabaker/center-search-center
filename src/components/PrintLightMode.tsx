'use client';

import { useEffect } from 'react';

// Printing from night/sepia produced pages with dark-theme colors baked in —
// hundreds of compiled dark:* utilities apply whenever .dark is on <html>,
// and print CSS alone cannot un-apply them. So: strip the theme attributes
// for the duration of the print and restore them exactly afterwards.
//
// This is a sanctioned exception to the "never toggle .dark directly" rule:
// the change is transient DOM state scoped to the print event — nothing is
// written to localStorage and applyTheme() remains the only persistent path,
// so no half-dark state can survive (afterprint restores, and a reload
// re-derives from storage anyway).
export default function PrintLightMode() {
  useEffect(() => {
    const de = document.documentElement;
    let saved: { dark: boolean; mode: string | null } | null = null;

    const before = () => {
      if (saved) return;
      saved = { dark: de.classList.contains('dark'), mode: de.getAttribute('data-reading-mode') };
      de.classList.remove('dark');
      de.removeAttribute('data-reading-mode');
    };
    const after = () => {
      if (!saved) return;
      de.classList.toggle('dark', saved.dark);
      if (saved.mode) de.setAttribute('data-reading-mode', saved.mode);
      saved = null;
    };

    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    // Safari fires these since v13, but the matchMedia listener costs nothing
    // and covers print-to-PDF paths that skip the events in some browsers.
    const mql = window.matchMedia('print');
    const onChange = (e: MediaQueryListEvent) => (e.matches ? before() : after());
    try { mql.addEventListener('change', onChange); } catch { /* old Safari */ }

    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
      try { mql.removeEventListener('change', onChange); } catch {}
    };
  }, []);
  return null;
}
