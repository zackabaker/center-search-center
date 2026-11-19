import { getUser, isOwnerUser } from '@/lib/auth';
import { getKV } from '@/lib/kv';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { canonText, estTokens, indexText, promptText } from '@/lib/tutor/context';
import { embedQuestion } from '@/lib/tutor/embed-query';
import { streamTutor, tutorCost, TUTOR_MODEL } from '@/lib/tutor/model';
import { buildTurn, sourcesOf } from '@/lib/tutor/turn';
import { checkAnswer } from '@/lib/tutor/verify';
import { archiveAnswer, findArchived } from '@/lib/tutor/archive';
import { admitTutor, settleTutor } from '@/lib/tutor/limits';

// The tutor. A visitor's question, with the thread so far, goes to
// the model together with the canon and index (cached), the paragraphs of the
// archive that best match it, and in full any further texts those paragraphs
// point to. The answer streams back as newline-delimited JSON:
//   { sources, whole }   what was retrieved, before any text
//   { text }             the answer, as it is written
//   { check }            links and quotations checked against the archive
//   { error }            if something went wrong mid-answer
//
// POST { message, history: [{ role, content }] }

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const HISTORY_BUDGET = 40_000;
const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|scrape|lighthouse/i;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!rateLimit(`tutor:${clientIp(request)}`, 8, 60_000).ok) {
    return Response.json({ error: 'Too many questions at once. Give it a minute.' }, { status: 429 });
  }
  const user = getUser(request);
  const owner = isOwnerUser(user);

  let body: { message?: unknown; history?: unknown; fresh?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 4000) : '';
  if (message.length < 2) return Response.json({ error: 'Ask a question.' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ error: 'The tutor is not configured.' }, { status: 500 });

  const kv = getKV();
  const firstTurn = !Array.isArray(body.history) || body.history.length === 0;
  const origin = new URL(request.url).origin;
  // One meaning vector serves both the archive lookup and retrieval.
  const firstVec = firstTurn ? await embedQuestion(message, origin, 12_000) : null;
  const encoder = new TextEncoder();

  // ── An answer already written for this exact question ────────────────────
  // Only for a conversation's first question (a follow-up depends on its
  // thread). Only the owner can ask for a new one in its place. Costs nothing
  // and counts against no one's allowance.
  if (kv && firstTurn && !(owner && body.fresh === true)) {
    try {
      const saved = await findArchived(kv, message, firstVec);
      if (saved) {
        const lines = [
          { sources: saved.sources ?? [], whole: saved.whole ?? [], archived: saved.t },
          { text: saved.a },
          { check: checkAnswer(saved.a) },
        ];
        return new Response(encoder.encode(lines.map((l) => JSON.stringify(l)).join('\n') + '\n'), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    } catch { /* no archive: answer it live */ }
  }

  // ── Limits (src/lib/tutor/limits.ts) ─────────────────────────────────────
  const admission = await admitTutor(kv, request, user?.sub ?? null, owner);
  if (!admission.ok) return Response.json({ error: admission.error, code: admission.code }, { status: admission.status });

  // ── The thread so far, newest kept, within a budget ──────────────────────
  const history: { role: 'user' | 'assistant'; content: string }[] = [];
  if (Array.isArray(body.history)) {
    let room = HISTORY_BUDGET;
    for (const m of [...body.history].reverse()) {
      const r = m as { role?: unknown; content?: unknown };
      if ((r.role !== 'user' && r.role !== 'assistant') || typeof r.content !== 'string' || !r.content.trim()) continue;
      const content = r.content.slice(0, 40_000);
      room -= estTokens(content);
      if (room < 0) break;
      history.unshift({ role: r.role, content });
    }
    while (history.length && history[0].role !== 'user') history.shift();
  }

  // ── Retrieval ────────────────────────────────────────────────────────────
  // A short follow-up ("why?", "say more about that") means little on its
  // own, so it is searched together with the question before it.
  const lastAsked = [...history].reverse().find((m) => m.role === 'user')?.content ?? '';
  const query = message.length < 80 && lastAsked ? `${lastAsked.slice(0, 300)} ${message}` : message;
  const vec = firstTurn ? firstVec : await embedQuestion(query, origin, 12_000);
  const { content: turn, hits, whole, strength } = buildTurn(message, query, vec);
  const sources = sourcesOf(hits);
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(encoder.encode(JSON.stringify(o) + '\n'));
      let answer = '';
      try {
        send({ sources, whole: whole.map((w) => ({ title: w.title, url: `/post/${w.slug}` })) });
        let cost = 0;
        let usage: unknown = null;
        let stop: string | null = null;
        for await (const ev of streamTutor({
          stable: [canonText(), `${indexText()}\n\n---\n\n${promptText()}`],
          messages: [...history, { role: 'user', content: turn }],
        })) {
          if (ev.type === 'text') { answer += ev.text; send({ text: ev.text }); }
          else { cost = tutorCost(ev.model, ev.usage); usage = ev.usage; stop = ev.stop; }
        }
        if (stop === 'refusal' && !answer) send({ text: 'The tutor could not answer that one. Try asking it another way.' });
        if (stop === 'max_tokens') send({ truncated: true });
        const check = checkAnswer(answer);
        send({ check, ...(owner ? { cost: Math.round(cost * 100) / 100, usage } : {}) });
        // Awaited before close: once the stream ends the function may freeze.
        if (kv) {
          try {
            await settleTutor(kv, cost);
            // Every first answer is saved for the next person who asks the same thing.
            if (firstTurn && stop === 'end_turn' && answer.length > 400 && check.badLinks.length === 0) {
              await archiveAnswer(kv, {
                q: message, a: answer, sources, whole: whole.map((w) => ({ title: w.title, url: `/post/${w.slug}` })), t: Date.now(),
              }, firstVec);
            }
            await kv.lpush('tutor:log', JSON.stringify({
              q: message.slice(0, 600),
              a: answer.slice(0, 8000),
              turn: history.filter((m) => m.role === 'user').length + 1,
              passages: hits.map((h) => h.key),
              whole: whole.map((w) => w.slug),
              strength,
              badLinks: check.badLinks,
              badQuotes: check.badQuotes.length,
              who: user ? 'account' : 'visitor',
              model: TUTOR_MODEL,
              cost: Math.round(cost * 1000) / 1000,
              t: Date.now(),
            }));
            await kv.ltrim('tutor:log', 0, 1999);
          } catch { /* logging must never break the answer */ }
        }
      } catch (err) {
        console.error('Tutor error:', err);
        send({ error: 'The tutor ran into a problem. Try again in a moment.' });
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}
