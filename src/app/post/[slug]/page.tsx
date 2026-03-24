import { getAllPosts, getPostBySlug } from '@/lib/parser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ContentSource } from '@/lib/types';
import HighlightedContent from '@/components/HighlightedContent';
import ReadingProgress from '@/components/ReadingProgress';
import ReadingControls from '@/components/ReadingControls';
import RelatedPosts from '@/components/RelatedPosts';

const SOURCE_LABELS: Record<ContentSource, string> = {
  substack: 'Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'PDF',
  glossary: 'Glossary',
};

const SOURCE_COLORS: Record<ContentSource, string> = {
  substack: 'bg-orange-100 text-orange-800',
  gablog: 'bg-blue-100 text-blue-800',
  book: 'bg-purple-100 text-purple-800',
  pdf: 'bg-green-100 text-green-800',
  glossary: 'bg-teal-100 text-teal-800',
};

// Generate only a small subset at build time; the rest are built on-demand via ISR
export async function generateStaticParams() {
  const posts = getAllPosts();
  // Pre-render only the 20 most recent posts to stay within Vercel disk limits
  return posts.slice(0, 20).map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;
export const revalidate = 3600; // Re-validate cached pages every hour

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 230));

  const paragraphs = post.content
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .filter(
      (p) =>
        !p.includes('Thanks for reading Center Study Center') &&
        !p.match(/^Subscribe$/)
    );

  return (
    <>
      <ReadingProgress />
      <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12 overflow-x-hidden">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <ReadingControls />
        </div>

        <article>
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${SOURCE_COLORS[post.source]}`}>
                {SOURCE_LABELS[post.source]}
              </span>
              {post.date && (
                <span className="text-xs sm:text-sm text-gray-400">{post.date}</span>
              )}
              {post.source !== 'glossary' && (
                <>
                  <span className="text-xs sm:text-sm text-gray-400">{readingTime} min</span>
                  <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">{wordCount.toLocaleString()} words</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{post.title}</h1>
            {post.url && (
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-2 inline-block"
              >
                View on Substack
              </a>
            )}
          </header>

          {post.source === 'glossary' ? (
            <div className="bg-white dark:bg-gray-800 border-l-4 border-teal-500 rounded-lg p-6 sm:p-8 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
                Definition
              </p>
              <p className="text-lg sm:text-xl leading-relaxed text-gray-900 dark:text-gray-100">
                {post.content.replace(/^[^:]+:\s*/, '')}
              </p>
            </div>
          ) : (
            <HighlightedContent paragraphs={paragraphs} />
          )}
        </article>

        <RelatedPosts currentSlug={slug} allPosts={allPosts} />
      </main>
    </>
  );
}
