'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense, useMemo } from 'react';
import { CS_TERMS, TERM_TO_CONCEPT_SLUG } from '@/lib/cs-terms';
import TermLink from '@/components/TermLink';

interface HighlightedContentProps {
  paragraphs: string[];
  postTitle?: string;
  postUrl?: string;
}

// ── Inline concept linking ────────────────────────────────────────────────────
// Build linkable terms once: 2+ words (specific enough), or single words ≥ 10
// chars (very domain-specific). Sorted longest-first so multi-word phrases
// match before their components.
const LINKABLE_TERMS = CS_TERMS
  .filter((t) => t.term.split(' ').length >= 2 || t.term.length >= 10)
  .sort((a, b) => b.term.length - a.term.length);

/**
 * Parse markdown-style links [text](url) in a paragraph and return segments.
 * Each segment is either a plain string or a rendered <a> element.
 * Text segments are passed through linkifyParagraph for concept linking.
 */
// Inline **bold** / *italic* — without this, readers arriving from search
// (the ?q= fork) saw literal asterisks in 102 posts, including every
// Anthropoetics Notes section.
function emphasize(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={`${keyBase}-b${k++}`}>{m[1]}</strong>);
    else out.push(<em key={`${keyBase}-i${k++}`}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderParagraphNodes(
  rawText: string,
  linkedAlready: Set<string>,
  paraIndex: number
): React.ReactNode[] {
  const mdLinkRe = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const segments: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let segKey = 0;

  while ((m = mdLinkRe.exec(rawText)) !== null) {
    if (m.index > last) {
      // plain text before the link — run concept linking
      segments.push(...linkifyParagraph(rawText.slice(last, m.index), linkedAlready).map((n, j) =>
        typeof n === 'string' ? n : <span key={`${paraIndex}-pre-${segKey++}-${j}`}>{n}</span>
      ));
    }
    segments.push(
      <a
        key={`${paraIndex}-link-${segKey++}`}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {m[1]}
      </a>
    );
    last = mdLinkRe.lastIndex;
  }

  if (last < rawText.length) {
    segments.push(...linkifyParagraph(rawText.slice(last), linkedAlready).map((n, j) =>
      typeof n === 'string' ? n : <span key={`${paraIndex}-post-${segKey++}-${j}`}>{n}</span>
    ));
  }

  const base = segments.length > 0 ? segments : linkifyParagraph(rawText, linkedAlready);
  // Final pass: render markdown emphasis inside plain-text segments.
  return base.flatMap((n, j) =>
    typeof n === 'string' ? emphasize(n, `${paraIndex}-em-${j}`) : [n]
  );
}

/**
 * Split `text` into an array of strings and <a> nodes for matched concepts.
 * Only the FIRST occurrence of each term per paragraph is linked.
 */
function linkifyParagraph(text: string, linkedAlready: Set<string>): React.ReactNode[] {
  if (!text || LINKABLE_TERMS.length === 0) return [text];

  // Find all non-overlapping matches
  interface Match { start: number; end: number; original: string; term: string; }
  const matches: Match[] = [];
  const occupied = new Set<number>();

  for (const { term } of LINKABLE_TERMS) {
    if (linkedAlready.has(term)) continue; // already linked in a previous paragraph
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) continue;
    // Check no position overlap with an already-claimed match
    let overlap = false;
    for (let i = idx; i < idx + term.length; i++) {
      if (occupied.has(i)) { overlap = true; break; }
    }
    if (overlap) continue;
    matches.push({ start: idx, end: idx + term.length, original: text.slice(idx, idx + term.length), term });
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
    const linkCls = 'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';
    if (conceptSlug) {
      nodes.push(
        <TermLink
          key={start}
          href={`/guide/concepts/${conceptSlug}`}
          defKey={`c:${conceptSlug}`}
          className={linkCls}
          title={`Concept: ${term}`}
        >
          {original}
        </TermLink>
      );
    } else {
      nodes.push(
        <a key={start} href={`/search?q=${encodeURIComponent(term)}`} className={linkCls} title={`Search: ${term}`}>
          {original}
        </a>
      );
    }
    last = end;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
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

// Stop words to exclude from in-post highlights so common words don't paint the page
const HIGHLIGHT_STOPWORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','have','has','had','do','does',
  'did','will','would','could','should','may','might','must','can','this',
  'that','these','those','it','its','what','which','who','when','where',
  'how','why','all','any','some','not','more','most','other','than','too',
  'very','just','also','about','than','then','over','after','before','while',
  'here','there','their','they','them','you','your','our','its','him','his',
  'her','she','he','we','my','who','as','if','so','no','only','both','each',
  'into',
]);

const MAX_MARKS = 20; // cap highlights so frequent terms don't paint the whole page

// Extract meaningful query terms: split on whitespace, strip punctuation,
// filter stop words and very short words.
function extractHighlightTerms(query: string): string[] {
  // Strip boolean operators and quotes
  const clean = query.replace(/"/g, '').replace(/\b(AND|OR|NOT)\b/gi, '').trim();
  return clean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9'-]/g, '').trim())
    .filter((w) => w.length >= 4 && !HIGHLIGHT_STOPWORDS.has(w.toLowerCase()));
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

    const allMarks: HTMLElement[] = [];
    let totalMatches = 0;

    const MARK_STYLE =
      // Subtle inline highlight — neutral (amber is reserved for the verbatim center)
      'background:rgba(120,113,108,0.30);color:inherit;border-radius:2px;padding:0 2px;';

    // ── Pass 1: the query as a contiguous PHRASE, matched at block level ──
    // Citation deep links (?q=first+words+of+the+quote) must land on the
    // quoted passage, not on the first stray occurrence of a common word.
    // Concept TermLinks and bold/italic split the phrase across text nodes,
    // so we match against each block's textContent and then wrap the covered
    // text-node segments (in reverse order, so offsets stay valid).
    const rawPhrase = query.replace(/["“”„‟]/g, '').replace(/\s+/g, ' ').trim();
    const phraseWords = rawPhrase.split(' ').filter(Boolean);
    if (phraseWords.length >= 2) {
      const phraseRegex = new RegExp(
        phraseWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\u00a0]+'),
        'gi'
      );
      const blocks = Array.from(container.querySelectorAll('p, blockquote')).filter(
        (el) => el.tagName !== 'P' || !el.closest('blockquote')
      );
      for (const block of blocks) {
        if (totalMatches >= MAX_MARKS) break;
        const blockText = block.textContent || '';
        phraseRegex.lastIndex = 0;
        const ranges: [number, number][] = [];
        let m: RegExpExecArray | null;
        while ((m = phraseRegex.exec(blockText)) !== null && totalMatches < MAX_MARKS) {
          ranges.push([m.index, m.index + m[0].length]);
          totalMatches++;
          if (m[0].length === 0) phraseRegex.lastIndex++;
        }
        if (ranges.length === 0) continue;
        // Snapshot text nodes with cumulative offsets, then wrap segments
        // back-to-front so earlier offsets survive the splits.
        const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
        const entries: { node: Text; start: number; end: number }[] = [];
        let off = 0;
        let tn: Node | null;
        while ((tn = walker.nextNode())) {
          const len = (tn.textContent || '').length;
          entries.push({ node: tn as Text, start: off, end: off + len });
          off += len;
        }
        for (let r = ranges.length - 1; r >= 0; r--) {
          const [rs, re] = ranges[r];
          for (let e = entries.length - 1; e >= 0; e--) {
            const entry = entries[e];
            if (entry.end <= rs || entry.start >= re) continue;
            const localStart = Math.max(0, rs - entry.start);
            const localEnd = Math.min(entry.node.length, re - entry.start);
            if (localEnd <= localStart) continue;
            const mid = entry.node.splitText(localStart);
            mid.splitText(localEnd - localStart);
            const mark = document.createElement('mark');
            mark.style.cssText = MARK_STYLE;
            entry.node.parentNode?.insertBefore(mark, mid);
            mark.appendChild(mid);
            allMarks.push(mark);
          }
        }
      }
      // Restore document order (segments were created back-to-front)
      allMarks.sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
    }

    // ── Pass 2 (fallback): meaningful words — the ordinary search arrival ──
    if (totalMatches === 0) {
      const terms = extractHighlightTerms(query);
      if (terms.length === 0) return;
      const pattern = terms
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
      const regex = new RegExp(`\\b(${pattern})\\b`, 'gi');

      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
      const textNodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) {
        if (regex.test((node as Text).textContent || '')) textNodes.push(node as Text);
        regex.lastIndex = 0;
      }

      for (const textNode of textNodes) {
        if (totalMatches >= MAX_MARKS) break; // stop once we've hit the cap
        const text = textNode.textContent || '';
        const parts: (string | { match: string })[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        regex.lastIndex = 0;
        while ((match = regex.exec(text)) !== null) {
          if (totalMatches >= MAX_MARKS) break;
          if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
          parts.push({ match: match[0] });
          lastIndex = regex.lastIndex;
          totalMatches++;
        }
        if (lastIndex < text.length) parts.push(text.slice(lastIndex));
        if (parts.length <= 1) continue;
        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (typeof part === 'string') {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const mark = document.createElement('mark');
            mark.textContent = part.match;
            mark.style.cssText = MARK_STYLE;
            allMarks.push(mark);
            fragment.appendChild(mark);
          }
        });
        textNode.parentNode?.replaceChild(fragment, textNode);
      }
    }

    marksRef.current = allMarks;
    setMatchCount(totalMatches);
    if (allMarks.length > 0) {
      setTimeout(() => {
        allMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        allMarks[0].style.outline = '2px solid #3b82f6';
        allMarks[0].style.outlineOffset = '1px';
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
    // Clear outlines using inline style (since we use inline styles now)
    marks.forEach((m) => { m.style.outline = ''; m.style.outlineOffset = ''; });
    setCurrentMatch((prev) => {
      const next = direction === 'next' ? (prev + 1) % marks.length : (prev - 1 + marks.length) % marks.length;
      marks[next].style.outline = '2px solid #3b82f6';
      marks[next].style.outlineOffset = '1px';
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

  // Pre-compute concept links across all paragraphs so each term is linked once
  const linkedParagraphs = useMemo(() => {
    const linkedAlready = new Set<string>();
    return paragraphs.map((p, i) => {
      const isDivider = p.trim() === '---';
      const isHeading = /^#{1,3}\s/.test(p);
      const headingLevel = isHeading ? (p.match(/^(#{1,3})\s/)?.[1].length ?? 2) : 0;
      const isBlockquote = !isHeading && !isDivider && (p.startsWith('>') || p.startsWith('_'));
      // Reddit Q&A structural markers — mirror PostContent so the ?q= view
      // never renders raw '[ADAM]' / '[Q:username]' brackets.
      const isBouvardLabel = p.trim() === '[ADAM]';
      const qMatch = (!isBlockquote && !isHeading && !isDivider && !isBouvardLabel)
        ? p.match(/^\[Q:([^\]]*)\]\s*([\s\S]*)/)
        : null;
      const questionCard = qMatch ? { questioner: qMatch[1].trim(), questionText: qMatch[2].trim() } : null;
      // Strip the markdown markers so the marker text never renders literally.
      const text = isHeading
        ? p.replace(/^#{1,3}\s/, '')
        : isBlockquote
        ? p.replace(/^>\s*/, '').replace(/^_|_$/g, '')
        : p;
      // Don't linkify headings — they're structural, not prose
      const nodes = isHeading || isDivider || isBouvardLabel || questionCard
        ? [text]
        : renderParagraphNodes(text, linkedAlready, i);
      return { isBlockquote, isHeading, isDivider, isBouvardLabel, questionCard, headingLevel, text, nodes };
    });
  }, [paragraphs]);

  return (
    <>
      {query && matchCount > 0 && (
        <div className="sticky top-1 z-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 mb-6 flex items-center gap-3 text-sm shadow-sm print:hidden">
          <span className="text-gray-700 dark:text-gray-300"><strong>{matchCount}</strong>{' '}match{matchCount !== 1 ? 'es' : ''} for &ldquo;<span className="font-medium">{query}</span>&rdquo;</span>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-gray-400 dark:text-gray-500 mr-1 hidden sm:inline">n / N to navigate</span>
            <button onClick={() => scrollToMatch('prev')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7"/></svg>
            </button>
            <button onClick={() => scrollToMatch('next')} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        </div>
      )}
      {query && matchCount === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 mb-6 text-sm text-gray-500 dark:text-gray-400 print:hidden">
          No matches for &ldquo;{query}&rdquo; in this post
        </div>
      )}
      <div ref={contentRef} className="prose text-gray-800 dark:text-gray-200 mx-auto">
        {linkedParagraphs.map(({ isBlockquote, isHeading, isDivider, isBouvardLabel, questionCard, headingLevel, text, nodes }, i) => {
          const id = `p-${i + 1}`;

          if (isDivider) {
            return <hr key={i} className="border-gray-100 dark:border-gray-800 my-2" />;
          }

          // Adam Katz speaker label (before Bouvard's response in Q&A) —
          // amber marks Katz's verbatim speech, matching PostContent.
          if (isBouvardLabel) {
            return (
              <div key={i} className="flex items-center gap-2.5 pt-1 pb-0.5">
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 tracking-wide whitespace-nowrap">
                  Adam Katz
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>
            );
          }

          // Question card (Reddit Q&A questioner)
          if (questionCard) {
            return (
              <div
                key={i}
                id={id}
                className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-3 mt-2 scroll-mt-20"
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
            const cls =
              headingLevel === 1 ? 'text-2xl font-bold leading-snug mt-10'
              : headingLevel === 2 ? 'text-xl font-semibold leading-snug mt-10'
              : 'text-lg font-semibold leading-snug mt-8';
            // Sans-serif heading, matching the non-search reader (PostContent).
            return (
              <p key={i} id={id} className={`group scroll-mt-20 ${cls}`}
                style={{ fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)' }}>
                {text}
              </p>
            );
          }

          const controls = (
            <span className="inline-flex items-center gap-1 ml-2 align-middle print:hidden">
              <PermalinkButton id={id} />
              <CopyParaButton text={text} title={postTitle} url={pageUrl} />
            </span>
          );
          if (isBlockquote) return <blockquote key={i} id={id} className="group scroll-mt-20"><p>{nodes}{controls}</p></blockquote>;
          return (
            <p key={i} id={id} className="group scroll-mt-20">
              {nodes}{controls}
            </p>
          );
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
