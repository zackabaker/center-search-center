'use client';
import { useState, useEffect } from 'react';

export interface HistoryEntry {
  slug: string;
  title: string;
  source: string;
  date: string | null;
  viewedAt: string;
}

const KEY = 'csc-history';
const MAX = 30;

function load(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function trackView(entry: Omit<HistoryEntry, 'viewedAt'>) {
  const history = load().filter((h) => h.slug !== entry.slug);
  history.unshift({ ...entry, viewedAt: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, MAX)));
}

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => { setHistory(load()); }, []);
  const clear = () => { setHistory([]); localStorage.removeItem(KEY); };
  return { history, clear };
}
