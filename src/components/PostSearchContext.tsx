'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HighlightedContent from './HighlightedContent';
import { PostContent } from './PostContent';
import { useFrozenSearchQ } from './useFrozenSearchQ';

interface Props {
  paragraphs: string[];
  content: string;
  postTitle: string;
  postUrl: string;
}

export default function PostSearchContext({ paragraphs, content, postTitle, postUrl }: Props) {
  // Frozen, not live: HighlightedContent strips ?q= from the address bar once
  // the highlight is applied, and a live read here would instantly swap the
  // view back to plain PostContent and lose the highlights.
  const q = useFrozenSearchQ();

  // Show the reader which passage they were sent to.
  //   ?hl=p-N  — "Go to post … with this quotation highlighted": tint the
  //              passage but stay at the TOP of the post (no scroll).
  //   #p-N     — a link to a paragraph: centre it and tint it.
  // The tint covers the whole paragraph when it is a normal-sized one. Inside
  // an enormous single-block post it covers only the quoted words, which the
  // linking page handed over in sessionStorage (rememberPassage).
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll('.excerpt-target').forEach((el) => el.classList.remove('excerpt-target'));
      const highlights = (window.CSS as unknown as { highlights?: Map<string, unknown> } | undefined)?.highlights;
      highlights?.delete('csc-excerpt');

      const hl = new URLSearchParams(window.location.search).get('hl');
      const fromHash = /^#(p-\d+)$/.exec(window.location.hash)?.[1] ?? null;
      const id = fromHash ?? (hl && /^p-\d+$/.test(hl) ? hl : null);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      const full = el.textContent || '';
      let marked = false;
      if (full.length > 2000 && highlights && typeof Highlight !== 'undefined') {
        // Mark just the quoted stretch: locate its first and last words in the
        // paragraph's text, then map those offsets onto the text nodes.
        let quote = '';
        try {
          const saved = JSON.parse(sessionStorage.getItem('csc-hl') || 'null');
          if (saved && window.location.pathname.endsWith(`/${saved.slug}`)) quote = String(saved.text || '');
        } catch {}
        const head = quote.slice(0, 40);
        const tail = quote.slice(-40);
        const start = head ? full.indexOf(head) : -1;
        const tailAt = start >= 0 && tail ? full.indexOf(tail, start) : -1;
        if (start >= 0 && tailAt >= 0) {
          const end = tailAt + tail.length;
          const range = document.createRange();
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let pos = 0;
          let began = false;
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const len = (node.textContent || '').length;
            if (!began && start < pos + len) { range.setStart(node, start - pos); began = true; }
            if (began && end <= pos + len) { range.setEnd(node, end - pos); marked = true; break; }
            pos += len;
          }
          if (marked) highlights.set('csc-excerpt', new Highlight(range));
        }
      }
      if (!marked && full.length <= 2000) el.classList.add('excerpt-target');
      if (fromHash) el.scrollIntoView({ block: 'center' });
    };
    const t = setTimeout(apply, 350);
    window.addEventListener('hashchange', apply);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', apply);
    };
  }, []);

  if (q) {
    return (
      <HighlightedContent
        paragraphs={paragraphs}
        postTitle={postTitle}
        postUrl={postUrl}
      />
    );
  }

  return (
    <PostContent
      content={content}
      postTitle={postTitle}
      postUrl={postUrl}
    />
  );
}

export function BackButton() {
  const searchParams = useSearchParams();
  // q is frozen (see above) so "Back to results" survives the ?q= strip.
  const q = useFrozenSearchQ();
  const back = searchParams.get('back') ?? '';

  // Sanitise: only allow same-origin relative paths starting with /
  const safeBack = back.startsWith('/') && !back.startsWith('//') ? back : '';

  let href = '/';
  let label = 'Back';

  if (safeBack) {
    href = safeBack;
    label = safeBack.startsWith('/browse') ? 'Back to Archive' : 'Back';
  } else if (q) {
    href = `/search?q=${encodeURIComponent(q)}`;
    label = 'Back to results';
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
}
