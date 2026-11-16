// Browser-side account helpers. Everything here is a no-op for a signed-out
// reader: the hint cookie is checked first, so anonymous visitors never make an
// account request and nothing about them is sent anywhere.
//
// Client-only.

export interface Account {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  /** Public handle (random until the reader picks one). */
  username: string | null;
  hasAvatar: boolean;
}

export interface AccountState {
  /** Sign-in is set up on this deployment. */
  configured: boolean;
  user: Account | null;
}

export function signedInHint(): boolean {
  return typeof document !== 'undefined' && /(?:^|;\s*)csc-signed-in=1/.test(document.cookie);
}

let pending: Promise<AccountState> | null = null;

/** Who is signed in. Cached for the page's lifetime; pass fresh to refetch. */
export function fetchAccount(fresh = false): Promise<AccountState> {
  if (!pending || fresh) {
    pending = fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { configured: false, user: null }))
      .catch(() => ({ configured: false, user: null }));
  }
  return pending;
}

type AccountEvent =
  | { type: 'read'; slug: string; title: string }
  | { type: 'query'; q: string; kind: 'ask' | 'search' }
  | { type: 'time' };

/** Add to the signed-in reader's history. Does nothing when signed out. */
export function logAccountEvent(event: AccountEvent): void {
  if (!signedInHint()) return;
  fetch('/api/me/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => { /* best-effort */ });
}

export function signInUrl(next?: string): string {
  const here = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/idioms';
  return `/api/auth/google?next=${encodeURIComponent(next ?? here)}`;
}
