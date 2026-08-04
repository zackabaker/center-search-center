'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface CompanyExcerpt {
  id: string;      // slug#p-N
  slug: string;
  title: string;
  source: string;
  date: string | null;
  p: number;       // stable paragraph anchor number
  text: string;    // verbatim paragraph, straight from the corpus
  tier: 1 | 2 | 3;
  themes: string[];
}

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
};

const THEME_LABELS: Record<string, string> = {
  'data-security': 'Data security',
  insurance: 'Insurance',
  'prediction-markets': 'Prediction markets',
  monopoly: 'Monopoly',
  'startup-formation': 'Starting companies',
  'corporate-order': 'The corporate order',
  'profit-revenue': 'Profit & revenue',
  'state-functions': 'Supplanting the state',
  'teams-patronage': 'Teams & patronage',
  'markets-finance': 'Markets & finance',
  discipline: 'Discipline',
  'anglo-modernity': 'Anglo modernity',
};

const TIER_META: Record<number, { label: string; sub: string }> = {
  3: { label: 'Blueprints', sub: 'Proposals and working designs — companies to be built, and how they would operate' },
  2: { label: 'The company as a form', sub: 'Sustained analysis of companies, corporations, insurance, monopoly, and markets' },
  1: { label: 'Mentions', sub: 'Passages that touch the theme in passing' },
};

function year(date: string | null): string {
  return date?.match(/\b(19|20)\d{2}\b/)?.[0] ?? '';
}

export default function CompaniesClient({ excerpts }: { excerpts: CompanyExcerpt[] }) {
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState<string | null>(null);

  const themeCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of excerpts) for (const t of e.themes) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [excerpts]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return excerpts.filter((e) => {
      if (theme && !e.themes.includes(theme)) return false;
      if (ql && !(e.text.toLowerCase().includes(ql) || e.title.toLowerCase().includes(ql))) return false;
      return true;
    });
  }, [excerpts, q, theme]);

  const byTier = useMemo(() => {
    const m: Record<number, CompanyExcerpt[]> = { 3: [], 2: [], 1: [] };
    for (const e of filtered) m[e.tier]?.push(e);
    return m;
  }, [filtered]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 space-y-3">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Filter ${excerpts.length.toLocaleString()} passages…`}
          className="w-full px-4 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors"
        />
        <div className="flex flex-wrap gap-1.5">
          {themeCounts.map(([t, n]) => (
            <button
              key={t}
              onClick={() => setTheme(theme === t ? null : t)}
              aria-pressed={theme === t}
              className={`px-2.5 py-1 rounded-full border text-xs transition-colors ${
                theme === t
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {THEME_LABELS[t] ?? t} <span className="opacity-60">{n}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500" role="status" aria-live="polite">
          {filtered.length === excerpts.length
            ? `${excerpts.length.toLocaleString()} passages`
            : `${filtered.length.toLocaleString()} of ${excerpts.length.toLocaleString()} passages`}
        </p>
      </div>

      {/* Tier sections */}
      {[3, 2, 1].map((tier) => {
        const items = byTier[tier];
        if (!items || items.length === 0) return null;
        const meta = TIER_META[tier];
        return (
          <section key={tier} className="mb-12" aria-label={meta.label}>
            <div className="mb-5 border-b border-gray-100 dark:border-gray-800 pb-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {meta.label} <span className="text-sm font-normal text-gray-400 dark:text-gray-500">· {items.length}</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{meta.sub}</p>
            </div>
            <div className="space-y-6">
              {items.map((e) => (
                <article key={e.id} className="border-l-2 border-amber-600 dark:border-amber-500 pl-4">
                  <p
                    className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                    style={{ fontFamily: 'var(--prose-font-family)' }}
                  >
                    {e.text}
                  </p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap text-xs text-gray-400 dark:text-gray-500">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {SOURCE_LABELS[e.source] ?? e.source}
                    </span>
                    {year(e.date) && <span>{year(e.date)}</span>}
                    <Link
                      href={`/post/${e.slug}#p-${e.p}`}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {e.title} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
          Nothing matches — try a different word or clear the theme filter.
        </p>
      )}
    </div>
  );
}
