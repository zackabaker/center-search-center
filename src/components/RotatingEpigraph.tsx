'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Homepage epigraph carousel: verbatim quotes from the corpus, each
// deep-linked to its source post with the ?q= highlight. The canonical
// Mobius-strip line always renders first (SSR), then the set auto-advances;
// the chevrons and dots let readers page through themselves (manual
// navigation restarts the timer). Every text here is an exact corpus
// substring (the first from posts-cache content, the rest from quotes.json,
// which is machine-verified verbatim at build time) — do not paraphrase or
// re-punctuate.
const QUOTES: { text: string; slug: string; q: string }[] = [
  {
    text: 'The originary hypothesis repels the kind of initiatory revelatory “download” that is nevertheless the only way of understanding it',
    slug: 'originary-hypothesis-as-mobius-strip',
    q: 'repels the kind of initiatory revelatory',
  },
  {
    text: 'The originary scene is a transition from the animal order governed by the Alpha to a human order governed by the center.',
    slug: 'ga-and-the-nap',
    q: 'The originary scene is a transition from the',
  },
  {
    text: 'My starting assumption is that humans are mimetic beings: we learn everything we learn by imitation.',
    slug: 'p-ower-reddit',
    q: 'My starting assumption is that humans are mimetic',
  },
  {
    text: 'the mode of succession is the most important question for assessing a social order—how is the center transferred from one occupant to the next tells us everything important we need to know about that social order',
    slug: 'successful-succession',
    q: 'the mode of succession is the most important',
  },
];

const INTERVAL_MS = 14000;

export default function RotatingEpigraph() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % QUOTES.length);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [startTimer]);

  // Manual navigation restarts the clock so the carousel doesn't auto-advance
  // right after a click.
  const goTo = (i: number) => {
    setActive(((i % QUOTES.length) + QUOTES.length) % QUOTES.length);
    startTimer();
  };

  const chevron =
    'shrink-0 p-1.5 rounded-full text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors';

  return (
    <figure
      className="mb-6 max-w-xl mx-auto"
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      <div className="flex items-center gap-1 sm:gap-2">
        <button type="button" aria-label="Previous quote" className={chevron} onClick={() => goTo(active - 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <blockquote
          className="grid flex-1 min-w-0"
          style={{ fontFamily: 'var(--font-lora, Georgia, serif)' }}
        >
          {/* All quotes share one grid cell so the tallest sets the height and
              paging never shifts the layout below. Upright (non-italic) serif —
              italic Lora is too ornate to read comfortably. */}
          {QUOTES.map((quote, i) => (
            <Link
              key={quote.slug + i}
              href={`/post/${quote.slug}?q=${encodeURIComponent(quote.q)}`}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              className={`col-start-1 row-start-1 self-center transition-opacity duration-500 ${
                i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="Read in context"
            >
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed hover:text-gray-800 dark:hover:text-gray-100 transition-colors">
                &ldquo;{quote.text}&rdquo;
              </p>
            </Link>
          ))}
        </blockquote>

        <button type="button" aria-label="Next quote" className={chevron} onClick={() => goTo(active + 1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2" role="tablist" aria-label="Quotes">
        {QUOTES.map((quote, i) => (
          <button
            key={quote.slug + i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Quote ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active
                ? 'w-4 bg-gray-400 dark:bg-gray-500'
                : 'w-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </figure>
  );
}
