import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONCEPTS, getConceptBySlug } from '@/data/guide/concepts';
import { atlasPassages } from '@/lib/concept-atlas';
import GLOSSARY from '@/data/guide/concept-glossary.json';
import GoBack from '@/components/GoBack';
import { parsePostDate, postTime } from '@/lib/dates';
import type { Metadata } from 'next';

function atlasYear(date: string | null): string {
  const d = parsePostDate(date);
  return d ? String(d.getFullYear()) : '—';
}

// Meta descriptions must not clip mid-word.
function clipDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return {};
  return {
    title: `${concept.title} — Center Study Concepts`,
    description: clipDescription(
      (GLOSSARY as Record<string, { definitionQuote?: string }>)[slug]?.definitionQuote
      || concept.definition
      || concept.subtitle
    ),
    alternates: { canonical: `https://center.study/guide/concepts/${slug}` },
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  // Verbatim glossary data — defining quote + passages + key texts, all from the archive.
  type GlossaryEntry = {
    definitionQuote: string; definitionSource: string; definitionSlug: string; definitionAuthor: string;
    passages: { text: string; source: string; sourceSlug: string }[];
    posts: { slug: string; title: string; note: string }[];
  };
  const g = (GLOSSARY as Record<string, GlossaryEntry>)[slug];
  const passages = g?.passages?.length ? g.passages : concept.passages;
  const keyTexts = g?.posts?.length ? g.posts : concept.posts;

  // Chronicle dates ("July 6th, 1995") defeated the atlas build's sort — order
  // chronologically here with the robust parser so the timeline reads correctly.
  const atlas = [...atlasPassages(slug)].sort((a, b) => {
    const ta = postTime(a.date);
    const tb = postTime(b.date);
    if (ta !== null && tb !== null) return ta - tb;
    if (ta !== null) return -1;
    if (tb !== null) return 1;
    return 0;
  });

  const relatedConcepts = concept.relations
    .map((s) => CONCEPTS.find((c) => c.slug === s))
    .filter(Boolean);

  const askQuery = encodeURIComponent(`What is ${concept.title} in Center Study?`);
  const askHref = `/ask?q=${askQuery}&concept=${concept.slug}`;

  // Machine-readable controlled vocabulary: each concept is a DefinedTerm keyed
  // to its verbatim sourced definition, plus a breadcrumb trail.
  const definitionText = g?.definitionQuote || concept.definition || concept.subtitle || '';
  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `https://center.study/guide/concepts/${slug}#term`,
    name: concept.title,
    ...(definitionText ? { description: definitionText } : {}),
    url: `https://center.study/guide/concepts/${slug}`,
    inDefinedTermSet: 'https://center.study/concepts#glossary',
    ...(g?.definitionSlug
      ? { subjectOf: { '@type': 'CreativeWork', name: g.definitionSource, url: `https://center.study/post/${g.definitionSlug}` } }
      : {}),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://center.study' },
      { '@type': 'ListItem', position: 2, name: 'Concepts & Glossary', item: 'https://center.study/concepts' },
      { '@type': 'ListItem', position: 3, name: concept.title, item: `https://center.study/guide/concepts/${slug}` },
    ],
  };

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }} />
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

        {/* Ask AI shortcut + every-mention escape hatch */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={askHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ask AI about {concept.title}
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(concept.title.toLowerCase())}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Every mention in the archive
          </Link>
        </div>
      </div>

      {/* Definition — a verbatim defining quote from the archive (not an AI summary) */}
      {(g?.definitionQuote || concept.definition) && (
        <section className="mb-10">
          {g?.definitionQuote ? (
            <blockquote className="border-l-2 border-gray-900 dark:border-gray-100 pl-5" style={{ fontFamily: 'var(--prose-font-family)' }}>
              <p className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl leading-relaxed">
                &ldquo;{g.definitionQuote}&rdquo;
              </p>
              <footer className="mt-2.5 text-sm">
                <Link href={`/post/${g.definitionSlug}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  {g.definitionSource}
                </Link>
                <span className="text-gray-400 dark:text-gray-500"> · {g.definitionAuthor}</span>
              </footer>
            </blockquote>
          ) : (
            <p
              className="text-gray-900 dark:text-gray-100"
              style={{ fontFamily: 'var(--prose-font-family)', fontSize: 'calc(var(--prose-font-size, 17px) + 1px)', lineHeight: 'var(--prose-line-height, 1.85)' }}
            >
              {concept.definition}
            </p>
          )}
        </section>
      )}

      {/* Passages — primary content, verbatim from the archive (verified) */}
      {passages.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">
            From the Archive
          </h2>
          <div className="space-y-6">
            {passages.map((p, i) => (
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

      {/* AI overview — clearly labelled, secondary to the archive quotes above */}
      {concept.body && (
        <section className="mb-10 rounded-xl border border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xs font-mono text-amber-700 dark:text-amber-500 uppercase tracking-widest">
              AI Overview
            </h2>
            <span className="text-[10px] text-amber-600/70 dark:text-amber-600/50 italic">
              — AI-generated synthesis. The archive passages above are the primary source.
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

      {/* Across the corpus — semantically-matched passages, ordered by date,
          showing how the concept develops over time. */}
      {atlas.length > 1 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
            Across the Corpus
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            How this idea is developed elsewhere in the archive, earliest to latest.
          </p>
          <div className="relative border-l border-gray-200 dark:border-gray-700 ml-2 space-y-6">
            {atlas.map((p, i) => (
              <div key={i} className="relative pl-6">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-500 tabular-nums">{atlasYear(p.date)}</span>
                  <Link href={`/post/${p.slug}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate">
                    {p.title}
                  </Link>
                </div>
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  &ldquo;{p.text.length > 360 ? p.text.slice(0, 360).replace(/\s+\S*$/, '') + '…' : p.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Archive posts */}
      {keyTexts.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Key Texts</h2>
          <div className="space-y-3">
            {keyTexts.map((post) => (
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
