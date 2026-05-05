'use client';

/**
 * The center study circles — same as CenterIcon but with a controllable speed.
 * speed=1 → idle (18s/11s/7s, like the home page)
 * speed=4 → active/loading (4.5s/2.75s/1.75s)
 * speed=8 → fast search (2.25s/1.4s/0.875s)
 *
 * Changing speed causes animations to restart at 0° — intentional, the sudden
 * jump communicates a state change and is barely perceptible on a dashed circle.
 */
interface Props {
  size?: number;
  speed?: number;
  className?: string;
}

export default function AnimatedSearchIcon({ size = 80, speed = 1, className = '' }: Props) {
  const outer = +(18 / speed).toFixed(2);
  const mid   = +(11 / speed).toFixed(2);
  const inner = +( 7 / speed).toFixed(2);
  const pulse = +( 4 / speed).toFixed(2);

  return (
    <div
      style={{ width: size, height: size }}
      className={`select-none flex-shrink-0 ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        {/* Keyframes injected inline — names match CenterIcon so they share safely */}
        <defs>
          <style>{`
            @keyframes csc-cw   { to { transform: rotate(360deg)  } }
            @keyframes csc-ccw  { to { transform: rotate(-360deg) } }
            @keyframes csc-dpulse {
              0%, 100% { opacity: 1;   r: 3;   }
              50%       { opacity: 0.5; r: 4.2; }
            }
          `}</style>
        </defs>

        {/* Outer ring — clockwise */}
        <circle
          cx="50" cy="50" r="40"
          fill="none" stroke="currentColor" strokeWidth="1"
          strokeDasharray="18 8" strokeLinecap="round"
          className="text-gray-300 dark:text-gray-600"
          style={{ transformOrigin: '50px 50px', animation: `csc-cw ${outer}s linear infinite` }}
        />

        {/* Middle ring — counter-clockwise */}
        <circle
          cx="50" cy="50" r="26"
          fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeDasharray="10 12" strokeLinecap="round"
          className="text-gray-400 dark:text-gray-500"
          style={{ transformOrigin: '50px 50px', animation: `csc-ccw ${mid}s linear infinite` }}
        />

        {/* Inner ring — clockwise, fastest */}
        <circle
          cx="50" cy="50" r="14"
          fill="none" stroke="currentColor" strokeWidth="1"
          strokeDasharray="5 7" strokeLinecap="round"
          className="text-gray-300 dark:text-gray-600"
          style={{ transformOrigin: '50px 50px', animation: `csc-cw ${inner}s linear infinite` }}
        />

        {/* The center — pulses but does not move */}
        <circle
          cx="50" cy="50" r="3"
          fill="currentColor"
          className="text-gray-800 dark:text-gray-200"
          style={{ animation: `csc-dpulse ${pulse}s ease-in-out infinite` }}
        />
      </svg>
    </div>
  );
}
