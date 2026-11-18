import Link from 'next/link';
import type { DayRow, SessionView, StudyData } from './data';
import type { Insight } from './derive';

// Shared pieces for the console's rooms: formatters, link helpers, and the
// two cards (a journey digest, a list of insight sentences) that appear in
// more than one place. No hooks here, so both server pages and client
// components can use it.

const fmtDayLong = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' });
const fmtDayShort = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });

export const timeET = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});
export const timeOnlyET = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit',
});

/** Day keys are YYYY-MM-DD; render them without timezone drift. */
export function dayLabel(day: string, long = false): string {
  return (long ? fmtDayLong : fmtDayShort).format(new Date(`${day}T00:00:00Z`));
}

export const share = (part: number, whole: number) => (whole > 0 ? `${Math.round((part / whole) * 100)}%` : '—');
export const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-US'));
export const sum = (rows: DayRow[], f: (r: DayRow) => number | null) => rows.reduce((a, r) => a + (f(r) ?? 0), 0);

export function duration(mins: number): string {
  if (mins < 1) return '<1 min';
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/** A text's own stats page, from its public href. */
export const statsHref = (href?: string) => (href?.startsWith('/post/') ? `/analytics${href}` : null);

/**
 * The page for the visit an event belongs to. A tab's id can span several
 * visits (they split at 30-minute silences), so this picks the one covering
 * the event's time, falling back to the tab's first.
 */
export function sessionHref(data: StudyData, sid?: string, t?: number): string | null {
  if (!sid) return null;
  const eps = data.episodes[sid];
  if (!eps || eps.length === 0) return null;
  const PAD = 30 * 60_000;
  const hit = typeof t === 'number' ? eps.find((e) => t >= e.start - PAD && t <= e.end + PAD) : undefined;
  return `/analytics/session/${(hit ?? eps[0]).id}`;
}

export function RoomHead({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <>
      <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {children && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{children}</p>}
    </>
  );
}

export function Unavailable() {
  return <p className="text-sm text-gray-500">The data store is not reachable from this environment.</p>;
}

export const sub = 'mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300';
export const fold = 'cursor-pointer text-sm text-gray-600 dark:text-gray-300 hover:underline';
export const thead = 'border-b border-gray-200 dark:border-gray-800 text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400';

export function InsightList({ insights }: { insights: Insight[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm">
      {insights.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span
            aria-hidden
            className={`w-3 shrink-0 text-center ${
              it.tone === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : it.tone === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-gray-400'
            }`}
          >
            {it.tone === 'up' ? '↑' : it.tone === 'down' ? '↓' : '·'}
          </span>
          <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
            {it.text}
            {it.href && <Link href={it.href} className="ml-1.5 text-xs text-gray-500 underline">see →</Link>}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The window's reader visits worth a card, most notable first. Defaults to the week. */
export function topJourneys(data: StudyData, cap: number, sinceMs = 7 * 86_400_000): SessionView[] {
  const since = data.generatedAt - sinceMs;
  return data.sessions
    .filter((s) => !s.mine && !s.crawler && s.kind === 'live' && s.end >= since)
    .sort((a, b) => b.score - a.score)
    .slice(0, cap);
}

/** One visit as a digest: who, from where, what they searched, read, followed. */
export function JourneyCard({ s }: { s: SessionView }) {
  const seen = new Set<string>();
  const searches: string[] = [];
  const reads: { label: string; href?: string }[] = [];
  const follows: string[] = [];
  const begins: { label: string; href?: string }[] = [];
  let landing: string | undefined;
  for (const e of s.events) {
    if (e.type === 'page' && landing === undefined) landing = e.label;
    else if (e.type === 'search' && !seen.has(`s:${e.label}`)) {
      seen.add(`s:${e.label}`);
      searches.push(e.label);
    } else if (e.type === 'read' && !seen.has(`r:${e.label}`)) {
      seen.add(`r:${e.label}`);
      reads.push({ label: e.label, href: e.href });
    } else if (e.type === 'follow') follows.push(e.label);
    else if (e.type === 'begin') begins.push({ label: e.label, href: e.href });
  }
  const row = 'w-20 shrink-0 text-xs uppercase tracking-wide text-gray-400 pt-0.5';
  return (
    <li className="rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <span className="font-medium text-gray-900 dark:text-gray-100">{timeET.format(s.start)}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {duration(s.mins)}
          {' · '}{s.pages}{' page'}{s.pages === 1 ? '' : 's'}
          {s.texts > 0 && <>{' · '}{s.texts}{' text'}{s.texts === 1 ? '' : 's'}</>}
        </span>
        {s.ai ? (
          <span className="rounded bg-indigo-100 dark:bg-indigo-900/40 px-1.5 py-0.5 text-xs text-indigo-800 dark:text-indigo-200">{'via '}{s.ai}{' (AI)'}</span>
        ) : s.ref ? (
          <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">{'via '}{s.ref}</span>
        ) : null}
        {s.device === 'm' && (
          <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">phone</span>
        )}
        {s.badges.includes('first visit') && (
          <span className="rounded bg-sky-100 dark:bg-sky-900/40 px-1.5 py-0.5 text-xs text-sky-800 dark:text-sky-200">first visit</span>
        )}
        {s.badges.filter((b) => b.startsWith('returning')).map((b) => (
          <span key={b} className="rounded bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 text-xs text-emerald-800 dark:text-emerald-200">{b}</span>
        ))}
      </div>
      {begins.map((b, i) => (
        <div key={i} className="mt-2">
          {b.label.startsWith('“') ? (
            <blockquote className="font-serif text-[15px] italic leading-snug text-gray-900 dark:text-gray-100">{b.label}</blockquote>
          ) : (
            <span className="text-sm text-gray-700 dark:text-gray-300">{'Generated a path from: '}{b.label}</span>
          )}
          {b.href && <a href={b.href} className="ml-2 text-xs text-gray-500 underline">their path →</a>}
        </div>
      ))}
      <dl className="mt-2 space-y-1 text-sm">
        {landing && (
          <div className="flex gap-2">
            <dt className={row}>entered</dt>
            <dd className="min-w-0 break-words text-gray-700 dark:text-gray-300">{landing}</dd>
          </div>
        )}
        {searches.length > 0 && (
          <div className="flex gap-2">
            <dt className={row}>searched</dt>
            <dd className="min-w-0 break-words text-gray-700 dark:text-gray-300">
              {searches.slice(0, 4).map((q) => `“${q}”`).join(' · ')}
              {searches.length > 4 && <span className="text-gray-400">{' +'}{searches.length - 4}{' more'}</span>}
            </dd>
          </div>
        )}
        {reads.length > 0 && (
          <div className="flex gap-2">
            <dt className={row}>read</dt>
            <dd className="min-w-0 break-words text-gray-900 dark:text-gray-100">
              {reads.slice(0, 4).map((r, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-gray-400">{' · '}</span>}
                  {r.href ? <Link href={r.href} className="hover:underline">{r.label}</Link> : r.label}
                </span>
              ))}
              {reads.length > 4 && <span className="text-gray-400">{' +'}{reads.length - 4}{' more'}</span>}
            </dd>
          </div>
        )}
        {follows.length > 0 && (
          <div className="flex gap-2">
            <dt className={row}>followed</dt>
            <dd className="min-w-0 text-emerald-700 dark:text-emerald-300">{follows.join(' · ')}</dd>
          </div>
        )}
      </dl>
      <div className="mt-2 text-xs">
        <Link href={`/analytics/session/${s.id}`} className="text-gray-500 underline">full trail →</Link>
      </div>
    </li>
  );
}
