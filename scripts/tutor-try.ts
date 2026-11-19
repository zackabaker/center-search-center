/**
 * Ask the tutor one or more questions from the command line, as one thread,
 * with the same context the site builds. For checking a prompt or canon
 * change before it ships:
 *   npx tsx --env-file=.env.local scripts/tutor-try.ts "question" "follow-up"
 *   npx tsx --env-file=.env.local scripts/tutor-try.ts --count   (size of the fixed context)
 */
import Anthropic from '@anthropic-ai/sdk';
import { canonSlugs, canonText, estTokens, indexText, postBySlug, promptText, renderWholeText } from '../src/lib/tutor/context';
import { streamTutor, tutorCost } from '../src/lib/tutor/model';
import { tutorRetrieve } from '../src/lib/tutor/retrieve';
import { checkAnswer } from '../src/lib/tutor/verify';
import { embedQuery } from '../src/lib/embed';

async function main() {
  const questions = process.argv.slice(2).filter((a) => a !== '--count');
  const stable = [canonText(), `${indexText()}\n\n---\n\n${promptText()}`];
  if (process.argv.includes('--count')) {
    const r = await new Anthropic().messages.countTokens({
      model: 'claude-opus-5-5',
      system: stable.map((text) => ({ type: 'text' as const, text })),
      messages: [{ role: 'user', content: 'x' }],
    });
    console.log(`fixed context: ${r.input_tokens.toLocaleString('en-US')} tokens (${canonSlugs.size} canon texts)`);
    return;
  }
  const history: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const q of questions) {
    const vec = await embedQuery(q);
    const hits = tutorRetrieve(q, vec, { limit: 18, perText: 2 });
    const whole: string[] = [];
    let spent = 0;
    for (const h of hits) {
      const post = postBySlug(h.slug);
      if (whole.length >= 4 || canonSlugs.has(h.slug) || !post || h.source === 'twitter' || h.source === 'reddit') continue;
      const text = renderWholeText(post);
      if (whole.includes(text) || spent + estTokens(text) > 70_000) continue;
      spent += estTokens(text);
      whole.push(text);
    }
    const cos = hits.map((h) => h.cosine ?? 0);
    const strength = `closest match by meaning ${Math.max(0, ...cos).toFixed(2)}; ${cos.filter((c) => c >= 0.62).length} of ${hits.length} paragraphs match closely`;
    const passages = hits.map((h) => `<passage title=${JSON.stringify(h.title)} url="${h.url}">\n${h.text}\n</passage>`).join('\n\n');
    const further = whole.length ? `<further_texts>\n${whole.join('\n\n')}\n</further_texts>\n\n` : '';
    const turn = `<archive_match strength="${strength}">\n${passages}\n</archive_match>\n\n${further}The visitor writes:\n${q}`;
    console.log(`\n\n=== ${q}\n(${strength}; further texts in full: ${whole.length})\n`);
    const t0 = Date.now();
    let first = 0;
    let answer = '';
    for await (const ev of streamTutor({ stable, messages: [...history, { role: 'user', content: turn }] })) {
      if (ev.type === 'text') {
        if (!first) first = Date.now() - t0;
        answer += ev.text;
        process.stdout.write(ev.text);
      } else {
        const c = checkAnswer(answer);
        console.log(`\n\n--- ${ev.model} · stop ${ev.stop} · first words ${(first / 1000).toFixed(1)}s · total ${((Date.now() - t0) / 1000).toFixed(1)}s`);
        console.log(`--- tokens: ${JSON.stringify(ev.usage)} · cost $${tutorCost(ev.model, ev.usage).toFixed(2)}`);
        console.log(`--- check: ${c.links} links (${c.badLinks.length} bad), ${c.quotes} quotations (${c.badQuotes.length} not in the cited paragraph)`);
        for (const b of c.badLinks) console.log('    bad link:', b);
        for (const b of c.badQuotes) console.log(`    quote not at ${b.href} (${b.inText ? 'elsewhere in that text' : 'not in that text'}): ${b.quote.slice(0, 90)}`);
      }
    }
    history.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
  }
}
main();
