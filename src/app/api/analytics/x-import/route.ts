import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { importXCsv } from '@/lib/x-analytics';

// Takes one of X's own analytics exports (Overview or Content CSV) and stores
// its private numbers for /analytics/x: daily impressions, profile visits and
// follows, and per-post link clicks. Owner-only, same gate as the console;
// everyone else gets its 404.
//
// POST { csv: "<file contents>" } → { ok, result } | { ok: false, error }

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let csv: unknown;
  try {
    csv = (await request.json()).csv;
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  if (typeof csv !== 'string' || csv.length < 20) {
    return Response.json({ ok: false, error: 'No file contents were sent.' }, { status: 400 });
  }
  try {
    const result = await importXCsv(csv);
    if (typeof result === 'string') return Response.json({ ok: false, error: result }, { status: 400 });
    return Response.json({ ok: true, result });
  } catch (err) {
    console.error('x-import failed', err);
    return Response.json({ ok: false, error: 'Could not save the import.' }, { status: 500 });
  }
}
