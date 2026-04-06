'use client';

// The center holds still. The periphery circulates.
// Two rings orbit in opposite directions around a fixed point —
// each ring appears to be caused by the other's motion.
export default function CenterIcon() {
  return (
    <div className="relative w-20 h-20 mx-auto mb-6 select-none">
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <style>{`
          @keyframes csc-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
          @keyframes csc-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
          @keyframes csc-pulse {
            0%, 100% { r: 3; opacity: 1; }
            50%       { r: 4.5; opacity: 0.6; }
          }
        `}</style>

        {/* Outer ring — clockwise, slow */}
        <circle
          cx="50" cy="50" r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="18 8"
          strokeLinecap="round"
          className="text-gray-300 dark:text-gray-600"
          style={{ transformOrigin: '50px 50px', animation: 'csc-cw 18s linear infinite' }}
        />

        {/* Middle ring — counter-clockwise, faster */}
        <circle
          cx="50" cy="50" r="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="10 12"
          strokeLinecap="round"
          className="text-gray-400 dark:text-gray-500"
          style={{ transformOrigin: '50px 50px', animation: 'csc-ccw 11s linear infinite' }}
        />

        {/* Inner ring — clockwise again, fastest */}
        <circle
          cx="50" cy="50" r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5 7"
          strokeLinecap="round"
          className="text-gray-300 dark:text-gray-600"
          style={{ transformOrigin: '50px 50px', animation: 'csc-cw 7s linear infinite' }}
        />

        {/* The center — pulses but does not move */}
        <circle
          cx="50" cy="50" r="3"
          fill="currentColor"
          className="text-gray-800 dark:text-gray-200"
          style={{ animation: 'csc-pulse 4s ease-in-out infinite' }}
        />
      </svg>
    </div>
  );
}
