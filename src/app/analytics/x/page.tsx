import { loadConsole } from '../load';
import { RoomHead, dayLabel, fmt, fold, sub, thead, timeET } from '../ui';
import { sourceName } from '../derive';
import { X_ACCOUNT, readX, xConfigured, type XPost } from '@/lib/x-analytics';
import XImport from './XImport';

// /analytics/x — the Center Study account on X beside the visits X sends.
//
// Three sources meet here:
//   · posts and their public numbers, from the daily X API pull;
//   · the account's private numbers (daily impressions, profile visits,
//     follows; link clicks per post), from X's own CSV exports, uploaded;
//   · arrivals from X, from this site's own visit log (referrer t.co / x.com).
// Together they show which posts actually bring readers, not just which get seen.

export const dynamic = 'force-dynamic';

const DAY = 86_400_000;
const WINDOW = 2 * DAY; // arrivals credited to a post: the 48 hours after it
const utcDay = (t: number) => new Date(t).toISOString().slice(0, 10);
const postUrl = (id: string) => `https://x.com/${X_ACCOUNT}/status/${id}`;
const clip = (s: string, n = 150) => {
  const flat = s.replace(/https:\/\/t\.co\/\S+/g, '').replace(/\s+/g, ' ').trim();
  return flat.length > n ? flat.slice(0, n).replace(/\s+\S*$/, '') + '…' : flat || '(media or link only)';
};
const monthLabel = (ym: string) =>
  new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const NOTICE: Record<string, string> = {
  synced: 'Refreshed from X just now.',
  busy: 'A refresh is already running. Give it a minute.',
  failed: 'X did not answer. Nothing was changed; try again in a few minutes.',
  unconfigured: 'The X API token is not set on the server yet, so posts cannot be refreshed automatically.',
};

export default async function XPage({ searchParams }: { searchParams: Promise<{ x?: string }> }) {
  const [{ x: flag }, data, snap] = await Promise.all([searchParams, loadConsole(), readX().catch(() => null)]);
  const notice = flag ? NOTICE[flag] : null;
  const live = xConfigured();

  if (!snap) {
    return (
      <>
        <RoomHead title="X">The @{X_ACCOUNT} account beside the visits X sends to the site.</RoomHead>
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
  const acctDays = [...acct.keys()].sort();
  const acctThrough = acctDays[acctDays.length - 1] ?? null;
  const havePrivatePosts = posts.some((p) => p.uc !== undefined);

  // Visits X sent, from the site's own log (readers only: not the owner, not crawlers).
  const sessions = data?.allSessions ?? [];
  const fromX = sessions.filter((s) => !!s.ref && sourceName(s.ref) === 'X' && !s.mine && !s.crawler);
  const logStart = sessions.reduce((m, s) => Math.min(m, s.start), Number.POSITIVE_INFINITY);
  const haveLog = Number.isFinite(logStart);
  const arrivalsAfter = (p: XPost): number | null =>
    haveLog && p.t >= logStart ? fromX.filter((s) => s.start >= p.t && s.start < p.t + WINDOW).length : null;

  // Day by day, last 30 (UTC days, like every other counter in the console).
  const days = Array.from({ length: 30 }, (_, i) => utcDay(now - i * DAY));
  const byDay = new Map(days.map((d) => [d, { posts: 0, views: 0, arrivals: 0, people: 0 }]));
  for (const p of own) {
    const row = byDay.get(utcDay(p.t));
    if (row) { row.posts += 1; row.views += p.v; }
  }
  for (const s of fromX) {
    const row = byDay.get(utcDay(s.start));
    if (row) { row.arrivals += 1; if (s.human) row.people += 1; }
  }
  const seenOn = (d: string) => acct.get(d)?.imp ?? byDay.get(d)!.views;
  const maxSeen = Math.max(1, ...days.map(seenOn));
  const maxArrivals = Math.max(1, ...[...byDay.values()].map((r) => r.arrivals));

  const since30 = now - 30 * DAY;
  const day30 = utcDay(since30);
  const own30 = own.filter((p) => p.t >= since30);
  const acct30 = snap.acct.filter((d) => d.day > day30);
  const impressions30 = acct30.length > 0 ? acct30.reduce((a, d) => a + d.imp, 0) : own30.reduce((a, p) => a + p.v, 0);
  const clicks30 = own30.reduce((a, p) => a + (p.uc ?? 0), 0) + replies.filter((p) => p.t >= since30).reduce((a, p) => a + (p.uc ?? 0), 0);
  const arrivals30 = fromX.filter((s) => s.start >= since30).length;
  const people30 = fromX.filter((s) => s.start >= since30 && s.human).length;

  const daySnaps = [...snap.days].sort((a, b) => a.day.localeCompare(b.day));
  const latest = daySnaps[daySnaps.length - 1];
  const netFollows30 = acct30.length > 0 ? acct30.reduce((a, d) => a + d.nf - d.uf, 0) : null;

  const recent = own.filter((p) => p.t >= now - 60 * DAY).sort((a, b) => b.v - a.v).slice(0, 40);
  const senders = posts.filter((p) => (p.uc ?? 0) > 0).sort((a, b) => (b.uc ?? 0) - (a.uc ?? 0)).slice(0, 15);
  const allTime = [...own].sort((a, b) => b.v - a.v).slice(0, 25);
  const oldest = posts[posts.length - 1];

  // The year by month, from the Overview export.
  const months = new Map<string, { imp: number; pv: number; nf: number; uf: number; cp: number; eng: number }>();
  for (const d of snap.acct) {
    const m = months.get(d.day.slice(0, 7)) ?? { imp: 0, pv: 0, nf: 0, uf: 0, cp: 0, eng: 0 };
    m.imp += d.imp; m.pv += d.pv; m.nf += d.nf; m.uf += d.uf; m.cp += d.cp; m.eng += d.eng;
    months.set(d.day.slice(0, 7), m);
  }
  const monthRows = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  const maxMonth = Math.max(1, ...monthRows.map(([, m]) => m.imp));
  const bigDays = [...snap.acct].sort((a, b) => b.imp - a.imp).slice(0, 5);

  const Tile = ({ label, value, note }: { label: string; value: string; note?: string }) => (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{value}</p>
      {note && <p className="text-xs text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  );

  const PostRows = ({ list, showArrivals }: { list: XPost[]; showArrivals: boolean }) => (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[680px] text-sm tabular-nums">
        <thead>
          <tr className={thead}>
            <th className="py-1.5 pr-3 font-normal">Post</th>
            <th className="py-1.5 pr-3 font-normal text-right">Views</th>
            <th className="py-1.5 pr-3 font-normal text-right">Likes</th>
            <th className="py-1.5 pr-3 font-normal text-right">Reposts</th>
            <th className="py-1.5 pr-3 font-normal text-right">Saves</th>
            {havePrivatePosts && <th className="py-1.5 pr-3 font-normal text-right">Link clicks</th>}
            {showArrivals && <th className="py-1.5 pr-0 font-normal text-right">Site visits, next 48h</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((p) => {
            const a = showArrivals ? arrivalsAfter(p) : null;
            return (
              <tr key={p.id} className="border-b border-gray-100 dark:border-gray-900 align-top">
                <td className="py-2 pr-3 max-w-[30rem]">
                  <a href={postUrl(p.id)} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-100 hover:underline [overflow-wrap:anywhere]">
                    {clip(p.text)}
                  </a>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    {timeET.format(p.t)}
                    {p.kind === 'quote' && ' · quote'}
                    {p.kind === 'reply' && ' · reply'}
                    {p.site && <> · links to <span className="text-gray-700 dark:text-gray-300">{p.site[0]}</span></>}
                  </span>
                </td>
                <td className="py-2 pr-3 text-right font-medium text-gray-900 dark:text-gray-100">{fmt(p.v)}</td>
                <td className="py-2 pr-3 text-right text-gray-700 dark:text-gray-300">{fmt(p.l)}</td>
                <td className="py-2 pr-3 text-right text-gray-700 dark:text-gray-300">{fmt(p.rt + p.q)}</td>
                <td className="py-2 pr-3 text-right text-gray-700 dark:text-gray-300">{fmt(p.b)}</td>
                {havePrivatePosts && (
                  <td className="py-2 pr-3 text-right text-gray-900 dark:text-gray-100">{p.uc === undefined ? '·' : fmt(p.uc)}</td>
                )}
                {showArrivals && (
                  <td className="py-2 pr-0 text-right text-gray-900 dark:text-gray-100">{a === null ? '·' : fmt(a)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <RoomHead title="X">
        The <a href={`https://x.com/${X_ACCOUNT}`} target="_blank" rel="noopener noreferrer" className="underline">@{X_ACCOUNT}</a>{' '}
        account beside the visits X sends to the site. Views, likes and reposts are read from X once a day; impressions,
        profile visits, follows and link clicks come from X’s own exports; site visits are this site’s count of arrivals from X.
      </RoomHead>
      {notice && <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">{notice}</p>}

      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        <Tile
          label={latest ? 'Followers' : 'Net follows, 30 days'}
          value={latest ? fmt(latest.followers) : netFollows30 === null ? '—' : `${netFollows30 >= 0 ? '+' : ''}${fmt(netFollows30)}`}
          note={latest && netFollows30 !== null ? `${netFollows30 >= 0 ? '+' : ''}${fmt(netFollows30)} net in 30 days` : undefined}
        />
        <Tile
          label="Impressions, 30 days"
          value={fmt(impressions30)}
          note={`${fmt(own30.length)} posts${acct30.length === 0 ? ' · views on those posts' : ''}`}
        />
        <Tile
          label="Link clicks, 30 days"
          value={havePrivatePosts ? fmt(clicks30) : '—'}
          note={havePrivatePosts ? 'on posts from these 30 days' : 'needs the Content export'}
        />
        <Tile label="Site visits from X, 30 days" value={haveLog ? fmt(arrivals30) : '—'} note={haveLog ? `${fmt(people30)} showed real input` : 'visit log unavailable'} />
      </div>

      <h2 className={sub}>Day by day</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        {acctThrough
          ? `Impressions, profile visits and follows are X’s own daily figures, imported through ${dayLabel(acctThrough, true)}. Later days show the views so far on that day’s posts.`
          : 'Impressions here are the views to date on the posts published that day, so recent days are still climbing.'}
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm tabular-nums">
          <thead>
            <tr className={thead}>
              <th className="py-1.5 pr-3 font-normal">Day</th>
              <th className="py-1.5 pr-3 font-normal text-right">Posts</th>
              <th className="py-1.5 pr-3 font-normal text-right">Impressions</th>
              <th className="py-1.5 pr-3 font-normal" aria-hidden />
              <th className="py-1.5 pr-3 font-normal text-right">Profile visits</th>
              <th className="py-1.5 pr-3 font-normal text-right">Follows</th>
              <th className="py-1.5 pr-3 font-normal text-right">Site visits from X</th>
              <th className="py-1.5 pr-0 font-normal" aria-hidden />
            </tr>
          </thead>
          <tbody>
            {days.map((d) => {
              const r = byDay.get(d)!;
              const a = acct.get(d);
              const seen = seenOn(d);
              const logged = haveLog && d >= utcDay(logStart);
              const net = a ? a.nf - a.uf : null;
              return (
                <tr key={d} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100 whitespace-nowrap">{dayLabel(d)}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{(a?.cp ?? r.posts) || '·'}</td>
                  <td className={`py-1.5 pr-3 text-right ${a ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>{seen ? fmt(seen) : '·'}</td>
                  <td className="py-1.5 pr-3 w-24">
                    <span className="block h-2 bg-gray-900 dark:bg-gray-100" style={{ width: `${Math.round((seen / maxSeen) * 100)}%` }} />
                  </td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{a ? a.pv || '·' : ''}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{net === null ? '' : net === 0 ? '·' : `${net > 0 ? '+' : ''}${net}`}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{logged ? r.arrivals || '·' : ''}</td>
                  <td className="py-1.5 pr-0 w-24">
                    {logged && <span className="block h-2 bg-blue-700 dark:bg-blue-300" style={{ width: `${Math.round((r.arrivals / maxArrivals) * 100)}%` }} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {senders.length > 0 && (
        <>
          <h2 className={sub}>Posts that sent the most readers</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Ranked by clicks on the link in the post, as X counts them. This is the closest thing to “this post brought
            people to the site”.
          </p>
          <PostRows list={senders} showArrivals />
        </>
      )}

      <h2 className={sub}>Posts from the last 60 days, most viewed first</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
        “Site visits, next 48h” counts arrivals from X in the two days after the post. When several posts go out close
        together they share the same visits, so read it as a signal, not a tally.
      </p>
      {recent.length === 0 ? <p className="mt-3 text-sm text-gray-400">No posts in this window.</p> : <PostRows list={recent} showArrivals />}

      {monthRows.length > 0 && (
        <>
          <h2 className={sub}>The year by month</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm tabular-nums">
              <thead>
                <tr className={thead}>
                  <th className="py-1.5 pr-3 font-normal">Month</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Posts</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Impressions</th>
                  <th className="py-1.5 pr-3 font-normal" aria-hidden />
                  <th className="py-1.5 pr-3 font-normal text-right">Profile visits</th>
                  <th className="py-1.5 pr-0 font-normal text-right">Net follows</th>
                </tr>
              </thead>
              <tbody>
                {monthRows.map(([ym, m]) => (
                  <tr key={ym} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100 whitespace-nowrap">{monthLabel(ym)}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{m.cp || '·'}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{fmt(m.imp)}</td>
                    <td className="py-1.5 pr-3 w-32">
                      <span className="block h-2 bg-gray-900 dark:bg-gray-100" style={{ width: `${Math.round((m.imp / maxMonth) * 100)}%` }} />
                    </td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{fmt(m.pv)}</td>
                    <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{`${m.nf - m.uf >= 0 ? '+' : ''}${fmt(m.nf - m.uf)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
            Biggest days: {bigDays.map((d, i) => (
              <span key={d.day}>{i > 0 && ', '}{dayLabel(d.day, true)} ({fmt(d.imp)})</span>
            ))}.
          </p>
        </>
      )}

      <h2 className={sub}>Most viewed, all time</h2>
      <PostRows list={allTime} showArrivals={false} />

      {replies.length > 0 && (
        <details className="mt-8">
          <summary className={fold}>Replies: {fmt(replies.length)} archived, {fmt(replies.reduce((a, p) => a + p.v, 0))} views in all</summary>
          <PostRows list={[...replies].sort((a, b) => b.v - a.v).slice(0, 20)} showArrivals={false} />
        </details>
      )}

      <h2 className={sub}>Keeping this current</h2>
      <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
        {fmt(posts.length)} posts archived{oldest ? `, back to ${dayLabel(utcDay(oldest.t), true)}` : ''}.{' '}
        {snap.meta.syncedAt
          ? <>Views, likes and reposts were last read from X {timeET.format(snap.meta.syncedAt)} and refresh daily.</>
          : live
            ? <>Views, likes and reposts have not been read from X yet.</>
            : <>Daily refresh from X is off until the X API token is added to the site’s production settings.</>}{' '}
        {acctThrough
          ? <>The private numbers run through {dayLabel(acctThrough, true)}; to bring them up to date, download the Overview and Content exports from X’s analytics page while signed in as @{X_ACCOUNT} and upload them here.</>
          : <>For impressions by day, profile visits, follows and link clicks, upload the Overview and Content exports from X’s analytics page.</>}
      </p>
      <XImport />
      {live && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          <a href="/api/analytics/x-sync?back=1" className="underline">Refresh the newest posts now</a>
          {!snap.meta.fullAt && (
            <> · <a href="/api/analytics/x-sync?full=1&back=1" className="underline">Fetch every post back to the first</a> (reads each post once)</>
          )}
        </p>
      )}
    </>
  );
}
