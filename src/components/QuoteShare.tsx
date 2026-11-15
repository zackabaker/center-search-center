'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { parsePostDate } from '@/lib/dates';
import { saveIdiom } from '@/lib/idioms';

interface QuoteShareProps {
  title: string;
  author: string;
  date: string | null;
  url: string;
  /** Post slug + source — needed to file a selection in the idiom archive. */
  slug?: string;
  source?: string;
}

interface Sel {
  text: string;
  x: number;
  y: number;
  anchorId: string | null; // the #p-N paragraph the selection starts in
}

// Walk up from the selection anchor to the nearest paragraph carrying a stable
// #p-N id, so a copied quote links to the exact paragraph, not just the post.
function paragraphAnchor(node: Node | null): string | null {
  let el: HTMLElement | null =
    node?.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node?.parentElement ?? null;
  while (el && el.tagName !== 'ARTICLE') {
    if (el.id && /^p-\d+$/.test(el.id)) return el.id;
    el = el.parentElement;
  }
  return null;
}

// When the reader selects text inside the article, a small floating button
// appears that copies the passage with a formatted citation attached — so a
// quote can be pulled out of any essay and shared without losing attribution.
export default function QuoteShare({ title, author, date, url, slug, source }: QuoteShareProps) {
  const [sel, setSel] = useState<Sel | null>(null);
  const [copied, setCopied] = useState(false);
  // After a save the pill is replaced by a short-lived confirmation that
  // links to the archive, independent of the (now cleared) selection.
  const [savedAt, setSavedAt] = useState<{ x: number; y: number } | null>(null);
  // Ref, not the copied state — the selectionchange effect closes over
  // [refresh] and would capture `copied` stale. Guards the pill through the
  // selection collapse a touch-tap causes, so the feedback stays visible.
  const copiedRef = useRef(false);

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
    setSel({ text, x: rect.left + rect.width / 2, y: rect.top, anchorId: paragraphAnchor(anchor) });
    setCopied(false);
  }, []);

  useEffect(() => {
    const onUp = () => setTimeout(refresh, 0);
    // Touch selection (iOS/Android long-press) never fires mouseup — debounce
    // selectionchange and refresh once the handles stop moving, so the copy
    // pill appears on phones too.
    let selTimer: ReturnType<typeof setTimeout> | undefined;
    const onSelChange = () => {
      const s = window.getSelection();
      // A tap on the copy button itself collapses the selection — keep the
      // pill up through the copied-feedback window instead of yanking it.
      if (!s || s.isCollapsed) { if (!copiedRef.current) setSel(null); return; }
      clearTimeout(selTimer);
      selTimer = setTimeout(refresh, 350);
    };
    const onScroll = () => setSel(null);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('selectionchange', onSelChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      clearTimeout(selTimer);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('selectionchange', onSelChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, [refresh]);

  if (!sel && savedAt) {
    const l = Math.min(Math.max(savedAt.x, 110), window.innerWidth - 110);
    return (
      <div style={{ position: 'fixed', left: l, top: Math.max(savedAt.y - 46, 8), transform: 'translateX(-50%)', zIndex: 60 }} className="print:hidden">
        <Link
          href="/idioms"
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium shadow-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
        >
          Saved — open your idiom archive →
        </Link>
      </div>
    );
  }
  if (!sel) return null;

  const year = (() => {
    // parsePostDate handles the Chronicle "July 6th, 1995" ordinal format
    // that Date.parse rejects — otherwise all 855 Chronicles lose their year.
    const d = parsePostDate(date);
    return d ? d.getFullYear() : null;
  })();

  const copy = () => {
    // Link to the exact paragraph when we found its anchor — the manifest
    // promises stable #p-N anchors, so the citation resolves to the sentence.
    const citeUrl = sel.anchorId ? `${url}#${sel.anchorId}` : url;
    const citation = `— ${author}, "${title}"${year ? ` (${year})` : ''}\n${citeUrl}`;
    const payload = `"${sel.text}"\n\n${citation}`;
    navigator.clipboard.writeText(payload).then(() => {
      copiedRef.current = true;
      setCopied(true);
      setTimeout(() => {
        copiedRef.current = false;
        setCopied(false);
        setSel(null);
        window.getSelection()?.removeAllRanges();
      }, 1300);
    }).catch(() => { /* clipboard blocked — leave the button up */ });
  };

  const save = () => {
    if (!slug) return;
    saveIdiom({ text: sel.text, slug, title, source: source ?? '', anchor: sel.anchorId });
    setSavedAt({ x: sel.x, y: sel.y });
    setSel(null);
    window.getSelection()?.removeAllRanges();
    setTimeout(() => setSavedAt(null), 4000);
  };

  // Keep the buttons on-screen near the selection's top edge.
  const half = slug ? 150 : 90;
  const left = Math.min(Math.max(sel.x, half), Math.max(half, window.innerWidth - half));
  const top = Math.max(sel.y - 46, 8);

  return (
    <div
      style={{ position: 'fixed', left, top, transform: 'translateX(-50%)', zIndex: 60 }}
      className="print:hidden flex items-center gap-1.5"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        onClick={copy}
        // touchend fires BEFORE the tap's default action collapses the
        // selection (and before synthesized mouse events, which
        // preventDefault suppresses so copy() can't double-fire) — without
        // it the pill self-destructs before the tap lands on iOS.
        onTouchEnd={(e) => { e.preventDefault(); copy(); }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium shadow-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity"
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
      {slug && !copied && (
        <button
          onClick={save}
          onTouchEnd={(e) => { e.preventDefault(); save(); }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium shadow-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" /></svg>
          Save idiom
        </button>
      )}
    </div>
  );
}
