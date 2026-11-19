import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Markdown from '../../Markdown';
import { getKept } from '@/lib/tutor/kept';

// A kept tutor answer on a page of its own: the question, the answer with its
// quotations and paragraph links, and the passages it drew on. Open to anyone
// (no account needed to read it), marked as AI-written, and kept out of
// search engines.

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const kept = await getKept((await params).id);
  return {
    title: kept ? kept.q : 'The Tutor',
    description: 'An answer from the Center Study tutor, an AI working from the archive.',
    robots: { index: false, follow: true },
  };
}

export default async function KeptAnswerPage({ params }: Props) {
  const { id } = await params;
  const kept = await getKept(id);
  // Nothing kept under this id (yet): the tutor's own page has the questions.
  if (!kept) redirect('/oracle');

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-8 pb-24 sm:pt-12">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <Link href="/oracle" className="hover:underline">The Center Study tutor</Link> · a saved answer
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{kept.q}</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Written by an AI tutor working from Adam Katz’s texts, and kept because it was a good answer. It is not Katz, and it can be wrong: every quotation links to the paragraph it comes from, so you can check.
      </p>
      <div className="mt-6">
        <Markdown text={kept.a} />
      </div>
      <p className="mt-8">
        <Link href={`/oracle?from=${kept.id}`} className="inline-block rounded bg-gray-900 px-3 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-900">
          Ask a follow-up
        </Link>
      </p>
      {kept.sources.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Sources · {kept.sources.length} passages retrieved
          </summary>
          <ol className="mt-2 space-y-2 text-sm">
            {kept.sources.map((s) => (
              <li key={s.url}>
                <Link href={s.url} className="font-medium text-gray-900 hover:underline dark:text-gray-100">{s.title}</Link>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{s.snippet}…</span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </main>
  );
}
