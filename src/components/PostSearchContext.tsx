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

  // Arriving at a paragraph anchor (#p-N — "Go to excerpt", shared passage
  // links): centre it and give it a light tint so the reader sees which
  // passage they were sent to. Skipped for enormous single-block posts, where
  // tinting the block would tint nearly the whole page.
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll('.excerpt-target').forEach((el) => el.classList.remove('excerpt-target'));
      const m = /^#(p-\d+)$/.exec(window.location.hash);
      if (!m) return;
      const el = document.getElementById(m[1]);
      if (!el) return;
      if ((el.textContent || '').length <= 2000) el.classList.add('excerpt-target');
      el.scrollIntoView({ block: 'center' });
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
