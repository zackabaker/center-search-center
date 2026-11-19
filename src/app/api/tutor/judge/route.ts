import { isOwner } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';
import { isSameOrigin } from '@/lib/rate-limit';

// The owner's verdicts in the blind comparison at /analytics/tutor/judge.
// GET → { votes: { [questionId]: { best, worst } } }   POST { id, best?, worst? } → { ok }
// best / worst are setup names; the page only ever shows them as letters.

export const dynamic = 'force-dynamic';
const KEY = 'tutor:judge';

export async function GET(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  const kv = getKV();
  const raw = kv ? ((await kv.hgetall(KEY).catch(() => null)) ?? {}) : {};
  const votes: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) votes[k] = typeof v === 'string' ? JSON.parse(v) : v;
  return Response.json({ votes });
}

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const kv = getKV();
  if (!kv) return Response.json({ error: 'Nowhere to save it.' }, { status: 503 });
  let b: { id?: unknown; best?: unknown; worst?: unknown };
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (typeof b.id !== 'string' || !/^[a-z0-9-]{1,20}$/.test(b.id)) return Response.json({ error: 'Needs an id.' }, { status: 400 });
  const name = (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]{1,40}$/.test(v) ? v : null);
  await kv.hset(KEY, { [b.id]: JSON.stringify({ best: name(b.best), worst: name(b.worst) }) });
  return Response.json({ ok: true });
}
