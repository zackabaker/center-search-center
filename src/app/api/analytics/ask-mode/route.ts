import { isOwner } from '@/lib/analytics-auth';
import { isSameOrigin } from '@/lib/rate-limit';
import { ASK_MODES, getAskStatus, setAskMode, type AskMode } from '@/lib/ask-budget';

// The owner's switch for Ask (src/lib/ask-budget.ts): automatic, economy
// model only, or off. Owner-only, same gate as the console; everyone else
// gets its 404.
//
// POST { mode: 'auto' | 'economy' | 'off' } → { ok, status }

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!isOwner(request)) return new Response('Not found', { status: 404 });
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden' }, { status: 403 });
  let mode: unknown;
  try {
    mode = (await request.json()).mode;
  } catch {
    return Response.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  if (!ASK_MODES.includes(mode as AskMode)) {
    return Response.json({ ok: false, error: 'Unknown setting.' }, { status: 400 });
  }
  try {
    await setAskMode(mode as AskMode);
    return Response.json({ ok: true, status: await getAskStatus() });
  } catch {
    return Response.json({ ok: false, error: 'Could not save the setting.' }, { status: 500 });
  }
}
