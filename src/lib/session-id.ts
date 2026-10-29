// Ephemeral, anonymous session id — the smallest identity that lets the
// activity log string one visit's events together. A random 8-char token in
// sessionStorage: it lives for one browser tab's session and is never written
// to a cookie or localStorage, so there is no cross-day identity, nothing to
// fingerprint, and nothing that survives closing the tab. '' when storage is
// unavailable (private mode etc.) — callers just log without an id.
const SID_KEY = 'csc-sid';

export function getSid(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = sessionStorage.getItem(SID_KEY);
    if (!sid) {
      sid = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
      sessionStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return '';
  }
}
