'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// Homepage epigraph: verbatim quotes from the corpus, each deep-linked to its
// source post with the ?q= highlight. The canonical Mobius-strip line always
// renders first (SSR), then the set rotates with a crossfade. Every text here
// is an exact corpus substring (the first from posts-cache content, the rest
// from quotes.json, which is machine-verified verbatim at build time) — do
// not paraphrase or re-punctuate.
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
  {
    text: 'Money is a means of subordinating market activity to central authority—that is, money is a form taken by the delegation of power, and is therefore a form of power itself. Money is the power to command the labor of others.',
    slug: 'anthropomorphics-book',
    q: 'Money is a means of subordinating market activity',
  },
];

const INTERVAL_MS = 14000;

export default function RotatingEpigraph() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % QUOTES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <blockquote
      className="mb-6 px-2 max-w-lg mx-auto grid"
      style={{ fontFamily: 'var(--font-lora, Georgia, serif)' }}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {/* All quotes share one grid cell so the tallest sets the height and
          rotation never shifts the layout below. Upright (non-italic) serif —
          italic Lora is too ornate to read comfortably. */}
      {QUOTES.map((quote, i) => (
        <Link
          key={quote.slug + i}
          href={`/post/${quote.slug}?q=${encodeURIComponent(quote.q)}`}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
          className={`col-start-1 row-start-1 self-center transition-opacity duration-700 ${
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
  );
}
