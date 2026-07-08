import { getPostBySlug } from '@/lib/parser';
import { renderOgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Center Study';
export const size = OG_SIZE;
export const contentType = 'image/png';
// Cache each generated card for a day — it loads the corpus to render, so don't
// regenerate on every social unfurl.
export const revalidate = 86400;

const SOURCE_LABELS: Record<string, string> = {
  substack: 'Bouvard Substack',
  gablog: 'GABlog',
  book: 'Anthropomorphics',
  pdf: 'Essays & Articles',
  reddit: 'Reddit',
  twitter: 'X / Twitter',
  chronicle: 'Chronicles of Love & Resentment',
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post
    ? post.title.length > 96
      ? post.title.slice(0, 93) + '…'
      : post.title
    : 'Center Study';

  const source = post ? (SOURCE_LABELS[post.source] ?? post.source) : '';
  const date = post?.date ?? '';
  const meta = [source, date].filter(Boolean).join(' · ');

  return renderOgCard({
    eyebrow: 'Center.Study',
    title,
    meta: meta || undefined,
  });
}
