// Chart annotations for /analytics: dated notes the owner pins to the trend
// lines ("posted the thread on X", "Avalon talk") so cause and effect can be
// read off the charts. One small hash; owner-only on both sides.
import { getKV } from './kv';

export type ChartNote = { id: string; day: string; label: string };

const KEY = 'notes:events';
const MAX = 200;

export async function listNotes(): Promise<ChartNote[]> {
  const kv = getKV();
  if (!kv) return [];
  try {
    const h = ((await kv.hgetall(KEY)) ?? {}) as Record<string, unknown>;
    const out: ChartNote[] = [];
    for (const [id, raw] of Object.entries(h)) {
      let v: unknown = raw;
      if (typeof raw === 'string') {
        try { v = JSON.parse(raw); } catch { continue; }
      }
      const o = v as { day?: unknown; label?: unknown } | null;
      if (o && typeof o.day === 'string' && typeof o.label === 'string') {
        out.push({ id, day: o.day, label: o.label });
      }
    }
    return out.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
  } catch {
    return [];
  }
}

/** Returns the saved note, or the reason it was refused. */
export async function addNote(day: string, label: string): Promise<ChartNote | string> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(`${day}T00:00:00Z`))) return 'Pick a date.';
  const text = label.replace(/\s+/g, ' ').trim().slice(0, 80);
  if (text.length < 2) return 'Say what happened.';
  const kv = getKV();
  if (!kv) return 'The data store is not reachable.';
  if ((await kv.hlen(KEY)) >= MAX) return 'Too many notes — remove one first.';
  const id = `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  await kv.hset(KEY, { [id]: JSON.stringify({ day, label: text }) });
  return { id, day, label: text };
}

export async function removeNote(id: string): Promise<void> {
  const kv = getKV();
  if (!kv || !/^n[a-z0-9]{6,20}$/.test(id)) return;
  await kv.hdel(KEY, id);
}
