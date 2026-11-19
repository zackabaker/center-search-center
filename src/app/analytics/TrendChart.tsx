'use client';

import { useMemo, useRef, useState } from 'react';

// A single-series line chart for the analytics console: 2px line, 10% area
// wash, hairline gridlines, endpoint dot + direct label, and a crosshair
// tooltip (pointer and keyboard both). One series per chart — identity is the
// title, so there is no legend. Colors ride currentColor from the wrapper's
// text class, so light/dark swap in the parent, and every value is also
// reachable in the table views beside these charts.

// `mark` pins an owner annotation ("posted the thread on X") to that point:
// a dashed rule with a diamond on the plot, and the note in the tooltip.
export type TrendPoint = { label: string; value: number; mark?: string };

const W = 600;
const H = 150;
const PAD_L = 8;
const PAD_R = 8;
const PAD_T = 14;
const PAD_B = 6;

function niceMax(v: number): number {
  if (v <= 5) return 5;
  const pow = 10 ** Math.floor(Math.log10(v));
  for (const m of [1, 2, 5, 10]) {
    if (m * pow >= v) return m * pow;
  }
  return 10 * pow;
}

export default function TrendChart({
  title,
  points,
  colorClass,
  headline,
  deltaPct,
  deltaVs,
  deltaFallback,
  note,
}: {
  title: string;
  points: TrendPoint[];
  /** e.g. "text-[#2a78d6] dark:text-[#3987e5]" — the series color. */
  colorClass: string;
  /** The big number above the plot (usually this week's total). */
  headline: string;
  /** Week-over-week change, percent; null when last week was empty. */
  deltaPct: number | null;
  deltaVs: string;
  /** Shown in place of the change when there is no earlier period to compare against. */
  deltaFallback?: string;
  note?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const geom = useMemo(() => {
    const max = niceMax(Math.max(1, ...points.map((p) => p.value)));
    const n = points.length;
    const x = (i: number) => PAD_L + (n <= 1 ? 0 : (i / (n - 1)) * (W - PAD_L - PAD_R));
    const y = (v: number) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B);
    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join('');
    const area = `${line}L${x(n - 1).toFixed(1)},${y(0).toFixed(1)}L${x(0).toFixed(1)},${y(0).toFixed(1)}Z`;
    return { max, x, y, line, area };
  }, [points]);

  if (points.length < 2) return null;
  const last = points.length - 1;
  const active = hover ?? last;

  const fromClientX = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const fx = ((clientX - r.left) / r.width) * W;
    const i = Math.round(((fx - PAD_L) / (W - PAD_L - PAD_R)) * (points.length - 1));
    return Math.max(0, Math.min(points.length - 1, i));
  };

  const deltaEl =
    deltaPct === null ? (
      deltaFallback ? <span className="text-gray-500 dark:text-gray-400">{deltaFallback}</span> : null
    ) : (
      <span
        className={
          deltaPct > 0
            ? 'text-[#006300] dark:text-[#0ca30c]'
            : deltaPct < 0
              ? 'text-rose-700 dark:text-rose-400'
              : 'text-gray-500 dark:text-gray-400'
        }
      >
        {deltaPct > 0 ? '+' : ''}{deltaPct}%{' '}{deltaVs}
      </span>
    );

  return (
    <div className="min-w-0">
      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{headline}</span>
        <span className="text-xs">{deltaEl}</span>
      </div>
      <div
        ref={wrapRef}
        className={`relative mt-2 ${colorClass}`}
        tabIndex={0}
        role="img"
        aria-label={`${title}: ${points.map((p) => `${p.label} ${p.value}${p.mark ? ` (${p.mark})` : ''}`).join(', ')}`}
        onPointerMove={(e) => setHover(fromClientX(e.clientX))}
        onPointerLeave={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { setHover(Math.max(0, active - 1)); e.preventDefault(); }
          else if (e.key === 'ArrowRight') { setHover(Math.min(last, active + 1)); e.preventDefault(); }
          else if (e.key === 'Escape') setHover(null);
        }}
        onBlur={() => setHover(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden>
          {/* gridlines: 0 / mid / max — hairline, recessive */}
          <g className="text-gray-200 dark:text-gray-800" stroke="currentColor" vectorEffect="non-scaling-stroke">
            {[0, 0.5, 1].map((f) => (
              <line
                key={f}
                x1={PAD_L} x2={W - PAD_R}
                y1={geom.y(geom.max * f)} y2={geom.y(geom.max * f)}
                strokeWidth={1} vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          {/* owner annotations — neutral ink, so they read as notes, not data */}
          <g className="text-gray-500 dark:text-gray-400">
            {points.map((p, i) =>
              p.mark ? (
                <g key={i}>
                  <line
                    x1={geom.x(i)} x2={geom.x(i)} y1={PAD_T} y2={H - PAD_B}
                    stroke="currentColor" strokeWidth={1} strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={`M${geom.x(i)},${PAD_T - 9}l5,5l-5,5l-5,-5Z`}
                    fill="currentColor" stroke="var(--background)" strokeWidth={1}
                  />
                </g>
              ) : null,
            )}
          </g>
          <path d={geom.area} fill="currentColor" opacity={0.1} />
          <path
            d={geom.line}
            fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
          />
          {/* crosshair */}
          {hover !== null && (
            <line
              x1={geom.x(hover)} x2={geom.x(hover)} y1={PAD_T - 6} y2={H - PAD_B}
              stroke="currentColor" strokeWidth={1} opacity={0.35} vectorEffect="non-scaling-stroke"
            />
          )}
          {/* active dot with surface ring */}
          <circle
            cx={geom.x(active)} cy={geom.y(points[active].value)} r={4.5}
            fill="currentColor" stroke="var(--background)" strokeWidth={2}
          />
        </svg>
        {/* tooltip — value leads, label follows */}
        <div
          className="pointer-events-none absolute -top-1 z-10 max-w-[14rem] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-1.5 py-0.5 text-xs shadow-sm"
          style={{
            left: `${(geom.x(active) / W) * 100}%`,
            transform: `translateX(${active > points.length * 0.7 ? '-100%' : active < points.length * 0.3 ? '0%' : '-50%'})`,
            visibility: hover !== null ? 'visible' : 'hidden',
          }}
        >
          <div className="whitespace-nowrap">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{points[active].value.toLocaleString('en-US')}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">{points[active].label}</span>
          </div>
          {points[active].mark && (
            <div className="mt-0.5 border-t border-gray-200 dark:border-gray-700 pt-0.5 text-gray-700 dark:text-gray-300">
              ◆ {points[active].mark}
            </div>
          )}
        </div>
        {/* endpoint direct label (hidden while the crosshair is near it) */}
        {(hover === null || hover < points.length - 4) && (
          <div className="pointer-events-none absolute -top-1 right-0 text-xs text-gray-700 dark:text-gray-300">
            {points[last].value.toLocaleString('en-US')}
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-gray-400 dark:text-gray-600">
        <span>{points[0].label}</span>
        <span>{note ?? points[last].label}</span>
      </div>
    </div>
  );
}
