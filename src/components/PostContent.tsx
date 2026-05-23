'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CS_TERMS_SORTED, TERM_TO_CONCEPT_SLUG } from '@/lib/cs-terms';

interface PostContentProps {
  content: string;
  postTitle?: string;
  postUrl?: string;
}

// Linkable terms: multi-word phrases, or single words ≥ 10 chars.
// Sorted longest-first so multi-word phrases match before their components.
const LINKABLE_TERMS = CS_TERMS_SORTED.filter(
  (t) => t.term.split(' ').length >= 2 || t.term.length >= 10
);

/**
 * Replace the first occurrence of each CS term across paragraphs with a link.
 * Returns an array of React nodes (strings or <Link> / <a> elements).
 */
function linkifyText(
  text: string,
  linkedAlready: Set<string>,
  paraIdx: number
): React.ReactNode[] {
  if (!text || LINKABLE_TERMS.length === 0) return [text];

  interface Match {
    start: number;
    end: number;
    original: string;
    term: string;
  }

  const matches: Match[] = [];
  const occupied = new Set<number>();

  for (const { term } of LINKABLE_TERMS) {
    if (linkedAlready.has(term)) continue;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) continue;
    let overlap = false;
    for (let i = idx; i < idx + term.length; i++) {
      if (occupied.has(i)) {
        overlap = true;
        break;
      }
    }
    if (overlap) continue;
    matches.push({
      start: idx,
      end: idx + term.length,
      original: text.slice(idx, idx + term.length),
      term,
    });
    for (let i = idx; i < idx + term.length; i++) occupied.add(i);
    linkedAlready.add(term);
  }

  if (matches.length === 0) return [text];

  matches.sort((a, b) => a.start - b.start);
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const { start, end, original, term } of matches) {
    if (start > last) nodes.push(text.slice(last, start));

    const conceptSlug = TERM_TO_CONCEPT_SLUG[term.toLowerCase()];
    const linkClass =
      'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';

    if (conceptSlug) {
      nodes.push(
        <Link
          key={`${paraIdx}-${start}`}
          href={`/guide/concepts/${conceptSlug}`}
          className={linkClass}
          title={`Concept: ${term}`}
        >
          {original}
        </Link>
      );
    } else {
      nodes.push(
        <a
          key={`${paraIdx}-${start}`}
          href={`/search?q=${encodeURIComponent(term)}`}
          className={linkClass}
          title={`Search: ${term}`}
        >
          {original}
        </a>
      );
    }

    last = end;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

// Paragraphs to strip (Substack boilerplate etc.)
const STRIP_PATTERNS = [
  /Thanks for reading Center Study Center/,
  /Thanks for reading GA Newsletter/,
  /reader-supported publication/,
  /^Subscribe$/,
  /^Share$/,
];

function shouldStrip(p: string): boolean {
  return STRIP_PATTERNS.some((re) => re.test(p));
}

export function PostContent({ content, postTitle = '', postUrl = '' }: PostContentProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const paragraphs = content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .filter((p) => !shouldStrip(p));

  // Pre-compute concept links — track linked terms across all paragraphs
  const linkedAlready = new Set<string>();
  const linkedParagraphs = paragraphs.map((raw, i) => {
    const isBlockquote = raw.startsWith('>') || raw.startsWith('_');
    const isHeading = /^#{1,3}\s/.test(raw);
    const text = isBlockquote
      ? raw.replace(/^>\s*/, '').replace(/^_|_$/g, '')
      : raw;
    const nodes: React.ReactNode[] = isHeading
      ? [text]
      : linkifyText(text, linkedAlready, i);
    return { isBlockquote, isHeading, text, nodes };
  });

  function copyAnchor(id: string) {
    const url =
      window.location.origin + window.location.pathname + '#' + id;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-4 text-gray-800 dark:text-gray-200">
      {linkedParagraphs.map(({ isBlockquote, isHeading, text, nodes }, i) => {
        const id = `p-${i + 1}`;

        // Pilcrow anchor button
        const pilcrow = (
          <button
            onClick={() => copyAnchor(id)}
            className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 text-sm select-none print:hidden"
            title="Copy link to this passage"
            aria-label="Copy link to this passage"
          >
            {copiedId === id ? '✓' : '¶'}
          </button>
        );

        if (isHeading) {
          return (
            <div key={id} id={id} className="group relative scroll-mt-20">
              {pilcrow}
              <p className="font-semibold text-base leading-relaxed">{text}</p>
            </div>
          );
        }

        if (isBlockquote) {
          return (
            <div key={id} id={id} className="group relative scroll-mt-20">
              {pilcrow}
              <blockquote className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400">
                {nodes}
              </blockquote>
            </div>
          );
        }

        return (
          <div
            key={id}
            id={id}
            className={`group relative scroll-mt-20${i === 0 ? ' pl-6 sm:pl-8' : ''}`}
          >
            {pilcrow}
            <p className="text-base leading-relaxed">{nodes}</p>
          </div>
        );
      })}

      {/* Attribution footer */}
      {postTitle && postUrl && (
        <p className="text-xs text-gray-400 dark:text-gray-600 pt-2 border-t border-gray-100 dark:border-gray-800 print:hidden">
          {postTitle} — {postUrl}
        </p>
      )}

      {/* Toast */}
      {copiedId && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none z-50">
          Link copied
        </div>
      )}
    </div>
  );
}
