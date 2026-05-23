import { getAllPosts, getPostBySlug } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentSource } from '@/lib/types';
import type { Metadata } from 'next';
import HighlightedContent from '@/components/HighlightedContent';
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
import { MarkPostRead } from '@/components/MarkPostRead';
import NextInPath from '@/components/NextInPath';

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'PDF',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  reddit: 'bg-red-100 text-red-800',
  twitter: 'bg-slate-100 text-slate-700',
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

  return {
    title: `${post.title} | Center Study Center`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      url,
      siteName: 'Center Study Center',
      type: 'article',
      ...(post.date ? { publishedTime: post.date } : {}),
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: excerpt,
    },
    alternates: { canonical: url },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts
    .filter((p) => p.source !== 'twitter' && p.source !== 'reddit')
    .map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ slug }, { q }] = await Promise.all([params, searchParams]);
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 230));

  const paragraphs = post.content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .filter((p) =>
      !p.includes('Thanks for reading Center Study Center') &&
      !p.includes('Thanks for reading GA Newsletter') &&
      !p.includes('reader-supported publication') &&
      !p.match(/^Subscribe$/) &&
      !p.match(/^Share$/)
    );

  const externalUrl = post.url || `https://center.study/post/${slug}`;

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

  // ── Related posts (for sidebar compact list) ───────────────────────────────
  const allEntries = buildSearchEntries(allPosts);
  const currentEntry = allEntries.find((e) => e.slug === slug);
  const relatedEntries = currentEntry ? getRelatedEntries(currentEntry, allEntries, 3) : [];

  const SIDEBAR_LABEL = 'text-xs font-mono uppercase tracking-widest text-gray-400 mb-3';

  return (
    <>
      <ReadingProgress />
      <TrackView slug={slug} title={post.title} source={post.source} date={post.date} />
      <main className="max-w-3xl lg:max-w-6xl mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden lg:overflow-x-visible">
        {/* Top nav — full width */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 print:hidden">
          <Link
            href={q ? `/search?q=${encodeURIComponent(q)}` : '/'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            {q ? 'Back to results' : 'Back'}
          </Link>
          <ReadingControls />
        </div>

        {/* Two-column grid on desktop */}
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12 lg:items-start">

          {/* ── Main content column ── */}
          <div className="min-w-0">
            <article>
              <header className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[post.source]}`}>
                    {SOURCE_LABELS[post.source]}
                  </span>
                  {post.date && <span className="text-xs sm:text-sm text-gray-400">{post.date}</span>}
                  <span className="text-xs sm:text-sm text-gray-400">{readingTime} min</span>
                  <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">{wordCount.toLocaleString()} words</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">{post.title}</h1>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <a
                    href={`/post/${slug}/text`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    title="Open clean reading view — share this URL to ElevenReader, Voice Dream, or any TTS app. On iPhone: tap Share → ElevenReader. For Safari Reader, tap the ᴬA icon in the address bar, then the speaker."
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7 7 0 010 12m-3.536-9.536a5 5 0 000 7.072" />
                    </svg>
                    Listen
                  </a>
                  <ShareButton title={post.title} url={`https://center.study/post/${slug}`} />
                  <BookmarkButton post={{ slug, title: post.title, source: post.source, date: post.date, savedAt: '' }} />
                  <CitationButton
                    title={post.title}
                    date={post.date}
                    source={post.source}
                    url={externalUrl}
                    slug={slug}
                  />
                  {post.url && (
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View original
                    </a>
                  )}
                </div>
              </header>

              {/* Table of contents — hidden on desktop (shown in sidebar instead) */}
              <div className="lg:hidden">
                <TableOfContents paragraphs={paragraphs} />
              </div>

              <HighlightedContent
                paragraphs={paragraphs}
                postTitle={post.title}
                postUrl={`https://center.study/post/${slug}`}
              />
            </article>

            {/* Below-article sections — hidden on desktop (shown in sidebar instead) */}
            <div className="lg:hidden">
              <Concordance terms={termFreq} />
              <Annotations slug={slug} />
            </div>

            {/* RelatedPosts — full version below article on all screen sizes on mobile;
                on desktop the sidebar shows a compact top-3 list, and the full list stays here too */}
            <RelatedPosts currentSlug={slug} allPosts={allPosts} />

            {/* Next in reading path */}
            <NextInPath slug={slug} />

            {/* Prev / Next in source — always below article */}
            <PostNavigation
              prev={prevPost ? { slug: prevPost.slug, title: prevPost.title, date: prevPost.date } : null}
              next={nextPost ? { slug: nextPost.slug, title: nextPost.title, date: nextPost.date } : null}
              source={post.source}
            />
          </div>

          {/* ── Sticky sidebar — desktop only ── */}
          <aside className="hidden lg:block sticky top-6 self-start space-y-0 print:hidden">

            {/* Contents */}
            <div className="pb-5">
              <p className={SIDEBAR_LABEL}>Contents</p>
              <TableOfContents paragraphs={paragraphs} />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-5 pb-5">
              <p className={SIDEBAR_LABEL}>Key terms</p>
              <Concordance terms={termFreq} />
            </div>

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

        </div>
        <MarkPostRead slug={slug} />
      </main>
    </>
  );
}
