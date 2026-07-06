'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TermLink from '@/components/TermLink';
import { CS_TERMS_SORTED, TERM_TO_CONCEPT_SLUG } from '@/lib/cs-terms';
import { GLOSSARY_LINK_TERMS } from '@/data/guide/glossary-link-terms';

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

// Glossary anchors for terms not covered by the concept system
const GLOSSARY_ANCHORS: Record<string, string> = {};
for (const { term, anchor } of GLOSSARY_LINK_TERMS) {
  GLOSSARY_ANCHORS[term.toLowerCase()] = anchor;
}

// Combined matching list, longest-first (concept terms take precedence on ties
// because they come first at equal length)
const ALL_LINKABLE: { term: string }[] = [
  ...LINKABLE_TERMS,
  ...GLOSSARY_LINK_TERMS.filter(
    (g) => !LINKABLE_TERMS.some((t) => t.term.toLowerCase() === g.term.toLowerCase())
  ),
].sort((a, b) => b.term.length - a.term.length);

/**
 * Replace the first occurrence of each CS term across paragraphs with a link.
 * Returns an array of React nodes (strings or <Link> / <a> elements).
 */
function linkifyText(
  text: string,
  linkedAlready: Set<string>,
  paraIdx: number
): React.ReactNode[] {
  if (!text || ALL_LINKABLE.length === 0) return [text];

  interface Match {
    start: number;
    end: number;
    original: string;
    term: string;
  }

  const matches: Match[] = [];
  const occupied = new Set<number>();

  for (const { term } of ALL_LINKABLE) {
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
    const glossaryAnchor = GLOSSARY_ANCHORS[term.toLowerCase()];
    const linkClass =
      'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';

    if (conceptSlug) {
      nodes.push(
        <TermLink
          key={`${paraIdx}-${start}`}
          href={`/guide/concepts/${conceptSlug}`}
          defKey={`c:${conceptSlug}`}
          className={linkClass}
          title={`Concept: ${term}`}
        >
          {original}
        </TermLink>
      );
    } else if (glossaryAnchor) {
      nodes.push(
        <TermLink
          key={`${paraIdx}-${start}`}
          href={`/concepts?view=glossary#${glossaryAnchor}`}
          defKey={`g:${glossaryAnchor}`}
          className={linkClass}
          title={`Glossary: ${term}`}
        >
          {original}
        </TermLink>
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

const INLINE_LINK_CLASS =
  'text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2 break-words';

// Render markdown emphasis (**bold**, *italic*, _italic_) and concept links on a
// text segment that no longer contains any markdown links or URLs.
function renderEmphasis(
  text: string,
  linkedAlready: Set<string>,
  paraIdx: number,
  allowTerms: boolean,
  keyBase: string
): React.ReactNode[] {
  const terms = (s: string): React.ReactNode[] =>
    allowTerms ? linkifyText(s, linkedAlready, paraIdx) : [s];
  const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*\n]+?\*|_[^_\n]+?_)/g);
  const out: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (!part) return;
    const key = `${keyBase}-${i}`;
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      out.push(<strong key={key} className="font-semibold text-gray-900 dark:text-white">{terms(part.slice(2, -2))}</strong>);
    } else if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      out.push(<em key={key}>{terms(part.slice(1, -1))}</em>);
    } else if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
      out.push(<em key={key}>{terms(part.slice(1, -1))}</em>);
    } else {
      out.push(<span key={key}>{terms(part)}</span>);
    }
  });
  return out;
}

// Inline renderer for body text: turn markdown links [text](url) and bare URLs
// into real anchors (extracted first, so URL punctuation is never mistaken for
// emphasis), then apply emphasis + concept links to the remaining prose.
function renderInline(
  text: string,
  linkedAlready: Set<string>,
  paraIdx: number,
  allowTerms: boolean
): React.ReactNode[] {
  const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|(https?:\/\/[^\s)\]]+)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) out.push(...renderEmphasis(text.slice(last, m.index), linkedAlready, paraIdx, allowTerms, `e${paraIdx}-${k}`));
    if (m[2]) {
      out.push(<a key={`ml${paraIdx}-${k++}`} href={m[2]} target="_blank" rel="noopener noreferrer" className={INLINE_LINK_CLASS}>{m[1]}</a>);
    } else if (m[3]) {
      // Trim trailing sentence punctuation so it isn't swallowed into the href.
      let url = m[3];
      let trail = '';
      const tm = url.match(/[.,;:!?]+$/);
      if (tm) { trail = tm[0]; url = url.slice(0, -trail.length); }
      out.push(<a key={`bu${paraIdx}-${k++}`} href={url} target="_blank" rel="noopener noreferrer" className={`${INLINE_LINK_CLASS} break-all`}>{url}</a>);
      if (trail) out.push(<span key={`tr${paraIdx}-${k++}`}>{trail}</span>);
    }
    last = LINK_RE.lastIndex;
  }
  if (last < text.length) out.push(...renderEmphasis(text.slice(last), linkedAlready, paraIdx, allowTerms, `e${paraIdx}-end`));
  return out;
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

  // Term links can be toggled off in ReadingControls (localStorage +
  // window event). Default on; read the preference after mount.
  const [linksEnabled, setLinksEnabled] = useState(true);
  useEffect(() => {
    const read = () => {
      try { setLinksEnabled(localStorage.getItem('csc-term-links') !== 'off'); } catch {}
    };
    read();
    window.addEventListener('csc-term-links-changed', read);
    return () => window.removeEventListener('csc-term-links-changed', read);
  }, []);

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
    const skipLinkify = !linksEnabled || isHeading || isDivider || isBouvardLabel || !!questionCard;
    // Markdown links, bare URLs, and emphasis always render; concept-term links
    // are gated by skipLinkify (structural lines + the term-links toggle).
    const nodes: React.ReactNode[] = renderInline(text, linkedAlready, i, !skipLinkify);
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
      // max-w-[65ch]: the serious-reading measure. ch computes against this
      // div's own font (Lora at the reader's prose size), so line length stays
      // ~65 characters at every font-size setting instead of the old ~85.
      className="space-y-7 text-gray-800 dark:text-gray-200 max-w-[65ch] mx-auto"
      style={{
        fontFamily: 'var(--prose-font-family)',
        fontSize: 'var(--prose-font-size, 18px)',
        lineHeight: 'var(--prose-line-height, 1.85)',
      }}
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
          // Real heading elements (nested under the page's single h1) so the
          // document has a proper outline for assistive tech + AI extraction.
          const HeadingTag = (level === 1 ? 'h2' : level === 2 ? 'h3' : 'h4') as 'h2' | 'h3' | 'h4';
          return (
            <div key={id} id={id} className="group relative scroll-mt-20">
              {pilcrow}
              {/* Headings use the UI font (sans-serif) for contrast with serif body */}
              <HeadingTag className={headingClass} style={{ fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)' }}>
                {headingText}
              </HeadingTag>
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
            {/* One paragraph convention: the container's vertical gaps mark
                paragraphs; first-line indents on top of gaps doubled the signal. */}
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
