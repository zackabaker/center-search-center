// The originary scene reduced to a mark: eight figures ringing the amber
// center. Static and unlabeled — the site's glyph, not an illustration.
// Figures take currentColor so the mark sits in any text context.

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
}: {
  size?: number;
  className?: string;
  center?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      {FIGURES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill="currentColor" />
      ))}
      <circle cx={50} cy={50} r={11} fill={center} />
    </svg>
  );
}
