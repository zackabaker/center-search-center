import { isOwner } from '@/lib/analytics-auth';
import { getKV } from '@/lib/kv';

// Owner-only raw readout of the newer analytics day-hashes, for checking that
// a capture change is actually writing (the console only shows these once
// there is enough data to say something). Same gate as the other raw GETs:
// everyone else gets the console's 404.
//
// GET ?k=crawler|depth|fof|activity&day=YYYY-MM-DD (default: today, UTC)
//   activity returns only the per-text read, device, language and event
//   fields — the full hash is large and the console already renders the rest.

const KEYS: Record<string, (day: string) => string> = {
  crawler: (day) => `crawler:day:${day}`,
  depth: (day) => `depth:${day}`,
  fof: (day) => `fof:${day}`,
  activity: (day) => `activity:day:${day}`,
};

export async function GET(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  const url = new URL(request.url);
  const k = url.searchParams.get('k') ?? '';
  const dayParam = url.searchParams.get('day') ?? '';
  const day = /^\d{4}-\d{2}-\d{2}$/.test(dayParam) ? dayParam : new Date().toISOString().slice(0, 10);
  const key = KEYS[k]?.(day);
  const kv = getKV();
  if (!key || !kv) return Response.json({ key: key ?? null, fields: {} });

  try {
    let fields = ((await kv.hgetall(key)) ?? {}) as Record<string, unknown>;
    if (k === 'activity') {
      fields = Object.fromEntries(
        Object.entries(fields).filter(([f]) => /^(r:|rm:|pm:|dev:|lang:|ev:)/.test(f)),
      );
    }
    return Response.json({ key, fields }, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch {
    return Response.json({ key, fields: {} });
  }
}
