import { loadConsole } from '../load';
import OppList from '../OppList';
import { RoomHead, Unavailable, fold } from '../ui';
import { readGscSnapshot } from '@/lib/gsc';
import { KIND_LABEL, buildOpportunities, oppStatuses } from '@/lib/opportunities';

// /analytics/opportunities — findings turned into to-dos. Every unmet-demand
// signal the console collects, in one list, strongest first, each with its
// evidence and the kind of fix it points to. Ticking one off stores only
// that verdict; the list itself is derived fresh from the data each time.

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  const [gsc, statuses] = await Promise.all([readGscSnapshot(), oppStatuses()]);
  const all = buildOpportunities(data, gsc);
  const item = (o: (typeof all)[number]) => ({
    id: o.id, kindLabel: KIND_LABEL[o.kind], title: o.title, evidence: o.evidence, fix: o.fix, links: o.links,
    status: statuses[o.id],
  });
  const open = all.filter((o) => !statuses[o.id]).map(item);
  const handled = all.filter((o) => statuses[o.id]).map(item);

  return (
    <>
      <RoomHead title="Dead ends">
        Where readers got stuck: queries where Google shows you and nobody clicks, searches here that opened nothing, questions Ask couldn’t answer, texts readers abandon, and links that lead nowhere. Read as hints, not verdicts — one that keeps recurring means more than one that happened once. Strongest evidence first.
      </RoomHead>
      <OppList items={open} />
      {handled.length > 0 && (
        <details className="mt-6">
          <summary className={fold}>{'Handled · '}{handled.length}{' still showing in the data'}</summary>
          <p className="mt-1 text-xs text-gray-400">
            Items you marked done or not relevant whose signal hasn’t aged out yet. Reopen one if it deserves another look.
          </p>
          <OppList items={handled} />
        </details>
      )}
      {!gsc && (
        <p className="mt-4 text-xs text-gray-400">Google-side opportunities appear once Search Console is connected.</p>
      )}
    </>
  );
}
