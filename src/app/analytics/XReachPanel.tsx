'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import TrendChart, { type TrendPoint } from './TrendChart';

// The "X, and what it sends here" tiles, behind one shared Daily / Weekly /
// Monthly toggle — the same one-filter-row-above-everything pattern as
// TrendsPanel, but for the X-crossed-with-site series from reach.ts. Each
// series gets the aggregation that actually makes sense for it: counts
// (impressions, site visits) sum across the period; followers and the
// referred-share percentage are already levels, so they take the period's
// last value or average instead.

type Pt = { day: string; value: number };
type Op = 'sum' | 'last' | 'avg';

const GRAINS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
] as const;
type Grain = (typeof GRAINS)[number]['key'];

const fmtDayShort = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const fmtMonth = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' });
const dayLabel = (day: string) => fmtDayShort.format(new Date(`${day}T00:00:00Z`));
const weekOf = (day: string) => {
  const t = Date.parse(`${day}T00:00:00Z`);
  const dow = (new Date(t).getUTCDay() + 6) % 7; // Monday = 0
  return new Date(t - dow * 86_400_000).toISOString().slice(0, 10);
};
const monthOf = (day: string) => day.slice(0, 7);

function bucket(points: Pt[], grain: Grain, op: Op): TrendPoint[] {
  if (grain === 'daily') return points.slice(-30).map((p) => ({ label: dayLabel(p.day), value: p.value }));
  const keyOf = grain === 'weekly' ? weekOf : monthOf;
  const groups = new Map<string, number[]>();
  for (const p of points) {
    const k = keyOf(p.day);
    const g = groups.get(k);
    if (g) g.push(p.value); else groups.set(k, [p.value]);
  }
  return [...groups.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([k, vals]) => {
      const value =
        op === 'sum' ? vals.reduce((a, v) => a + v, 0)
        : op === 'last' ? vals[vals.length - 1]
        : Math.round(vals.reduce((a, v) => a + v, 0) / vals.length);
      const label = grain === 'weekly' ? `wk of ${dayLabel(k)}` : fmtMonth.format(new Date(`${k}-01T00:00:00Z`));
      return { label, value };
    });
}

export default function XReachPanel({
  impressions,
  siteVisits,
  followers,
  xShareOfReferred,
}: {
  impressions: Pt[];
  siteVisits: Pt[];
  followers: Pt[];
  xShareOfReferred: Pt[];
}) {
  const [grain, setGrain] = useState<Grain>('daily');

  const view = useMemo(() => ({
    impressions: bucket(impressions, grain, 'sum'),
    siteVisits: bucket(siteVisits, grain, 'sum'),
    followers: followers.length >= 2 ? bucket(followers, grain, 'last') : [],
    xShare: xShareOfReferred.length >= 2 ? bucket(xShareOfReferred, grain, 'avg') : [],
  }), [impressions, siteVisits, followers, xShareOfReferred, grain]);

  const per = grain === 'daily' ? 'day' : grain === 'weekly' ? 'week' : 'month';
  const sum7 = (pts: Pt[]) => pts.slice(-7).reduce((a, p) => a + p.value, 0);

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">X, and what it sends here</h2>
        <Link href="/analytics/x" className="text-xs text-gray-500 underline">the X room →</Link>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        The @centerstudy_ account next to the site’s own visit log — not just X on its own. Followers in{' '}
        <Link href="/analytics/growth" className="underline">Growth</Link>.
      </p>

      <div className="mt-3 flex gap-1.5">
        {GRAINS.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setGrain(g.key)}
            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
              grain === g.key
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        <TrendChart
          title={`X impressions / ${per}`}
          points={view.impressions}
          colorClass="text-[#2a78d6] dark:text-[#3987e5]"
          headline={sum7(impressions).toLocaleString('en-US')}
          deltaPct={null}
          deltaVs=""
          note="last 7 days"
        />
        <TrendChart
          title={`Site visits from X / ${per}`}
          points={view.siteVisits}
          colorClass="text-[#eb6834] dark:text-[#d95926]"
          headline={sum7(siteVisits).toLocaleString('en-US')}
          deltaPct={null}
          deltaVs=""
          note="last 7 days"
        />
        {view.followers.length > 0 ? (
          <TrendChart
            title="X followers"
            points={view.followers}
            colorClass="text-[#1baf7a] dark:text-[#199e70]"
            headline={followers[followers.length - 1].value.toLocaleString('en-US')}
            deltaPct={null}
            deltaVs=""
          />
        ) : (
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">X followers</div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">Fills in after a day or two of tracking — see Growth.</p>
          </div>
        )}
        {view.xShare.length > 0 ? (
          <TrendChart
            title={`X, share of referred visits / ${per}`}
            points={view.xShare}
            colorClass="text-[#6250d6] dark:text-[#9085e9]"
            headline={`${xShareOfReferred[xShareOfReferred.length - 1].value}%`}
            deltaPct={null}
            deltaVs=""
            note="of days with any referral"
          />
        ) : (
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">X, share of referred visits</div>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">Needs a few days with referred arrivals to show a trend.</p>
          </div>
        )}
      </div>
    </section>
  );
}
