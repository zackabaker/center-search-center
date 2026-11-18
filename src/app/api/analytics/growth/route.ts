import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { recordPoint, keyFromLabel } from '@/lib/growth';

// The owner's manual entries for /analytics/growth — anything this site has
// no API for (Substack subscribers, a number read off another analytics
// tool). Owner-only, same gate as the console; everyone else gets its 404.
//
// POST { label, unit?, day, value, key? } -> { ok, key }
//   `key` identifies an existing series to add to; without it, one is made
//   from `label` (so retyping the same label keeps adding to it).

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let body: { label?: unknown; unit?: unknown; day?: unknown; value?: unknown; key?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  const label = typeof body.label === 'string' ? body.label.trim().slice(0, 80) : '';
  const day = typeof body.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.day) ? body.day : '';
  const value = Number(body.value);
  if (!label || !day || !Number.isFinite(value)) {
    return Response.json({ ok: false, error: 'Needs a name, a date, and a number.' }, { status: 400 });
  }
  const key = typeof body.key === 'string' && body.key ? body.key : keyFromLabel(label);
  const unit = typeof body.unit === 'string' && body.unit ? body.unit.slice(0, 20) : 'count';
  try {
    await recordPoint(key, label, unit, false, day, Math.round(value));
    return Response.json({ ok: true, key });
  } catch {
    return Response.json({ ok: false, error: 'Could not save that.' }, { status: 500 });
  }
}
