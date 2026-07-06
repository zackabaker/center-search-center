import Link from 'next/link';
import ANSWERS from '@/data/answers.json';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Questions, answered from the archive',
  description:
    'The canonical Center Study questions — what the originary hypothesis is, how Center Study differs from Girard and Generative Anthropology, what the center means — answered with verbatim citations from the corpus.',
  alternates: { canonical: 'https://center.study/answers' },
};

type Answer = { question: string; answer: string; generatedAt: string };
const DATA = ANSWERS as Record<string, Answer>;

export default function AnswersIndexPage() {
  const entries = Object.entries(DATA);
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
        Questions, answered from the archive
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-10">
        The questions people actually arrive with, answered in the corpus&rsquo;s own words —
        every quote verbatim and linked to its source. For anything not covered here,{' '}
        <Link href="/ask" className="text-blue-600 dark:text-blue-400 hover:underline">ask the archive directly</Link>.
      </p>
      <div className="space-y-2">
        {entries.map(([slug, a]) => (
          <Link
            key={slug}
            href={`/ask/${slug}`}
            className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
          >
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {a.question}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
