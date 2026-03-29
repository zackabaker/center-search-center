'use client';
import { useState, useEffect } from 'react';

export interface SavedPost {
  slug: string;
  title: string;
  source: string;
  date: string | null;
  savedAt: string;
}

const KEY = 'csc-reading-list';

function load(): SavedPost[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function useReadingList() {
  const [list, setList] = useState<SavedPost[]>([]);

  useEffect(() => { setList(load()); }, []);

  const isSaved = (slug: string) => list.some((p) => p.slug === slug);

  const toggle = (post: SavedPost) => {
    const next = isSaved(post.slug)
      ? list.filter((p) => p.slug !== post.slug)
      : [{ ...post, savedAt: new Date().toISOString() }, ...list];
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const clear = () => { setList([]); localStorage.removeItem(KEY); };

  return { list, isSaved, toggle, clear };
}
