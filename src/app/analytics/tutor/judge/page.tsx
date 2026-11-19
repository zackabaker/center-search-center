import { RoomHead } from '../../ui';
import JudgeClient, { type Round } from './JudgeClient';
import medium from '../../../../../tutor/eval-runs/quick-opus-medium.json';
import low from '../../../../../tutor/eval-runs/quick-opus-low.json';
import sonnet from '../../../../../tutor/eval-runs/quick-sonnet-low.json';

// /analytics/tutor/judge — a quick blind comparison. Six everyday questions,
// each shown once with two short answers side by side from two different
// setups; the owner clicks the better one and the next pair appears. Six
// clicks, then the result.

type Run = { rows: { id: string; q: string; a: string; firstWords: number; seconds: number; words: number }[] };
const SETUPS = {
  'opus-medium': { label: 'Opus 5.5, medium thinking', run: medium as Run },
  'opus-low': { label: 'Opus 5.5, low thinking', run: low as Run },
  'sonnet-low': { label: 'Sonnet 5.5, low thinking', run: sonnet as Run },
} as const;
type Key = keyof typeof SETUPS;

// Each pairing appears twice, and each setup sits on the left and on the right equally often.
const PAIRS: [Key, Key][] = [
  ['opus-medium', 'opus-low'], ['sonnet-low', 'opus-medium'], ['opus-low', 'sonnet-low'],
  ['opus-low', 'opus-medium'], ['opus-medium', 'sonnet-low'], ['sonnet-low', 'opus-low'],
];

export default function JudgePage() {
  const ids = (medium as Run).rows.map((r) => r.id).sort();
  const row = (k: Key, id: string) => SETUPS[k].run.rows.find((r) => r.id === id)!;
  const rounds: Round[] = ids.map((id, i) => {
    const [l, r] = PAIRS[i % PAIRS.length];
    return { id, q: row(l, id).q, left: { setup: l, a: row(l, id).a }, right: { setup: r, a: row(r, id).a } };
  });
  const med = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)] ?? 0;
  const setups = (Object.keys(SETUPS) as Key[]).map((key) => ({
    key,
    label: SETUPS[key].label,
    firstWords: med(SETUPS[key].run.rows.slice(1).map((r) => r.firstWords)),
    seconds: med(SETUPS[key].run.rows.slice(1).map((r) => r.seconds)),
  }));
  return (
    <>
      <RoomHead title="Tutor: which answer is better?">
        Six questions, two short answers each. Click the better one (or press ← or →; ↓ if you can’t choose). You aren’t told which setup wrote which until the end.
      </RoomHead>
      <JudgeClient rounds={rounds} setups={setups} />
    </>
  );
}
