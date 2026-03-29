'use client';
import { useState, useEffect } from 'react';

const KEY = 'csc-annotations';

function load(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

export function useAnnotations(slug: string) {
  const [note, setNote] = useState('');

  useEffect(() => {
    const all = load();
    setNote(all[slug] || '');
  }, [slug]);

  const save = (text: string) => {
    setNote(text);
    const all = load();
    if (text.trim()) {
      all[slug] = text;
    } else {
      delete all[slug];
    }
    localStorage.setItem(KEY, JSON.stringify(all));
  };

  return { note, save };
}
