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
import { parsePostDate, postTime } from '@/lib/dates';
import { MarkPostRead } from '@/components/MarkPostRead';
import NextInPath from '@/components/NextInPath';
import AiPathNext from '@/components/AiPathNext';
import PostSearchContext, { BackButton } from '@/components/PostSearchContext';
import SceneMark from '@/components/SceneMark';
import QuoteShare from '@/components/QuoteShare';

// Maps a byline name to its on-site author page. Names not listed render as
// plain text — we never link a byline to an external (and often broken) source.
const AUTHOR_HANDLES: Record<string, string> = {
  'adam katz': 'katz',
  'dennis bouvard': 'katz',
  'zack baker': 'baker',
  'eric gans': 'gans',
};

// Posts whose "Original" link should point to a faithful reading copy we host
// ourselves, rather than to a flaky external publication.
const HOSTED_ORIGINAL: Record<string, string> = {
  'there-is-no-economy-pdf': '/original/there-is-no-economy.html',
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
  'there-is-no-economy-pdf': { issue: 'Anthropoetics XXVIII, no. 2 — Spring 2023' },
  'the-origin-of-language': { issue: 'Eric Gans — The Origin of Language (new edition, Spuyten Duyvil, 2020)' },
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
  const isoDate = parsePostDate(post.date)?.toISOString();

  // Author: explicit override (e.g. co-authored) wins; else per-source default.
  const authorName = post.author ? post.author
    : post.source === 'ap' ? 'Various Authors'
    : post.source === 'chronicle' ? 'Eric Gans'
    : post.source === 'substack' ? 'Dennis Bouvard'
    : 'Adam Katz';

  // Highwire citation_* tags — Zotero/Mendeley/Scholar pick these up so a
  // researcher gets a correct reference with one click. Emitted ONLY on the
  // Anthropoetics articles: the Embedded Metadata translator types any
  // citation_*-bearing page as a journalArticle, which is right for the AP
  // journal but wrong for the blog/book sources (they keep OG metadata, which
  // Zotero reads as webpage/blogPost). Volume/issue derive from the slug
  // (apVVII-…), verified against the source data with zero mismatches.
  let scholarMeta: Record<string, string> | undefined;
  if (post.source === 'ap') {
    const m = slug.match(/^ap(\d\d)(\d\d)-/);
    scholarMeta = {
      citation_title: post.title,
      citation_author: authorName,
      citation_journal_title: 'Anthropoetics',
      citation_publisher: 'UCLA',
      citation_public_url: url,
      ...(post.date ? { citation_publication_date: post.date } : {}),
      ...(m ? { citation_volume: String(Number(m[1])), citation_issue: String(Number(m[2])) } : {}),
    };
  }

  return {
    title: post.title,
    description: excerpt,
    authors: [{ name: authorName }],
    ...(scholarMeta ? { other: scholarMeta } : {}),
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
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
    },
    alternates: { canonical: url },
  };
}

// Pre-render only the head of the corpus — pre-rendering all 1,900+ posts
// exceeds Vercel's build disk limit (27 GB output), but the ~60 most-entered
// texts (book chapters, lectures, curated entry points) should never serve a
// cold first view. Having generateStaticParams (even partial) is also what
// marks the route ISR; all other slugs render on demand and cache for 1 hour.
export function generateStaticParams() {
  const posts = getPublicPosts();
  // Lectures aren't in the public-post source union; book chapters are the
  // long-lived head of the corpus alongside the curated entry points below.
  const head = posts.filter((p) => p.source === 'book');
  const curated = [
    // Homepage featured groups + /start gateway + /intro anchors
    'the-discourse-of-the-center',
    'the-prospects-of-the-hypothesis',
    'the-transdisciplinarity-of-the-hypothesis',
    'anthropomorphics-origin-and-hypothesis',
    'anthropomorphics-the-use-of-a-center',
    'there-is-no-economy-pdf',
  ];
  const slugs = new Set<string>([...head.map((p) => p.slug), ...curated.filter((s) => posts.some((p) => p.slug === s))]);
  return [...slugs].map((slug) => ({ slug }));
}
export const dynamicParams = true;
export const revalidate = 3600;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Legacy source-prefixed URLs are 308-redirected to the canonical slug by the
  // proxy (middleware), which only matches those legacy patterns — so canonical
  // /post/* pages skip middleware and stay ISR-cached (via generateStaticParams).
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
  // Scholars cite the Chronicles by number — surface it ("Chronicle No. 500").
  const chronicleNo = post.source === 'chronicle' ? slug.match(/^clr-(\d+)$/)?.[1] ?? null : null;

  // ── Prev / Next within source ──────────────────────────────────────────────
  // Book chapters have no dates but posts-cache order IS the book's chapter
  // order — preserve it. Everything else sorts chronologically (parsePostDate
  // handles Chronicle-style "July 6th, 1995" that Date.parse rejects).
  // The whole-book blob is not a chapter — finishing the last real chapter
  // must not offer "Next: Anthropomorphics" (the 325k-char full text).
  const BOOK_BLOBS = new Set(['anthropomorphics-book']);
  const sourceFiltered = allPosts.filter(
    (p) => p.source === post.source && !(post.source === 'book' && BOOK_BLOBS.has(p.slug))
  );
  const sourcePosts = post.source === 'book'
    ? sourceFiltered
    : [...sourceFiltered].sort((a, b) => {
        const ta = postTime(a.date);
        const tb = postTime(b.date);
        if (ta !== null && tb !== null) return ta - tb;
        if (ta !== null) return -1;
        if (tb !== null) return 1;
        return a.title.localeCompare(b.title);
      });
  const currentIdx = sourcePosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? sourcePosts[currentIdx - 1] : null;
  const nextPost = currentIdx >= 0 && currentIdx < sourcePosts.length - 1 ? sourcePosts[currentIdx + 1] : null;

  // ── Concordance ────────────────────────────────────────────────────────────
  const termFreq = getPostTermFrequency(post.content, 25);

  // ── Headings (for conditional Contents sidebar) ────────────────────────────
  // Headings only — the "Landmarks" fallback for heading-less essays was
  // removed at the owner's direction (no landmarks button).
  const hasNav = paragraphs.filter((p) => /^#{1,3}\s/.test(p)).length >= 3;

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

  const isoDate = parsePostDate(post.date)?.toISOString();

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

  const SOURCE_CRUMB: Record<string, { label: string; href: string }> = {
    gablog: { label: 'GABlog', href: '/browse/gablog' },
    substack: { label: 'Substack', href: '/browse/substack' },
    book: { label: 'Anthropomorphics', href: '/browse/book' },
    pdf: { label: 'Essays & Articles', href: '/browse/pdf' },
    chronicle: { label: 'Chronicles of Love and Resentment', href: '/browse/chronicle' },
    ap: { label: 'Anthropoetics Journal', href: '/browse/ap' },
    reddit: { label: 'Threads & Q&A', href: '/browse/threads' },
    twitter: { label: 'Threads & Q&A', href: '/browse/threads' },
    lecture: { label: 'Lecture Series', href: '/lectures' },
  };
  const crumb = SOURCE_CRUMB[post.source];
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://center.study' },
      ...(crumb ? [{ '@type': 'ListItem', position: 2, name: crumb.label, item: `https://center.study${crumb.href}` }] : []),
      { '@type': 'ListItem', position: crumb ? 3 : 2, name: post.title, item: `https://center.study/post/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />
      <ReadingProgress />
      <TrackView slug={slug} title={post.title} source={post.source} date={post.date} />
      {/* Reader mode: warm, full-viewport reading background behind everything */}
      {reader && <div className="reader-bg fixed inset-0 -z-10 bg-[#fbfaf7] dark:bg-[#111111] print:hidden" />}
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
                      {academic?.issue ?? `${SOURCE_LABELS[post.source]}${chronicleNo ? ` · No. ${chronicleNo}` : ''}${post.date ? ` · ${post.date}` : ''}`}
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
                    <div className="flex justify-center mb-7">
                      <SceneMark size={14} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[post.source]}`}>
                        {SOURCE_LABELS[post.source]}
                      </span>
                      {chronicleNo && <span className="text-sm text-gray-400">No. {chronicleNo}</span>}
                      {post.date && <span className="text-sm text-gray-400">{post.date}</span>}
                      <span className="text-sm text-gray-400">{readingTime} min read</span>
                      <span className="text-sm text-gray-400 hidden sm:inline">{wordCount.toLocaleString()} words</span>
                    </div>

                    <h1
                      className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4"
                    >
                      {post.title}
                    </h1>
                    <p className="text-base text-gray-500 dark:text-gray-400 mb-5">
                      By {bylineInner}
                    </p>
                  </>
                )}

                {/* Action buttons */}
                <div className={`flex flex-wrap items-center gap-2 print:hidden${reader ? ' justify-center' : ''}`}>
                  <ShareButton title={post.title} url={`https://center.study/post/${slug}`} />
                  <BookmarkButton post={{ slug, title: post.title, source: post.source, date: post.date, savedAt: '' }} />
                  <CitationButton
                    title={post.title}
                    date={post.date}
                    source={post.source}
                    url={externalUrl}
                    slug={slug}
                    authorName={authorName}
                    chronicleNo={chronicleNo}
                  />
                  <a
                    href={`/post/${slug}/text`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors print:hidden"
                    title="Clean single-file copy — for reading apps, text-to-speech, or saving"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Plain text
                  </a>
                  {originalHref && (
                    <a
                      href={originalHref}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      title={HOSTED_ORIGINAL[slug] ? 'Read the original article (faithful reading copy)' : 'View the original publication'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Original
                    </a>
                  )}
                </div>

                {/* Site mark closes the title block in the standard layout */}
                {!reader && (
                  <div className="flex items-center gap-3 mt-7">
                    <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
                    <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
                  </div>
                )}
              </header>

              {/* Table of contents — hidden on desktop (shown in sidebar instead) */}
              {!reader && (
                <div className="lg:hidden">
                  <TableOfContents paragraphs={paragraphs} />
                </div>
              )}

              {/* Reader mode previously had no in-page navigation at all — for
                  long texts, offer the collapsible ToC (headings when they
                  exist, verbatim paragraph landmarks otherwise). */}
              {reader && hasNav && (
                <div className="max-w-[65ch] mx-auto text-left mb-8">
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

            {/* Everything below the article is screen-only — on paper the
                text ends where the text ends. */}
            <div className="print:hidden">
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

            {/* End-of-read CTA — source-aware, at the point of highest intent */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 print:hidden">
              {post.source === 'book' ? (
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  From <em>Anthropomorphics: An Originary Grammar of the Center</em>{' '}by Dennis Bouvard.{' '}
                  <a href="https://www.amazon.com/Anthropomorphics-Originary-Grammar-Dennis-Bouvard/dp/0648690571" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Get the book&nbsp;↗</a>
                </p>
              ) : post.source === 'substack' || post.source === 'reddit' || post.source === 'twitter' ? (
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  Dennis Bouvard publishes new applied essays on Substack.{' '}
                  <a href="https://dennisbouvard.substack.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Subscribe&nbsp;↗</a>
                </p>
              ) : (
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  Keep reading across the archive —{' '}
                  <Link href="/start" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">start here</Link>{' '}or{' '}
                  <Link href="/search" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">search the corpus</Link>.
                </p>
              )}
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                <a href="https://x.com/centerstudy_" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Follow on X&nbsp;↗</a>
                {' · '}
                <Link href="/lectures" className="hover:text-gray-700 dark:hover:text-gray-300">Lecture series</Link>
              </p>
            </div>
          </div>

          {/* ── Sticky sidebar — desktop only; omitted entirely in reader mode ── */}
          {!reader && (
          <aside className="hidden lg:block sticky top-6 self-start space-y-0 print:hidden">

            {/* Contents — headings when present, paragraph landmarks for long
                heading-less essays */}
            {hasNav && (
              <div className="pb-5">
                <p className={SIDEBAR_LABEL}>Contents</p>
                <TableOfContents paragraphs={paragraphs} />
              </div>
            )}

            {/* Key Terms — compact mode: no outer chrome, terms always visible */}
            {termFreq.length > 0 && (
              <div className={`${hasNav ? 'border-t border-gray-100 dark:border-gray-800 ' : ''}pt-5 pb-5`}>
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
