// Who may ask the tutor, and how much may be spent. One allowance, shared by
// the tutor's own page and the search box's Answer view.
//
// A signed-out visitor gets a couple of answers a day (counted against a hash
// of their address, never the address itself) and is then asked to sign in;
// an account gets a real daily allowance; the owner is exempt. The day's and
// the month's spending each have a ceiling, so a burst of abuse costs a
// bounded amount whatever else fails. Saved answers never reach this check.
import crypto from 'crypto';
import type { Redis } from '@upstash/redis';
import { clientIp } from '../rate-limit';

const PER_DAY = Number(process.env.TUTOR_USER_PER_DAY) || 40;
const ANON_PER_DAY = Number(process.env.TUTOR_ANON_PER_DAY) || 2;
const DAILY_USD = Number(process.env.TUTOR_DAILY_USD) || 150;
const MONTHLY_USD = Number(process.env.TUTOR_MONTHLY_USD) || 1000;

export type Admission =
  | { ok: true }
  | { ok: false; status: number; error: string; code: 'signin' | 'day' | 'today' | 'month' };

const dayOf = () => new Date().toISOString().slice(0, 10);
const signIn: Admission = {
  ok: false, status: 401, code: 'signin',
  error: 'Sign in to keep going. It is free, and it is how the tutor stays open to people and closed to bots.',
};

function addressHash(request: Request): string {
  const pepper = process.env.AUTH_SECRET || process.env.STUDY_KEY || 'center-study';
  return crypto.createHash('sha256').update(`${pepper}:tutor:${clientIp(request)}`).digest('hex').slice(0, 24);
}

export async function admitTutor(kv: Redis | null, request: Request, userSub: string | null, owner: boolean): Promise<Admission> {
  if (!kv) return userSub ? { ok: true } : signIn; // no way to meter a signed-out visitor
  const day = dayOf();
  try {
    const [month, today] = await Promise.all([kv.get(`tutor:spend:${day.slice(0, 7)}`), kv.get(`tutor:spend:day:${day}`)]);
    if ((Number(month) || 0) >= MONTHLY_USD) {
      return { ok: false, status: 429, code: 'month', error: 'The tutor has reached its limit for this month. It will be back next month.' };
    }
    if (owner) return { ok: true };
    if ((Number(today) || 0) >= DAILY_USD) {
      return { ok: false, status: 429, code: 'today', error: 'The tutor has answered as much as it can today. It will be back tomorrow.' };
    }
    const who = userSub ? `tutor:n:${day}:${userSub}` : `tutor:anon:${day}:${addressHash(request)}`;
    const n = await kv.incr(who);
    if (n === 1) await kv.expire(who, 60 * 60 * 48);
    if (!userSub && n > ANON_PER_DAY) return signIn;
    if (userSub && n > PER_DAY) {
      return { ok: false, status: 429, code: 'day', error: `That is ${PER_DAY} questions today, which is the daily limit. Come back tomorrow.` };
    }
    return { ok: true };
  } catch {
    // The store being down must not take the tutor down for readers with an account.
    return userSub ? { ok: true } : signIn;
  }
}

/** Record what an answer cost, and that the canon is loaded for the next hour. */
export async function settleTutor(kv: Redis, cost: number): Promise<void> {
  const day = dayOf();
  await kv.incrbyfloat(`tutor:spend:${day.slice(0, 7)}`, cost);
  await kv.expire(`tutor:spend:${day.slice(0, 7)}`, 60 * 60 * 24 * 70);
  await kv.incrbyfloat(`tutor:spend:day:${day}`, cost);
  await kv.expire(`tutor:spend:day:${day}`, 60 * 60 * 24 * 40);
  await kv.set('tutor:warm', 1, { ex: 50 * 60 });
}
