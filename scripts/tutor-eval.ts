/**
 * Runs the tutor's eval set (tutor/eval.json) and writes the answers and
 * checks to tutor/eval-runs/<name>.json. Each question is asked as the first
 * of a fresh conversation, with the context the site builds.
 *
 *   npx tsx --env-file=.env.local scripts/tutor-eval.ts <name> [--only core-01,thin-02] [--sample]
 *   TUTOR_MODEL=claude-sonnet-5-5 TUTOR_EFFORT=low … to try another setup
 *
 * What it checks by itself: every link resolves to a real text and paragraph;
 * every quotation followed by a link appears in the paragraphs it cites; and,
 * for the "thin" and "trap" questions, whether the answer says plainly that
 * the archive doesn't have it. Whether the teaching is any good is for a
 * person to judge, against reference answers.
 */
import fs from 'fs';
import path from 'path';
import { canonText, indexText, promptText } from '../src/lib/tutor/context';
import { streamTutor, tutorCost, TUTOR_MODEL } from '../src/lib/tutor/model';
import { buildTurn } from '../src/lib/tutor/turn';
import { checkAnswer } from '../src/lib/tutor/verify';
import { embedQuery } from '../src/lib/embed';

type Q = { id: string; kind: string; q: string; note?: string };
type Row = Q & {
  a: string; words: number; firstWords: number; seconds: number; cost: number; stop: string | null;
  links: number; badLinks: string[]; quotes: number; badQuotes: { quote: string; href: string; inText: boolean }[];
  saysNotThere: boolean; strength: string;
};

// The tutor saying the archive doesn't have something.
const NOT_THERE = /\b(doesn['’]t|does not|didn['’]t|did not|never|no (such|text|essay|post|record|passage|chapter)|not (something|a topic|in the archive|among|one of|aware)|isn['’]t|is not|there is no|nothing (i['’]ve|i have|in)|can['’]t (find|give|quote|cite|link)|cannot (find|give|quote|cite|link)|outside the archive|haven['’]t been shown|have not been shown|wasn['’]t shown|only \d+ chapters|has \d+ chapters)\b/i;

const SAMPLE = ['core-03', 'core-07', 'apply-02', 'apply-10', 'new-02', 'new-08', 'thin-01', 'thin-07', 'trap-01', 'trap-04'];

async function main() {
  const name = process.argv[2];
  if (!name || name.startsWith('--')) throw new Error('Give the run a name.');
  const onlyArg = process.argv.indexOf('--only');
  const only = process.argv.includes('--sample') ? SAMPLE : onlyArg > 0 ? process.argv[onlyArg + 1].split(',') : null;
  const all: Q[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tutor', 'eval.json'), 'utf-8'));
  const questions = only ? all.filter((q) => only.includes(q.id)) : all;
  const stable = [canonText(), `${indexText()}\n\n---\n\n${promptText()}`];
  const dir = path.join(process.cwd(), 'tutor', 'eval-runs');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.json`);
  const rows: Row[] = [];
  const setup = { model: TUTOR_MODEL, effort: process.env.TUTOR_EFFORT || 'high' };

  const run = async (q: Q): Promise<void> => {
    const { content, strength } = buildTurn(q.q, q.q, await embedQuery(q.q));
    const t0 = Date.now();
    let first = 0;
    let a = '';
    let cost = 0;
    let stop: string | null = null;
    try {
      for await (const ev of streamTutor({ stable, messages: [{ role: 'user', content }] })) {
        if (ev.type === 'text') { if (!first) first = Date.now() - t0; a += ev.text; }
        else { cost = tutorCost(ev.model, ev.usage); stop = ev.stop; }
      }
    } catch (e) {
      stop = `error: ${(e as Error).message.slice(0, 120)}`;
    }
    const c = checkAnswer(a);
    rows.push({
      ...q, a, words: a.split(/\s+/).filter(Boolean).length,
      firstWords: Math.round(first / 100) / 10, seconds: Math.round((Date.now() - t0) / 100) / 10,
      cost: Math.round(cost * 100) / 100, stop,
      links: c.links, badLinks: c.badLinks, quotes: c.quotes, badQuotes: c.badQuotes,
      saysNotThere: NOT_THERE.test(a.slice(0, 900)), strength,
    });
    fs.writeFileSync(file, JSON.stringify({ name, setup, rows }, null, 1) + '\n');
    console.log(`${q.id}  ${rows[rows.length - 1].firstWords}s/${rows[rows.length - 1].seconds}s  $${cost.toFixed(2)}  ${c.quotes}q/${c.badQuotes.length}bad  ${c.links}l/${c.badLinks.length}bad  ${stop}`);
  };

  // The first question loads the cache; the rest share it, four at a time.
  await run(questions[0]);
  const rest = questions.slice(1);
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < rest.length) await run(rest[next++]);
  }));

  const sum = (f: (r: Row) => number) => rows.reduce((x, r) => x + f(r), 0);
  const med = (xs: number[]) => [...xs].sort((x, y) => x - y)[Math.floor(xs.length / 2)] ?? 0;
  console.log(`\n${name}: ${setup.model}, effort ${setup.effort}, ${rows.length} questions, $${sum((r) => r.cost).toFixed(2)}`);
  console.log(`first words: median ${med(rows.slice(1).map((r) => r.firstWords))}s (warm); whole answer: median ${med(rows.map((r) => r.seconds))}s; length: median ${med(rows.map((r) => r.words))} words`);
  console.log(`links: ${sum((r) => r.links)}, ${sum((r) => r.badLinks.length)} do not resolve`);
  console.log(`quotations: ${sum((r) => r.quotes)}, ${sum((r) => r.badQuotes.length)} not in the cited paragraphs`);
  for (const kind of ['thin', 'trap']) {
    const k = rows.filter((r) => r.kind === kind);
    if (k.length) console.log(`${kind}: ${k.filter((r) => r.saysNotThere).length}/${k.length} say plainly it isn't there; not: ${k.filter((r) => !r.saysNotThere).map((r) => r.id).join(', ') || 'none'}`);
  }
  for (const r of rows.filter((x) => x.badLinks.length || x.badQuotes.length || (x.stop !== 'end_turn'))) {
    console.log(`  ${r.id}: stop ${r.stop}; ${r.badLinks.join(' ')} ${r.badQuotes.map((b) => `[${b.inText ? 'wrong paragraph' : 'not in text'}] "${b.quote.slice(0, 70)}" ${b.href}`).join(' | ')}`);
  }
}
main();
