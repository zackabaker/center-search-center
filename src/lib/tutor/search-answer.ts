// The tutor behind the search box's Answer view. Same canon, index, prompt and
// retrieval as the tutor's own page, asked for a short answer, and streamed in
// the shape the Answer view already reads:
//   { sources: [{ slug, title, source, snippet }], model }   then   { text } …
//
// Order: a saved answer if there is one (instant, free); otherwise a new short
// answer, which is then saved. Returns null when the tutor can't take the
// question (not configured, or paused by a spending ceiling), and the caller
// falls back to the older excerpt-based answer so the view is never empty.
import type { Redis } from '@upstash/redis';
import { archiveAnswer, findArchived } from './archive';
import { canonText, estTokens, indexText, promptText } from './context';
import { embedQuestion } from './embed-query';
import { admitTutor, settleTutor } from './limits';
import { streamTutor, tutorCost, TUTOR_MODEL } from './model';
import { buildTurn } from './turn';
import { checkAnswer } from './verify';

export const BRIEF =
  '\n\n(This question came from the site’s search box, where a short answer is wanted. Answer in three or four ' +
  'paragraphs, about 300 words: the heart of the matter, with two or three quotations linked to their paragraphs, ' +
  'in plain prose with no headings. End by naming one text to read next. The visitor can continue the conversation ' +
  'with you at full length afterwards, so do not try to cover everything.)';
const LABEL = 'the Center Study tutor';
const HISTORY_BUDGET = 20_000;

type Msg = { role: 'user' | 'assistant'; content: string };
const askSources = (hits: { slug: string; title: string; source: string; text: string }[]) => {
  const seen = new Set<string>();
  return hits
    .filter((h) => (seen.has(h.slug) ? false : (seen.add(h.slug), true)))
    .slice(0, 8)
    .map((h) => ({ slug: h.slug, title: h.title, source: h.source, snippet: h.text.replace(/\s+/g, ' ').slice(0, 180) + '…' }));
};
const ndjson = (lines: unknown[]) => lines.map((l) => JSON.stringify(l)).join('\n') + '\n';
const headers = (cors: Record<string, string>) => ({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...cors });

export async function tutorSearchAnswer(opts: {
  request: Request;
  kv: Redis | null;
  message: string;
  history: unknown;
  userSub: string | null;
  owner: boolean;
  fresh: boolean;
  cors: Record<string, string>;
}): Promise<Response | null> {
  const { request, kv, message, userSub, owner, cors } = opts;
  if (!process.env.ANTHROPIC_API_KEY || process.env.TUTOR_IN_SEARCH === 'off') return null;
  const origin = new URL(request.url).origin;

  const history: Msg[] = [];
  if (Array.isArray(opts.history)) {
    let room = HISTORY_BUDGET;
    for (const m of [...opts.history].reverse()) {
      const r = m as { role?: unknown; content?: unknown };
      if ((r.role !== 'user' && r.role !== 'assistant') || typeof r.content !== 'string' || !r.content.trim()) continue;
      room -= estTokens(r.content);
      if (room < 0) break;
      history.unshift({ role: r.role, content: r.content.slice(0, 20_000) });
    }
    while (history.length && history[0].role !== 'user') history.shift();
  }
  const firstTurn = history.length === 0;
  const lastAsked = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';
  const query = message.length < 80 && lastAsked ? `${lastAsked.slice(0, 300)} ${message}` : message;
  const vec = await embedQuestion(query, origin, 10_000);

  // A saved answer: a full one from the tutor's page (the owner's kept answers
  // among them) first, then a short one written here earlier.
  if (kv && firstTurn && !(owner && opts.fresh)) {
    try {
      const saved = (await findArchived(kv, message, vec)) ?? (await findArchived(kv, message, vec, 'brief'));
      if (saved) {
        const sources = (saved.sources as { title: string; url: string; source: string; snippet: string }[])
          .map((s) => ({ slug: (/^\/post\/([^#?]+)/.exec(s.url ?? '') ?? [])[1] ?? '', title: s.title, source: s.source, snippet: s.snippet }))
          .filter((s) => s.slug);
        return new Response(ndjson([{ sources: sources.slice(0, 8), model: LABEL, saved: true }, { text: saved.a }]), { headers: headers(cors) });
      }
    } catch { /* answer it live */ }
  }

  const admission = await admitTutor(kv, request, userSub, owner);
  if (!admission.ok) {
    // Paused by a spending ceiling: let the older answer serve. A visitor out
    // of free answers is asked to sign in, as on the tutor's own page.
    if (admission.code === 'month' || admission.code === 'today') return null;
    return Response.json({ error: admission.error, code: admission.code }, { status: admission.status, headers: cors });
  }

  const { content, hits, whole, strength } = buildTurn(message, query, vec);
  const sources = askSources(hits);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(encoder.encode(JSON.stringify(o) + '\n'));
      let answer = '';
      try {
        send({ sources, model: LABEL });
        let cost = 0;
        let stop: string | null = null;
        for await (const ev of streamTutor(
          { stable: [canonText(), `${indexText()}\n\n---\n\n${promptText()}`], messages: [...history, { role: 'user', content: content + BRIEF }] },
          { effort: 'low', maxTokens: 4000 },
        )) {
          if (ev.type === 'text') { answer += ev.text; send({ text: ev.text }); }
          else { cost = tutorCost(ev.model, ev.usage); stop = ev.stop; }
        }
        if (stop === 'max_tokens') send({ truncated: true });
        if (kv) {
          try {
            await settleTutor(kv, cost);
            const check = checkAnswer(answer);
            if (firstTurn && stop === 'end_turn' && answer.length > 300 && check.badLinks.length === 0) {
              await archiveAnswer(kv, { q: message, a: answer, sources: hits.slice(0, 10).map((h) => ({ title: h.title, url: h.url, source: h.source, snippet: h.text.slice(0, 200) })), whole: [], t: Date.now() }, vec, 'brief');
            }
            await kv.lpush('tutor:log', JSON.stringify({
              q: message.slice(0, 600), a: answer.slice(0, 8000), turn: history.filter((m) => m.role === 'user').length + 1,
              passages: hits.map((h) => h.key), whole: whole.map((w) => w.slug), strength, where: 'search',
              badLinks: check.badLinks, badQuotes: check.badQuotes.length, who: userSub ? 'account' : 'visitor',
              model: TUTOR_MODEL, cost: Math.round(cost * 1000) / 1000, t: Date.now(),
            }));
            await kv.ltrim('tutor:log', 0, 1999);
          } catch { /* logging must never break the answer */ }
        }
        controller.close();
      } catch (err) {
        console.error('Tutor (search) error:', err);
        controller.error(err);
      }
    },
  });
  return new Response(stream, { headers: headers(cors) });
}
