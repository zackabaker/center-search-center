import { kv } from '@vercel/kv';
import { NextRequest } from 'next/server';
import type { NameEntry } from '../submit/route';

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const key = req.nextUrl.searchParams.get('key') || req.headers.get('x-admin-key');
  return key === secret;
}

// GET — list pending submissions
export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pending: NameEntry[] = (await kv.get('names:pending')) || [];
  const approved: NameEntry[] = (await kv.get('names:approved')) || [];

  return Response.json({ pending, approved });
}

// POST — approve or reject a pending submission
export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, id } = await req.json();

  if (!action || !id) {
    return Response.json({ error: 'action and id required' }, { status: 400 });
  }

  const pending: NameEntry[] = (await kv.get('names:pending')) || [];
  const entry = pending.find((e) => e.id === id);

  if (!entry) {
    return Response.json({ error: 'Entry not found' }, { status: 404 });
  }

  const newPending = pending.filter((e) => e.id !== id);
  await kv.set('names:pending', newPending);

  if (action === 'approve') {
    const approved: NameEntry[] = (await kv.get('names:approved')) || [];
    approved.push({ ...entry, submittedAt: entry.submittedAt });
    await kv.set('names:approved', approved);
    return Response.json({ success: true, action: 'approved' });
  }

  return Response.json({ success: true, action: 'rejected' });
}
