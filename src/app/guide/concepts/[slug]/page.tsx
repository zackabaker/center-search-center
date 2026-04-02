import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptBySlug } from '@/data/guide/concepts';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: `${concept.title} — Center Study Concepts`,
    description: concept.definition,
  };
}

function renderBody(text: string, currentSlug: string) {
  // Split on **bold** and render headings/paragraphs
  const paragraphs = text.trim().split('\n\n');
  return paragraphs.map((para, i) => {
    if (para.startsWith('**') && para.endsWith('**') && !para.slice(2).includes('**')) {
      return <h3 key={i} className="font-semibold text-gray-900 mt-6 mb-2">{para.slice(2, -2)}</h3>;
    }
    // Inline bold
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-gray-700 leading-relaxed mb-4">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  const relatedConcepts = concept.relations
    .map((s) => CONCEPTS.find((c) => c.slug === s))
    .filter(Boolean);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/guide/concepts" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← All concepts</Link>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mt-4 mb-1">
          Concept · Imperative Mode
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">{concept.title}</h1>
        <p className="text-gray-500 text-sm italic">{concept.subtitle}</p>
      </div>

      {/* Originary definition */}
      <div className="bg-gray-50 border-l-4 border-gray-800 px-5 py-4 rounded-r-xl mb-8">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Originary Definition</p>
        <p className="text-gray-900 leading-relaxed font-medium">{concept.definition}</p>
      </div>

      {/* Body */}
      <div className="mb-10">
        {renderBody(concept.body, concept.slug)}
      </div>

      {/* Passages */}
      {concept.passages.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Exemplary Passages</h2>
          <div className="space-y-4">
            {concept.passages.map((p, i) => (
              <blockquote key={i} className="border-l-2 border-amber-300 pl-4 py-1">
                <p className="text-gray-700 italic leading-relaxed mb-2">"{p.text}"</p>
                <footer className="text-xs text-gray-400">
                  —{' '}
                  <Link href={`/post/${p.sourceSlug}`} className="text-blue-500 hover:underline" target="_blank">
                    {p.source}
                  </Link>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Self-reference note */}
      {concept.selfReference && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-10">
          <p className="text-xs font-mono text-amber-600 uppercase tracking-widest mb-2">Self-Reference</p>
          <p className="text-sm text-amber-900 leading-relaxed italic">{concept.selfReference}</p>
        </div>
      )}

      {/* Archive posts */}
      {concept.posts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">In the Archive</h2>
          <div className="space-y-3">
            {concept.posts.map((post) => (
              <div key={post.slug} className="flex gap-3">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-2" />
                <div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                    target="_blank"
                  >
                    {post.title}
                  </Link>
                  {post.note && (
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed italic">{post.note}</p>
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
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {relatedConcepts.map((c) => (
              <Link
                key={c!.slug}
                href={`/guide/concepts/${c!.slug}`}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-400 hover:text-gray-900 transition-all"
              >
                {c!.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <div className="border-t border-gray-100 pt-6 flex items-center justify-between text-sm">
        <Link href="/guide/concepts" className="text-gray-400 hover:text-gray-600 transition-colors">← All concepts</Link>
        <div className="flex gap-4">
          <Link href="/guide/map" className="text-gray-400 hover:text-blue-500 transition-colors">View in map</Link>
          <Link href="/guide/reading-paths" className="text-gray-400 hover:text-blue-500 transition-colors">Reading paths</Link>
        </div>
      </div>
    </main>
  );
}
