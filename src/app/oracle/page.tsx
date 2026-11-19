import type { Metadata } from 'next';
import OracleClient from './OracleClient';

// /oracle — the Center Study tutor. Unlisted while it is being tested: no nav
// entry, no sitemap entry, noindex. Signed-in readers only (the API enforces it).

export const metadata: Metadata = {
  title: 'The Tutor',
  description: 'An AI tutor for Center Study, working from the archive.',
  robots: { index: false, follow: false },
};

export default function OraclePage() {
  return <OracleClient />;
}
