import { clearSessionCookies } from '@/lib/auth';
import { isSameOrigin } from '@/lib/rate-limit';

// POST /api/auth/logout — end the session on this device. Stored data stays.
export function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const headers = new Headers({ 'content-type': 'application/json' });
  for (const c of clearSessionCookies(request)) headers.append('Set-Cookie', c);
  return new Response(JSON.stringify({ ok: true }), { headers });
}
