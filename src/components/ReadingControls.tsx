'use client';

import { useState, useEffect } from 'react';

export default function ReadingControls() {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const saved = localStorage.getItem('csc-font-size');
    if (saved) setFontSize(parseInt(saved, 10));
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--prose-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--prose-line-height', `${fontSize < 18 ? 1.75 : 1.85}`);
    localStorage.setItem('csc-font-size', String(fontSize));
  }, [fontSize]);

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <button
        onClick={() => setFontSize((s) => Math.max(13, s - 1))}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 hover:text-gray-600 text-xs font-bold"
        title="Decrease font size"
      >
        A-
      </button>
      <span className="text-xs w-6 text-center">{fontSize}</span>
      <button
        onClick={() => setFontSize((s) => Math.min(24, s + 1))}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 hover:text-gray-600 text-sm font-bold"
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
