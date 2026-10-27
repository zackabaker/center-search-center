import type { Metadata } from 'next';
import MineClient from './MineClient';

// Owner device flag. Visiting this page lets the owner mark a browser as his
// own: the flag (localStorage csc-mine) rides along on search-log, view, and
// conversion events so his usage can be separated from readers' in the
// counters. Unlinked and noindexed; harmless if anyone else finds it — it
// only tags, never grants anything.
export const metadata: Metadata = {
  title: 'Owner device',
  robots: { index: false, follow: false },
};

export default function MinePage() {
  return <MineClient />;
}
