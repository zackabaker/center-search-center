import { getPublicPosts, getPostBySlug } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { ContentSource } from '@/lib/types';
import type { Metadata } from 'next';
import { PostContent } from '@/components/PostContent';
import ReadingProgress from '@/components/ReadingProgress';
import ReadingControls from '@/components/ReadingControls';
import RelatedPosts from '@/components/RelatedPosts';
import BookmarkButton from '@/components/BookmarkButton';
import CitationButton from '@/components/CitationButton';
import Annotations from '@/components/Annotations';
import TrackView from '@/components/TrackView';
import ShareButton from '@/components/ShareButton';
import TableOfContents from '@/components/TableOfContents';
import PostNavigation from '@/components/PostNavigation';
import Concordance from '@/components/Concordance';
import { getPostTermFrequency, buildSearchEntries, getRelatedEntries } from '@/lib/search-index';
import { relatedSlugs } from '@/lib/related';
import { MarkPostRead } from '@/components/MarkPostRead';
import NextInPath from '@/components/NextInPath';
import AiPathNext from '@/components/AiPathNext';
import PostSearchContext, { BackButton } from '@/components/PostSearchContext';
import QuoteShare from '@/components/QuoteShare';

// Maps a byline name to its on-site author page. Names not listed render as
// plain text — we never link a byline to an external (and often broken) source.
const AUTHOR_HANDLES: Record<string, string> = {
  'adam katz': 'katz',
  'dennis bouvard': 'katz',
  'zack baker': 'baker',
};

// Posts whose "Original" link should point to a faithful reading copy we host
// ourselves, rather than to a flaky external publication.
const HOSTED_ORIGINAL: Record<string, string> = {
  'pdf-there-is-no-economy': '/original/there-is-no-economy.html',
};

// Long-form sources get the focused "reader" layout by default: a single
// centered column on a warm background, no sidebar — matching the standalone
// reading copy. Short threads (Reddit/Twitter Q&A) keep the standard layout.
const READER_SOURCES = new Set(['gablog', 'substack', 'book', 'pdf', 'ap', 'chronicle', 'lecture']);

// Long-form scholarly articles that get the "academic" reading presentation
// in-app: a centered serif title block (issue line, title, byline) over the
// normal reader chrome. Add a slug here to opt another essay in. `issue` is the
// small line above the title (journal / volume / date).
const ACADEMIC_ARTICLES: Record<string, { issue?: string }> = {
  'pdf-there-is-no-economy': { issue: 'Anthropoetics XXVIII, no. 2 — Spring 2023' },
};

// Module-level cache — computed once per server-process lifetime (survives warm serverless invocations)
let _cachedAllEntries: ReturnType<typeof buildSearchEntries> | null = null;
function getCachedAllEntries() {
  if (!_cachedAllEntries) _cachedAllEntries = buildSearchEntries(getPublicPosts());
  return _cachedAllEntries;
}

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack:  'Bouvard Substack',
  gablog:    'GABlog',
  book:      'Anthropomorphics',
  pdf:       'Essays & Articles',
  reddit:    'Reddit',
  twitter:   'X / Twitter',
  chronicle: 'Chronicles of Love and Resentment',
  ap:        'Anthropoetics Journal',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack:  'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  gablog:    'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  book:      'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  pdf:       'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  reddit:    'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  twitter:   'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300',
  chronicle: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  ap:        'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };

  const excerpt = post.content
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 160)
    .replace(/\s+\S*$/, '') + '…';

  const url = `https://center.study/post/${slug}`;

  // ISO 8601 for OG article:published_time (parseable by crawlers)
  const isoDate = post.date ? (() => {
    try { return new Date(post.date).toISOString(); } catch { return undefined; }
  })() : undefined;

  // Author: explicit override (e.g. co-authored) wins; else per-source default.
  const authorName = post.author ? post.author
    : post.source === 'ap' ? 'Various Authors'
    : post.source === 'chronicle' ? 'Eric Gans'
    : post.source === 'substack' ? 'Dennis Bouvard'
    : 'Adam Katz';

  return {
    title: `${post.title} | Center Study Center`,
    description: excerpt,
    authors: [{ name: authorName }],
    // All sources (including chronicles and AP journal) are publicly crawlable
    openGraph: {
      title: post.title,
      description: excerpt,
      url,
      siteName: 'Center Study Center',
      type: 'article',
      ...(isoDate ? { publishedTime: isoDate } : {}),
      authors: [authorName],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: excerpt,
    },
    alternates: { canonical: url },
  };
}

// Don't pre-render posts at build time — there are 700+ posts and pre-rendering
// all of them exceeds Vercel's build disk limit (27 GB output). Instead, pages
// are rendered on first request and cached at the CDN edge for 1 hour (ISR).
// dynamicParams = true means unknown slugs are also rendered on demand.
export const dynamicParams = true;
export const revalidate = 3600;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getPublicPosts();
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 230));

  const paragraphs = post.content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .filter((p) => {
      const t = p.trim();
      return (
        !t.includes('Thanks for reading') &&
        !t.includes('reader-supported publication') &&
        !t.includes('Subscribe for free to receive new posts') &&
        t !== 'Subscribe' &&
        t !== 'Share'
      );
    });

  const externalUrl = post.url || `https://center.study/post/${slug}`;
  const originalHref = HOSTED_ORIGINAL[slug] ?? post.url;
  const academic = ACADEMIC_ARTICLES[slug];
  const reader = READER_SOURCES.has(post.source);

  // ── Prev / Next within source ──────────────────────────────────────────────
  const sourcePosts = allPosts
    .filter((p) => p.source === post.source)
    .sort((a, b) => {
      if (a.date && b.date) return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (a.date && !b.date) return -1;
      if (!a.date && b.date) return 1;
      return a.title.localeCompare(b.title);
    });
  const currentIdx = sourcePosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? sourcePosts[currentIdx - 1] : null;
  const nextPost = currentIdx < sourcePosts.length - 1 ? sourcePosts[currentIdx + 1] : null;

  // ── Concordance ────────────────────────────────────────────────────────────
  const termFreq = getPostTermFrequency(post.content, 25);

  // ── Headings (for conditional Contents sidebar) ────────────────────────────
  const hasHeadings = paragraphs.filter((p) => /^#{1,3}\s/.test(p)).length >= 3;

  // ── Related posts — computed server-side once; sidebar gets top 3, the
  // below-article grid gets top 6 as a slim array (never pass full posts
  // to client components — that serializes the corpus into the page).
  const allEntries = getCachedAllEntries();
  const currentEntry = allEntries.find((e) => e.slug === slug);
  // Prefer the precomputed semantic neighbours (by meaning); fall back to
  // lexical overlap if the index is unavailable. Drop same-title cross-source
  // copies (e.g. the pdf + ap versions of one article) so they don't show up
  // as "related" to themselves.
  const entryBySlug = new Map(allEntries.map((e) => [e.slug, e]));
  const titleLower = post.title.trim().toLowerCase();
  const semanticRelated = relatedSlugs(slug, 10)
    .map((s) => entryBySlug.get(s))
    .filter((e): e is NonNullable<typeof e> => !!e && e.title.trim().toLowerCase() !== titleLower);
  const relatedResolved = semanticRelated.length >= 3
    ? semanticRelated
    : (currentEntry ? getRelatedEntries(currentEntry, allEntries, 6) : []);
  const relatedEntries = relatedResolved.slice(0, 3);
  const relatedForGrid = relatedResolved.slice(0, 6).map((e) => ({
    slug: e.slug,
    title: e.title,
    source: e.source,
    date: e.date,
  }));

  const SIDEBAR_LABEL = 'text-xs font-mono uppercase tracking-widest text-gray-400 mb-3';

  // An explicit author override (e.g. a co-authored essay) wins over the
  // per-source default.
  const authorName = post.author ? post.author
    : post.source === 'ap' ? 'Various Authors'
    : post.source === 'chronicle' ? 'Eric Gans'
    : post.source === 'substack' || post.source === 'reddit' || post.source === 'twitter'
    ? 'Dennis Bouvard'
    : 'Adam Katz';
  // Split a (possibly co-authored) credit into names, linking each to its
  // author page when one exists — never to an external/broken source.
  const authorParts = authorName
    .split(/\s*&\s*|\s+and\s+/i)
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => ({ name: n, handle: AUTHOR_HANDLES[n.toLowerCase()] ?? null }));
  const linkedHandle = authorParts.find((p) => p.handle)?.handle;
  const authorUrl = linkedHandle
    ? `https://center.study/author/${linkedHandle}`
    : 'https://center.study';
  const bylineInner = authorParts.map((p, i) => (
    <span key={p.name}>
      {i > 0 && <span className="text-gray-400"> &amp; </span>}
      {p.handle ? (
        <Link
          href={`/author/${p.handle}`}
          className="hover:text-gray-800 dark:hover:text-gray-200 underline underline-offset-2 transition-colors"
        >
          {p.name}
        </Link>
      ) : (
        <span className="text-gray-600 dark:text-gray-300">{p.name}</span>
      )}
    </span>
  ));

  const isoDate = post.date ? (() => { try { return new Date(post.date).toISOString(); } catch { return undefined; } })() : undefined;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.content.replace(/\n+/g, ' ').trim().slice(0, 160).replace(/\s+\S*$/, '') + '…',
    url: `https://center.study/post/${slug}`,
    ...(isoDate ? { datePublished: isoDate } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Center Study Center',
      url: 'https://center.study',
    },
    isPartOf: { '@id': 'https://center.study/#website' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <ReadingProgress />
      <TrackView slug={slug} title={post.title} source={post.source} date={post.date} />
      {/* Reader mode: warm, full-viewport reading background behind everything */}
      {reader && <div className="fixed inset-0 -z-10 bg-[#fbfaf7] dark:bg-[#111111] print:hidden" />}
      <main className={`${reader ? 'max-w-3xl' : 'max-w-3xl lg:max-w-5xl'} w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden lg:overflow-x-visible`}>
        {/* Top nav — full width */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 print:hidden">
          <Suspense fallback={
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          }>
            <BackButton />
          </Suspense>
          <ReadingControls />
        </div>

        {/* Two-column grid on desktop — single centered column in reader mode */}
        <div className={reader ? '' : 'lg:grid lg:grid-cols-[1fr_260px] lg:gap-12 lg:items-start'}>

          {/* ── Main content column ── */}
          <div className="min-w-0">
            <QuoteShare title={post.title} author={authorName} date={post.date} url={`https://center.study/post/${slug}`} />
            <article>
              <header className={`mb-8 sm:mb-12${reader ? ' text-center' : ''}`}>
                {reader ? (
                  <>
                    <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.12em] text-gray-400 dark:text-gray-500 mb-5">
                      {academic?.issue ?? `${SOURCE_LABELS[post.source]}${post.date ? ` · ${post.date}` : ''}`}
                    </p>
                    <h1
                      className="text-3xl sm:text-4xl lg:text-[2.85rem] font-bold leading-tight mb-5"
                      style={{ fontFamily: 'var(--prose-font-family)' }}
                    >
                      {post.title}
                    </h1>
                    <p
                      className="text-xl text-gray-600 dark:text-gray-300 italic mb-4"
                      style={{ fontFamily: 'var(--prose-font-family)' }}
                    >
                      {bylineInner}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                      {readingTime} min read · {wordCount.toLocaleString()} words
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-700 w-16 mx-auto mb-7" />
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[post.source]}`}>
                        {SOURCE_LABELS[post.source]}
                      </span>
                      {post.date && <span className="text-sm text-gray-400">{post.date}</span>}
                      <span className="text-sm text-gray-400">{readingTime} min read</span>
                      <span className="text-sm text-gray-400 hidden sm:inline">{wordCount.toLocaleString()} words</span>
                    </div>

                    <h1
                      className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {post.title}
                    </h1>
                    <p className="text-base text-gray-500 dark:text-gray-400 mb-5">
                      By {bylineInner}
                    </p>
                  </>
                )}

                {/* Action buttons */}
                <div className={`flex items-center gap-2 print:hidden${reader ? ' justify-center' : ''}`}>
                  <a
                    href={`/post/${slug}/text`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    title="Open clean reading view — share this URL to ElevenReader, Voice Dream, or any TTS app."
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12m-3.536-9.536a5 5 0 000 7.072" />
                    </svg>
                    Listen
                  </a>
                  <ShareButton title={post.title} url={`https://center.study/post/${slug}`} />
                  <BookmarkButton post={{ slug, title: post.title, source: post.source, date: post.date, savedAt: '' }} />
                  <div className="hidden sm:flex sm:items-center sm:gap-2">
                    <CitationButton
                      title={post.title}
                      date={post.date}
                      source={post.source}
                      url={externalUrl}
                      slug={slug}
                    />
                    {originalHref && (
                      <a
                        href={originalHref}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        title={HOSTED_ORIGINAL[slug] ? 'Read the original article (faithful reading copy)' : 'View the original publication'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Original
                      </a>
                    )}
                  </div>
                </div>
              </header>

              {/* Table of contents — hidden on desktop (shown in sidebar instead) */}
              {!reader && (
                <div className="lg:hidden">
                  <TableOfContents paragraphs={paragraphs} />
                </div>
              )}

              {/* PostSearchContext: client component that reads ?q from the URL.
                  - With q: renders HighlightedContent (search-result highlighting)
                  - Without q: renders PostContent (paragraph deep-linking + concept links)
                  Suspense fallback renders PostContent immediately so static HTML is useful. */}
              <Suspense fallback={<PostContent content={post.content} postTitle={post.title} postUrl={`https://center.study/post/${slug}`} />}>
                <PostSearchContext
                  paragraphs={paragraphs}
                  content={post.content}
                  postTitle={post.title}
                  postUrl={`https://center.study/post/${slug}`}
                />
              </Suspense>
            </article>

            {/* Reader mode drops the Key Terms / Related panels entirely; Notes
                stay (a personal feature), placed below the article. */}
            {reader ? (
              <>
                <Annotations slug={slug} />
                {/* End-of-read discovery — semantic neighbours, not a sidebar */}
                {relatedForGrid.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 text-center">Related reading</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {relatedForGrid.slice(0, 4).map((r) => (
                        <Link
                          key={r.slug}
                          href={`/post/${r.slug}`}
                          className="group block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">{r.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Below-article sections — hidden on desktop (shown in sidebar instead) */}
                <div className="lg:hidden">
                  <Concordance terms={termFreq} />
                  <Annotations slug={slug} />
                </div>

                {/* RelatedPosts — slim server-computed list (top 6) */}
                <RelatedPosts related={relatedForGrid} />
              </>
            )}

            {/* Next in AI-generated reading path (client, localStorage) */}
            <AiPathNext slug={slug} />

            {/* Next in curated reading path */}
            <NextInPath slug={slug} />

            {/* Prev / Next in source — always below article */}
            <PostNavigation
              prev={prevPost ? { slug: prevPost.slug, title: prevPost.title, date: prevPost.date } : null}
              next={nextPost ? { slug: nextPost.slug, title: nextPost.title, date: nextPost.date } : null}
              source={post.source}
            />
          </div>

          {/* ── Sticky sidebar — desktop only; omitted entirely in reader mode ── */}
          {!reader && (
          <aside className="hidden lg:block sticky top-6 self-start space-y-0 print:hidden">

            {/* Contents — only shown when post has ≥3 headings */}
            {hasHeadings && (
              <div className="pb-5">
                <p className={SIDEBAR_LABEL}>Contents</p>
                <TableOfContents paragraphs={paragraphs} />
              </div>
            )}

            {/* Key Terms — compact mode: no outer chrome, terms always visible */}
            {termFreq.length > 0 && (
              <div className={`${hasHeadings ? 'border-t border-gray-100 dark:border-gray-800 ' : ''}pt-5 pb-5`}>
                <p className={SIDEBAR_LABEL}>Key terms</p>
                <Concordance terms={termFreq} compact />
              </div>
            )}

            {/* Related — compact top-3 */}
            {relatedEntries.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-5 pb-5">
                <p className={SIDEBAR_LABEL}>Related</p>
                <ul className="space-y-2">
                  {relatedEntries.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/post/${entry.slug}`}
                        className="flex items-start justify-between gap-2 group"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white leading-snug line-clamp-2 transition-colors">
                          {entry.title}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5 ${SOURCE_COLORS[entry.source]}`}>
                          {SOURCE_LABELS[entry.source]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
              <p className={SIDEBAR_LABEL}>Notes</p>
              <Annotations slug={slug} />
            </div>

          </aside>
          )}

        </div>
        <MarkPostRead slug={slug} />
      </main>
    </>
  );
}
