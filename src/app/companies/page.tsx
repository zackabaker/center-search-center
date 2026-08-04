import type { Metadata } from 'next';
import Link from 'next/link';
import EXCERPTS from '@/data/companies-excerpts.json';
import CompaniesClient, { CompanyExcerpt } from '@/components/CompaniesClient';
import SceneMark from '@/components/SceneMark';

export const metadata: Metadata = {
  title: 'On Companies',
  description:
    'Every passage in the archive where Adam Katz discusses companies — starting them, joining them, their discipline and their place in the order: startups, insurance, data security, prediction markets, monopolies.',
  alternates: { canonical: 'https://center.study/companies' },
};

// Every excerpt below is a verbatim paragraph from the corpus, extracted by
// stable paragraph anchor — nothing is retyped or paraphrased. Ranking and
// grouping are editorial; the sentences are Katz's.
export default function CompaniesPage() {
  const excerpts = EXCERPTS as CompanyExcerpt[];

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
      <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        ← Home
      </Link>

      <header className="mt-6 mb-8">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Reading the archive
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          On Companies
        </h1>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mt-4 max-w-2xl">
          Every passage where Adam Katz talks about companies — starting them, joining
          them, their discipline and their place in the order: startups, insurance,
          data security, prediction markets, monopolies, profit. {excerpts.length.toLocaleString()}{' '}
          verbatim paragraphs from {new Set(excerpts.map((e) => e.slug)).size.toLocaleString()} texts,
          ranked by how directly they bear on the creation of companies. Every passage
          links to its exact place in the source text.
        </p>
      </header>

      <div className="flex items-center gap-3 mb-8">
        <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
      </div>

      <CompaniesClient excerpts={excerpts} />
    </main>
  );
}
