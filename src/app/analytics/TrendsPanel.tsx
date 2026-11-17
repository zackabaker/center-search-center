'use client';

import { useMemo, useState } from 'react';
import TrendChart, { type TrendPoint } from './TrendChart';

// The trends room: three single-series charts (visitors, reader searches,
// texts read) behind one shared range toggle — 30 days (daily, delta vs last
// week), 90 days (daily, delta vs last month), all time (weekly buckets;
// searches cover the full retained log, visitors/reads start with the site's
// own instrumentation). One filter row scopes everything below it.
//
// Local prop types on purpose: this is a client component, and importing
// ./data (Upstash client, corpus parser) would drag server code into the
// browser bundle.

export type TrendDay = {
  day: string; // YYYY-MM-DD (UTC)
  views: number | null;
  uniq: number | null;
  searches: number;
  searchesMine: number;
  reads: number;
  readsMine: number;
};
export type TrendWeek = { week: string; n: number; mine: number };

const RANGES = [
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: 'all', label: 'All time' },
] as const;
type RangeKey = (typeof RANGES)[number]['key'];

const fmtDayShort = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const dayLabel = (day: string) => fmtDayShort.format(new Date(`${day}T00:00:00Z`));
const weekOf = (day: string) => {
  const t = Date.parse(`${day}T00:00:00Z`);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  return new Date(t - dow * 86_400_000).toISOString().slice(0, 10);
};

const readerSearches = (r: TrendDay) => Math.max(0, r.searches - r.searchesMine);
const readerReads = (r: TrendDay) => Math.max(0, r.reads - r.readsMine);

function weeklyBuckets(rows: TrendDay[], f: (r: TrendDay) => number): TrendPoint[] {
  const byWeek = new Map<string, number>();
  for (const r of rows) {
    const w = weekOf(r.day);
    byWeek.set(w, (byWeek.get(w) ?? 0) + f(r));
  }
  return [...byWeek.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([w, v]) => ({ label: `wk of ${dayLabel(w)}`, value: v }));
}

export default function TrendsPanel({
  days,
  weeks,
  engaged7,
}: {
  /** Newest first, 90 rows. */
  days: TrendDay[];
  /** Oldest first, full retained search history. */
  weeks: TrendWeek[];
  engaged7: number;
}) {
  const [range, setRange] = useState<RangeKey>('30d');

  const view = useMemo(() => {
    const oldestFirst = [...days].reverse();
    const era = oldestFirst.filter((r) => r.views !== null); // instrumentation era only
    const win = range === '90d' ? 90 : 30;

    let visitors: TrendPoint[];
    let searches: TrendPoint[];
    let reads: TrendPoint[];
    if (range === 'all') {
      visitors = weeklyBuckets(era, (r) => r.uniq ?? 0);
      reads = weeklyBuckets(era, readerReads);
      searches = weeks.map((w) => ({ label: `wk of ${dayLabel(w.week)}`, value: Math.max(0, w.n - w.mine) }));
    } else {
      visitors = era.slice(-win).map((r) => ({ label: dayLabel(r.day), value: r.uniq ?? 0 }));
      searches = oldestFirst.slice(-win).map((r) => ({ label: dayLabel(r.day), value: readerSearches(r) }));
      reads = era.slice(-win).map((r) => ({ label: dayLabel(r.day), value: readerReads(r) }));
    }

    // Deltas from the newest-first rows: current period vs the one before it.
    const span = range === '30d' ? 7 : 30;
    const vs = range === '30d' ? 'vs last wk' : range === '90d' ? 'vs last mo' : 'vs prior 30d';
    const sum = (from: number, to: number, f: (r: TrendDay) => number) =>
      days.slice(from, to).reduce((a, r) => a + f(r), 0);
    const delta = (f: (r: TrendDay) => number) => {
      const cur = sum(0, span, f);
      const prev = sum(span, span * 2, f);
      return { cur, pct: prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null };
    };
    const dVisitors = delta((r) => r.uniq ?? 0);
    const dSearches = delta(readerSearches);
    const dReads = delta(readerReads);

    // All-time headline = the whole series' total, not the delta window.
    const total = (pts: TrendPoint[]) => pts.reduce((a, p) => a + p.value, 0);
    return {
      visitors, searches, reads, vs,
      hVisitors: range === 'all' ? total(visitors) : dVisitors.cur,
      hSearches: range === 'all' ? total(searches) : dSearches.cur,
      hReads: range === 'all' ? total(reads) : dReads.cur,
      pVisitors: dVisitors.pct, pSearches: dSearches.pct, pReads: dReads.pct,
    };
  }, [days, weeks, range]);

  const fmt = (n: number) => n.toLocaleString('en-US');

  return (
    <div>
      {/* One filter row, above the charts; everything below re-renders to it. */}
      <div className="flex gap-1.5">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
              range === r.key
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        <TrendChart
          title={range === 'all' ? 'Visitors / week' : 'Visitors / day'}
          points={view.visitors}
          colorClass="text-[#2a78d6] dark:text-[#3987e5]"
          headline={fmt(view.hVisitors)}
          deltaPct={view.pVisitors}
          deltaVs={view.vs}
        />
        <TrendChart
          title={range === 'all' ? 'Reader searches / week' : 'Reader searches / day'}
          points={view.searches}
          colorClass="text-[#eb6834] dark:text-[#d95926]"
          headline={fmt(view.hSearches)}
          deltaPct={view.pSearches}
          deltaVs={view.vs}
          note={range === 'all' ? 'current week (partial)' : undefined}
        />
        <TrendChart
          title={range === 'all' ? 'Texts read / week' : 'Texts read / day'}
          points={view.reads}
          colorClass="text-[#1baf7a] dark:text-[#199e70]"
          headline={fmt(view.hReads)}
          deltaPct={view.pReads}
          deltaVs={view.vs}
        />
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        {range === '30d' && <>{'Headline = last 7 days; change is against the 7 before. '}</>}
        {range === '90d' && <>{'Headline = last 30 days; change is against the 30 before. '}</>}
        {range === 'all' && <>{'Headline = total. Searches cover the full retained log; visitors and reads begin with the site’s own instrumentation (late Oct). '}</>}
        {'Searches and reads exclude yours. Visitors are unique tabs (JS-running bots included; engaged humans ≈ '}
        {engaged7.toLocaleString('en-US')}{' · 7d). A read = ≥50% depth and ≥90s.'}
      </p>
    </div>
  );
}
