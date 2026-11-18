import { RoomHead, sub } from '../ui';
import { readAllGrowth, AUTO_X_ACCOUNTS } from '@/lib/growth';
import GrowthCharts from './GrowthCharts';
import GrowthEntry from './GrowthEntry';

// /analytics/growth — how big every audience is, over time, in one place:
// the two X accounts this site can read directly (@centerstudy_,
// @bouvard38829538), and anything the owner enters by hand because no API
// reaches it (Substack subscribers, generativeanthropology.com's own
// analytics, …). See src/lib/growth.ts. Day / Week / Month / Year / All
// time ranges live in GrowthCharts.tsx, a client component so switching
// needs no reload.

export const dynamic = 'force-dynamic';

export default async function GrowthPage() {
  const series = await readAllGrowth();
  const missingAuto = AUTO_X_ACCOUNTS.filter((a) => !series.some((s) => s.key === a.key));

  return (
    <>
      <RoomHead title="Growth">
        Every audience this site or the people behind it have, over time — the two X accounts read automatically, and
        anything else entered by hand below.
      </RoomHead>

      <div className="mt-5">
        <GrowthCharts series={series.map((s) => ({ key: s.key, label: s.label, points: s.points }))} />
      </div>

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
