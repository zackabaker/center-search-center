'use client';
import { useEffect } from 'react';

export function MarkPostRead({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const key = 'csc-read-posts';
      const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!existing.includes(slug)) {
        existing.push(slug);
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch {}
  }, [slug]);
  return null;
}
