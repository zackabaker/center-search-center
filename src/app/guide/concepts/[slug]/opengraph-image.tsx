import { ImageResponse } from 'next/og';
import { CONCEPTS, getConceptBySlug } from '@/data/guide/concepts';
import GLOSSARY from '@/data/guide/concept-glossary.json';

export const alt = 'Center Study concept';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

// Share card per concept: the verbatim defining quote is the image —
// quote-first even in the OG layer.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  const g = (GLOSSARY as Record<string, { definitionQuote?: string; definitionSource?: string; definitionAuthor?: string }>)[slug];

  const title = concept?.title ?? 'Center Study';
  const quoteRaw = g?.definitionQuote || concept?.definition || concept?.subtitle || '';
  const quote = quoteRaw.length > 280 ? quoteRaw.slice(0, 280).replace(/\s+\S*$/, '') + '…' : quoteRaw;
  // Satori requires a single text child per node — build display strings up front.
  const quoteText = quote ? `“${quote}”` : '';
  const attribution = g?.definitionSource
    ? `— ${g.definitionAuthor ?? ''}${g.definitionAuthor ? ', ' : ''}${g.definitionSource}`
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle at top right, rgba(59,130,246,0.15) 0%, transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}>
          <div
            style={{
              background: 'rgba(59,130,246,0.2)',
              border: '1px solid rgba(59,130,246,0.4)',
              color: '#93c5fd',
              fontSize: '14px',
              fontFamily: 'sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '999px',
            }}
          >
            center.study · concept
          </div>
        </div>

        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f8fafc',
            lineHeight: 1.1,
            marginBottom: '30px',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        {quoteText ? (
          <div
            style={{
              display: 'flex',
              borderLeft: '4px solid #93c5fd',
              paddingLeft: '28px',
            }}
          >
            <div
              style={{
                fontSize: quote.length > 180 ? '26px' : '32px',
                color: '#cbd5e1',
                lineHeight: 1.45,
                maxWidth: '960px',
              }}
            >
              {quoteText}
            </div>
          </div>
        ) : null}

        {attribution ? (
          <div
            style={{
              marginTop: '26px',
              fontSize: '20px',
              color: '#64748b',
              fontFamily: 'sans-serif',
            }}
          >
            {attribution}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
