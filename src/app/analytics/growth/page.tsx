import TrendChart, { type TrendPoint } from '../TrendChart';
import { RoomHead, dayLabel, fmt, sub } from '../ui';
import { readAllGrowth, AUTO_X_ACCOUNTS } from '@/lib/growth';
import GrowthEntry from './GrowthEntry';

// /analytics/growth — how big every audience is, over time, in one place:
// the two X accounts this site can read directly (@centerstudy_,
// @bouvard38829538), and anything the owner enters by hand because no API
// reaches it (Substack subscribers, generativeanthropology.com's own
// analytics, …). See src/lib/growth.ts.

export const dynamic = 'force-dynamic';

const PALETTE = [
  'text-[#2a78d6] dark:text-[#3987e5]',
  'text-[#eb6834] dark:text-[#d95926]',
  'text-[#1baf7a] dark:text-[#199e70]',
  'text-[#6250d6] dark:text-[#9085e9]',
  'text-[#c23b7a] dark:text-[#e0629f]',
  'text-[#9a8420] dark:text-[#c4a82e]',
];

export default async function GrowthPage() {
  const series = await readAllGrowth();
  const auto = series.filter((s) => s.auto);
  const manual = series.filter((s) => !s.auto);
  const missingAuto = AUTO_X_ACCOUNTS.filter((a) => !series.some((s) => s.key === a.key));

  const since30 = Date.now() - 32 * 86_400_000;

  const charted = [...auto, ...manual].map((s, i) => {
    const pts: TrendPoint[] = s.points.map((p) => ({ label: dayLabel(p.day), value: p.value }));
    const latest = s.points[s.points.length - 1];
    const prior = [...s.points].reverse().find((p) => Date.parse(`${p.day}T00:00:00Z`) <= since30);
    const deltaPct = latest && prior && prior.value > 0 ? Math.round(((latest.value - prior.value) / prior.value) * 100) : null;
    return { series: s, points: pts, colorClass: PALETTE[i % PALETTE.length], headline: latest ? fmt(latest.value) : '—', deltaPct };
  });

  return (
    <>
      <RoomHead title="Growth">
        Every audience this site or the people behind it have, over time — the two X accounts read automatically, and
        anything else entered by hand below.
      </RoomHead>

      {charted.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Nothing recorded yet. The X accounts fill in on the next daily run; add anything else below.
        </p>
      ) : (
        <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {charted.map(({ series: s, points, colorClass, headline, deltaPct }) =>
            points.length >= 2 ? (
              <TrendChart
                key={s.key}
                title={s.label}
                points={points}
                colorClass={colorClass}
                headline={headline}
                deltaPct={deltaPct}
                deltaVs="vs ~30d ago"
              />
            ) : (
              <div key={s.key} className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{s.label}</div>
                <div className="mt-0.5 text-2xl font-semibold text-gray-900 dark:text-gray-100">{headline}</div>
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">One entry so far — a chart appears once there are two.</p>
              </div>
            ),
          )}
        </div>
      )}

      {missingAuto.length > 0 && (
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {missingAuto.map((a) => a.label).join(', ')} {missingAuto.length === 1 ? 'has' : 'have'} not reported yet — they
          fill in on the next daily run{process.env.TWITTER_BEARER_TOKEN ? '' : ' (the X API token is not set in production yet)'}.
        </p>
      )}

      <h2 className={sub}>Add a number by hand</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        For anything with no API this site can reach — Substack’s subscriber count, a figure read off
        generativeanthropology.com’s own analytics, or anything else worth tracking. Type the same name again to keep
        adding to the same chart; it appears above once there are two entries.
      </p>
      <GrowthEntry existing={series.map((s) => ({ key: s.key, label: s.label }))} />
    </>
  );
}
