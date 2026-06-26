import { ImageResponse } from 'next/og';

// iOS home-screen icon ("Add to Home Screen"). iOS ignores SVG favicons and
// manifest icons — it wants an apple-touch-icon PNG, which Next generates from
// this file. The concentric "center" mark (same as the site logo) on a dark
// tile with a little depth; iOS rounds the corners itself. Strokes are heavier
// and brighter than the favicon so the orbits still read at ~120px.

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#101216',
          backgroundImage:
            'radial-gradient(circle at 50% 40%, #262b35 0%, #14171c 56%, #0a0b0d 100%)',
        }}
      >
        <svg width="150" height="150" viewBox="0 0 100 100">
          {/* Outer orbit */}
          <circle
            cx="50" cy="50" r="42"
            fill="none" stroke="#94a3b8" strokeWidth="4"
            strokeDasharray="20 9" strokeLinecap="round"
            transform="rotate(18 50 50)"
          />
          {/* Middle orbit — brightest, the focal ring */}
          <circle
            cx="50" cy="50" r="28"
            fill="none" stroke="#eef2f7" strokeWidth="5.5"
            strokeDasharray="13 12" strokeLinecap="round"
            transform="rotate(-26 50 50)"
          />
          {/* Inner orbit */}
          <circle
            cx="50" cy="50" r="15"
            fill="none" stroke="#94a3b8" strokeWidth="4"
            strokeDasharray="7 8" strokeLinecap="round"
            transform="rotate(46 50 50)"
          />
          {/* Faint halo + bright center */}
          <circle cx="50" cy="50" r="9" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.25" />
          <circle cx="50" cy="50" r="6.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    size
  );
}
