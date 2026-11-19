/**
 * A short tutor answer for each curated concept, written to
 * tutor/concept-answers.json. The search page shows it under the concept card
 * when a search names that concept. Skips concepts that already have one
 * (pass --all to rewrite them).
 *   npx tsx --env-file=.env.local scripts/tutor-concepts.ts
 */
import fs from 'fs';
import path from 'path';
import { CONCEPTS } from '../src/data/guide/concepts';
import { canonText, indexText, promptText } from '../src/lib/tutor/context';
import { streamTutor, tutorCost } from '../src/lib/tutor/model';
import { BRIEF } from '../src/lib/tutor/search-answer';
import { buildTurn } from '../src/lib/tutor/turn';
import { checkAnswer } from '../src/lib/tutor/verify';
import { embedQuery } from '../src/lib/embed';

const FILE = path.join(process.cwd(), 'tutor', 'concept-answers.json');

async function main() {
  const out: Record<string, { q: string; a: string }> = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf-8')) : {};
  const all = process.argv.includes('--all');
  const todo = CONCEPTS.filter((c) => all || !out[c.slug]);
  const stable = [canonText(), `${indexText()}\n\n---\n\n${promptText()}`];
  let spent = 0;
  const run = async (c: (typeof CONCEPTS)[number]) => {
    const q = `What does Center Study mean by ${/^the /i.test(c.title) ? c.title.replace(/^The /, 'the ') : c.title.toLowerCase()}?`;
    const { content } = buildTurn(q, q, await embedQuery(q));
    let a = '';
    for await (const ev of streamTutor({ stable, messages: [{ role: 'user', content: content + BRIEF }] }, { effort: 'low', maxTokens: 4000 })) {
      if (ev.type === 'text') a += ev.text; else spent += tutorCost(ev.model, ev.usage);
    }
    const chk = checkAnswer(a);
    console.log(`${c.slug}: ${a.split(/\s+/).length} words, ${chk.quotes} quotations (${chk.badQuotes.length} flagged), ${chk.links} links (${chk.badLinks.length} bad)`);
    if (chk.badLinks.length === 0 && a.length > 300) {
      out[c.slug] = { q, a };
      fs.writeFileSync(FILE, JSON.stringify(out, null, 1) + '\n');
    }
  };
  if (todo.length) await run(todo[0]);
  let next = 1;
  await Promise.all(Array.from({ length: 4 }, async () => { while (next < todo.length) await run(todo[next++]); }));
  console.log(`${Object.keys(out).length} of ${CONCEPTS.length} concepts have an answer; spent $${spent.toFixed(2)}`);
}
main();
