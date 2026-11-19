'use client';

import { useMemo, useState } from 'react';
import TrendChart, { type TrendPoint } from './TrendChart';

// The trends room: single-series charts (readers, reader searches, texts
// read, and — when Search Console is connected — clicks from Google) behind
// one shared range toggle: 30 days (daily, delta vs last week), 90 days
// (daily, delta vs last month), all time (weekly buckets). One filter row
// scopes everything below it.
//
// "Readers" are people, not tabs: sessions that produced a real input, and
// for days before that was measured, visits that came from somewhere or did
// more than load one page.
//
// Local prop types on purpose: this is a client component, and importing
// ./data (Upstash client, corpus parser) would drag server code into the
// browser bundle.

export type TrendDay = {
  day: string; // YYYY-MM-DD (UTC)
  views: number | null;
  readers: number | null;
  searches: number;
  searchesMine: number;
  reads: number;
  readsMine: number;
};
export type TrendWeek = { week: string; n: number; mine: number };
export type TrendNote = { day: string; label: string };
export type GoogleDay = { day: string; clicks: number };

const RANGES = [
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
  { key: 'all', label: 'All time' },
] as const;
type RangeKey = (typeof RANGES)[number]['key'];

const NO_NOTES: TrendNote[] = [];
const NO_GOOGLE: GoogleDay[] = [];

const fmtDayShort = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const dayLabel = (day: string) => fmtDayShort.format(new Date(`${day}T00:00:00Z`));
const weekOf = (day: string) => {
  const t = Date.parse(`${day}T00:00:00Z`);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  return new Date(t - dow * 86_400_000).toISOString().slice(0, 10);
};

const readerSearches = (r: TrendDay) => Math.max(0, r.searches - r.searchesMine);
const readerReads = (r: TrendDay) => Math.max(0, r.reads - r.readsMine);

function weekly<T extends { day: string }>(rows: T[], f: (r: T) => number, marks: Map<string, string>): TrendPoint[] {
  const byWeek = new Map<string, number>();
  for (const r of rows) {
    const w = weekOf(r.day);
    byWeek.set(w, (byWeek.get(w) ?? 0) + f(r));
  }
  return [...byWeek.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([w, v]) => ({ label: `wk of ${dayLabel(w)}`, value: v, mark: marks.get(w) }));
}

export default function TrendsPanel({
  days,
  weeks,
  notes = NO_NOTES,
  google = NO_GOOGLE,
}: {
  /** Newest first, 90 rows. */
  days: TrendDay[];
  /** Oldest first, full retained search history. */
  weeks: TrendWeek[];
  /** Annotations, pinned to the day (or, on the weekly view, the week) they name. */
  notes?: TrendNote[];
  /** Clicks from Google per day, oldest first (Search Console; about two days behind). */
  google?: GoogleDay[];
}) {
  const [range, setRange] = useState<RangeKey>('30d');

  const view = useMemo(() => {
    const oldestFirst = [...days].reverse();
    const era = oldestFirst.filter((r) => r.views !== null); // instrumentation era only
    const counted = era.filter((r) => r.readers !== null);
    const win = range === '90d' ? 90 : 30;

    const dayMarks = new Map<string, string>();
    const weekMarks = new Map<string, string>();
    const join = (m: Map<string, string>, k: string, label: string) =>
      m.set(k, m.has(k) ? `${m.get(k)} · ${label}` : label);
    for (const n of notes) {
      join(dayMarks, n.day, n.label);
      join(weekMarks, weekOf(n.day), n.label);
    }
    const pt = (day: string, value: number): TrendPoint => ({ label: dayLabel(day), value, mark: dayMarks.get(day) });

    let readers: TrendPoint[];
    let searches: TrendPoint[];
    let reads: TrendPoint[];
    let clicks: TrendPoint[];
    if (range === 'all') {
      readers = weekly(counted, (r) => r.readers ?? 0, weekMarks);
      reads = weekly(era, readerReads, weekMarks);
      searches = weeks.map((w) => ({
        label: `wk of ${dayLabel(w.week)}`, value: Math.max(0, w.n - w.mine), mark: weekMarks.get(w.week),
      }));
      clicks = weekly(google, (g) => g.clicks, weekMarks);
    } else {
      readers = counted.slice(-win).map((r) => pt(r.day, r.readers ?? 0));
      searches = oldestFirst.slice(-win).map((r) => pt(r.day, readerSearches(r)));
      reads = era.slice(-win).map((r) => pt(r.day, readerReads(r)));
      clicks = google.slice(-win).map((g) => pt(g.day, g.clicks));
    }

    // Deltas: the current period against the one before it.
    const span = range === '30d' ? 7 : 30;
    const vs = range === '30d' ? 'vs last wk' : range === '90d' ? 'vs last mo' : 'vs prior 30d';
    const delta = <T,>(rows: T[], f: (r: T) => number) => {
      // rows are newest first
      const cur = rows.slice(0, span).reduce((a, r) => a + f(r), 0);
      const prev = rows.slice(span, span * 2).reduce((a, r) => a + f(r), 0);
      return { cur, pct: prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null };
    };
    const dReaders = delta(days.filter((r) => r.readers !== null), (r) => r.readers ?? 0);
    const dSearches = delta(days, readerSearches);
    const dReads = delta(days, readerReads);
    const dClicks = delta([...google].reverse(), (g) => g.clicks);

    // All-time headline = the whole series' total, not the delta window.
    const total = (pts: TrendPoint[]) => pts.reduce((a, p) => a + p.value, 0);
    const head = (pts: TrendPoint[], d: { cur: number }) => (range === 'all' ? total(pts) : d.cur);
    // With no earlier period to set the number against (the site's own
    // counting began in late October), say so instead of showing nothing.
    const since = (pts: TrendPoint[]) =>
      pts.length > 0 ? `no earlier period yet · since ${pts[0].label.replace(/^wk of /, '')}` : undefined;
    return {
      fReaders: since(readers), fSearches: since(searches), fReads: since(reads), fClicks: since(clicks),
      readers, searches, reads, clicks, vs,
      hReaders: head(readers, dReaders), pReaders: dReaders.pct,
      hSearches: head(searches, dSearches), pSearches: dSearches.pct,
      hReads: head(reads, dReads), pReads: dReads.pct,
      hClicks: head(clicks, dClicks), pClicks: dClicks.pct,
    };
  }, [days, weeks, range, notes, google]);

  const fmt = (n: number) => n.toLocaleString('en-US');
  const per = range === 'all' ? 'week' : 'day';
  const withGoogle = google.length > 1;

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

      <div className={`mt-4 grid gap-x-8 gap-y-6 ${withGoogle ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        <TrendChart
          title={`Readers / ${per}`}
          points={view.readers}
          colorClass="text-[#2a78d6] dark:text-[#3987e5]"
          headline={fmt(view.hReaders)}
          deltaPct={view.pReaders}
          deltaFallback={view.fReaders}
          deltaVs={view.vs}
        />
        <TrendChart
          title={`Reader searches / ${per}`}
          points={view.searches}
          colorClass="text-[#eb6834] dark:text-[#d95926]"
          headline={fmt(view.hSearches)}
          deltaPct={view.pSearches}
          deltaFallback={view.fSearches}
          deltaVs={view.vs}
          note={range === 'all' ? 'current week (partial)' : undefined}
        />
        <TrendChart
          title={`Texts read / ${per}`}
          points={view.reads}
          colorClass="text-[#1baf7a] dark:text-[#199e70]"
          headline={fmt(view.hReads)}
          deltaPct={view.pReads}
          deltaFallback={view.fReads}
          deltaVs={view.vs}
        />
        {withGoogle && (
          <TrendChart
            title={`Clicks from Google / ${per}`}
            points={view.clicks}
            colorClass="text-[#6250d6] dark:text-[#9085e9]"
            headline={fmt(view.hClicks)}
            deltaPct={view.pClicks}
          deltaFallback={view.fClicks}
            deltaVs={view.vs}
          />
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        {range === '30d' && <>{'Headline = last 7 days; change is against the 7 before. '}</>}
        {range === '90d' && <>{'Headline = last 30 days; change is against the 30 before. '}</>}
        {range === 'all' && <>{'Headline = total. Searches cover the full retained log; the rest begins with the site’s own instrumentation (late Oct). '}</>}
        {'Readers are people, not tabs: visits with a real tap, key or mouse move from Nov 18; before that, visits that came from somewhere or opened more than one page. Yours are excluded throughout. A read = at least half the text and 90+ seconds.'}
        {withGoogle && ' Google’s numbers run about two days behind.'}
      </p>
    </div>
  );
}
