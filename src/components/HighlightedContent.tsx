'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { PostContent, useTermLinksEnabled } from './PostContent';
import { useFrozenSearchQ } from './useFrozenSearchQ';

// The ?q= arrival view. NOT a second renderer: it renders the canonical
// PostContent (term links, toggle, anchors, pilcrows — identical to a plain
// visit) and lays the search highlight over the resulting DOM as <mark>
// wrappers. Everything about how a paragraph looks lives in PostContent.

interface HighlightedContentProps {
  content: string;
  postTitle?: string;
  postUrl?: string;
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

function HighlightedContentInner({ content, postTitle = '', postUrl = '' }: HighlightedContentProps) {
  // Frozen, not live — this component itself strips ?q= from the address bar
  // after applying the highlight, and a live read would wipe the marks.
  const query = useFrozenSearchQ();
  // Term links follow the same csc-term-links toggle as a plain visit. The
  // highlight passes below mutate PostContent's rendered DOM (splitText +
  // <mark> wrappers), so a links-on/off re-render reconciled over that
  // mutated DOM would corrupt it — instead the toggle is owned HERE and keys
  // the PostContent subtree: a flip remounts it clean, and the marking
  // effect (which depends on it) re-marks the fresh tree.
  const linksEnabled = useTermLinksEnabled();
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
    // Punctuation-insensitive: the phrase's words must appear in order
    // separated by ANY run of non-alphanumerics (same contract as
    // lib/phrase-match). A whitespace-only joiner broke on quoted text —
    // ?q=unlike+e.g.+prevent never matched “unlike, e.g., ‘prevent,’ …” and
    // the highlight fell back to scattered single-word marks.
    const rawPhrase = query.replace(/["“”„‟]/g, '').replace(/\s+/g, ' ').trim();
    const phraseWords = rawPhrase.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    if (phraseWords.length >= 2) {
      const phraseRegex = new RegExp(
        `(?<![a-zA-Z0-9])${phraseWords
          .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('[^a-zA-Z0-9]+')}(?![a-zA-Z0-9])`,
        'gi'
      );
      // PostContent renders body paragraphs as <p>, quotes as <blockquote>
      // (no inner <p>) and headings as real h2–h4; [data-nohl] marks chrome
      // (the attribution footer) that must never carry a search mark.
      const blocks = Array.from(
        container.querySelectorAll('p, blockquote, h2, h3, h4')
      ).filter(
        (el) => (el.tagName !== 'P' || !el.closest('blockquote')) && !el.closest('[data-nohl]')
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
        if ((node as Text).parentElement?.closest('[data-nohl]')) continue;
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
    setCurrentMatch(0);
    if (allMarks.length > 0) {
      setTimeout(() => {
        allMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        allMarks[0].style.outline = '2px solid #3b82f6';
        allMarks[0].style.outlineOffset = '1px';
      }, 200);
    }
    // The highlight is applied — drop ?q= from the address bar so sharing the
    // page from the browser (share sheet, copied address) gives the clean
    // canonical URL instead of leaking the reader's search query. The
    // highlight itself stays; only the visible URL changes.
    try {
      const u = new URL(window.location.href);
      if (u.searchParams.has('q')) {
        u.searchParams.delete('q');
        const qs = u.searchParams.toString();
        window.history.replaceState(null, '', u.pathname + (qs ? `?${qs}` : '') + u.hash);
      }
    } catch {}
  }, [query, linksEnabled]);

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
      <div ref={contentRef}>
        <PostContent
          key={linksEnabled ? 'links-on' : 'links-off'}
          content={content}
          postTitle={postTitle}
          postUrl={postUrl}
          linksEnabled={linksEnabled}
        />
      </div>
    </>
  );
}

export default function HighlightedContent(props: HighlightedContentProps) {
  return (
    <Suspense fallback={<PostContent content={props.content} postTitle={props.postTitle} postUrl={props.postUrl} />}>
      <HighlightedContentInner {...props} />
    </Suspense>
  );
}
