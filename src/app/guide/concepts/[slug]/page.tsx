import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptBySlug } from '@/data/guide/concepts';
import GoBack from '@/components/GoBack';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  const firstPassage = concept.passages[0]?.text;
  return {
    title: `${concept.title} — Center Study Concepts`,
    description: firstPassage ? `"${firstPassage.slice(0, 160)}…"` : concept.subtitle,
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  const relatedConcepts = concept.relations
    .map((s) => CONCEPTS.find((c) => c.slug === s))
    .filter(Boolean);

  const askQuery = encodeURIComponent(`What is ${concept.title} in Center Study?`);
  const askHref = `/ask?q=${askQuery}&concept=${concept.slug}`;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <GoBack label="← Back" />
        <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-4 mb-1">
          Concept
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 text-gray-900 dark:text-white">
          {concept.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm italic mb-4">{concept.subtitle}</p>

        {/* Ask AI shortcut */}
        <Link
          href={askHref}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Ask AI about {concept.title}
        </Link>
      </div>

      {/* AI overview — clearly labelled */}
      {concept.body && (
        <section className="mb-10 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-mono text-amber-700 dark:text-amber-500 uppercase tracking-widest">
              AI Overview
            </h2>
            <span className="text-[10px] text-amber-600/70 dark:text-amber-600/50 italic">
              — AI-generated synthesis. Verify claims against the archive passages and linked texts below.
            </span>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
            {concept.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: para
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Passages — primary content, from the archive */}
      {concept.passages.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
            From the Archive
          </h2>
          <div className="space-y-6">
            {concept.passages.map((p, i) => (
              <blockquote key={i} className="border-l-2 border-gray-300 dark:border-gray-600 pl-5 py-0.5">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-3 text-[15px]">
                  &ldquo;{p.text}&rdquo;
                </p>
                <footer className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <Link
                    href={`/post/${p.sourceSlug}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {p.source}
                  </Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Archive posts */}
      {concept.posts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Key Texts</h2>
          <div className="space-y-3">
            {concept.posts.map((post) => (
              <div key={post.slug} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 mt-2" />
                <div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {post.title}
                  </Link>
                  {post.note && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed italic">{post.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related concepts */}
      {relatedConcepts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((c) => (
              <Link
                key={c!.slug}
                href={`/guide/concepts/${c!.slug}`}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                {c!.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center justify-between text-sm">
        <GoBack label="← Back" />
        <Link href={askHref} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">Ask AI →</Link>
      </div>
    </main>
  );
}
