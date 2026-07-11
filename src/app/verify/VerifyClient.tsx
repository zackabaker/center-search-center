'use client';

import { useState } from 'react';
import Link from 'next/link';

type Source = { slug: string; title: string; source: string; date: string | null; url: string; snippet: string };
type Result = { verified: boolean; sources: Source[]; canonical: string | null; corpusVersion?: string };

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack', gablog: 'GABlog', book: 'Anthropomorphics', pdf: 'Essay',
  chronicle: 'Chronicle', ap: 'Anthropoetics', reddit: 'Reddit', twitter: 'X',
};

export default function VerifyClient() {
  const [quote, setQuote] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);

  const check = async () => {
    const q = quote.trim();
    if (q.length < 15) return;
    setStatus('checking');
    setResult(null);
    try {
      const r = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: q }),
      });
      if (!r.ok) throw new Error('bad response');
      setResult(await r.json());
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <textarea
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="“The sign is the deferral of violence…”"
        rows={4}
        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 text-base leading-relaxed placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
        style={{ fontFamily: 'var(--prose-font-family)' }}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={check}
          disabled={quote.trim().length < 15 || status === 'checking'}
          className="px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'checking' ? 'Checking…' : 'Verify'}
        </button>
        {quote.trim().length > 0 && quote.trim().length < 15 && (
          <span className="text-xs text-gray-400 dark:text-gray-500">at least 15 characters</span>
        )}
      </div>

      {status === 'error' && (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Verification is unavailable right now — try again in a moment.
        </p>
      )}

      {status === 'done' && result && (
        <div className="mt-8">
          {result.verified ? (
            <div>
              <p className="flex items-center gap-2 text-base font-medium text-green-700 dark:text-green-400 mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Verified — these are the author&rsquo;s exact words
              </p>
              <div className="space-y-4">
                {result.sources.map((s) => (
                  <div key={s.slug} className="border-l-2 border-amber-600 dark:border-amber-500 pl-4">
                    <p
                      className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-1.5"
                      style={{ fontFamily: 'var(--prose-font-family)' }}
                    >
                      {s.snippet}
                    </p>
                    <Link
                      href={`/post/${s.slug}?q=${encodeURIComponent(quote.trim().split(/\s+/).slice(0, 8).join(' '))}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {s.title}
                    </Link>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {' '}· {SOURCE_LABELS[s.source] ?? s.source}{s.date ? ` · ${s.date}` : ''}
                    </span>
                  </div>
                ))}
              </div>
              {result.canonical && (
                <p className="mt-5 text-sm">
                  <Link href={result.canonical} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    This is a canonical quote — cite it at center.study{result.canonical} →
                  </Link>
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="flex items-center gap-2 text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                Not found verbatim in the corpus
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                The exact words don&rsquo;t appear in any of the archive&rsquo;s texts. It may be a
                paraphrase, a misattribution, or from a work outside this corpus. Try{' '}
                <Link
                  href={`/search?mode=meaning&q=${encodeURIComponent(quote.trim().slice(0, 120))}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  searching by meaning
                </Link>{' '}
                for the closest real passages.
              </p>
            </div>
          )}
          {result.corpusVersion && (
            <p className="mt-6 text-[11px] font-mono text-gray-300 dark:text-gray-600">
              checked against corpus {result.corpusVersion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
