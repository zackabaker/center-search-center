import Link from 'next/link';
import { loadConsole } from '../load';
import { RoomHead, dayLabel, fmt, fold, sub, timeET } from '../ui';
import { sourceName } from '../derive';
import TrendChart, { type TrendPoint } from '../TrendChart';
import { X_ACCOUNT, readX, xConfigured, type XPost } from '@/lib/x-analytics';
import XImport from './XImport';

// /analytics/x — the Center Study account on X set beside what the site's
// own data says happened next. Charts first, by design (owner direction,
// 2026-11-18: "more charts, less of these crazy long lists of numbers") —
// the only tables left are short, linked lists of actual posts, not grids
// of digits. For follower counts over time (this account and others), see
// /analytics/growth.
//
// Three sources meet here:
//   · posts and their public numbers, from the daily X API pull;
//   · the account's private numbers (daily impressions, profile visits,
//     follows; link clicks per post), from X's own CSV exports, uploaded;
//   · arrivals from X, from this site's own visit log (referrer t.co / x.com).

export const dynamic = 'force-dynamic';

const DAY = 86_400_000;
const WINDOW = 2 * DAY; // arrivals credited to a post: the 48 hours after it
const utcDay = (t: number) => new Date(t).toISOString().slice(0, 10);
const postUrl = (id: string) => `https://x.com/${X_ACCOUNT}/status/${id}`;
const clip = (s: string, n = 120) => {
  const flat = s.replace(/https:\/\/t\.co\/\S+/g, '').replace(/\s+/g, ' ').trim();
  return flat.length > n ? flat.slice(0, n).replace(/\s+\S*$/, '') + '…' : flat || '(media or link only)';
};
/** X's own Engagements figure when a Content export covered the post; otherwise the sum of what the API reports. */
const engagement = (p: XPost): number => p.eng ?? p.l + p.rt + p.q + p.rp + p.b;

const NOTICE: Record<string, string> = {
  synced: 'Refreshed from X just now.',
  busy: 'A refresh is already running. Give it a minute.',
  failed: 'X did not answer. Nothing was changed; try again in a few minutes.',
  unconfigured: 'The X API token is not set on the server yet, so posts cannot be refreshed automatically.',
};

/** One linked post, one line of stats underneath — not a spreadsheet row. */
function PostRow({ p, stat, arrivals }: { p: XPost; stat: string; arrivals?: number | null }) {
  return (
    <li className="border-b border-gray-100 dark:border-gray-900 py-2.5">
      <a href={postUrl(p.id)} target="_blank" rel="noopener noreferrer" className="text-[15px] text-gray-900 dark:text-gray-100 hover:underline [overflow-wrap:anywhere]">
        {clip(p.text)}
      </a>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
        {dayLabel(utcDay(p.t))} · {stat}
        {typeof arrivals === 'number' && <> · <span className="text-gray-700 dark:text-gray-300">{fmt(arrivals)} site visits after</span></>}
      </p>
    </li>
  );
}

export default async function XPage({ searchParams }: { searchParams: Promise<{ x?: string }> }) {
  const [{ x: flag }, data, snap] = await Promise.all([searchParams, loadConsole(), readX().catch(() => null)]);
  const notice = flag ? NOTICE[flag] : null;
  const live = xConfigured();

  if (!snap) {
    return (
      <>
        <RoomHead title="X">The @{X_ACCOUNT} account set beside the visits X sends to the site.</RoomHead>
        {notice && <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">{notice}</p>}
        <p className="mt-4 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
          Nothing from X is stored yet. Upload the exports from X’s analytics page to start
          {live ? ', or fetch the posts straight from X.' : '.'}
        </p>
        <XImport />
        {live && (
          <p className="mt-3 text-sm">
            <a href="/api/analytics/x-sync?full=1&back=1" className="font-medium text-blue-700 dark:text-blue-300 hover:underline">
              Fetch every post from X now
            </a>{' '}
            <span className="text-gray-500 dark:text-gray-400">(reads each post once; takes up to a minute)</span>
          </p>
        )}
      </>
    );
  }

  const now = Date.now();
  const posts = [...snap.posts].sort((a, b) => b.t - a.t);
  const own = posts.filter((p) => p.kind !== 'reply');
  const replies = posts.filter((p) => p.kind === 'reply');
  const acct = new Map(snap.acct.map((d) => [d.day, d]));
  const havePrivatePosts = posts.some((p) => p.uc !== undefined);

  // Visits X sent, from the site's own log (readers only: not the owner, not crawlers).
  const sessions = data?.allSessions ?? [];
  const fromX = sessions.filter((s) => !!s.ref && sourceName(s.ref) === 'X' && !s.mine && !s.crawler);
  const logStart = sessions.reduce((m, s) => Math.min(m, s.start), Number.POSITIVE_INFINITY);
  const haveLog = Number.isFinite(logStart);
  const arrivalsAfter = (p: XPost): number | null =>
    haveLog && p.t >= logStart ? fromX.filter((s) => s.start >= p.t && s.start < p.t + WINDOW).length : null;

  // ── Charts: 30 days, oldest first, with posting-day marks so the two
  // charts below double as "did posting more move the numbers" at a glance. ──
  const days30 = Array.from({ length: 30 }, (_, i) => utcDay(now - (29 - i) * DAY));
  const postsOnDay = new Map<string, number>();
  for (const p of own) postsOnDay.set(utcDay(p.t), (postsOnDay.get(utcDay(p.t)) ?? 0) + 1);
  const mark = (d: string): string | undefined => {
    const n = postsOnDay.get(d);
    return n ? `${n} post${n > 1 ? 's' : ''}` : undefined;
  };
  const viewsOnDay = new Map<string, number>();
  for (const p of own) viewsOnDay.set(utcDay(p.t), (viewsOnDay.get(utcDay(p.t)) ?? 0) + p.v);
  const arrivalsOnDay = new Map<string, number>();
  for (const s of fromX) arrivalsOnDay.set(utcDay(s.start), (arrivalsOnDay.get(utcDay(s.start)) ?? 0) + 1);

  const impressionPts: TrendPoint[] = days30.map((d) => ({
    label: dayLabel(d), value: acct.get(d)?.imp ?? viewsOnDay.get(d) ?? 0, mark: mark(d),
  }));
  const visitPts: TrendPoint[] = days30.filter((d) => !haveLog || d >= utcDay(logStart)).map((d) => ({
    label: dayLabel(d), value: arrivalsOnDay.get(d) ?? 0, mark: mark(d),
  }));

  // Monthly rollup, as far back as the Overview export + archived posts reach.
  const months = new Map<string, number>();
  for (const d of snap.acct) months.set(d.day.slice(0, 7), (months.get(d.day.slice(0, 7)) ?? 0) + d.imp);
  if (months.size === 0) for (const p of own) months.set(utcDay(p.t).slice(0, 7), (months.get(utcDay(p.t).slice(0, 7)) ?? 0) + p.v);
  const monthPts: TrendPoint[] = [...months.entries()].sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([ym, v]) => ({ label: new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }), value: v }));

  const delta = (pts: TrendPoint[], span: number) => {
    const cur = pts.slice(-span).reduce((a, p) => a + p.value, 0);
    const prev = pts.slice(-span * 2, -span).reduce((a, p) => a + p.value, 0);
    return { cur, pct: prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null };
  };
  const dImp = delta(impressionPts, 7);
  const dVis = delta(visitPts, 7);

  // ── How X-sourced visits behave, next to the site's other top sources ──
  const topSources = (data?.sources ?? []).filter((s) => s.sessions > 0).sort((a, b) => b.visits30 - a.visits30).slice(0, 6);
  const xSource = (data?.sources ?? []).find((s) => s.name === 'X');

  // ── Post lists: compact, linked, one each for a different question ──
  const since30 = now - 30 * DAY;
  const clicks30 = own.filter((p) => p.t >= since30).reduce((a, p) => a + (p.uc ?? 0), 0);
  const senders = posts.filter((p) => (p.uc ?? 0) > 0).sort((a, b) => (b.uc ?? 0) - (a.uc ?? 0)).slice(0, 8);
  const mostEngaged = [...own].sort((a, b) => engagement(b) - engagement(a)).slice(0, 10);
  const recentTop = own.filter((p) => p.t >= now - 60 * DAY).sort((a, b) => b.v - a.v).slice(0, 8);
  const oldest = posts[posts.length - 1];

  const Tile = ({ label, value, note }: { label: string; value: string; note?: string }) => (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{value}</p>
      {note && <p className="text-xs text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  );

  return (
    <>
      <RoomHead title="X">
        The <a href={`https://x.com/${X_ACCOUNT}`} target="_blank" rel="noopener noreferrer" className="underline">@{X_ACCOUNT}</a>{' '}
        account set beside what the site’s own visit log says happened next. Views, likes and reposts are read from X
        once a day; impressions, profile visits, follows and link clicks come from X’s own exports; site visits are this
        site’s count of arrivals referred by X. Follower counts over time live in{' '}
        <Link href="/analytics/growth" className="underline">Growth</Link>.
      </RoomHead>
      {notice && <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{notice}</p>}

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Tile label="Posts, 30 days" value={fmt(own.filter((p) => p.t >= since30).length)} note={`${fmt(replies.filter((p) => p.t >= since30).length)} replies besides`} />
        <Tile label="Impressions, 30 days" value={fmt(dImp.cur)} note={dImp.pct === null ? undefined : `${dImp.pct >= 0 ? '+' : ''}${dImp.pct}% vs the 30 before`} />
        <Tile label="Link clicks, 30 days" value={havePrivatePosts ? fmt(clicks30) : '—'} note={havePrivatePosts ? undefined : 'needs the Content export'} />
        <Tile label="Site visits from X, 30 days" value={haveLog ? fmt(dVis.cur) : '—'} note={dVis.pct === null ? undefined : `${dVis.pct >= 0 ? '+' : ''}${dVis.pct}% vs the 30 before`} />
      </div>

      <h2 className={sub}>Reach and traffic, day by day</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        Hover a point marked with a diamond to see how many posts went out that day.
      </p>
      <div className="mt-3 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <TrendChart title="Impressions / day" points={impressionPts} colorClass="text-[#2a78d6] dark:text-[#3987e5]" headline={fmt(dImp.cur)} deltaPct={dImp.pct} deltaVs="vs last wk" />
        {haveLog ? (
          <TrendChart title="Site visits from X / day" points={visitPts} colorClass="text-[#eb6834] dark:text-[#d95926]" headline={fmt(dVis.cur)} deltaPct={dVis.pct} deltaVs="vs last wk" />
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-600">The visit log isn’t available for this window.</p>
        )}
      </div>
      {monthPts.length >= 2 && (
        <div className="mt-6 max-w-sm">
          <TrendChart title="Impressions / month" points={monthPts} colorClass="text-[#1baf7a] dark:text-[#199e70]" headline={fmt(monthPts[monthPts.length - 1].value)} deltaPct={null} deltaVs="" note="most recent month" />
        </div>
      )}

      {xSource && topSources.length > 1 && (
        <>
          <h2 className={sub}>How X’s visits compare with other sources</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            “Stayed” did more than land on one page; “read” spent real time in a text. Last 30 days.
          </p>
          <div className="mt-3 max-w-xl space-y-2.5">
            {topSources.map((s) => {
              const stayedPct = s.sessions > 0 ? Math.round((s.stayed / s.sessions) * 100) : 0;
              const readPct = s.sessions > 0 ? Math.round((s.read / s.sessions) * 100) : 0;
              const isX = s.name === 'X';
              return (
                <div key={s.name} className={`flex items-center gap-3 text-sm ${isX ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                  <span className="w-24 shrink-0 truncate">{s.name}</span>
                  <span className="w-10 shrink-0 text-right tabular-nums text-xs text-gray-400">{fmt(s.sessions)}</span>
                  <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className={`absolute inset-y-0 left-0 rounded-full ${isX ? 'bg-blue-700 dark:bg-blue-400' : 'bg-gray-400 dark:bg-gray-600'}`} style={{ width: `${stayedPct}%` }} />
                  </span>
                  <span className="w-20 shrink-0 text-right tabular-nums text-xs">{stayedPct}% stayed</span>
                  <span className="w-16 shrink-0 text-right tabular-nums text-xs">{readPct}% read</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {senders.length > 0 && (
        <>
          <h2 className={sub}>Posts that sent the most readers</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Ranked by clicks on the link in the post, as X counts them.</p>
          <ul className="mt-2">{senders.map((p) => <PostRow key={p.id} p={p} stat={`${fmt(p.uc ?? 0)} link clicks · ${fmt(p.v)} views`} arrivals={arrivalsAfter(p)} />)}</ul>
        </>
      )}

      <h2 className={sub}>Most engaged, all time</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        X’s own engagement count where a Content export covers the post; otherwise likes + reposts + quotes + replies + saves.
      </p>
      <ul className="mt-2">{mostEngaged.map((p) => <PostRow key={p.id} p={p} stat={`${fmt(engagement(p))} engaged · ${fmt(p.v)} views`} />)}</ul>

      {recentTop.length > 0 && (
        <>
          <h2 className={sub}>Most seen, last 60 days</h2>
          <ul className="mt-2">{recentTop.map((p) => <PostRow key={p.id} p={p} stat={`${fmt(p.v)} views · ${fmt(p.l)} likes`} arrivals={arrivalsAfter(p)} />)}</ul>
        </>
      )}

      {replies.length > 0 && (
        <details className="mt-8">
          <summary className={fold}>Replies: {fmt(replies.length)} archived, {fmt(replies.reduce((a, p) => a + p.v, 0))} views in all</summary>
          <ul className="mt-2">{[...replies].sort((a, b) => engagement(b) - engagement(a)).slice(0, 10).map((p) => <PostRow key={p.id} p={p} stat={`${fmt(engagement(p))} engaged · ${fmt(p.v)} views`} />)}</ul>
        </details>
      )}

      <h2 className={sub}>Keeping this current</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
        {fmt(posts.length)} posts archived{oldest ? `, back to ${dayLabel(utcDay(oldest.t), true)}` : ''}.{' '}
        {snap.meta.syncedAt
          ? <>Views, likes and reposts were last read from X {timeET.format(snap.meta.syncedAt)} and refresh daily.</>
          : live ? <>Views, likes and reposts have not been read from X yet.</> : <>Daily refresh from X is off until the X API token is added to the site’s production settings.</>}{' '}
        For impressions by day, profile visits, follows and link clicks, upload the Overview and Content exports from X’s
        analytics page (x.com/i/account_analytics) while signed in as @{X_ACCOUNT}.
      </p>
      <XImport />
      {live && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <a href="/api/analytics/x-sync?back=1" className="underline">Refresh the newest posts now</a>
          {!snap.meta.fullAt && <> · <a href="/api/analytics/x-sync?full=1&back=1" className="underline">Fetch every post back to the first</a> (reads each post once)</>}
        </p>
      )}
    </>
  );
}
