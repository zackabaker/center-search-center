import SceneMark from '@/components/SceneMark';

// The search loading state (owner direction, 2026-11-17): instead of filler
// suggestions, the site's mark rolls along a hairline like a wheel, drawing
// the line behind it, with one line of text saying what is being searched.
// Pure CSS (keyframes in globals.css), so it renders in server fallbacks too.
// The track is capped at 22rem so the turn rate matches the distance rolled.
export default function RollingLoader({
  label,
  className = '',
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={`mx-auto w-full max-w-[22rem] ${className}`}>
      <div className="roll-track relative h-7 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-200 dark:bg-gray-800" />
        <div className="roll-wheel absolute left-0 bottom-0.5 w-6 h-6 text-gray-900 dark:text-gray-100">
          <div className="roll-spin w-6 h-6">
            <SceneMark size={24} />
          </div>
        </div>
      </div>
      {label && (
        <p className="mt-3 text-center text-sm text-gray-600 dark:text-gray-300 truncate">{label}</p>
      )}
    </div>
  );
}
