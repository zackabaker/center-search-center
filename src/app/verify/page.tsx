import type { Metadata } from 'next';
import VerifyClient from './VerifyClient';

export const metadata: Metadata = {
  title: 'Verify a Quote — Center Study Center',
  description:
    'Check whether Adam Katz / Dennis Bouvard or Eric Gans actually wrote a quote. Verbatim verification against the full 1,900-text corpus, with source attribution.',
  alternates: { canonical: 'https://center.study/verify' },
};

export default function VerifyPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-8 sm:py-14">
      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
        The authority function
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-3">
        Verify a quote
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
        Paste a quote attributed to Adam Katz, Dennis Bouvard, or Eric Gans. It is checked
        verbatim against the full corpus — every text, all the way through — and answered with
        the source. Elided quotes (&ldquo;…&rdquo;) verify segment by segment. Also available as an{' '}
        <a href="/developers" className="text-blue-600 dark:text-blue-400 hover:underline">
          open API
        </a>{' '}
        for AI agents and other sites.
      </p>
      <VerifyClient />
    </main>
  );
}
