'use client';

import { useState, useEffect, useRef } from 'react';

interface Item {
  level: number;
  text: string;
  id: string;
}

interface Props {
  paragraphs: string[];
}

function extractHeadings(paragraphs: string[]): Item[] {
  const headings: Item[] = [];
  paragraphs.forEach((para, i) => {
    const match = para.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
        id: `p-${i + 1}`,
      });
    }
  });
  return headings;
}

// Orientation for heading-less essays (only 2 of ~1,970 posts have ≥3 real
// headings, so a headings-only ToC was a phantom feature). Landmarks are the
// VERBATIM opening words of paragraphs at the quarter points of the essay —
// nothing invented, per the site's verbatim ethos — each linking to its
// existing stable #p-N anchor.
function extractLandmarks(paragraphs: string[]): Item[] {
  const substantive: { index: number; text: string }[] = [];
  paragraphs.forEach((para, i) => {
    const p = para.trim();
    if (!p || p === '---' || /^#{1,3}\s/.test(p) || p.length < 120) return;
    substantive.push({ index: i, text: p });
  });
  if (substantive.length < 20) return []; // short reads don't need landmarks
  const picks = [0, 0.25, 0.5, 0.75].map((f) =>
    substantive[Math.min(substantive.length - 1, Math.floor(f * substantive.length))]
  );
  const seen = new Set<number>();
  return picks
    .filter((p) => (seen.has(p.index) ? false : (seen.add(p.index), true)))
    .map((p) => {
      const words = p.text.replace(/^>\s*/, '').replace(/[*_]/g, '').split(/\s+/);
      return {
        level: 1,
        text: `“${words.slice(0, 7).join(' ')}${words.length > 7 ? ' …' : ''}”`,
        id: `p-${p.index + 1}`,
      };
    });
}

export default function TableOfContents({ paragraphs }: Props) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const headings = extractHeadings(paragraphs);
  const isLandmarks = headings.length < 3;
  const items = isLandmarks ? extractLandmarks(paragraphs) : headings;

  useEffect(() => {
    if (!open || items.length === 0) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [open, items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (items.length === 0) return null;

  return (
    <nav className="mt-8 mb-6 print:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {isLandmarks ? 'Landmarks' : `Contents (${items.length} sections)`}
      </button>

      {open && (
        <ol className="mt-3 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
          {items.map(({ level, text, id }, i) => (
            <li key={id} style={{ paddingLeft: (level - 1) * 14 + 'px' }}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-sm py-0.5 transition-colors ${
                  activeId === id
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {isLandmarks && (
                  <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 mr-1.5">
                    {['¼', '½', '¾', ''][i - 1] ?? ''}
                  </span>
                )}
                <span className={isLandmarks ? 'italic' : ''} style={isLandmarks ? { fontFamily: 'var(--prose-font-family)' } : undefined}>
                  {text}
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
