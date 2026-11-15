'use client';
import { useEffect } from 'react';
import { logAccountEvent } from '@/lib/account-client';

export function MarkPostRead({ slug, title }: { slug: string; title?: string }) {
  useEffect(() => {
    try {
      const key = 'csc-read-posts';
      const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!existing.includes(slug)) {
        existing.push(slug);
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch {}
    // Signed-in readers keep a reading history (no-op when signed out).
    logAccountEvent({ type: 'read', slug, title: title ?? slug });
  }, [slug, title]);
  return null;
}
