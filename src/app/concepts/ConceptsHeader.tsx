import Link from 'next/link';
import BackToReading from '@/components/BackToReading';
import { GLOSSARY } from '@/data/guide/glossary';

// Shared header + tab bar for /concepts (core) and /concepts/glossary.
// Two static routes instead of one ?view= page: reading searchParams on the
// server opted the whole route into per-request rendering (CDN MISS + ~1 MB
// HTML on every glossary hit).
export default function ConceptsHeader({ active }: { active: 'core' | 'glossary' }) {
  const tab = (isActive: boolean) =>
    `px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap shrink-0 transition-colors -mb-px ${
      isActive
        ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
        : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

  return (
    <>
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ← Home
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-1 text-gray-900 dark:text-white">Concepts &amp; Glossary</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          The vocabulary of Center Study — core concepts treated in depth, and a glossary
          of {GLOSSARY.length} working terms with usage drawn from the corpus.
        </p>
      </div>

      {/* Shown when the reader arrived from a post via a term link */}
      <BackToReading />

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
        <Link href="/concepts" className={tab(active === 'core')}>
          Core Concepts
        </Link>
        <Link href="/concepts/glossary" className={tab(active === 'glossary')}>
          Glossary
        </Link>
      </div>
    </>
  );
}
