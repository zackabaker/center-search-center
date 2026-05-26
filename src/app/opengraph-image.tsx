import { ImageResponse } from 'next/og';

export const alt = 'Center Study Center — Archive of Adam Katz & Dennis Bouvard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          padding: '80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid accent */}
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

        {/* Source indicator pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
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
            center.study
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '700',
            color: '#f8fafc',
            lineHeight: 1.1,
            marginBottom: '28px',
            letterSpacing: '-0.02em',
          }}
        >
          Center Study Center
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            fontFamily: 'sans-serif',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          Complete searchable archive of Adam Katz &amp; Dennis Bouvard — originary thinking, the center, deferral, sovereignty
        </div>

        {/* Bottom stats bar */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginTop: '56px',
            borderTop: '1px solid rgba(148,163,184,0.2)',
            paddingTop: '32px',
            fontFamily: 'sans-serif',
          }}
        >
          {['700+ texts', 'Full-text search', 'AI Q&A', '5 venues'].map((label) => (
            <div key={label} style={{ color: '#64748b', fontSize: '18px' }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
