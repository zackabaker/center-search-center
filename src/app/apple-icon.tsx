import { ImageResponse } from 'next/og';

// iOS home-screen icon ("Add to Home Screen"). iOS ignores SVG favicons and
// manifest icons — it wants an apple-touch-icon PNG, which Next generates from
// this file. The scene glyph (eight figures ringing the amber center — the
// site mark) on a dark tile; iOS rounds the corners itself.

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const FIGURES: Array<[number, number]> = [
  [50, 12],
  [76.87, 23.13],
  [88, 50],
  [76.87, 76.87],
  [50, 88],
  [23.13, 76.87],
  [12, 50],
  [23.13, 23.13],
];

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
        <svg width="132" height="132" viewBox="0 0 100 100">
          {FIGURES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={7} fill="#cbd5e1" />
          ))}
          {/* Faint sacred halo + amber center */}
          <circle cx="50" cy="50" r="19" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.35" />
          <circle cx="50" cy="50" r="11" fill="#d97706" />
        </svg>
      </div>
    ),
    size
  );
}
