'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { GlossaryEntry } from '@/data/guide/glossary';

// Entries arrive enriched server-side with the defining quote's real author.
type Entry = GlossaryEntry & { definitionAuthor?: string };

const SOURCE_COLORS: Record<string, string> = {
  GABlog:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Substack:   'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Essay:      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Book:       'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Chronicles: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'AP Journal': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

interface Props {
  entries: Entry[];
}

// Share a specific term: native share sheet on mobile, copy-link elsewhere.
// Links to the term's canonical page (its concept hub when one exists).
function ShareTerm({ slug, term, concept }: { slug: string; term: string; concept?: string }) {
  const [copied, setCopied] = useState(false);
  const url = concept
    ? `https://center.study/guide/concepts/${concept}`
    : `https://center.study/guide/glossary/${slug}`;
  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `${term} — Center Study`, url });
        return;
      }
    } catch { return; } // user dismissed the sheet
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <button
      onClick={share}
      title={`Share “${term}”`}
      aria-label={`Share the term ${term}`}
      className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
    >
      {copied ? (
        <span className="text-[11px] text-green-600 dark:text-green-400">copied</span>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
    </button>
  );
}

export default function GlossaryClient({ entries }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (e) => e.term.toLowerCase().includes(q) || e.definitionQuote.toLowerCase().includes(q)
    );
  }, [entries, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of filtered) {
      const c = e.term[0].toUpperCase();
      const letter = /[A-Z]/.test(c) ? c : '#';
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(e);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const letters = groups.map(([l]) => l);

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-5">
        {entries.length} terms, each used repeatedly across the corpus, with usage
        drawn directly from the texts.
      </p>

      {/* Filter */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Filter ${entries.length} terms…`}
          className="w-full sm:max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2.5 text-base sm:text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 transition-all"
        />
      </div>

      {/* A–Z bar */}
      {!query && (
        <nav className="sticky top-12 z-20 backdrop-blur py-2 -mx-4 px-4 mb-8 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide" style={{ backgroundColor: 'color-mix(in srgb, var(--background) 95%, transparent)' }}>
          <div className="flex gap-1 min-w-max">
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </nav>
      )}

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 dark:text-gray-500 py-8">
          No terms match &ldquo;{query}&rdquo; — try{' '}
          <Link href={`/search?q=${encodeURIComponent(query)}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            searching the full archive
          </Link>
          .
        </p>
      )}

      {/* Entries */}
      <div className="space-y-12">
        {groups.map(([letter, group]) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-28">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-2 border-b border-gray-100 dark:border-gray-800">
              {letter}
            </h2>
            <div className="space-y-9">
              {group.map((entry) => (
                <div key={entry.slug} id={entry.slug} className="scroll-mt-28">
                  <div className="flex items-baseline gap-3 flex-wrap mb-1">
                    <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white">
                      <Link
                        href={entry.concept ? `/guide/concepts/${entry.concept}` : `/guide/glossary/${entry.slug}`}
                        className="hover:underline decoration-gray-300 dark:decoration-gray-600 underline-offset-4"
                      >
                        {entry.term}
                      </Link>
                    </h3>
                    <span className="text-[11px] text-gray-300 dark:text-gray-600 tabular-nums">
                      in {entry.posts} texts
                    </span>
                    <ShareTerm slug={entry.slug} term={entry.term} concept={entry.concept} />
                  </div>
                  {/* Verbatim defining quote — Katz's words lead (amber); the
                      rare non-Katz definition takes gray + an author label */}
                  <blockquote className={`border-l-2 pl-3.5 mb-3 max-w-2xl ${!entry.definitionAuthor || entry.definitionAuthor.startsWith('Adam Katz') ? 'border-amber-600 dark:border-amber-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    <p
                      className="text-gray-800 dark:text-gray-200 leading-relaxed"
                      style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px' }}
                    >
                      &ldquo;{entry.definitionQuote}&rdquo;
                    </p>
                    <footer className="mt-1">
                      <Link
                        href={`/post/${entry.definitionSlug}`}
                        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
                      >
                        — {entry.definitionAuthor && !entry.definitionAuthor.startsWith('Adam Katz') ? `${entry.definitionAuthor}, ` : ''}{entry.definitionSource}
                      </Link>
                    </footer>
                  </blockquote>

                  {/* Usage from the corpus */}
                  {entry.passages.length > 0 && (
                    <div className="space-y-2.5 mb-2.5">
                      {entry.passages.map((p, i) => (
                        <blockquote
                          key={i}
                          className={`border-l-2 border-gray-200 dark:border-gray-700 pl-3.5 ${i > 0 ? 'hidden sm:block' : ''}`}
                        >
                          <p
                            className="text-sm text-gray-600 dark:text-gray-400 italic leading-relaxed max-w-2xl"
                            style={{ fontFamily: 'var(--prose-font-family)' }}
                          >
                            &ldquo;{p.text}&rdquo;
                          </p>
                          <footer className="mt-1">
                            <Link
                              href={`/post/${p.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
                            >
                              <span className={`px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[p.source] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {p.source}
                              </span>
                              <span className="group-hover:underline max-w-[300px] truncate">{p.title}</span>
                            </Link>
                          </footer>
                        </blockquote>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                    {entry.concept && (
                      <Link
                        href={`/guide/concepts/${entry.concept}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Full concept page →
                      </Link>
                    )}
                    {entry.sources.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/post/${s.slug}`}
                        className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
                        title={s.title}
                      >
                        <span className={`px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[s.source] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {s.source}
                        </span>
                        <span className="group-hover:underline max-w-[220px] truncate">{s.title}</span>
                      </Link>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(entry.term)}`}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      Search archive →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
