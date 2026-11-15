import { clearSessionCookies, getUser } from '@/lib/auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { deleteAccountData } from '@/lib/user-store';

// DELETE /api/me/account — erase everything stored for this account (idioms,
// reading history, queries) and sign out. There is no separate account record
// to remove: the account exists only as that data plus the session cookie.
export async function DELETE(request: Request) {
  const user = getUser(request);
  if (!user) return Response.json({ error: 'Not signed in' }, { status: 401 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  await deleteAccountData(user.sub);
  const headers = new Headers({ 'content-type': 'application/json' });
  for (const c of clearSessionCookies(request)) headers.append('Set-Cookie', c);
  return new Response(JSON.stringify({ ok: true }), { headers });
}
