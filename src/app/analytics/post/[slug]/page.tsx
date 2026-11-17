import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEPTH_STEPS, DWELL_LABELS, fetchPostData } from '../../data';
import TrendChart from '../../TrendChart';

// /analytics/post/<slug> — one text, in depth: is it being opened, do people
// get through it, who sends them, what did they search just before, and
// where do they go next. Gated with the rest of /analytics in src/proxy.ts
// (the matcher covers /analytics/:path*).

export const metadata: Metadata = {
  title: 'Text stats',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

const fmtDay = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const fmtWhen = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});

function Bars({ rows, colorClass }: { rows: { label: string; n: number; of: number }[]; colorClass: string }) {
  return (
    <ol className="mt-2 space-y-1.5 text-sm">
      {rows.map((r) => {
        const pct = r.of > 0 ? Math.round((r.n / r.of) * 100) : 0;
        return (
          <li key={r.label} className="flex items-center gap-2">
            <span className="w-24 shrink-0 text-xs text-gray-500 dark:text-gray-400">{r.label}</span>
            <span className="h-2.5 min-w-0 flex-1 rounded-sm bg-gray-100 dark:bg-gray-800" aria-hidden>
              <span className={`block h-2.5 rounded-sm ${colorClass}`} style={{ width: `${pct}%` }} />
            </span>
            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-gray-700 dark:text-gray-300">
              {pct}%<span className="ml-1 text-gray-400">{r.n}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default async function PostStatsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) notFound();
  const data = await fetchPostData(slug);
  if (!data) notFound();

  const viewPoints = data.series.map((r) => ({ label: fmtDay.format(new Date(`${r.day}T00:00:00Z`)), value: r.views }));
  const readPoints = data.series.map((r) => ({ label: fmtDay.format(new Date(`${r.day}T00:00:00Z`)), value: r.reads }));
  const delta = data.viewsPrev7 > 0 ? Math.round(((data.views7 - data.viewsPrev7) / data.viewsPrev7) * 100) : null;
  const readsTracked = data.series.some((r) => r.reads > 0);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
      <p className="text-sm">
        <Link href="/analytics#reading" className="text-gray-500 underline">← Analytics</Link>
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{data.title}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {data.source}{' · '}{data.allTime.toLocaleString('en-US')}{' views all-time · '}
        <Link href={`/post/${data.slug}`} className="underline">open the text →</Link>
      </p>

      <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        <TrendChart
          title="Views / day"
          points={viewPoints}
          colorClass="text-[#2a78d6] dark:text-[#3987e5]"
          headline={data.views7.toLocaleString('en-US')}
          deltaPct={delta}
          deltaVs="vs last wk"
        />
        <TrendChart
          title="Reads / day"
          points={readPoints}
          colorClass="text-[#1baf7a] dark:text-[#199e70]"
          headline={data.reads30.toLocaleString('en-US')}
          deltaPct={null}
          deltaVs=""
        />
      </div>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
        {'Views headline = last 7 days ('}{data.views30.toLocaleString('en-US')}{' in 30). Reads headline = last 30 days; a read = at least half the text and 90+ seconds. Yours excluded from Nov 17 on.'}
        {!readsTracked && ' Per-text reads have been counted since Nov 17 — the line fills in from there.'}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">How far readers get</h2>
        {data.depthN === 0 ? (
          <p className="mt-2 text-sm text-gray-400">No depth reports for this text yet — tracking began Nov 17.</p>
        ) : (
          <div className="mt-2 grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reached</h3>
              <Bars
                colorClass="bg-[#1baf7a] dark:bg-[#199e70]"
                rows={DEPTH_STEPS.map((step, i) => ({
                  label: step === 0 ? 'Opened' : step === 100 ? 'The end' : `${step}% down`,
                  n: data.reach[i],
                  of: data.depthN,
                }))}
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time on the text</h3>
              <Bars
                colorClass="bg-[#2a78d6] dark:bg-[#3987e5]"
                rows={DWELL_LABELS.map((label, i) => ({ label, n: data.dwell[i], of: data.depthN }))}
              />
            </div>
          </div>
        )}
        {data.depthN > 0 && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-600">
            {data.depthN}{' reader session'}{data.depthN === 1 ? '' : 's'}{' in 90 days. Time counts only while the tab was visible and the reader active (a still minute at most). A short text can be “at the end” on arrival — read it against the time column.'}
          </p>
        )}
      </section>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Arrived here from</h2>
          <p className="mt-1 text-xs text-gray-400">Visits that landed straight on this text.</p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.sources.map((s) => (
              <li key={s.name} className="flex justify-between gap-2">
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">{s.name}</span>
                <span className="tabular-nums text-gray-400">{s.n}</span>
              </li>
            ))}
            {data.sources.length === 0 && <li className="text-gray-400">No referred landings in the recent window.</li>}
          </ol>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Searched just before</h2>
          <p className="mt-1 text-xs text-gray-400">The query in a visit’s last few moves before opening this text.</p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.searches.map((s) => (
              <li key={s.q} className="flex justify-between gap-2">
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">“{s.q}”</span>
                <span className="tabular-nums text-gray-400">{s.n}</span>
              </li>
            ))}
            {data.searches.length === 0 && <li className="text-gray-400">No search led here in the recent window.</li>}
          </ol>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Opened next</h2>
          <p className="mt-1 text-xs text-gray-400">The next text in the same visit.</p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.next.map((p) => (
              <li key={p.href ?? p.label} className="flex justify-between gap-2">
                <span className="min-w-0 break-words text-gray-800 dark:text-gray-200">
                  {p.href ? <Link href={`/analytics${p.href}`} className="hover:underline">{p.label}</Link> : p.label}
                </span>
                <span className="tabular-nums text-gray-400">{p.n}</span>
              </li>
            ))}
            {data.next.length === 0 && <li className="text-gray-400">Nobody went on to another text in the recent window.</li>}
          </ol>
        </section>
        <section>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent visits</h2>
          <p className="mt-1 text-xs text-gray-400">
            {data.follows > 0
              ? `${data.follows} follow click${data.follows === 1 ? '' : 's'} came from this text.`
              : 'Reader visits that included this text.'}
          </p>
          <ol className="mt-2 space-y-1 text-sm">
            {data.visits.map((v) => (
              <li key={v.id} className="flex flex-wrap items-baseline gap-x-2">
                <span className="w-28 shrink-0 text-xs tabular-nums text-gray-400">{fmtWhen.format(v.start)}</span>
                <span className="text-gray-800 dark:text-gray-200">{v.mins < 1 ? '<1 min' : `${v.mins} min`}</span>
                {v.read && <span className="text-xs uppercase text-emerald-700 dark:text-emerald-300">read ✓</span>}
                {v.via && <span className="text-xs text-gray-500 dark:text-gray-400">{'via '}{v.via}</span>}
                <Link href={`/analytics#s-${v.id}`} className="text-xs text-gray-500 underline">trail →</Link>
              </li>
            ))}
            {data.visits.length === 0 && <li className="text-gray-400">No reader visits in the recent window.</li>}
          </ol>
        </section>
      </div>
    </main>
  );
}
