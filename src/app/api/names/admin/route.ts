import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import type { NameEntry } from '../submit/route';

function getKV() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('KV not configured');
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function checkAuth(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const key = req.nextUrl.searchParams.get('key') || req.headers.get('x-admin-key');
  return key === secret;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const kv = getKV();
  const pending: NameEntry[] = (await kv.get('names:pending')) || [];
  const approved: NameEntry[] = (await kv.get('names:approved')) || [];
  return Response.json({ pending, approved });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { action, id } = await req.json();
  if (!action || !id) {
    return Response.json({ error: 'action and id required' }, { status: 400 });
  }

  const kv = getKV();
  const pending: NameEntry[] = (await kv.get('names:pending')) || [];
  const entry = pending.find((e) => e.id === id);

  if (!entry) {
    return Response.json({ error: 'Entry not found' }, { status: 404 });
  }

  const newPending = pending.filter((e) => e.id !== id);
  await kv.set('names:pending', newPending);

  if (action === 'approve') {
    const approved: NameEntry[] = (await kv.get('names:approved')) || [];
    approved.push(entry);
    await kv.set('names:approved', approved);
    return Response.json({ success: true, action: 'approved' });
  }

  return Response.json({ success: true, action: 'rejected' });
}
