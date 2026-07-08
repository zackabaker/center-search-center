'use client';

import { useState, useEffect } from 'react';

type ReadingMode = 'normal' | 'sepia' | 'night';

const MODE_LABELS: Record<ReadingMode, string> = {
  normal: 'Default',
  sepia: 'Sepia',
  night: 'Night',
};

const MODE_SEQUENCE: ReadingMode[] = ['normal', 'sepia', 'night'];

export default function ReadingControls() {
  const [fontSize, setFontSize] = useState(18);
  const [readingMode, setReadingMode] = useState<ReadingMode>('normal');
  const [termLinks, setTermLinks] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('csc-font-size');
    if (saved) setFontSize(parseInt(saved, 10));

    const savedMode = localStorage.getItem('csc-reading-mode') as ReadingMode | null;
    if (savedMode && MODE_SEQUENCE.includes(savedMode)) {
      setReadingMode(savedMode);
      applyMode(savedMode);
    }

    try { setTermLinks(localStorage.getItem('csc-term-links') !== 'off'); } catch {}
  }, []);

  function toggleTermLinks() {
    const next = !termLinks;
    setTermLinks(next);
    try { localStorage.setItem('csc-term-links', next ? 'on' : 'off'); } catch {}
    window.dispatchEvent(new Event('csc-term-links-changed'));
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--prose-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--prose-line-height', `${fontSize < 18 ? 1.75 : 1.85}`);
    localStorage.setItem('csc-font-size', String(fontSize));
  }, [fontSize]);

  function applyMode(mode: ReadingMode) {
    const root = document.documentElement;
    if (mode === 'normal') {
      root.removeAttribute('data-reading-mode');
      // Sepia strips the dark class and Night adds it — returning to Default
      // must restore the user's own dark-mode preference, not whatever the
      // last reading mode left behind.
      try {
        if (localStorage.getItem('csc-dark-mode') === 'true') root.classList.add('dark');
        else root.classList.remove('dark');
      } catch {}
    } else {
      root.setAttribute('data-reading-mode', mode);
      // Night mode also enables dark class for UI elements
      if (mode === 'night') {
        root.classList.add('dark');
      } else {
        // Sepia removes dark (use light theme background)
        root.classList.remove('dark');
      }
    }
  }

  function cycleMode() {
    const currentIdx = MODE_SEQUENCE.indexOf(readingMode);
    const next = MODE_SEQUENCE[(currentIdx + 1) % MODE_SEQUENCE.length];
    setReadingMode(next);
    applyMode(next);
    localStorage.setItem('csc-reading-mode', next);
  }

  const modeIcon = readingMode === 'normal'
    ? (
      // Sun / default
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-5.66l-.71.71M6.34 17.66l-.71.71M17.66 17.66l-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 100 10A5 5 0 0012 7z" />
      </svg>
    )
    : readingMode === 'sepia'
    ? (
      // Warm / book icon
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
    : (
      // Moon / night
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );

  return (
    <div className="flex items-center gap-3 text-gray-400 print:hidden">
      {/* Reading mode toggle */}
      <button
        onClick={cycleMode}
        title={`Reading mode: ${MODE_LABELS[readingMode]} — click to cycle`}
        aria-label={`Reading mode: ${MODE_LABELS[readingMode]}. Cycle reading mode`}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
          readingMode !== 'normal'
            ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        {modeIcon}
        <span className="text-[10px] font-medium">{MODE_LABELS[readingMode]}</span>
      </button>

      {/* Term links toggle — dotted-underline concept/glossary links in the text */}
      <button
        onClick={toggleTermLinks}
        title={termLinks ? 'Term links on — click to hide concept/glossary links in the text' : 'Term links off — click to show them'}
        aria-pressed={termLinks}
        aria-label="Toggle concept and glossary links in the text"
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
          termLinks
            ? 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 line-through'
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-[10px] font-medium underline decoration-dotted">terms</span>
      </button>

      {/* Font size */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFontSize((s) => Math.max(13, s - 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 text-xs font-bold transition-colors"
          title="Decrease font size"
          aria-label="Decrease font size"
        >
          A-
        </button>
        <button
          onClick={() => setFontSize(18)}
          className={`text-xs w-5 text-center tabular-nums transition-colors rounded ${
            fontSize !== 18
              ? 'text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer'
              : 'cursor-default'
          }`}
          title={fontSize !== 18 ? 'Reset to default (18)' : undefined}
          disabled={fontSize === 18}
        >
          {fontSize}
        </button>
        <button
          onClick={() => setFontSize((s) => Math.min(24, s + 1))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bold transition-colors"
          title="Increase font size"
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
    </div>
  );
}
