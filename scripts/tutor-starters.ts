/**
 * Writes a kept answer for each starter question that doesn't have one yet,
 * into tutor/answers.json (pass --all to rewrite every one). Each is asked as
 * the first question of a fresh conversation, with the same context the site
 * builds, and checked against the archive.
 *   npx tsx --env-file=.env.local scripts/tutor-starters.ts
 */
import fs from 'fs';
import path from 'path';
import { canonText, indexText, promptText } from '../src/lib/tutor/context';
import { streamTutor, tutorCost } from '../src/lib/tutor/model';
import { buildTurn, sourcesOf } from '../src/lib/tutor/turn';
import { checkAnswer } from '../src/lib/tutor/verify';
import { embedQuery } from '../src/lib/embed';

const FILE = path.join(process.cwd(), 'tutor', 'answers.json');
type Kept = { id: string; q: string; a: string; sources: unknown[]; whole: unknown[]; keptAt: number };

async function main() {
  const starters: { id: string; q: string }[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'tutor', 'starters.json'), 'utf-8'));
  const kept: Kept[] = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
  const all = process.argv.includes('--all');
  const stable = [canonText(), `${indexText()}\n\n---\n\n${promptText()}`];
  let spent = 0;
  for (const s of starters) {
    const have = kept.find((k) => k.id === s.id);
    if (have && have.q === s.q && !all) { console.log(`have: ${s.id}`); continue; }
    const { content, hits, whole } = buildTurn(s.q, s.q, await embedQuery(s.q));
    let a = '';
    for await (const ev of streamTutor({ stable, messages: [{ role: 'user', content }] })) {
      if (ev.type === 'text') a += ev.text;
      else spent += tutorCost(ev.model, ev.usage);
    }
    const c = checkAnswer(a);
    console.log(`${s.id}: ${a.split(/\s+/).length} words, ${c.links} links (${c.badLinks.length} bad), ${c.quotes} quotations (${c.badQuotes.length} not in the cited paragraph)`);
    for (const b of c.badQuotes) console.log(`    not at ${b.href}: ${b.quote.slice(0, 80)}`);
    const row: Kept = {
      id: s.id, q: s.q, a,
      sources: sourcesOf(hits),
      whole: whole.map((w) => ({ title: w.title, url: `/post/${w.slug}` })),
      keptAt: Date.now(),
    };
    const i = kept.findIndex((k) => k.id === s.id);
    if (i >= 0) kept[i] = row; else kept.push(row);
    fs.writeFileSync(FILE, JSON.stringify(kept, null, 1) + '\n');
  }
  console.log(`spent $${spent.toFixed(2)}`);
}
main();
