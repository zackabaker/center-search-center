import { notFound } from 'next/navigation';
import Link from 'next/link';
import QUOTES from '@/data/quotes.json';
import { CONCEPT_TITLES } from '@/lib/cs-terms';
import { GLOSSARY } from '@/data/guide/glossary';
import type { Metadata } from 'next';

// Canonical quote pages — the site's atom, addressed. Every curated verbatim
// passage in the reference layer (glossary defining quotes and usage passages,
// concept defining quotes, the chronological atlas) gets a permanent URL:
// content-derived id, machine-verified verbatim at build time, Quotation
// JSON-LD for citing AIs. THESE URLS ARE A PERMANENCE CONTRACT — ids are
// content-addressed and must never be deleted once published.

type Quote = {
  id: string;
  text: string;
  sourceSlug: string;
  sourceTitle: string;
  source: string;
  date: string | null;
  author?: string;
  concepts: string[];
  terms: string[];
  defining: boolean;
};

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  chronicle: 'Chronicles of Love & Resentment',
  ap: 'Anthropoetics',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
};

// quotes.json carries a real per-quote author (venue alone misattributes:
// Katz's own Anthropoetics articles, guest Chroniclers). Source-based
// inference is only the fallback for older data.
function quoteAuthor(q: Quote): string {
  return q.author ?? (q.source === 'chronicle' || q.source === 'ap' ? 'Eric Gans' : 'Adam Katz');
}

const quotes = QUOTES as Quote[];
const byId = new Map(quotes.map((q) => [q.id, q]));

export function generateStaticParams() {
  return quotes.map((q) => ({ id: q.id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const q = byId.get(id);
  if (!q) return {};
  const head = q.text.length > 150 ? q.text.slice(0, 150).replace(/\s+\S*$/, '') + '…' : q.text;
  return {
    title: `“${head.slice(0, 60)}${head.length > 60 ? '…' : ''}” — Center Study`,
    description: `${head} — ${quoteAuthor(q)}, ${q.sourceTitle}`,
    alternates: { canonical: `https://center.study/q/${id}` },
  };
}

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = byId.get(id);
  if (!q) notFound();

  const author = quoteAuthor(q);
  const termsBySlug = new Map(GLOSSARY.map((e) => [e.slug, e]));

  const quotationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quotation',
    '@id': `https://center.study/q/${id}`,
    text: q.text,
    creator: { '@type': 'Person', name: author },
    isPartOf: {
      '@type': 'CreativeWork',
      name: q.sourceTitle,
      url: `https://center.study/post/${q.sourceSlug}`,
      ...(q.date ? { datePublished: q.date } : {}),
    },
    ...(q.concepts.length || q.terms.length
      ? {
          about: [
            ...q.concepts.map((c) => ({
              '@type': 'DefinedTerm',
              name: CONCEPT_TITLES[c] ?? c,
              url: `https://center.study/guide/concepts/${c}`,
            })),
            ...q.terms.map((t) => ({
              '@type': 'DefinedTerm',
              name: termsBySlug.get(t)?.term ?? t,
              url: termsBySlug.get(t)?.concept
                ? `https://center.study/guide/concepts/${termsBySlug.get(t)!.concept}`
                : `https://center.study/guide/glossary/${t}`,
            })),
          ],
        }
      : {}),
  };

  const readHref = `/post/${q.sourceSlug}?q=${encodeURIComponent(
    q.text.split(/\s+/).slice(0, 8).join(' ')
  )}`;

  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(quotationJsonLd) }} />

      <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-8">
        Verbatim quote · {author === 'Eric Gans'
          ? 'reference material — Eric Gans'
          : q.defining ? 'defining passage' : 'from the corpus'}
      </p>

      {/* Amber marks Katz's verbatim center; reference-tier quotes take gray */}
      <blockquote className={`border-l-2 pl-5 sm:pl-6 mb-8 ${author === 'Eric Gans' ? 'border-gray-300 dark:border-gray-600' : 'border-amber-600 dark:border-amber-500'}`}>
        <p
          className="text-gray-900 dark:text-gray-100 leading-relaxed text-xl sm:text-2xl"
          style={{ fontFamily: 'var(--prose-font-family)' }}
        >
          &ldquo;{q.text}&rdquo;
        </p>
      </blockquote>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
        — {author},{' '}
        <Link href={readHref} className="text-gray-700 dark:text-gray-300 hover:underline font-medium">
          {q.sourceTitle}
        </Link>
        {q.date ? <span className="text-gray-400 dark:text-gray-500"> · {q.date}</span> : null}
        <span className="text-gray-400 dark:text-gray-500"> · {SOURCE_LABELS[q.source] ?? q.source}</span>
      </p>

      {(q.concepts.length > 0 || q.terms.length > 0) && (
        <section className="mb-10">
          <p className="text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            Evidences
          </p>
          <div className="flex flex-wrap gap-2">
            {q.concepts.map((c) => (
              <Link
                key={c}
                href={`/guide/concepts/${c}`}
                className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                {CONCEPT_TITLES[c] ?? c}
              </Link>
            ))}
            {q.terms
              .filter((t) => !termsBySlug.get(t)?.concept || !q.concepts.includes(termsBySlug.get(t)!.concept!))
              .map((t) => (
                <Link
                  key={t}
                  href={
                    termsBySlug.get(t)?.concept
                      ? `/guide/concepts/${termsBySlug.get(t)!.concept}`
                      : `/guide/glossary/${t}`
                  }
                  className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  {termsBySlug.get(t)?.term ?? t}
                </Link>
              ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm">
        <Link href={readHref} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
          Read in context →
        </Link>
        <span className="text-gray-400 dark:text-gray-500 font-mono text-xs">
          center.study/q/{q.id}
        </span>
      </div>
    </main>
  );
}
