import { getUser } from '@/lib/auth';
import { clientIp, isSameOrigin, rateLimit } from '@/lib/rate-limit';
import { addFeedback, getProfile, storeAvailable } from '@/lib/user-store';

export const dynamic = 'force-dynamic';

// POST /api/feedback { text, page } — a note from a reader to the site's
// owner. Stored for /study; nothing identifying is kept beyond the username
// of a signed-in sender.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!storeAvailable()) return Response.json({ error: 'Feedback is not available right now.' }, { status: 503 });
  if (!rateLimit(`feedback:${clientIp(request)}`, 5, 10 * 60_000).ok) {
    return Response.json({ error: 'Too many messages — try again in a few minutes.' }, { status: 429 });
  }
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const text = typeof b.text === 'string' ? b.text.trim().slice(0, 2000) : '';
  if (text.length < 3) return Response.json({ error: 'Write a few words first.' }, { status: 400 });
  const page = typeof b.page === 'string' && b.page.startsWith('/') ? b.page.slice(0, 200) : '/';
  const user = getUser(request);
  const username = user ? (await getProfile(user.sub)).username : null;
  await addFeedback({ text, page, at: new Date().toISOString(), username });
  return Response.json({ ok: true });
}
