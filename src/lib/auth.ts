// Accounts — Google sign-in with a signed, stateless session cookie.
//
// Deliberately dependency-free: the OAuth authorization-code flow is three
// HTTP hops, and the session is an HMAC-signed JSON payload. Nothing here runs
// unless all three env vars are set, so the site behaves exactly as before on
// a deployment without them:
//
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET — from a Google Cloud OAuth client
//     (authorized redirect URI: https://center.study/api/auth/callback)
//   AUTH_SECRET — any long random string; signs the session cookie
//
// Server-only. Never import from a client component.

import crypto from 'crypto';

export interface SessionUser {
  /** Google's stable account id — the key all stored data hangs off. */
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export const SESSION_COOKIE = 'csc-session';
/** Readable by page scripts: lets the client skip /api/auth/me when signed out. */
export const HINT_COOKIE = 'csc-signed-in';
export const STATE_COOKIE = 'csc-oauth-state';
const SESSION_DAYS = 90;

export function authConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.AUTH_SECRET);
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

function hmac(data: string): string {
  return crypto.createHmac('sha256', process.env.AUTH_SECRET || '').update(data).digest('base64url');
}

/** payload.signature — tamper-evident, not encrypted (holds nothing secret). */
export function signToken(payload: object): string {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${hmac(body)}`;
}

export function verifyToken<T>(token: string | null | undefined): T | null {
  if (!token || !process.env.AUTH_SECRET) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  const sig = Buffer.from(token.slice(dot + 1));
  const expected = Buffer.from(hmac(body));
  if (sig.length !== expected.length || !crypto.timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as T & { exp?: number };
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

/** The signed-in user for this request, or null. */
export function getUser(request: Request): SessionUser | null {
  if (!authConfigured()) return null;
  const p = verifyToken<SessionUser & { exp: number }>(readCookie(request, SESSION_COOKIE));
  if (!p || typeof p.sub !== 'string' || !p.sub) return null;
  return { sub: p.sub, email: p.email, name: p.name, picture: p.picture };
}

function secureFlag(request: Request): string {
  // Secure everywhere except plain-http local development.
  return new URL(request.url).protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https'
    ? '; Secure'
    : '';
}

export function cookie(request: Request, name: string, value: string, maxAgeSec: number, httpOnly = true): string {
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSec}; SameSite=Lax${httpOnly ? '; HttpOnly' : ''}${secureFlag(request)}`;
}

export function sessionCookies(request: Request, user: SessionUser): string[] {
  const maxAge = SESSION_DAYS * 86400;
  const token = signToken({ ...user, exp: Math.floor(Date.now() / 1000) + maxAge });
  return [cookie(request, SESSION_COOKIE, token, maxAge), cookie(request, HINT_COOKIE, '1', maxAge, false)];
}

export function clearSessionCookies(request: Request): string[] {
  return [cookie(request, SESSION_COOKIE, '', 0), cookie(request, HINT_COOKIE, '', 0, false)];
}

/** Only same-site relative paths may be used as a post-sign-in destination. */
export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/idioms';
}

/** The public origin sign-in should return to (proxy-aware). */
export function publicOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || url.host;
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  return `${proto}://${host}`;
}

export function randomState(): string {
  return crypto.randomBytes(24).toString('base64url');
}
