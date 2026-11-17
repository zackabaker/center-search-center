import { headers } from 'next/headers';
import { getKV } from '@/lib/kv';
import { rememberOwnerNetwork } from '@/lib/owner-mark';
import { fetchStudyData, type StudyData } from './data';

/**
 * Every room starts here. Whoever is reading a console page is the owner (the
 * proxy gate saw to that), so remember this network — the ingest routes use
 * it to mark searches and activity from it as "mine" and keep them out of
 * the readers' view, whichever browser or device they come from. Then the
 * shared dataset (cached for half a minute across rooms).
 */
export async function loadConsole(): Promise<StudyData | null> {
  try {
    const kv = getKV();
    if (kv) await rememberOwnerNetwork(kv, await headers());
  } catch {
    /* never block the console on this */
  }
  return fetchStudyData();
}
