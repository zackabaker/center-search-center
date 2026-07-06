'use client';

import { useState } from 'react';

// Interactive originary-scene walkthrough: the hypothesis stepped through as
// one scene seen at five moments. Pure SVG + CSS transitions on opacity and
// line-length only (no autoplay — user-stepped, reduced-motion friendly).

const STAGES = [
  {
    key: 'convergence',
    label: 'Convergence',
    caption:
      'A group of proto-humans converges on a single central object of desire. Mimetic desire escalates: everyone wants it because everyone else wants it.',
  },
  {
    key: 'crisis',
    label: 'Crisis',
    caption:
      'The pecking order that manages animal competition breaks down. Each reaches; each sees the others reaching. Anyone who grabs will face the entire group.',
  },
  {
    key: 'sign',
    label: 'The first sign',
    caption:
      'At the threshold of violence, the grasping gesture aborts into a pointing gesture. It still designates the object — but names it rather than seizing it.',
  },
  {
    key: 'sacred',
    label: 'The sacred',
    caption:
      'The object, deferred rather than consumed, becomes charged, untouchable — the first sacred thing. The center and the sacred are the same thing at origin.',
  },
  {
    key: 'community',
    label: 'Community',
    caption:
      'The group constituted by shared attention to the same sign is the first human community. Language, the sacred, community, equality: one event, seen from four angles.',
  },
];

const N = 8;
const CX = 200, CY = 150;
const R_OUT = 118;   // figures
const R_NEAR = 44;   // crisis reach
const R_POINT = 74;  // pointing distance

export default function OriginaryScene() {
  const [stage, setStage] = useState(0);
  const s = STAGES[stage];

  const figures = Array.from({ length: N }, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + Math.cos(a) * R_OUT, y: CY + Math.sin(a) * R_OUT, a };
  });

  // reach endpoint per stage: converge → near-grab → retracted point
  const reachR = stage === 0 ? R_POINT + 18 : stage === 1 ? R_NEAR : R_POINT;
  const dashed = stage >= 2;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 mb-5">
      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
        The scene — step through it
      </p>

      <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto block" role="img" aria-label={`Originary scene, stage: ${s.label}`}>
        {/* community ring */}
        <circle
          cx={CX} cy={CY} r={R_OUT}
          fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-gray-400 dark:text-gray-500"
          style={{ opacity: stage === 4 ? 0.9 : 0, transition: 'opacity .45s' }}
        />
        {/* sacred halo */}
        <circle
          cx={CX} cy={CY} r={26}
          fill="none" stroke="#d97706" strokeWidth="2"
          style={{ opacity: stage >= 3 ? 0.85 : 0, transition: 'opacity .45s' }}
        />
        <circle
          cx={CX} cy={CY} r={34}
          fill="none" stroke="#d97706" strokeWidth="1"
          style={{ opacity: stage >= 3 ? 0.4 : 0, transition: 'opacity .45s' }}
        />
        {/* central object */}
        <circle cx={CX} cy={CY} r={13} className={stage >= 3 ? 'fill-amber-500' : 'fill-gray-500 dark:fill-gray-400'} style={{ transition: 'fill .45s' }} />

        {/* reach lines */}
        {figures.map((f, i) => {
          const ex = CX + Math.cos(f.a) * reachR;
          const ey = CY + Math.sin(f.a) * reachR;
          return (
            <line
              key={i}
              x1={f.x} y1={f.y} x2={ex} y2={ey}
              stroke="currentColor"
              strokeWidth={stage === 1 ? 2.4 : 1.6}
              strokeDasharray={dashed ? '4 4' : 'none'}
              className={stage === 1 ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
              style={{ transition: 'all .45s' }}
            />
          );
        })}

        {/* figures */}
        {figures.map((f, i) => (
          <circle
            key={i}
            cx={f.x} cy={f.y} r={8}
            className="fill-gray-700 dark:fill-gray-300"
          />
        ))}
      </svg>

      {/* caption */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center max-w-md mx-auto min-h-[3.5rem] mt-2 mb-4">
        {s.caption}
      </p>

      {/* controls */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <button
          onClick={() => setStage((x) => Math.max(0, x - 1))}
          disabled={stage === 0}
          aria-label="Previous stage"
          className="px-2.5 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          ←
        </button>
        {STAGES.map((st, i) => (
          <button
            key={st.key}
            onClick={() => setStage(i)}
            aria-current={i === stage ? 'step' : undefined}
            className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors border ${
              i === stage
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {i + 1}. {st.label}
          </button>
        ))}
        <button
          onClick={() => setStage((x) => Math.min(STAGES.length - 1, x + 1))}
          disabled={stage === STAGES.length - 1}
          aria-label="Next stage"
          className="px-2.5 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
