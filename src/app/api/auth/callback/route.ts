import {
  authConfigured, cookie, publicOrigin, readCookie, safeNext, sessionCookies, verifyToken, STATE_COOKIE,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/callback?code=…&state=… — Google sends the reader back here.
// Exchange the one-time code for an ID token (server to server, with the client
// secret), take the account's id / email / name from it, and start a session.
export async function GET(request: Request) {
  const origin = publicOrigin(request);
  const fail = (why: string) => {
    const headers = new Headers({ Location: `${origin}/idioms?signin=${why}` });
    headers.append('Set-Cookie', cookie(request, STATE_COOKIE, '', 0));
    return new Response(null, { status: 302, headers });
  };
  if (!authConfigured()) return fail('unavailable');

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const saved = verifyToken<{ state: string; next: string; exp: number }>(readCookie(request, STATE_COOKIE));
  if (!code || !state || !saved || saved.state !== state) return fail('failed');

  let claims: Record<string, unknown>;
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${origin}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });
    if (!res.ok) return fail('failed');
    const { id_token } = (await res.json()) as { id_token?: string };
    if (!id_token) return fail('failed');
    // The token came straight from Google over TLS in exchange for our client
    // secret, so its signature need not be re-verified; the claims are still
    // checked so a token minted for another app or issuer is never accepted.
    claims = JSON.parse(Buffer.from(id_token.split('.')[1], 'base64url').toString('utf-8'));
  } catch {
    return fail('failed');
  }

  const iss = claims.iss;
  if (
    claims.aud !== process.env.GOOGLE_CLIENT_ID ||
    (iss !== 'https://accounts.google.com' && iss !== 'accounts.google.com') ||
    typeof claims.exp !== 'number' || claims.exp < Date.now() / 1000 ||
    typeof claims.sub !== 'string' || !claims.sub ||
    typeof claims.email !== 'string' || claims.email_verified === false
  ) {
    return fail('failed');
  }

  const headers = new Headers({ Location: `${origin}${safeNext(saved.next)}` });
  for (const c of sessionCookies(request, {
    sub: claims.sub,
    email: claims.email,
    name: typeof claims.name === 'string' ? claims.name : claims.email,
    picture: typeof claims.picture === 'string' ? claims.picture : undefined,
  })) headers.append('Set-Cookie', c);
  headers.append('Set-Cookie', cookie(request, STATE_COOKIE, '', 0));
  return new Response(null, { status: 302, headers });
}
