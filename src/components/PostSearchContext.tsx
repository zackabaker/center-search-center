'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import HighlightedContent from './HighlightedContent';
import { PostContent } from './PostContent';

interface Props {
  paragraphs: string[];
  content: string;
  postTitle: string;
  postUrl: string;
}

export default function PostSearchContext({ paragraphs, content, postTitle, postUrl }: Props) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';

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
  const q = searchParams.get('q') ?? '';
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
