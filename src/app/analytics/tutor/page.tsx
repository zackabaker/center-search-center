import Link from 'next/link';
import { RoomHead, fold, timeET } from '../ui';
import TutorSearch from './TutorSearch';
import { getKV } from '@/lib/kv';

// /analytics/tutor — what the tutor is costing and what people ask it, then
// its retrieval on its own (what a question pulls out of the archive).

export const dynamic = 'force-dynamic';

type Entry = {
  q: string; a?: string; turn?: number; who?: string; strength?: string;
  badLinks?: string[]; badQuotes?: number; cost?: number; t: number;
};

const usd = (n: number) => `$${n.toFixed(2)}`;

export default async function TutorRoom() {
  const kv = getKV();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  let spentMonth = 0;
  let spentToday = 0;
  let entries: Entry[] = [];
  let archived = 0;
  if (kv) {
    try {
      const [m, d, raw, n] = await Promise.all([
        kv.get(`tutor:spend:${month}`),
        kv.get(`tutor:spend:day:${day}`),
        kv.lrange<unknown>('tutor:log', 0, 199),
        kv.hlen('tutor:archive'),
      ]);
      spentMonth = Number(m) || 0;
      spentToday = Number(d) || 0;
      entries = raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r) as Entry);
      archived = n;
    } catch { /* show what there is */ }
  }
  const monthLimit = Number(process.env.TUTOR_MONTHLY_USD) || 1000;
  const dayLimit = Number(process.env.TUTOR_DAILY_USD) || 150;
  const today = entries.filter((e) => new Date(e.t).toISOString().slice(0, 10) === day);
  const cold = entries.filter((e) => (e.cost ?? 0) > 3).length;
  const flagged = entries.filter((e) => (e.badQuotes ?? 0) > 0 || (e.badLinks?.length ?? 0) > 0).length;
  const tile = 'rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2.5';
  const label = 'text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400';
  const big = 'mt-0.5 text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100';

  return (
    <>
      <RoomHead title="Tutor">
        The tutor at <Link href="/oracle" className="underline">/oracle</Link>: what it has cost, what people ask it, and what its search finds. A question after a quiet hour costs about $6.75 because the whole canon is loaded again; within the hour each costs about 30¢. Answers served from the archive or kept by you cost nothing.
      </RoomHead>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className={tile}>
          <div className={label}>This month</div>
          <div className={big}>{usd(spentMonth)}</div>
          <div className="text-xs text-gray-400">pauses at {usd(monthLimit)}</div>
        </div>
        <div className={tile}>
          <div className={label}>Today</div>
          <div className={big}>{usd(spentToday)}</div>
          <div className="text-xs text-gray-400">pauses at {usd(dayLimit)}</div>
        </div>
        <div className={tile}>
          <div className={label}>Answers today</div>
          <div className={big}>{today.length}</div>
          <div className="text-xs text-gray-400">{today.filter((e) => e.who === 'visitor').length} from signed-out visitors</div>
        </div>
        <div className={tile}>
          <div className={label}>Archived answers</div>
          <div className={big}>{archived}</div>
          <div className="text-xs text-gray-400">reused for the same question</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Of the last {entries.length} live answers: {cold} paid the full loading cost, and {flagged} had a quotation or link that failed the check.
        Limits: {Number(process.env.TUTOR_USER_PER_DAY) || 40} questions a day with an account, {Number(process.env.TUTOR_ANON_PER_DAY) || 2} without.
      </p>

      <h2 className="mt-8 text-sm font-semibold text-gray-700 dark:text-gray-300">Latest questions</h2>
      <ol className="mt-2 divide-y divide-gray-200 dark:divide-gray-800 border-y border-gray-200 dark:border-gray-800">
        {entries.slice(0, 40).map((e, i) => (
          <li key={i} className="py-2.5">
            <details>
              <summary className="cursor-pointer text-sm">
                <span className="text-xs tabular-nums text-gray-400">{timeET.format(e.t)}</span>{' '}
                <span className="text-gray-900 dark:text-gray-100">{e.q}</span>{' '}
                <span className="text-xs tabular-nums text-gray-400">
                  · {usd(e.cost ?? 0)} · {e.who === 'visitor' ? 'signed out' : 'account'}{(e.turn ?? 1) > 1 ? ` · question ${e.turn} of a conversation` : ''}
                  {((e.badQuotes ?? 0) > 0 || (e.badLinks?.length ?? 0) > 0) && <span className="text-amber-700 dark:text-amber-300"> · failed a check</span>}
                </span>
              </summary>
              {e.strength && <p className="mt-1 text-xs text-gray-400">Archive match: {e.strength}</p>}
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{e.a}</p>
            </details>
          </li>
        ))}
        {entries.length === 0 && <li className="py-3 text-sm text-gray-400">No questions yet.</li>}
      </ol>

      <details className="mt-8">
        <summary className={fold}>Test what a question retrieves</summary>
        <p className="mt-1 text-xs text-gray-400">
          The paragraphs the tutor would be shown for a question, with where each ranked on wording and on meaning.
        </p>
        <TutorSearch />
      </details>
    </>
  );
}
