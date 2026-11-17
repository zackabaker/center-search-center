import AskSwitch from '../AskSwitch';
import { loadConsole } from '../load';
import { RoomHead, Unavailable, timeET } from '../ui';
import { getAskStatus } from '@/lib/ask-budget';

// /analytics/answers — what the AI actually told readers: today's Ask
// spending and the owner's switch, then the full answer behind each recent
// question, with the ones that came up empty marked.

export const dynamic = 'force-dynamic';

export default async function AnswersPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const askStatus = await getAskStatus().catch(() => null);

  return (
    <>
      <RoomHead title="Ask answers">
        What the AI actually told readers — the full answer behind each recent Ask question. Click a question to read it.
        {data.weakAsks > 0 && (
          <>{' '}<span className="text-rose-700 dark:text-rose-300">{data.weakAsks}{' of the recent answers read like “the archive doesn’t cover this”'}</span>{' — marked below; each is a gap worth a look.'}</>
        )}
      </RoomHead>
      {askStatus && <AskSwitch status={askStatus} />}
      <ol className="mt-3 space-y-2 text-sm">
        {data.askAnswers.map((h, i) => (
          <li key={`${h.t}-${i}`}>
            <details>
              <summary className="cursor-pointer flex flex-wrap items-baseline gap-x-2">
                <span className="text-xs tabular-nums text-gray-400 w-28 shrink-0">{timeET.format(h.t)}</span>
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{h.q}”</span>
                {h.concept && <span className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs text-gray-700 dark:text-gray-300">from {h.concept}</span>}
                {h.fresh && <span className="text-xs text-gray-400">regenerate</span>}
                {h.cut && <span className="text-xs text-rose-600 dark:text-rose-300">truncated</span>}
                {h.weak && <span className="rounded bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 text-xs text-rose-800 dark:text-rose-200">no real answer?</span>}
              </summary>
              <div className="mt-2 sm:ml-28 max-w-2xl whitespace-pre-wrap [overflow-wrap:anywhere] rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-[13px] leading-relaxed text-gray-700 dark:text-gray-300">
                {h.a}{h.aLen ? ` … [${h.aLen} chars total]` : ''}
              </div>
            </details>
          </li>
        ))}
        {data.askAnswers.length === 0 && <li className="text-gray-400">None recorded yet.</li>}
      </ol>
    </>
  );
}
