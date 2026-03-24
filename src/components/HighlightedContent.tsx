'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';

function HighlightedContentInner({ paragraphs }: { paragraphs: string[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const contentRef = useRef<HTMLDivElement>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const marksRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!query || !contentRef.current) return;

    const container = contentRef.current;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (regex.test((node as Text).textContent || '')) {
        textNodes.push(node as Text);
      }
      regex.lastIndex = 0;
    }

    let totalMatches = 0;
    const allMarks: HTMLElement[] = [];

    textNodes.forEach((textNode) => {
      const text = textNode.textContent || '';
      const parts: (string | { match: string })[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
        parts.push({ match: match[0] });
        lastIndex = regex.lastIndex;
        totalMatches++;
      }
      if (lastIndex < text.length) parts.push(text.slice(lastIndex));
      if (parts.length <= 1) return;

      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (typeof part === 'string') {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const mark = document.createElement('mark');
          mark.textContent = part.match;
          mark.className = 'bg-amber-300 text-amber-950 rounded-sm px-0.5 highlight-term';
          mark.dataset.matchIndex = String(allMarks.length);
          allMarks.push(mark);
          fragment.appendChild(mark);
        }
      });
      textNode.parentNode?.replaceChild(fragment, textNode);
    });

    allMarks.forEach((mark) => {
      const p = mark.closest('p, blockquote, li, div');
      if (p && !p.classList.contains('highlight-sentence')) {
        p.classList.add('highlight-sentence');
        (p as HTMLElement).style.backgroundColor = '#fef3c7';
        (p as HTMLElement).style.borderLeft = '3px solid #f59e0b';
        (p as HTMLElement).style.paddingLeft = '12px';
        (p as HTMLElement).style.marginLeft = '-15px';
        (p as HTMLElement).style.borderRadius = '4px';
      }
    });

    marksRef.current = allMarks;
    setMatchCount(totalMatches);

    if (allMarks.length > 0) {
      setTimeout(() => {
        allMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        allMarks[0].classList.add('ring-2', 'ring-blue-500');
      }, 200);
    }
  }, [query]);

  const scrollToMatch = useCallback((direction: 'next' | 'prev') => {
    const marks = marksRef.current;
    if (marks.length === 0) return;

    marks.forEach((m) => m.classList.remove('ring-2', 'ring-blue-500'));

    setCurrentMatch((prev) => {
      const next = direction === 'next'
        ? (prev + 1) % marks.length
        : (prev - 1 + marks.length) % marks.length;
      marks[next].classList.add('ring-2', 'ring-blue-500');
      marks[next].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return next;
    });
  }, []);

  // Keyboard shortcuts: n = next match, N (shift+n) = prev match
  useEffect(() => {
    if (!query || matchCount === 0) return;

    const handleKey = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        scrollToMatch(e.shiftKey ? 'prev' : 'next');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [query, matchCount, scrollToMatch]);

  return (
    <>
      {query && matchCount > 0 && (
        <div className="sticky top-1 z-10 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-sm shadow-sm">
          <span className="text-amber-800">
            <strong>{matchCount}</strong> match{matchCount !== 1 ? 'es' : ''} for {'"'}<span className="font-medium">{query}</span>{'"'}
          </span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-amber-600 mr-1 hidden sm:inline">n / N to navigate</span>
            <button onClick={() => scrollToMatch('prev')} className="p-1 rounded hover:bg-amber-200 text-amber-700" title="Previous match (Shift+N)">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button onClick={() => scrollToMatch('next')} className="p-1 rounded hover:bg-amber-200 text-amber-700" title="Next match (N)">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {query && matchCount === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-6 text-sm text-gray-500">
          No matches for &ldquo;{query}&rdquo; in this post
        </div>
      )}

      <div ref={contentRef} className="prose text-gray-800">
        {paragraphs.map((p, i) => {
          if (p.startsWith('>') || p.startsWith('_') || p.startsWith(' _')) {
            const text = p.replace(/^>\s*/, '').replace(/^_|_$/g, '');
            return <blockquote key={i}><p>{text}</p></blockquote>;
          }
          return <p key={i}>{p}</p>;
        })}
      </div>
    </>
  );
}

export default function HighlightedContent({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Suspense fallback={
      <div className="prose text-gray-800">
        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    }>
      <HighlightedContentInner paragraphs={paragraphs} />
    </Suspense>
  );
}
