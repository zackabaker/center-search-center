import { loadConsole } from '../load';
import SessionsExplorer from '../SessionsExplorer';
import { RoomHead, Unavailable } from '../ui';

// /analytics/sessions — whole visits as timelines, with the filter box and
// facet chips. The 150 most notable are here; any other visit has its own
// page, reached from wherever it is mentioned.

export const dynamic = 'force-dynamic';

export default async function SessionsPage() {
  const data = await loadConsole();
  if (!data) return <Unavailable />;
  return (
    <>
      <RoomHead title="Visits">
        {'Whole visits, newest first — pages opened, texts read ('}
        <span className="text-xs uppercase">read ✓</span>
        {'), searches run, results picked, reading paths generated, follows clicked. A tab quiet for 30+ minutes starts a new visit. Trails with page data start '}
        {data.activitySince}
        {'; older ones are search-bursts from the retained log (“pre-ID era”). Click a visit’s time to open it on its own page.'}
      </RoomHead>
      <div className="mt-4">
        <SessionsExplorer sessions={data.sessions} />
      </div>
    </>
  );
}
