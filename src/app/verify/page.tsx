import type { Metadata } from 'next';
import VerifyClient from './VerifyClient';

export const metadata: Metadata = {
  title: 'Verify a Quote — Center Study Center',
  description:
    'Check whether Adam Katz / Dennis Bouvard or Eric Gans actually wrote a quote. Verbatim verification against the full corpus, with source attribution.',
  alternates: { canonical: 'https://center.study/verify' },
};

export default function VerifyPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-8 sm:py-14">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-3">
        Verify a quote
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-8">
        Paste a quote attributed to Adam Katz, Dennis Bouvard, or Eric Gans — it is checked
        verbatim against every text in the corpus and answered with the source.
      </p>
      <VerifyClient />
    </main>
  );
}
