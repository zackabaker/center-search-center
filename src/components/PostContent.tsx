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
    const isDivider = raw.trim() === '---';
    const isBouvardLabel = raw.trim() === '[ADAM]';
    // [Q:username] question text — Reddit Q&A conversation marker
    const qMatch = (!isBlockquote && !isHeading && !isDivider && !isBouvardLabel)
      ? raw.match(/^\[Q:([^\]]*)\]\s*([\s\S]*)/)
      : null;
    const questionCard = qMatch ? { questioner: qMatch[1].trim(), questionText: qMatch[2].trim() } : null;

    const text = isBlockquote
      ? raw.replace(/^>\s*/, '').replace(/^_|_$/g, '')
      : raw;
    const skipLinkify = isHeading || isDivider || isBouvardLabel || !!questionCard;
    const nodes: React.ReactNode[] = skipLinkify
      ? [text]
      : linkifyText(text, linkedAlready, i);
    return { isBlockquote, isHeading, isDivider, isBouvardLabel, questionCard, text, nodes };
  });

  function copyAnchor(id: string) {
    const url =
      window.location.origin + window.location.pathname + '#' + id;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div
      className="space-y-7 text-gray-800 dark:text-gray-200"
      style={{ fontSize: 'var(--prose-font-size, 18px)', lineHeight: 'var(--prose-line-height, 1.85)' }}
    >
      {linkedParagraphs.map(({ isBlockquote, isHeading, isDivider, isBouvardLabel, questionCard, text, nodes }, i) => {
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

        // ── Horizontal rule (between Q&A exchanges) ───────────────────────────
        if (isDivider) {
          return <hr key={id} className="border-gray-100 dark:border-gray-800 my-2" />;
        }

        // ── Adam Katz speaker label (before Bouvard's response in Q&A) ────────
        if (isBouvardLabel) {
          return (
            <div key={id} className="flex items-center gap-2.5 pt-1 pb-0.5">
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wide whitespace-nowrap">
                Adam Katz
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
            </div>
          );
        }

        // ── Question card (Reddit Q&A questioner) ─────────────────────────────
        if (questionCard) {
          return (
            <div
              key={id}
              id={id}
              className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-3 mt-2"
            >
              <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">
                {questionCard.questioner}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                {questionCard.questionText}
              </p>
            </div>
          );
        }

        if (isHeading) {
          const level = text.match(/^(#{1,3})\s/)?.[1]?.length ?? 2;
          const headingClass =
            level === 1
              ? 'text-2xl font-bold leading-snug mt-10'
              : level === 2
              ? 'text-xl font-semibold leading-snug mt-10'
              : 'text-lg font-semibold leading-snug mt-8';
          const headingText = text.replace(/^#{1,3}\s/, '');
          return (
            <div key={id} id={id} className="group relative scroll-mt-20">
              {pilcrow}
              <p className={headingClass}>{headingText}</p>
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
            className="group relative scroll-mt-20"
          >
            {pilcrow}
            <p>{nodes}</p>
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
