'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';

interface HighlightedContentProps {
  paragraphs: string[];
  postTitle?: string;
  postUrl?: string;
}

function CopyParaButton({ text, title, url }: { text: string; title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const clean = text.replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(`"${clean}" — ${title}. ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} title="Copy paragraph with attribution"
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-gray-300 hover:text-gray-600 flex-shrink-0 print:hidden inline-flex">
      {copied
        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
        : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
      }
    </button>
  );
}

function PermalinkButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <a href={`#${id}`} onClick={copy} title="Copy paragraph link"
      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 print:hidden select-none text-sm inline-flex">
      {copied ? <span className="text-xs text-green-500">✓</span> : '¶'}
    </a>
  );
}

function HighlightedContentInner({ paragraphs, postTitle = '', postUrl = '' }: HighlightedContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const contentRef = useRef<HTMLDivElement>(null);
  const [matchCount, setMatchCount] = useState(0);
  const [, setCurrentMatch] = useState(0);
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
      if (regex.test((node as Text).textContent || '')) textNodes.push(node as Text);
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
          mark.className = 'bg-amber-300 text-amber-950 rounded-sm px-0.5';
          allMarks.push(mark);
          fragment.appendChild(mark);
        }
      });
      textNode.parentNode?.replaceChild(fragment, textNode);
    });
    allMarks.forEach((mark) => {
      const p = mark.closest('p, blockquote, li');
      if (p && !p.classList.contains('highlight-sentence')) {
        p.classList.add('highlight-sentence');
        (p as HTMLElement).style.cssText += 'background:#fef3c7;border-left:3px solid #f59e0b;padding-left:12px;margin-left:-15px;border-radius:4px;';
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

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, []);

  const scrollToMatch = useCallback((direction: 'next' | 'prev') => {
    const marks = marksRef.current;
    if (!marks.length) return;
    marks.forEach((m) => m.classList.remove('ring-2', 'ring-blue-500'));
    setCurrentMatch((prev) => {
      const next = direction === 'next' ? (prev + 1) % marks.length : (prev - 1 + marks.length) % marks.length;
      marks[next].classList.add('ring-2', 'ring-blue-500');
      marks[next].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return next;
    });
  }, []);

  useEffect(() => {
    if (!query || !matchCount) return;
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); scrollToMatch(e.shiftKey ? 'prev' : 'next'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [query, matchCount, scrollToMatch]);

  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : postUrl;

  return (
    <>
      {query && matchCount > 0 && (
        <div className="sticky top-1 z-10 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-sm shadow-sm print:hidden">
          <span className="text-amber-800"><strong>{matchCount}</strong> match{matchCount !== 1 ? 'es' : ''} for &ldquo;<span className="font-medium">{query}</span>&rdquo;</span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-amber-600 mr-1 hidden sm:inline">n / N to navigate</span>
            <button onClick={() => scrollToMatch('prev')} className="p-1 rounded hover:bg-amber-200 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
            </button>
            <button onClick={() => scrollToMatch('next')} className="p-1 rounded hover:bg-amber-200 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        </div>
      )}
      {query && matchCount === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-6 text-sm text-gray-500 print:hidden">
          No matches for &ldquo;{query}&rdquo; in this post
        </div>
      )}
      <div ref={contentRef} className="prose text-gray-800">
        {paragraphs.map((p, i) => {
          const id = `p-${i + 1}`;
          const isBlockquote = p.startsWith('>') || p.startsWith('_');
          const text = isBlockquote ? p.replace(/^>\s*/, '').replace(/^_|_$/g, '') : p;
          const controls = (
            <span className="inline-flex items-center gap-1 ml-2 align-middle print:hidden">
              <PermalinkButton id={id} />
              <CopyParaButton text={text} title={postTitle} url={pageUrl} />
            </span>
          );
          if (isBlockquote) return <blockquote key={i} id={id} className="group scroll-mt-20"><p>{text}{controls}</p></blockquote>;
          return <p key={i} id={id} className="group scroll-mt-20">{text}{controls}</p>;
        })}
      </div>
    </>
  );
}

export default function HighlightedContent(props: HighlightedContentProps) {
  return (
    <Suspense fallback={<div className="prose text-gray-800">{props.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>}>
      <HighlightedContentInner {...props} />
    </Suspense>
  );
}
