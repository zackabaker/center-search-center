import { loadConsole } from '../load';
import { RoomHead, Unavailable, dayLabel, sub, timeET } from '../ui';
import { accountOverview, recentFeedback, topEngaged } from '@/lib/user-store';

// /analytics/people — the readers who signed in: how many accounts there
// are and how fast they're being made, who uses the site most, and the
// notes people send from the Feedback button.

export const dynamic = 'force-dynamic';

const readTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

export default async function PeoplePage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const [accounts, readers, feedback] = await Promise.all([
    accountOverview(8).catch(() => null),
    topEngaged(50).catch(() => []),
    recentFeedback(100).catch(() => []),
  ]);

  return (
    <>
      <RoomHead title="People">Signed-in readers and what they tell you. Usernames only, never emails; none of this is shown publicly.</RoomHead>

      {accounts && (
        <>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="text-2xl font-semibold tabular-nums text-gray-900 dark:text-gray-100">
              {accounts.total.toLocaleString('en-US')}
              <span className="ml-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">account{accounts.total === 1 ? '' : 's'}</span>
            </span>
            <span className="text-sm tabular-nums text-gray-600 dark:text-gray-300">{'+'}{accounts.last7}{' this week'}</span>
            <span className="text-sm tabular-nums text-gray-600 dark:text-gray-300">{'+'}{accounts.last30}{' this month'}</span>
          </div>
          {accounts.newest.length > 0 && (
            <ol className="mt-3 space-y-1 text-sm">
              {accounts.newest.map((a) => (
                <li key={a.username} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{'joined '}{dayLabel(new Date(a.createdAt).toISOString().slice(0, 10))}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{a.username}</span>
                  <span className="text-xs text-gray-400">{a.score > 0 ? `score ${a.score}` : 'no activity yet'}</span>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            {'Signup index started Nov 17, 2026 — engaged accounts were backfilled with their real creation dates; dormant ones join the count when they next sign in.'}
          </p>
        </>
      )}

      <h2 className={sub}>Most engaged</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {'Signed-in readers by score: minutes read + 2 × new searches + 5 × idioms saved.'}
      </p>
      {readers.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No signed-in reader has a score yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-3 font-medium">#</th>
                <th className="py-2 pr-3 font-medium">Username</th>
                <th className="py-2 pr-3 font-medium text-right">Read</th>
                <th className="py-2 pr-3 font-medium text-right">Searches</th>
                <th className="py-2 pr-3 font-medium text-right">Idioms</th>
                <th className="py-2 font-medium text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {readers.map((r, i) => (
                <tr key={r.username} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2 pr-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                  <td className="py-2 pr-3 font-medium text-gray-900 dark:text-gray-100">{r.username}</td>
                  <td className="py-2 pr-3 text-right">{readTime(r.readSec)}</td>
                  <td className="py-2 pr-3 text-right">{r.searches}</td>
                  <td className="py-2 pr-3 text-right">{r.idioms}</td>
                  <td className="py-2 text-right font-semibold text-gray-900 dark:text-gray-100">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className={sub}>Feedback</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {'Notes sent from the footer’s Feedback button, newest first. A username appears only when the sender was signed in.'}
      </p>
      {feedback.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Nothing yet.</p>
      ) : (
        <ol className="mt-3 divide-y divide-gray-200 dark:divide-gray-700 border-y border-gray-200 dark:border-gray-700">
          {feedback.map((f, i) => (
            <li key={`${f.at}-${i}`} className="py-3">
              <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">{f.text}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {timeET.format(new Date(f.at))}{' · on '}{f.page}{f.username ? ` · ${f.username}` : ''}
              </p>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
