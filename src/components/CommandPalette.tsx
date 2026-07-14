'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONCEPT_TITLES } from '@/lib/cs-terms';

// ⌘K command palette: jump to any page, concept, or text from anywhere.
// Static payload is tiny (pages + 41 concept titles); the full text-title
// index (~220KB, edge-cached) loads lazily the first time the palette opens.

type Item = { label: string; sub?: string; href: string; group: 'Pages' | 'Concepts' | 'Texts' | 'Actions' };

const PAGES: Item[] = [
  { label: 'Start Here', href: '/start', group: 'Pages' },
  { label: 'Introduction', href: '/intro', group: 'Pages' },
  { label: 'Guide', href: '/guide', group: 'Pages' },
  { label: 'Concepts & Glossary', href: '/concepts', group: 'Pages' },
  { label: 'Search', href: '/search', group: 'Pages' },
  { label: 'Ask AI', href: '/ask', group: 'Pages' },
  { label: 'Answers', href: '/answers', group: 'Pages' },
  { label: 'Archive', href: '/browse', group: 'Pages' },
  { label: 'New in the archive', href: '/new', group: 'Pages' },
  { label: 'Trending', href: '/trending', group: 'Pages' },
  { label: 'Reading paths', href: '/guide/reading-paths', group: 'Pages' },
  { label: 'Lectures', href: '/lectures', group: 'Pages' },
  { label: 'Lineage', href: '/lineage', group: 'Pages' },
  { label: 'FAQ', href: '/faq', group: 'Pages' },
  { label: 'About this archive', href: '/about', group: 'Pages' },
  { label: 'Developers & AI agents', href: '/developers', group: 'Pages' },
  { label: 'Download the corpus', href: '/download', group: 'Pages' },
];

const CONCEPTS: Item[] = Object.entries(CONCEPT_TITLES).map(([slug, title]) => ({
  label: title,
  sub: 'Concept',
  href: `/guide/concepts/${slug}`,
  group: 'Concepts' as const,
}));

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [texts, setTexts] = useState<Item[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetching = useRef(false);
  // Focus management: remember who opened the palette, restore on close.
  const openerRef = useRef<HTMLElement | null>(null);

  // Global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lazy-load the text-title index on first open
  useEffect(() => {
    if (!open || texts || fetching.current) return;
    fetching.current = true;
    fetch(`/api/search-index?scope=lite&v=${process.env.NEXT_PUBLIC_INDEX_V}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setTexts(
          (d.entries || []).map((e: { slug: string; title: string; source: string }) => ({
            label: e.title,
            sub: e.source,
            href: `/post/${e.slug}`,
            group: 'Texts' as const,
          }))
        );
      })
      .catch(() => setTexts([]));
  }, [open, texts]);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
    } else if (openerRef.current) {
      openerRef.current.focus?.();
      openerRef.current = null;
    }
    if (open) {
      setQ('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const results = useCallback((): Item[] => {
    const query = q.trim().toLowerCase();
    if (!query) return PAGES.slice(0, 8);
    const score = (label: string) => {
      const l = label.toLowerCase();
      if (l === query) return 4;
      if (l.startsWith(query)) return 3;
      if (l.includes(` ${query}`)) return 2;
      if (l.includes(query)) return 1;
      return 0;
    };
    const rank = (items: Item[], cap: number) =>
      items
        .map((it) => ({ it, s: score(it.label) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, cap)
        .map((x) => x.it);
    const out: Item[] = [
      ...rank(PAGES, 3),
      ...rank(CONCEPTS, 4),
      ...rank(texts || [], 7),
      { label: `Search the corpus for “${q.trim()}”`, href: `/search?q=${encodeURIComponent(q.trim())}`, group: 'Actions' },
      { label: `Ask AI: “${q.trim()}”`, href: `/ask?q=${encodeURIComponent(q.trim())}`, group: 'Actions' },
    ];
    return out;
  }, [q, texts]);

  if (!open) return null;

  const items = results();
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/30 dark:bg-black/50 flex items-start justify-center pt-[12vh] px-4 print:hidden"
      onPointerDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        // Focus trap: the palette is arrow-key driven; Tab must not walk out
        // into the page hidden behind the scrim.
        onKeyDown={(e) => { if (e.key === 'Tab') { e.preventDefault(); inputRef.current?.focus(); } }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, items.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
            if (e.key === 'Enter' && items[sel]) { e.preventDefault(); go(items[sel].href); }
          }}
          placeholder="Jump to a page, concept, or text…"
          className="w-full px-4 py-3.5 text-base outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border-b border-gray-100 dark:border-gray-800"
        />
        <div className="max-h-[50vh] overflow-y-auto py-1.5">
          {items.map((it, i) => (
            <button
              key={`${it.href}-${i}`}
              onClick={() => go(it.href)}
              onMouseEnter={() => setSel(i)}
              className={`w-full text-left px-4 py-2 flex items-baseline justify-between gap-3 text-sm ${
                i === sel ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              <span className={`truncate ${it.group === 'Actions' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {it.label}
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0 uppercase tracking-wide">
                {it.sub || it.group}
              </span>
            </button>
          ))}
          {q.trim() && texts === null && (
            <p className="px-4 py-2 text-xs text-gray-400">Loading text titles…</p>
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-400 dark:text-gray-500 flex gap-4">
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  );
}
