// The reader's idiom archive — passages they chose to keep.
//
// Lives in this browser's localStorage, so it works with no account. When the
// reader is signed in, AccountSync mirrors it to their account (see
// src/components/AccountSync.tsx); this module knows nothing about accounts.
//
// Client-only.

export interface Idiom {
  id: string;
  text: string;
  slug: string;
  title: string;
  source: string;
  /** Stable #p-N paragraph anchor in the post, when known. */
  anchor: string | null;
  savedAt: string;
}

const KEY = 'csc-idioms';
/** Fired on window whenever the archive changes (this tab). */
export const IDIOMS_EVENT = 'csc-idioms-changed';
const MAX = 1000;

function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** Same passage from the same post always gets the same id, so saving twice is a no-op. */
export function idiomId(slug: string, text: string): string {
  return `${hash(slug)}-${hash(text.replace(/\s+/g, ' ').trim().toLowerCase())}`;
}

export function loadIdioms(): Idiom[] {
  if (typeof window === 'undefined') return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Replace the whole archive. `silent` skips the change event (used when applying the account's copy). */
export function storeIdioms(list: Idiom[], silent = false): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch { /* storage full or blocked — nothing to do */ }
  if (!silent) window.dispatchEvent(new Event(IDIOMS_EVENT));
  else window.dispatchEvent(new Event(`${IDIOMS_EVENT}-applied`));
}

export function saveIdiom(input: Omit<Idiom, 'id' | 'savedAt'>): Idiom {
  const text = input.text.replace(/^…\s*/, '').replace(/\s*…$/, '').replace(/\s+/g, ' ').trim().slice(0, 2000);
  const id = idiomId(input.slug, text);
  const list = loadIdioms();
  const existing = list.find((x) => x.id === id);
  if (existing) return existing;
  const idiom: Idiom = { ...input, text, id, savedAt: new Date().toISOString() };
  storeIdioms([idiom, ...list]);
  return idiom;
}

export function removeIdiom(id: string): void {
  storeIdioms(loadIdioms().filter((x) => x.id !== id));
}

export function isSaved(slug: string, text: string): boolean {
  const clean = text.replace(/^…\s*/, '').replace(/\s*…$/, '').replace(/\s+/g, ' ').trim().slice(0, 2000);
  const id = idiomId(slug, clean);
  return loadIdioms().some((x) => x.id === id);
}

/** Link that opens the post at its top with the passage lightly highlighted. */
export function passageHref(slug: string, anchor: string | null, text: string): string {
  if (anchor) return `/post/${slug}?hl=${anchor}`;
  const lead = text.replace(/^…\s*/, '').split(/\s+/).slice(0, 8).join(' ');
  return `/post/${slug}?q=${encodeURIComponent(lead)}`;
}

/** Hand the exact passage to the post page, so it can mark just those words
    inside a very long paragraph. Call on click, before navigating. */
export function rememberPassage(slug: string, text: string): void {
  try {
    sessionStorage.setItem('csc-hl', JSON.stringify({ slug, text: text.replace(/^…\s*/, '').replace(/\s*…$/, '') }));
  } catch { /* fine — the paragraph-level tint still applies */ }
}
