'use client';

import { useCallback, useEffect, useState } from 'react';

interface QuoteShareProps {
  title: string;
  author: string;
  date: string | null;
  url: string;
}

interface Sel {
  text: string;
  x: number;
  y: number;
}

// When the reader selects text inside the article, a small floating button
// appears that copies the passage with a formatted citation attached — so a
// quote can be pulled out of any essay and shared without losing attribution.
export default function QuoteShare({ title, author, date, url }: QuoteShareProps) {
  const [sel, setSel] = useState<Sel | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => {
    const s = window.getSelection();
    if (!s || s.isCollapsed) { setSel(null); return; }
    const text = s.toString().replace(/\s+/g, ' ').trim();
    // Ignore stray clicks and tiny selections; cap absurdly long ones.
    if (text.length < 12) { setSel(null); return; }
    const anchor = s.anchorNode;
    const article = document.querySelector('article');
    if (!article || !anchor || !article.contains(anchor)) { setSel(null); return; }
    const rect = s.getRangeAt(0).getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) { setSel(null); return; }
    setSel({ text, x: rect.left + rect.width / 2, y: rect.top });
    setCopied(false);
  }, []);

  useEffect(() => {
    const onUp = () => setTimeout(refresh, 0);
    const onSelChange = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed) setSel(null);
    };
    const onScroll = () => setSel(null);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('selectionchange', onSelChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('selectionchange', onSelChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, [refresh]);

  if (!sel) return null;

  const year = (() => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.getFullYear();
  })();

  const copy = () => {
    const citation = `— ${author}, "${title}"${year ? ` (${year})` : ''}\n${url}`;
    const payload = `"${sel.text}"\n\n${citation}`;
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setSel(null);
        window.getSelection()?.removeAllRanges();
      }, 1300);
    }).catch(() => { /* clipboard blocked — leave the button up */ });
  };

  // Keep the button on-screen near the selection's top edge.
  const left = Math.min(Math.max(sel.x, 90), window.innerWidth - 90);
  const top = Math.max(sel.y - 46, 8);

  return (
    <div
      style={{ position: 'fixed', left, top, transform: 'translateX(-50%)', zIndex: 60 }}
      className="print:hidden"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
      >
        {copied ? (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Copied with citation
          </>
        ) : (
          <>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy with citation
          </>
        )}
      </button>
    </div>
  );
}
