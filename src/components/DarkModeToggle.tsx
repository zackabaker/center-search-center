'use client';

import { useState, useEffect } from 'react';
import { applyTheme, currentTheme } from '@/lib/theme';

// The moon is a night ⇔ default toggle over the ONE site theme model
// (src/lib/theme.ts). From sepia, turning night on replaces sepia — the two
// systems can no longer strand a half-dark state.
export default function DarkModeToggle() {
  const [night, setNight] = useState(false);

  useEffect(() => {
    // Reflect whatever the first-paint script applied, then track changes
    // made elsewhere (the reading controls on post pages).
    setNight(currentTheme() === 'night');
    const onChange = () => setNight(currentTheme() === 'night');
    window.addEventListener('csc-theme-changed', onChange);
    return () => window.removeEventListener('csc-theme-changed', onChange);
  }, []);

  const toggle = () => {
    const next = night ? 'normal' : 'night';
    applyTheme(next);
    setNight(next === 'night');
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
      title={night ? 'Light mode' : 'Night mode'}
      aria-label={night ? 'Switch to light mode' : 'Switch to night mode'}
    >
      {night ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
