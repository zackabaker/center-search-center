'use client';

import { useState, useEffect } from 'react';
import { applyTheme, currentTheme, type ThemeMode } from '@/lib/theme';

const ORDER: ThemeMode[] = ['normal', 'sepia', 'night'];
const NEXT_LABEL: Record<ThemeMode, string> = {
  normal: 'Switch to sepia',
  sepia: 'Switch to night',
  night: 'Switch to light',
};

// The nav theme control cycles all THREE modes of the one site theme model
// (light → sepia → night). Previously sepia was reachable only from post-page
// reading controls, stranding non-post pages between systems.
export default function DarkModeToggle() {
  const [mode, setMode] = useState<ThemeMode>('normal');

  useEffect(() => {
    setMode(currentTheme());
    const onChange = () => setMode(currentTheme());
    window.addEventListener('csc-theme-changed', onChange);
    return () => window.removeEventListener('csc-theme-changed', onChange);
  }, []);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    applyTheme(next);
    setMode(next);
  };

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
      title={NEXT_LABEL[mode]}
      aria-label={NEXT_LABEL[mode]}
    >
      {mode === 'normal' ? (
        // Sun — light mode active
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : mode === 'sepia' ? (
        // Open book — sepia reading mode active
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ) : (
        // Moon — night mode active
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
