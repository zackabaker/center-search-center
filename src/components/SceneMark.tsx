// The originary scene reduced to a mark: eight figures ringing the amber
// center. Static and unlabeled — the site's glyph, not an illustration.
// Figures take currentColor so the mark sits in any text context.
//
// With `spin`, the ring of figures circulates around the still center — the
// theory as motion: the center holds, the periphery moves. `speed` scales the
// rotation rate (1 = idle ~18s/turn, higher = faster) so search/loading states
// can accelerate it. Reduced-motion is honored globally in globals.css.

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

export default function SceneMark({
  size = 16,
  className = '',
  center = '#d97706',
  spin = false,
  speed = 1,
}: {
  size?: number;
  className?: string;
  center?: string;
  spin?: boolean;
  speed?: number;
}) {
  const dur = +(18 / Math.max(speed, 0.1)).toFixed(2);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <g
        className="scene-ring"
        style={spin ? { animation: `scene-spin ${dur}s linear infinite` } : undefined}
      >
        {FIGURES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill="currentColor" />
        ))}
      </g>
      <circle
        cx={50}
        cy={50}
        r={11}
        fill={center}
        style={spin ? { animation: `scene-pulse ${(dur / 2).toFixed(2)}s ease-in-out infinite` } : undefined}
      />
    </svg>
  );
}
