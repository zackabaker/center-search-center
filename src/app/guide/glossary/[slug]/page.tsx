import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY } from '@/data/guide/glossary';
import { getPublicPosts } from '@/lib/parser';
import GoBack from '@/components/GoBack';
import type { Metadata } from 'next';

// Real author of the defining quote's source — venue alone misattributes
// (Anthropoetics is multi-author). Katz definitions lead by policy; the rare
// non-Katz definition renders labeled, with a gray rule (amber is Katz's).
function definitionAuthor(defSlug: string): string {
  const post = getPublicPosts().find((p) => p.slug === defSlug);
  const a = (post?.author ?? '').trim();
  if (a) return a;
  return post?.source === 'chronicle' || post?.source === 'ap' ? 'Eric Gans' : 'Adam Katz';
}

// Canonical page per glossary term — the site's atom (the verbatim defining
// quote) with a stable, crawlable URL. Terms that have a full concept hub
// redirect there permanently: one term system, progressive depth, no
// duplicate pages competing with the curated treatment.

const SOURCE_COLORS: Record<string, string> = {
  GABlog: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Substack: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Essay: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Book: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Chronicles: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'AP Journal': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

function clipDescription(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export function generateStaticParams() {
  return GLOSSARY.map((e) => ({ slug: e.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = GLOSSARY.find((e) => e.slug === slug);
  if (!entry || entry.concept) return {};
  return {
    title: `${entry.term} — Center Study Glossary`,
    description: clipDescription(`“${entry.definitionQuote}” — ${entry.definitionSource}`),
    alternates: { canonical: `https://center.study/guide/glossary/${slug}` },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = GLOSSARY.find((e) => e.slug === slug);
  if (!entry) notFound();

  // Terms with a full concept treatment live there — one canonical page per term.
  if (entry.concept) permanentRedirect(`/guide/concepts/${entry.concept}`);

  const defAuthor = definitionAuthor(entry.definitionSlug);
  const katzDefined = defAuthor.startsWith('Adam Katz');

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `https://center.study/guide/glossary/${slug}#term`,
    name: entry.term,
    description: entry.definitionQuote,
    url: `https://center.study/guide/glossary/${slug}`,
    inDefinedTermSet: 'https://center.study/concepts#glossary',
    subjectOf: {
      '@type': 'CreativeWork',
      name: entry.definitionSource,
      url: `https://center.study/post/${entry.definitionSlug}`,
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Concepts & Glossary', item: 'https://center.study/concepts' },
      { '@type': 'ListItem', position: 2, name: entry.term, item: `https://center.study/guide/glossary/${slug}` },
    ],
  };

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-8 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <GoBack fallback="/concepts?view=glossary" label="← Glossary" />

      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-6 mb-2">
        Term{!katzDefined && ' · reference definition'}
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-1.5">
        {entry.term}
      </h1>
      <p className="text-xs text-gray-400 dark:text-gray-500 tabular-nums mb-8">
        used in {entry.posts} texts across the archive
      </p>

      {/* The verbatim defining quote — Katz's words lead (amber); the rare
          non-Katz definition takes a gray rule and an explicit author. */}
      <blockquote className={`border-l-2 pl-4 sm:pl-5 mb-10 ${katzDefined ? 'border-amber-600 dark:border-amber-500' : 'border-gray-300 dark:border-gray-600'}`}>
        <p
          className="text-gray-900 dark:text-gray-100 leading-relaxed text-lg sm:text-xl"
          style={{ fontFamily: 'var(--prose-font-family)' }}
        >
          &ldquo;{entry.definitionQuote}&rdquo;
        </p>
        <footer className="mt-2">
          <Link
            href={`/post/${entry.definitionSlug}`}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:underline transition-colors"
          >
            — {katzDefined ? '' : `${defAuthor}, `}{entry.definitionSource}
          </Link>
        </footer>
      </blockquote>

      {/* Usage from the corpus */}
      {entry.passages.length > 0 && (
        <section className="mb-10">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            In use
          </p>
          <div className="space-y-5">
            {entry.passages.map((p, i) => (
              <blockquote key={i} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <p
                  className="text-[15px] text-gray-600 dark:text-gray-400 italic leading-relaxed"
                  style={{ fontFamily: 'var(--prose-font-family)' }}
                >
                  &ldquo;{p.text}&rdquo;
                </p>
                <footer className="mt-1.5">
                  <Link
                    href={`/post/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
                  >
                    <span className={`px-1.5 py-0.5 rounded font-medium ${SOURCE_COLORS[p.source] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {p.source}
                    </span>
                    <span className="group-hover:underline max-w-[320px] truncate">{p.title}</span>
                  </Link>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Key texts */}
      {entry.sources.length > 0 && (
        <section className="mb-10">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Key texts
          </p>
          <ul className="space-y-2">
            {entry.sources.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/post/${s.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group"
                >
                  <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${SOURCE_COLORS[s.source] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                    {s.source}
                  </span>
                  <span className="group-hover:underline">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Onward */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm">
        <Link
          href={`/search?q=${encodeURIComponent(entry.term.toLowerCase())}`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Every mention in the archive →
        </Link>
        <Link
          href={`/ask?q=${encodeURIComponent(`What is ${entry.term.toLowerCase()} in Center Study?`)}`}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          ✦ Ask AI about it
        </Link>
        <Link
          href="/concepts?view=glossary"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          All 134 terms
        </Link>
      </div>
    </main>
  );
}
