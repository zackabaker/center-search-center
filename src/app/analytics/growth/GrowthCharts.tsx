'use client';

import { useMemo, useState } from 'react';
import TrendChart, { type TrendPoint } from '../TrendChart';

// The charts half of the Growth room, as its own client component so the
// range toggle needs no page reload (same split as TrendsPanel/../page.tsx).
// Every series here is a STOCK, not a flow — a follower count, a subscriber
// count — so bucketing a wider range takes the latest reading in the bucket,
// never a sum (summing follower counts across a month would be meaningless).

export type GrowthSeriesData = { key: string; label: string; points: { day: string; value: number }[] };

const RANGES = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All time' },
] as const;
type RangeKey = (typeof RANGES)[number]['key'];
// How many raw daily points / buckets each range window shows, newest-first slice.
const WINDOW: Record<Exclude<RangeKey, 'all'>, number> = { day: 60, week: 52, month: 36, year: 20 };

const fmtMonthDay = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const fmtMonthYear = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' });
const dayLabel = (d: string) => fmtMonthDay.format(new Date(`${d}T00:00:00Z`));

function mondayOf(day: string): string {
  const t = Date.parse(`${day}T00:00:00Z`);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  return new Date(t - dow * 86_400_000).toISOString().slice(0, 10);
}

const BUCKET: Record<RangeKey, (day: string) => string> = {
  day: (d) => d,
  week: mondayOf,
  month: (d) => d.slice(0, 7),
  year: (d) => d.slice(0, 4),
  all: (d) => d,
};
const LABEL: Record<RangeKey, (key: string) => string> = {
  day: dayLabel,
  week: (k) => `wk of ${dayLabel(k)}`,
  month: (k) => fmtMonthYear.format(new Date(`${k}-01T00:00:00Z`)),
  year: (k) => k,
  all: dayLabel,
};

/** One point per bucket: the LAST (most recent) reading in it — never a sum. */
function bucket(points: { day: string; value: number }[], range: RangeKey): TrendPoint[] {
  const by = new Map<string, { day: string; value: number }>();
  for (const p of points) {
    const k = BUCKET[range](p.day);
    const cur = by.get(k);
    if (!cur || p.day > cur.day) by.set(k, p);
  }
  const bucketed = [...by.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  const windowed = range === 'all' ? bucketed : bucketed.slice(-WINDOW[range]);
  return windowed.map(([k, p]) => ({ label: LABEL[range](k), value: p.value }));
}

const PALETTE = [
  'text-[#2a78d6] dark:text-[#3987e5]',
  'text-[#eb6834] dark:text-[#d95926]',
  'text-[#1baf7a] dark:text-[#199e70]',
  'text-[#6250d6] dark:text-[#9085e9]',
  'text-[#c23b7a] dark:text-[#e0629f]',
  'text-[#9a8420] dark:text-[#c4a82e]',
];
const fmt = (n: number) => n.toLocaleString('en-US');

export default function GrowthCharts({ series }: { series: GrowthSeriesData[] }) {
  const [range, setRange] = useState<RangeKey>('day');

  const charted = useMemo(
    () => series.map((s, i) => {
      const points = bucket(s.points, range);
      const latest = points[points.length - 1];
      const prior = points.length > 1 ? points[Math.max(0, points.length - 2)] : undefined;
      const deltaPct = latest && prior && prior.value > 0 ? Math.round(((latest.value - prior.value) / prior.value) * 100) : null;
      return { series: s, points, colorClass: PALETTE[i % PALETTE.length], headline: latest ? fmt(latest.value) : '—', deltaPct };
    }),
    [series, range],
  );

  if (series.length === 0) {
    return <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Nothing recorded yet. The X accounts fill in on the next daily run; add anything else below.</p>;
  }

  const rangeLabel = RANGES.find((r) => r.key === range)!.label.toLowerCase();
  const deltaVs = range === 'all' ? 'vs the reading before' : `vs the prior ${rangeLabel === 'all time' ? 'period' : rangeLabel}`;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            aria-pressed={range === r.key}
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
      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {charted.map(({ series: s, points, colorClass, headline, deltaPct }) =>
          points.length >= 2 ? (
            <TrendChart key={s.key} title={s.label} points={points} colorClass={colorClass} headline={headline} deltaPct={deltaPct} deltaVs={deltaVs} />
          ) : (
            <div key={s.key} className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{s.label}</div>
              <div className="mt-0.5 text-2xl font-semibold text-gray-900 dark:text-gray-100">{headline}</div>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
                {s.points.length === 0 ? 'Nothing recorded yet.' : 'One entry so far — a chart appears once there are two.'}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
