import { loadConsole } from '../load';
import { RoomHead, Unavailable, dayLabel, fold, share, sub, thead, timeET } from '../ui';
import { gscConfigured, readGscSnapshot } from '@/lib/gsc';

// /analytics/sources — where readers come from and whether each source sends
// people who stay: referrers, Google (Search Console), where visits land,
// device and language mix, and the links that lead nowhere.

export const dynamic = 'force-dynamic';

export default async function SourcesPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const gsc = await readGscSnapshot();
  const deviceTotal = data.devices.m + data.devices.d;
  const langTotal = data.langs.reduce((a, l) => a + l.n, 0);

  return (
    <>
      <RoomHead title="Where readers come from">
        Arrivals by source, and whether each source sends people who stay. “People” = arrivals that showed a real tap, key or mouse move (counted from Nov 17); “stayed” = did more than land; “read” = finished a text. The last two cover the recent trail window.
      </RoomHead>
      {data.sources.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">No referred arrivals recorded yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm tabular-nums">
            <thead>
              <tr className={thead}>
                <th className="py-1.5 pr-3 font-normal">Source</th>
                <th className="py-1.5 pr-3 font-normal text-right">7 days</th>
                <th className="py-1.5 pr-3 font-normal text-right">30 days</th>
                <th className="py-1.5 pr-3 font-normal text-right">People</th>
                <th className="py-1.5 pr-3 font-normal text-right">Stayed</th>
                <th className="py-1.5 pr-0 font-normal text-right">Read</th>
              </tr>
            </thead>
            <tbody>
              {data.sources.map((r) => (
                <tr key={r.name} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100">
                    {r.name}
                    {r.ai && (
                      <span className="ml-1.5 rounded bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-[10px] font-medium text-indigo-800 dark:text-indigo-200">AI</span>
                    )}
                  </td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{r.visits7 || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{r.visits30 || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{r.human30 || '·'}</td>
                  <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">
                    {r.sessions > 0 ? <>{share(r.stayed, r.sessions)}<span className="ml-1 text-xs text-gray-400">{r.stayed}/{r.sessions}</span></> : '·'}
                  </td>
                  <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{r.read || '·'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deviceTotal > 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {'Of '}{deviceTotal.toLocaleString('en-US')}{' new sessions since Nov 17: phones '}{share(data.devices.m, deviceTotal)}{', larger screens '}{share(data.devices.d, deviceTotal)}
          {langTotal > 0 && <>{' · browser languages: '}{data.langs.map((l) => `${l.l} ${share(l.n, langTotal)}`).join(', ')}</>}
          {'. This mix counts every tab, bots included — a language far out of line with your readership is a bot signature.'}
        </p>
      )}

      <h2 id="google" className={sub}>Google Search</h2>
      {gsc ? (
        <>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium tabular-nums">{gsc.totals.clicks.toLocaleString('en-US')}</span>{' clicks'}
            {gsc.prevTotals && gsc.prevTotals.clicks > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {' ('}{gsc.totals.clicks >= gsc.prevTotals.clicks ? '+' : ''}
                {Math.round(((gsc.totals.clicks - gsc.prevTotals.clicks) / gsc.prevTotals.clicks) * 100)}{'% vs the 28 days before)'}
              </span>
            )}
            {' · '}<span className="font-medium tabular-nums">{gsc.totals.impressions.toLocaleString('en-US')}</span>{' impressions · '}
            <span className="font-medium tabular-nums">{(gsc.totals.ctr * 100).toFixed(1)}%</span>{' CTR · average position '}
            <span className="font-medium tabular-nums">{gsc.totals.position.toFixed(1)}</span>
            <span className="ml-1.5 text-xs text-gray-400">{dayLabel(gsc.start)}{' – '}{dayLabel(gsc.end)}</span>
          </p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm tabular-nums">
              <thead>
                <tr className={thead}>
                  <th className="py-1.5 pr-3 font-normal">Query on Google</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Clicks</th>
                  <th className="py-1.5 pr-3 font-normal text-right">Shown</th>
                  <th className="py-1.5 pr-3 font-normal text-right">CTR</th>
                  <th className="py-1.5 pr-0 font-normal text-right">Position</th>
                </tr>
              </thead>
              <tbody>
                {gsc.queries.slice(0, 25).map((q) => (
                  <tr key={q.key} className="border-b border-gray-100 dark:border-gray-900">
                    <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100"><span className="line-clamp-1 break-words">{q.key}</span></td>
                    <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{q.clicks}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{q.impressions.toLocaleString('en-US')}</td>
                    <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{(q.ctr * 100).toFixed(1)}%</td>
                    <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{q.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="mt-3">
            <summary className={fold}>Pages Google sends people to</summary>
            <ol className="mt-2 space-y-1 text-sm">
              {gsc.pages.slice(0, 25).map((p) => (
                <li key={p.key} className="flex justify-between gap-3">
                  <span className="min-w-0 break-all text-gray-800 dark:text-gray-200">{p.key.replace(/^https?:\/\/[^/]+/, '') || '/'}</span>
                  <span className="shrink-0 tabular-nums text-gray-400">{p.clicks}{' clicks · '}{p.impressions.toLocaleString('en-US')}{' shown'}</span>
                </li>
              ))}
            </ol>
          </details>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            {'From Search Console, refreshed daily (last '}{timeET.format(gsc.fetchedAt)}{' ET); its data runs about two days behind.'}
          </p>
        </>
      ) : (
        <p className="mt-1 text-sm text-gray-400">
          {gscConfigured()
            ? 'Credentials are set — the first import runs with the daily refresh.'
            : 'Not connected. It needs a Google service-account key in the GSC_SERVICE_ACCOUNT_JSON environment variable; the steps are in geo/analytics-roadmap.md.'}
        </p>
      )}

      <h2 className={sub}>Where visits land — and whether the page holds them</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm tabular-nums">
          <thead>
            <tr className={thead}>
              <th className="py-1.5 pr-3 font-normal">Landing page</th>
              <th className="py-1.5 pr-3 font-normal text-right">Visits</th>
              <th className="py-1.5 pr-3 font-normal text-right">Stayed</th>
              <th className="py-1.5 pr-0 font-normal text-right">Read</th>
            </tr>
          </thead>
          <tbody>
            {data.landings.map((r) => (
              <tr key={r.href ?? r.label} className="border-b border-gray-100 dark:border-gray-900">
                <td className="py-1.5 pr-3 text-gray-900 dark:text-gray-100"><span className="line-clamp-1 break-words">{r.label}</span></td>
                <td className="py-1.5 pr-3 text-right text-gray-900 dark:text-gray-100">{r.sessions}</td>
                <td className="py-1.5 pr-3 text-right text-gray-700 dark:text-gray-300">{share(r.stayed, r.sessions)}</td>
                <td className="py-1.5 pr-0 text-right text-gray-700 dark:text-gray-300">{r.read || '·'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        Recent trail window; yours and likely crawlers excluded, and from Nov 18 only visits with a real input. Earlier days still include one-touch bot loads, which is why /search shows so many visits that never stay.
      </p>

      {data.missing.length > 0 && (
        <details className="mt-6">
          <summary className={fold}>
            {'Broken links — 404s people hit · '}{data.missing.reduce((a, m) => a + m.n, 0)}{' in 14 days'}
          </summary>
          <ol className="mt-2 space-y-1 text-sm">
            {data.missing.map((m) => (
              <li key={m.path} className="flex justify-between gap-3">
                <span className="min-w-0 break-all font-mono text-xs text-gray-800 dark:text-gray-200">{m.path}</span>
                <span className="tabular-nums text-gray-400">{m.n}</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}
