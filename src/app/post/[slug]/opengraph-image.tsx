import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/parser';

export const alt = 'Center Study';
export const size = { width: 1200, height: 630 };
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
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post
    ? post.title.length > 72
      ? post.title.slice(0, 69) + '…'
      : post.title
    : 'Center Study';

  const source = post ? (SOURCE_LABELS[post.source] ?? post.source) : '';
  const date = post?.date ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0c0c0c',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 72px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top bar: site name + concentric circle mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                border: '2px solid #666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#888',
                }}
              />
            </div>
          </div>
          <span
            style={{
              color: '#666',
              fontSize: '17px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Center Study
          </span>
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            paddingTop: '32px',
            paddingBottom: '32px',
          }}
        >
          <div
            style={{
              color: '#f0f0f0',
              fontSize: title.length > 48 ? '48px' : '60px',
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              maxWidth: '960px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: source + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {source && (
            <span
              style={{
                background: '#1c1c1c',
                border: '1px solid #333',
                color: '#999',
                fontSize: '15px',
                padding: '6px 16px',
                borderRadius: '6px',
              }}
            >
              {source}
            </span>
          )}
          {date && (
            <span style={{ color: '#444', fontSize: '15px' }}>{date}</span>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
