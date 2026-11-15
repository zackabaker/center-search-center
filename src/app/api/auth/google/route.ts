import { authConfigured, googleClientId, cookie, publicOrigin, randomState, safeNext, signToken, STATE_COOKIE } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// GET /api/auth/google?next=/idioms → redirect to Google's consent screen.
// A random state value is kept in a short-lived signed cookie and echoed back
// by Google; the callback refuses any response whose state does not match,
// which is what stops a forged sign-in from being planted in a reader's browser.
export function GET(request: Request) {
  if (!authConfigured()) return Response.json({ error: 'Sign-in is not configured' }, { status: 503 });
  if (!rateLimit(`auth:${clientIp(request)}`, 20, 60_000).ok) {
    return Response.json({ error: 'Too many attempts' }, { status: 429 });
  }
  const url = new URL(request.url);
  const state = randomState();
  const next = safeNext(url.searchParams.get('next'));
  const stateCookie = signToken({ state, next, exp: Math.floor(Date.now() / 1000) + 600 });

  const google = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  google.searchParams.set('client_id', googleClientId());
  google.searchParams.set('redirect_uri', `${publicOrigin(request)}/api/auth/callback`);
  google.searchParams.set('response_type', 'code');
  google.searchParams.set('scope', 'openid email profile');
  google.searchParams.set('state', state);
  google.searchParams.set('prompt', 'select_account');

  return new Response(null, {
    status: 302,
    headers: { Location: google.toString(), 'Set-Cookie': cookie(request, STATE_COOKIE, stateCookie, 600) },
  });
}
