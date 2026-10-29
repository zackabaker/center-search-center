import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchStudyData, type DayRow } from './data';
import SessionsExplorer from './SessionsExplorer';

// /study — the owner's private analytics console. One page, five rooms:
// Overview (the numbers that matter now), Days (the last 30, every counter
// side by side), Content (what gets read), Searches (what readers want —
// common, recent, unmet, and the people-watch), Sessions (whole visits,
// reconstructed and browsable). Access is enforced in src/proxy.ts: without
// the key cookie this URL is a 404.

export const metadata: Metadata = {
  title: 'The Study',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const fmtDayLong = new Intl.DateTimeFormat('en-US', {
  timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric',
});

function sum(rows: DayRow[], f: (r: DayRow) => number | null): number {
  return rows.reduce((a, r) => a + (f(r) ?? 0), 0);
}

function Tile({ label, today, week, month, note }: {
  label: string; today: string; week: string; month: string; note?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-3 sm:p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">{today}</div>
      <div className="mt-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {week}{' · 7d'}<br />{month}{' · 30d'}
      </div>
      {note && <div className="mt-1 text-[10px] text-gray-400 dark:text-gray-600">{note}</div>}
    </div>
  );
}

function Bar({ n, max, className }: { n: number; max: number; className: string }) {
  const pct = n > 0 && max > 0 ? Math.max(2, Math.round((n / max) * 100)) : 0;
  return (
    <span className="inline-flex w-24 items-center" aria-hidden>
      <span className={`h-1.5 rounded-sm ${className}`} style={{ width: `${pct}%` }} />
    </span>
  );
}

const SECTIONS = [
  ['overview', 'Overview'],
  ['days', 'Days'],
  ['content', 'Content'],
  ['searches', 'Searches'],
  ['sessions', 'Sessions'],
] as const;

export default async function StudyPage() {
  const data = await fetchStudyData();

  if (!data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-14">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">The Study</h1>
        <p className="mt-3 text-sm text-gray-500">The data store is not reachable from this environment.</p>
      </main>
    );
  }

  const d7 = data.days.slice(0, 7);
  const d30 = data.days;
  const today = data.days[0];
  const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-US'));
  const maxViews = Math.max(1, ...d30.map((r) => r.views ?? 0));
  const maxSearches = Math.max(1, ...d30.map((r) => r.searches));
  const maxWeekly = Math.max(1, ...data.weeklySearches.map((w) => w.n));
  const timeET = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
  // "session →" links only where a serialized session actually exists.
  const sidSet = new Set(data.sessions.map((s) => s.id));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">The Study</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {'Private console · generated '}{timeET.format(data.generatedAt)}{' ET · all times ET, days UTC'}
          </p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          {SECTIONS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-gray-600 dark:text-gray-300 hover:underline">{label}</a>
          ))}
        </nav>
      </header>

      {/* ---------------- Overview ---------------- */}
      <section id="overview" className="mt-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Tile
            label="Page views"
            today={fmt(today.views)}
            week={fmt(sum(d7, (r) => r.views))}
            month={fmt(sum(d30, (r) => r.views))}
            note={`own instrumentation, since ${data.activitySince}`}
          />
          <Tile
            label="Visitors"
            today={fmt(today.uniq)}
            week={fmt(sum(d7, (r) => r.uniq))}
            month={fmt(sum(d30, (r) => r.uniq))}
            note="unique tabs per day, summed"
          />
          <Tile
            label="Searches"
            today={fmt(today.searches)}
            week={fmt(sum(d7, (r) => r.searches))}
            month={fmt(sum(d30, (r) => r.searches))}
          />
          <Tile
            label="Reads"
            today={fmt(today.reads)}
            week={fmt(sum(d7, (r) => r.reads))}
            month={fmt(sum(d30, (r) => r.reads))}
            note="≥50% depth and ≥90s on a text"
          />
          <Tile
            label="Follows"
            today={fmt(today.follows)}
            week={fmt(sum(d7, (r) => r.follows))}
            month={fmt(sum(d30, (r) => r.follows))}
            note="clicks out to Substack / X / RSS"
          />
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {'All-time: '}{data.searchTotal.toLocaleString('en-US')}{' searches · '}
          {data.viewTotal.toLocaleString('en-US')}{' text views. External layers: '}
          <a className="underline" href="https://vercel.com/zack-bakers-projects/center-search-center/analytics" target="_blank" rel="noreferrer">Vercel Analytics</a>
          {' · '}
          <a className="underline" href="https://search.google.com/search-console?resource_id=sc-domain%3Acenter.study" target="_blank" rel="noreferrer">Search Console</a>
          {' · '}
          <a className="underline" href="https://claude.ai/artifact/W6WngpEABBFjYdFzmA9qk3" target="_blank" rel="noreferrer">chart dashboard</a>
          {'.'}
        </p>
      </section>

      {/* ---------------- Days ---------------- */}
      <section id="days" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Last 30 days</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm tabular-nums">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="py-1.5 pr-3 font-normal">Day</th>
                <th className="py-1.5 pr-3 font-normal">Views</th>
                <th className="py-1.5 pr-3 font-normal"></th>
                <th className="py-1.5 pr-3 font-normal">Visitors</th>
                <th className="py-1.5 pr-3 font-normal">Searches</th>
                <th className="py-1.5 pr-3 font-normal"></th>
                <th className="py-1.5 pr-3 font-normal">Opens</th>
                <th className="py-1.5 pr-3 font-normal">Reads</th>
                <th className="py-1.5 pr-3 font-normal">Follows</th>
                <th className="py-1.5 pr-0 font-normal">Returns</th>
              </tr>
            </thead>
            <tbody>
              {d30.map((r) => (
                <tr key={r.day} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="py-1.5 pr-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {fmtDayLong.format(new Date(`${r.day}T00:00:00Z`))}
                  </td>
                  <td className="py-1.5 pr-1 text-gray-900 dark:text-gray-100">{fmt(r.views)}</td>
                  <td className="py-1.5 pr-3"><Bar n={r.views ?? 0} max={maxViews} className="bg-sky-400/70" /></td>
                  <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{fmt(r.uniq)}</td>
                  <td className="py-1.5 pr-1 text-gray-900 dark:text-gray-100">{r.searches.toLocaleString('en-US')}</td>
                  <td className="py-1.5 pr-3"><Bar n={r.searches} max={maxSearches} className="bg-violet-400/70" /></td>
                  <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.opens || '·'}</td>
                  <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.reads || '·'}</td>
                  <td className="py-1.5 pr-3 text-gray-700 dark:text-gray-300">{r.follows || '·'}</td>
                  <td className="py-1.5 pr-0 text-gray-700 dark:text-gray-300">{r.returns || '·'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
          {'Views/Visitors are the site’s own counters (no bots that identify themselves), collected since '}
          {data.activitySince}{'. Searches before then are reconstructed from the retained search log.'}
        </p>

        <h3 className="mt-8 text-sm font-semibold text-gray-900 dark:text-gray-100">Search volume by week (full retained history)</h3>
        <div className="mt-2 space-y-1">
          {data.weeklySearches.map((w) => (
            <div key={w.week} className="flex items-center gap-2 text-xs tabular-nums">
              <span className="w-20 shrink-0 text-gray-500 dark:text-gray-400">{w.week.slice(5)}</span>
              <span className="h-2 rounded-sm bg-violet-400/70" style={{ width: `${Math.max(1, Math.round((w.n / maxWeekly) * 100))}%` }} />
              <span className="text-gray-700 dark:text-gray-300">{w.n}</span>
              {w.mine > 0 && <span className="text-gray-400">({w.mine}{' you'})</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Content ---------------- */}
      <section id="content" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What gets read</h2>
        <div className="mt-3 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Past two months</h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {data.topRecent.map((p, i) => (
                <li key={p.slug} className="flex gap-2">
                  <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                  <span className="min-w-0">
                    <Link href={`/post/${p.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                    <span className="ml-1.5 text-xs text-gray-400">{p.source}{' · '}{p.n}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">All time</h3>
            <ol className="mt-2 space-y-1.5 text-sm">
              {data.topAll.map((p, i) => (
                <li key={p.slug} className="flex gap-2">
                  <span className="w-5 shrink-0 text-right tabular-nums text-gray-400">{i + 1}</span>
                  <span className="min-w-0">
                    <Link href={`/post/${p.slug}`} className="text-gray-900 dark:text-gray-100 hover:underline">{p.title}</Link>
                    <span className="ml-1.5 text-xs text-gray-400">{p.source}{' · '}{p.n}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------------- Searches ---------------- */}
      <section id="searches" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What readers search</h2>
        <div className="mt-3 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">All time (top 40)</h3>
            <ol className="mt-2 columns-2 gap-6 text-sm">
              {data.termsAll.map((t) => (
                <li key={t.q} className="flex justify-between gap-2 break-inside-avoid">
                  <span className="truncate text-gray-800 dark:text-gray-200">{t.q}</span>
                  <span className="tabular-nums text-gray-400">{t.n}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last 7 days (readers only)</h3>
            <ol className="mt-2 space-y-1 text-sm">
              {data.termsRecent.map((t) => (
                <li key={t.q} className="flex justify-between gap-2">
                  <span className="truncate text-gray-800 dark:text-gray-200">{t.q}</span>
                  <span className="tabular-nums text-gray-400">{t.n}</span>
                </li>
              ))}
              {data.termsRecent.length === 0 && <li className="text-gray-400">Nothing yet this week.</li>}
            </ol>

            <h3 className="mt-6 text-sm font-semibold text-gray-700 dark:text-gray-300">Searched, found nothing</h3>
            <p className="text-xs text-gray-400">Unmet demand — candidates for new concept pages or vocabulary.</p>
            <ol className="mt-2 space-y-1 text-sm">
              {data.zeroResult.map((s) => (
                <li key={`${s.q}-${s.t}`} className="text-gray-800 dark:text-gray-200">
                  “{s.q}”<span className="ml-1.5 text-xs text-gray-400">{timeET.format(s.t)}</span>
                </li>
              ))}
              {data.zeroResult.length === 0 && <li className="text-gray-400">None recorded.</li>}
            </ol>
          </div>
        </div>

        <h3 className="mt-8 text-sm font-semibold text-gray-900 dark:text-gray-100">People watch</h3>
        <p className="text-xs text-gray-400">Every retained search that names you or the circle. The session link opens the full trail when one exists.</p>
        <ol className="mt-2 space-y-1 text-sm">
          {data.peopleHits.map((h, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
              <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">{h.term}</span>
              <span className="text-gray-800 dark:text-gray-200">“{h.q}”</span>
              {h.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
              {h.sid && sidSet.has(h.sid) && <a href={`#s-${h.sid}`} className="text-xs text-gray-500 underline">session →</a>}
            </li>
          ))}
          {data.peopleHits.length === 0 && <li className="text-gray-400">None recorded.</li>}
        </ol>

        <h3 className="mt-8 text-sm font-semibold text-gray-900 dark:text-gray-100">Most recent searches</h3>
        <ol className="mt-2 space-y-1 text-sm">
          {data.recentSearches.map((s, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(s.t)}</span>
              <span className="text-xs uppercase tracking-wide text-gray-400">{s.mode === 'ask' ? 'ai' : 'kw'}</span>
              <span className="text-gray-800 dark:text-gray-200">“{s.q}”</span>
              {s.mine && <span className="text-xs text-amber-600 dark:text-amber-300">you</span>}
              {s.sid && sidSet.has(s.sid) && <a href={`#s-${s.sid}`} className="text-xs text-gray-500 underline">session →</a>}
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Sessions ---------------- */}
      <section id="sessions" className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sessions</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {'Whole visits, most interesting first — pages opened, texts read ('}
          <span className="text-xs uppercase">read ✓</span>
          {' = ≥50% and ≥90s), searches run, follows clicked. Trails with page data start '}
          {data.activitySince}
          {'; older sessions are search-bursts from the retained log (“pre-ID era”).'}
        </p>
        <div className="mt-4">
          <SessionsExplorer sessions={data.sessions} />
        </div>
      </section>
    </main>
  );
}
