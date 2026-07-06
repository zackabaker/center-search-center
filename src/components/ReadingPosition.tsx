'use client';

import { useEffect, useRef, useState } from 'react';

// Reading-position memory for a corpus of 30–200 minute texts. Saves the
// nearest paragraph anchor (robust to font-size changes) + percent progress to
// localStorage while you read; offers a quiet "Resume" pill when you return.
// Renders nothing unless there is somewhere meaningful to resume — invisible
// until useful. No accounts, nothing leaves the browser.

type Saved = { slug: string; title: string; anchor: string; pct: number; t: number };

const LATEST_KEY = 'csc-reading-latest';
const keyFor = (slug: string) => `csc-pos:${slug}`;

export default function ReadingPosition({ slug, title }: { slug: string; title: string }) {
  const [resume, setResume] = useState<Saved | null>(null);
  const dismissed = useRef(false);

  // Offer resume on mount (only if meaningfully into the text and not finished)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(slug));
      if (!raw) return;
      const s: Saved = JSON.parse(raw);
      if (s.pct >= 8 && s.pct <= 92 && !window.location.hash) setResume(s);
    } catch {}
  }, [slug]);

  // Track position while reading
  useEffect(() => {
    let ticking = false;
    let lastSave = 0;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const now = Date.now();
        if (now - lastSave < 2000) return;
        lastSave = now;
        const doc = document.documentElement;
        const pct = Math.round((window.scrollY / Math.max(doc.scrollHeight - window.innerHeight, 1)) * 100);
        // nearest paragraph anchor currently near the top of the viewport
        const anchors = document.querySelectorAll('article [id^="p-"]');
        let current = '';
        for (const el of anchors) {
          const top = (el as HTMLElement).getBoundingClientRect().top;
          if (top < 140) current = el.id;
          else break;
        }
        try {
          if (pct > 92) {
            localStorage.removeItem(keyFor(slug));
            const latest = localStorage.getItem(LATEST_KEY);
            if (latest && JSON.parse(latest).slug === slug) localStorage.removeItem(LATEST_KEY);
            return;
          }
          if (pct < 4 || !current) return;
          const s: Saved = { slug, title, anchor: current, pct, t: Date.now() };
          localStorage.setItem(keyFor(slug), JSON.stringify(s));
          localStorage.setItem(LATEST_KEY, JSON.stringify(s));
        } catch {}
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug, title]);

  if (!resume || dismissed.current) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 print:hidden">
      <div className="flex items-center gap-1 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg pl-4 pr-1.5 py-1.5">
        <button
          onClick={() => {
            const el = document.getElementById(resume.anchor);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setResume(null);
          }}
          className="text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Resume where you left off · {resume.pct}%
        </button>
        <button
          onClick={() => { dismissed.current = true; setResume(null); }}
          aria-label="Dismiss"
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 dark:hover:bg-gray-900/10 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
