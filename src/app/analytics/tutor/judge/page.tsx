import crypto from 'crypto';
import { RoomHead } from '../../ui';
import JudgeClient, { type JudgeQuestion } from './JudgeClient';
import high from '../../../../../tutor/eval-runs/judge-opus-high.json';
import medium from '../../../../../tutor/eval-runs/judge-opus-medium.json';
import low from '../../../../../tutor/eval-runs/judge-opus-low.json';
import sonnet from '../../../../../tutor/eval-runs/judge-sonnet-high.json';

// /analytics/tutor/judge — a blind comparison. Eight hard questions, each
// answered by four setups of the tutor; the answers are shown as A–D in an
// order shuffled per question, and the owner picks the best and the worst
// before finding out which was which.

type Run = { rows: { id: string; q: string; a: string; words: number; firstWords: number; seconds: number; cost: number }[] };
const SETUPS: { key: string; label: string; run: Run }[] = [
  { key: 'opus-high', label: 'Opus 5.5, high thinking', run: high as Run },
  { key: 'opus-medium', label: 'Opus 5.5, medium thinking (live now)', run: medium as Run },
  { key: 'opus-low', label: 'Opus 5.5, low thinking', run: low as Run },
  { key: 'sonnet-high', label: 'Sonnet 5.5, high thinking', run: sonnet as Run },
];

export default function JudgePage() {
  const ids = (high as Run).rows.map((r) => r.id).sort();
  const questions: JudgeQuestion[] = ids.map((id) => {
    const answers = SETUPS.flatMap((s) => {
      const row = s.run.rows.find((r) => r.id === id);
      return row ? [{ setup: s.key, a: row.a, words: row.words, firstWords: row.firstWords, seconds: row.seconds, cost: row.cost }] : [];
    });
    // A fixed shuffle per question, so the letters don't move between visits.
    answers.sort((x, y) =>
      crypto.createHash('sha1').update(id + x.setup).digest('hex') < crypto.createHash('sha1').update(id + y.setup).digest('hex') ? -1 : 1,
    );
    return { id, q: (high as Run).rows.find((r) => r.id === id)!.q, answers };
  });
  return (
    <>
      <RoomHead title="Tutor: blind comparison">
        Eight hard questions, each answered four ways. The answers are lettered in a different order for every question. Pick the best and the worst for each, then reveal which setup wrote which, with how long each took.
      </RoomHead>
      <JudgeClient questions={questions} setups={SETUPS.map(({ key, label }) => ({ key, label }))} />
    </>
  );
}
