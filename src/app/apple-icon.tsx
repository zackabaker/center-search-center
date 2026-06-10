import { ImageResponse } from 'next/og';

// iOS home-screen icon ("Add to Home Screen"). iOS ignores SVG favicons and
// manifest icons — it wants an apple-touch-icon PNG, which Next generates
// from this file. Same concentric-circles mark as the site logo, on a dark
// field so it reads as an app tile (iOS rounds the corners itself).

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
          background: '#111111',
        }}
      >
        <svg width="132" height="132" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#9ca3af" strokeWidth="3"
            strokeDasharray="18 8" strokeLinecap="round"
            transform="rotate(20 50 50)"
          />
          <circle
            cx="50" cy="50" r="26"
            fill="none" stroke="#e5e7eb" strokeWidth="4"
            strokeDasharray="10 12" strokeLinecap="round"
            transform="rotate(-30 50 50)"
          />
          <circle
            cx="50" cy="50" r="14"
            fill="none" stroke="#9ca3af" strokeWidth="3"
            strokeDasharray="5 7" strokeLinecap="round"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="50" r="5" fill="#ffffff" />
        </svg>
      </div>
    ),
    size
  );
}
