import { getKV } from '@/lib/kv';
import { rateLimit, clientIp, isSameOrigin } from '@/lib/rate-limit';
import { canonText, indexText, promptText } from '@/lib/tutor/context';
import { warmTutor } from '@/lib/tutor/model';

// Loads the canon into the model's cache when a person arrives at the tutor,
// so their first question doesn't pay the long wait. Called by the page on the
// visitor's first real input (a tap, a key), never on load, so crawlers that
// only fetch pages don't trigger it. At most one load every fifty minutes
// however many people arrive, and none once the day's spending is at its
// ceiling.
//
// POST → { warmed: boolean }

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const BOT_UA = /(?<!cu)bot|crawl|spider|slurp|headless|scrape|lighthouse|preview|fetch|monitor/i;
const DAILY_USD = Number(process.env.TUTOR_DAILY_USD) || 150;

export async function POST(request: Request) {
  if (!isSameOrigin(request) || BOT_UA.test(request.headers.get('user-agent') ?? '')) {
    return Response.json({ warmed: false }, { status: 403 });
  }
  if (!rateLimit(`tutor-warm:${clientIp(request)}`, 3, 60_000).ok) return Response.json({ warmed: false }, { status: 429 });
  const kv = getKV();
  if (!kv || !process.env.ANTHROPIC_API_KEY) return Response.json({ warmed: false });
  try {
    const day = new Date().toISOString().slice(0, 10);
    if ((Number(await kv.get(`tutor:spend:day:${day}`)) || 0) >= DAILY_USD) return Response.json({ warmed: false });
    // Claim the slot first: of many visitors arriving together, one loads it.
    const claimed = await kv.set('tutor:warm', 1, { nx: true, ex: 50 * 60 });
    if (claimed !== 'OK') return Response.json({ warmed: false, already: true });
    const u = await warmTutor([canonText(), `${indexText()}\n\n---\n\n${promptText()}`]);
    const cost = (u.wrote * 8 + u.read * 0.2) / 1e6; // Opus 5.5: one-hour cache write, cache read
    await kv.incrbyfloat(`tutor:spend:${day.slice(0, 7)}`, cost);
    await kv.incrbyfloat(`tutor:spend:day:${day}`, cost);
    return Response.json({ warmed: true });
  } catch (err) {
    console.error('Tutor warm error:', err);
    await kv.del('tutor:warm').catch(() => {});
    return Response.json({ warmed: false });
  }
}
