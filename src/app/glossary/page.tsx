import type { Metadata } from 'next';
import Link from 'next/link';
import GlossaryClient from '@/components/GlossaryClient';
import { GLOSSARY } from '@/data/guide/glossary';

export const metadata: Metadata = {
  title: 'Glossary — Center Study Center',
  description:
    'Definitions of 200+ terms of Center Study and Generative Anthropology — attentionality, deferral, the center, originary scene, and more — each linked to the archive texts where the concept is developed.',
};

export default function GlossaryPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          Glossary
        </h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-3">
          {GLOSSARY.length} terms of Center Study and Generative Anthropology, each
          linked to the archive texts where the concept is developed. For the deeper
          treatments, see the{' '}
          <Link href="/concepts" className="text-blue-600 dark:text-blue-400 hover:underline">
            key concepts
          </Link>{' '}
          pages, or{' '}
          <Link href="/ask" className="text-blue-600 dark:text-blue-400 hover:underline">
            ask AI
          </Link>{' '}
          about any term.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Term list adapted from{' '}
          <a
            href="https://theglossary.home.blog/generative-anthropology/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            The Glossary
          </a>
          , a community Generative Anthropology reference.
        </p>
      </div>

      <GlossaryClient entries={GLOSSARY} />
    </main>
  );
}
