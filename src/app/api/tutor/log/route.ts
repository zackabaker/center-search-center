import { isOwner } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';

// The tutor's log, newest first: what was asked, what it answered, which
// passages it was given, what it cost. Owner only.
// GET ?n=50 → { entries }

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  const kv = getKV();
  if (!kv) return Response.json({ entries: [] });
  const n = Math.min(500, Math.max(1, Number(new URL(request.url).searchParams.get('n')) || 50));
  const raw = await kv.lrange<unknown>('tutor:log', 0, n - 1).catch(() => []);
  return Response.json({ entries: raw.map((r) => (typeof r === 'string' ? JSON.parse(r) : r)) });
}
