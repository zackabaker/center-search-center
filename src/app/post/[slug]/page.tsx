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
import { getPostTermFrequency } from '@/lib/search-index';

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
      !p.match(/^Subscribe$/)
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

  return (
    <>
      <ReadingProgress />
      <TrackView slug={slug} title={post.title} source={post.source} date={post.date} />
      <main className="max-w-3xl mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">
        {/* Top nav */}
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

          {/* Table of contents — only renders if 3+ headings found */}
          <TableOfContents paragraphs={paragraphs} />

          <HighlightedContent
            paragraphs={paragraphs}
            postTitle={post.title}
            postUrl={`https://center.study/post/${slug}`}
          />
        </article>

        {/* Key terms concordance */}
        <Concordance terms={termFreq} />

        <Annotations slug={slug} />
        <RelatedPosts currentSlug={slug} allPosts={allPosts} />

        {/* Prev / Next in source */}
        <PostNavigation
          prev={prevPost ? { slug: prevPost.slug, title: prevPost.title, date: prevPost.date } : null}
          next={nextPost ? { slug: nextPost.slug, title: nextPost.title, date: nextPost.date } : null}
          source={post.source}
        />
      </main>
    </>
  );
}
