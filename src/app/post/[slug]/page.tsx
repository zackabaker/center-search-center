import { getAllPosts, getPostBySlug } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentSource } from '@/lib/types';
import HighlightedContent from '@/components/HighlightedContent';
import ReadingProgress from '@/components/ReadingProgress';
import ReadingControls from '@/components/ReadingControls';
import RelatedPosts from '@/components/RelatedPosts';
import BookmarkButton from '@/components/BookmarkButton';
import CitationButton from '@/components/CitationButton';
import Annotations from '@/components/Annotations';
import TrackView from '@/components/TrackView';
import ShareButton from '@/components/ShareButton';

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

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.slice(0, 20).map((post) => ({ slug: post.slug }));
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

  return (
    <>
      <ReadingProgress />
      <TrackView slug={slug} title={post.title} source={post.source} date={post.date} />
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12 overflow-x-hidden">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 print:hidden">
          <Link
            href={q ? `/search?q=${encodeURIComponent(q)}` : '/'}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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

          <HighlightedContent
            paragraphs={paragraphs}
            postTitle={post.title}
            postUrl={`https://center.study/post/${slug}`}
          />
        </article>

        <Annotations slug={slug} />
        <RelatedPosts currentSlug={slug} allPosts={allPosts} />
      </main>
    </>
  );
}
