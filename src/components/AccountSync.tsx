'use client';

import { useEffect } from 'react';
import { fetchAccount, signedInHint } from '@/lib/account-client';
import { IDIOMS_EVENT, loadIdioms, storeIdioms, type Idiom } from '@/lib/idioms';

const OWNER_KEY = 'csc-idioms-owner';

// Keeps a signed-in reader's idiom archive the same on every device.
//
//  - First load after signing in on this device: whatever was saved here while
//    signed out is MERGED into the account, so nothing is lost by signing in.
//  - Every later load: the account's copy replaces the local one (so an idiom
//    removed on another device stays removed).
//  - Any local change while signed in is written to the account.
//
// Renders nothing, and does nothing at all for a signed-out reader.
export default function AccountSync() {
  useEffect(() => {
    if (!signedInHint()) {
      try { localStorage.removeItem(OWNER_KEY); } catch {}
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ready = false;

    const push = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fetch('/api/me/idioms', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ idioms: loadIdioms() }),
        }).catch(() => {});
      }, 600);
    };
    const onChange = () => { if (ready) push(); };
    window.addEventListener(IDIOMS_EVENT, onChange);

    (async () => {
      const { user } = await fetchAccount();
      if (!user || cancelled) return;
      const res = await fetch('/api/me/idioms').catch(() => null);
      if (!res || !res.ok || cancelled) return;
      const server = ((await res.json()).idioms ?? []) as Idiom[];
      let owner: string | null = null;
      try { owner = localStorage.getItem(OWNER_KEY); } catch {}

      if (owner !== user.id) {
        const local = loadIdioms();
        const ids = new Set(server.map((x) => x.id));
        const merged = [...local.filter((x) => !ids.has(x.id)), ...server]
          .sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
        storeIdioms(merged, true);
        try { localStorage.setItem(OWNER_KEY, user.id); } catch {}
        ready = true;
        if (merged.length !== server.length) push();
      } else {
        storeIdioms(server, true);
        ready = true;
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener(IDIOMS_EVENT, onChange);
    };
  }, []);

  return null;
}
