'use client';

// A thin indeterminate progress bar pinned to the very top of the viewport.
// Used to signal background work the page can't otherwise show — the initial
// search-index fetch and the lazy archive-index fetch — so a slow load on
// mobile reads as "working", not "frozen". Render it conditionally; it
// animates itself via the keyframes injected once below.
export default function TopLoadingBar({ label }: { label?: string }) {
  return (
    <>
      <style>{`
        @keyframes csc-bar-slide {
          0%   { left: -40%; width: 40%; }
          50%  { left: 25%;  width: 50%; }
          100% { left: 100%; width: 40%; }
        }
      `}</style>
      <div
        role="progressbar"
        aria-label={label || 'Loading'}
        className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-blue-100 dark:bg-blue-950 overflow-hidden print:hidden"
      >
        <div
          className="absolute top-0 h-full bg-blue-500 dark:bg-blue-400"
          style={{ animation: 'csc-bar-slide 1.1s ease-in-out infinite' }}
        />
      </div>
    </>
  );
}
