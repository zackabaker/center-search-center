import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';

export interface NameEntry {
  id: string;
  name: string;
  location?: string;
  note?: string;
  submittedAt: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, location, note } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return Response.json({ error: 'Name is required.' }, { status: 400 });
    }
    if (name.trim().length > 80) {
      return Response.json({ error: 'Name is too long.' }, { status: 400 });
    }
    if (location && location.length > 100) {
      return Response.json({ error: 'Location is too long.' }, { status: 400 });
    }
    if (note && note.length > 300) {
      return Response.json({ error: 'Note is too long.' }, { status: 400 });
    }

    const entry: NameEntry = {
      id: crypto.randomUUID(),
      name: name.trim(),
      location: location?.trim() || undefined,
      note: note?.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    const pending: NameEntry[] = (await kv.get('names:pending')) || [];
    pending.push(entry);
    await kv.set('names:pending', pending);

    return Response.json({ success: true });
  } catch (err) {
    console.error('Names submit error:', err);
    return Response.json({ error: 'Failed to submit.' }, { status: 500 });
  }
}
