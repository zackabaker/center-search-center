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

// Headings-only contents. (A "Landmarks" variant for heading-less essays —
// quarter-point verbatim openings — shipped in July 2026 and was removed at
// the owner's direction: no landmarks button. Don't reintroduce it.)
export default function TableOfContents({ paragraphs }: Props) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const items = extractHeadings(paragraphs);

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

  if (items.length < 3) return null;

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
        Contents ({items.length} sections)
      </button>

      {open && (
        <ol className="mt-3 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
          {items.map(({ level, text, id }) => (
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
                {text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
