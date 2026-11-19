import SceneMark from '@/components/SceneMark';

// What a visitor sees while the tutor works: what is happening, in order, and
// why it takes longer than a search. The site's own mark turns while it reads.

const STEPS = [
  'Finding the passages that bear on your question',
  'Reading them against 150 of Katz’s texts, held in full',
  'Writing an answer, with each quotation linked to its paragraph',
];

export default function TutorWaiting({ seconds, found }: { seconds: number; found: string[] }) {
  const step = found.length === 0 ? 0 : seconds < 14 ? 1 : 2;
  return (
    <div role="status" className="rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-6 sm:px-7">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-7">
        <SceneMark size={84} spin speed={step === 0 ? 5 : 2.5} className="shrink-0 text-gray-400 dark:text-gray-500" />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg text-gray-900 dark:text-gray-100">The tutor is reading.</p>
          <ol className="mt-3 space-y-1.5 text-sm">
            {STEPS.map((s, i) => (
              <li key={s} className={`flex gap-2 ${i === step ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'}`}>
                <span aria-hidden className="w-4 shrink-0 text-center">{i < step ? '✓' : i === step ? '›' : '·'}</span>
                <span>{s}{i === step && '…'}</span>
              </li>
            ))}
          </ol>
          {found.length > 0 && (
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Found in: {found.slice(0, 4).join(' · ')}{found.length > 4 ? ` and ${found.length - 4} more` : ''}
            </p>
          )}
          <p className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            This is an AI model working from the archive, not a search and not Katz. It reads whole essays before it answers, so a new question takes 10 to 20 seconds to begin. Once it has answered, the answer is saved, and anyone who asks the same thing gets it at once.
            {seconds >= 8 && <span className="tabular-nums"> {seconds}s so far.</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
