import { createHash } from 'crypto';
import { getKV } from './kv';
import {
  ASK_MODEL_ID, ASK_MODEL_LABEL, ASK_EFFORT, ASK_FAST,
  ASK_ECONOMY_MODEL_ID, ASK_ECONOMY_MODEL_LABEL,
} from './ask-model';

// Spending guards for Ask (owner direction, 2026-11-17: "just don't want it
// to get abused and have my costs go insane"). Every answer costs real money,
// so before one is written it has to be admitted here. Three guards, in the
// order they are checked:
//
//   1. The switch and the day's ceiling. The owner can turn Ask off or force
//      the cheaper model from the analytics console; and once the day's
//      spending passes ASK_PAUSE_USD, Ask pauses until midnight UTC.
//   2. A per-reader allowance. A signed-out reader gets ASK_FREE_PER_DAY
//      answers a day (counted per network address), then is asked to sign in
//      with Google; a signed-in reader gets ASK_USER_PER_DAY.
//   3. The economy threshold. Past ASK_ECONOMY_USD in a day, answers are
//      written by the cheaper model instead of being refused.
//
// Counters live in the shared KV store so every server instance sees the
// same numbers; without a store (local development) they live in memory.
// Days are UTC. All four numbers can be overridden with env vars of the
// same names.

const envNum = (name: string, fallback: number): number => {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const askLimits = () => ({
  freePerDay: envNum('ASK_FREE_PER_DAY', 10),
  userPerDay: envNum('ASK_USER_PER_DAY', 50),
  // About 30 answers on the main setup, then roughly 280 more on the
  // economy one before the pause: a worst case of $15 a day.
  economyUsd: envNum('ASK_ECONOMY_USD', 5),
  pauseUsd: envNum('ASK_PAUSE_USD', 15),
});

export type AskMode = 'auto' | 'economy' | 'off';
export const ASK_MODES: AskMode[] = ['auto', 'economy', 'off'];

export interface AskPlan {
  tier: 'full' | 'economy';
  model: string;
  label: string;
  effort: 'low';
  fast: boolean;
  /** Charged to the day's total up front, in millionths of a dollar. */
  estimateMicro: number;
}

const FULL: AskPlan = {
  tier: 'full', model: ASK_MODEL_ID, label: ASK_MODEL_LABEL, effort: ASK_EFFORT, fast: ASK_FAST,
  estimateMicro: 170_000,
};
const ECONOMY: AskPlan = {
  tier: 'economy', model: ASK_ECONOMY_MODEL_ID, label: ASK_ECONOMY_MODEL_LABEL, effort: 'low', fast: false,
  estimateMicro: 35_000,
};

// Dollars per million tokens [input, output]; fast mode doubles Opus 5.5.
const PRICES: Record<string, [number, number]> = {
  'claude-opus-5-5': [4, 20],
  'claude-sonnet-5-5': [2, 10],
};

const DAY_TTL = 3 * 86_400;
const MODE_KEY = 'ask:mode';
const today = () => new Date().toISOString().slice(0, 10);
const spendKey = (day: string) => `ask:spend:${day}`;
const countKey = (day: string) => `ask:n:${day}`;

// ── Store: shared KV, or memory when there is none ──────────────────────────
const mem = new Map<string, number | string>();

async function incrBy(key: string, by: number): Promise<number> {
  const kv = getKV();
  if (!kv) {
    const next = (Number(mem.get(key)) || 0) + by;
    mem.set(key, next);
    return next;
  }
  const next = await kv.incrby(key, by);
  // First write of the day for this key: let it expire on its own.
  if (next === by) await kv.expire(key, DAY_TTL);
  return next;
}

async function readNum(key: string): Promise<number> {
  const kv = getKV();
  const v = kv ? await kv.get<number | string>(key) : mem.get(key);
  return Number(v) || 0;
}

export async function getAskMode(): Promise<AskMode> {
  const kv = getKV();
  const v = kv ? await kv.get<string>(MODE_KEY) : mem.get(MODE_KEY);
  return v === 'economy' || v === 'off' ? v : 'auto';
}

export async function setAskMode(mode: AskMode): Promise<void> {
  const kv = getKV();
  if (kv) await kv.set(MODE_KEY, mode);
  else mem.set(MODE_KEY, mode);
}

// ── Admission ───────────────────────────────────────────────────────────────
export type Admission =
  | { ok: true; plan: AskPlan }
  | { ok: false; status: number; code: 'signin' | 'limit' | 'paused'; message: string };

export async function admitAsk(who: { ip: string; userSub: string | null; owner: boolean }): Promise<Admission> {
  const limits = askLimits();
  const day = today();
  try {
    const [mode, spentMicro] = await Promise.all([getAskMode(), readNum(spendKey(day))]);
    const spentUsd = spentMicro / 1e6;

    if (mode === 'off') {
      return { ok: false, status: 503, code: 'paused', message: 'AI answers are switched off for the moment.' };
    }
    if (spentUsd >= limits.pauseUsd) {
      return { ok: false, status: 503, code: 'paused', message: 'AI answers are paused for the rest of today and resume tomorrow.' };
    }

    // The owner's own questions are not rationed (they still count as spending).
    if (!who.owner) {
      if (who.userSub) {
        const used = await incrBy(`ask:u:${day}:${who.userSub}`, 1);
        if (used > limits.userPerDay) {
          return { ok: false, status: 429, code: 'limit', message: `You’ve had today’s ${limits.userPerDay} AI answers. More tomorrow.` };
        }
      } else {
        // Hashed so no address is stored; the key expires within three days.
        const who16 = createHash('sha256').update(`${day}:${who.ip}`).digest('hex').slice(0, 16);
        const used = await incrBy(`ask:v:${day}:${who16}`, 1);
        if (used > limits.freePerDay) {
          return { ok: false, status: 401, code: 'signin', message: `You’ve had today’s ${limits.freePerDay} free AI answers. Sign in with Google to keep asking. It’s free.` };
        }
      }
    }

    const plan = mode === 'economy' || spentUsd >= limits.economyUsd ? ECONOMY : FULL;
    // Charge the estimate now, so a burst of parallel requests (or answers
    // abandoned mid-stream) cannot slip under the ceiling; settleAsk corrects
    // it to the real cost when the answer finishes.
    await Promise.all([incrBy(spendKey(day), plan.estimateMicro), incrBy(countKey(day), 1)]);
    return { ok: true, plan };
  } catch (err) {
    // The store is unreachable: nothing can be counted, so answer on the
    // cheap setup rather than refuse everyone or spend blind.
    console.warn('Ask budget: store unavailable, using the economy setup', err);
    return { ok: true, plan: ECONOMY };
  }
}

/** Replace the up-front estimate with what the answer really cost. */
export async function settleAsk(
  plan: AskPlan,
  usage: { input_tokens: number; output_tokens: number; speed?: string | null },
): Promise<void> {
  try {
    const [inPrice, outPrice] = PRICES[plan.model] ?? [4, 20];
    const factor = usage.speed === 'fast' ? 2 : 1;
    const actualMicro = Math.round((usage.input_tokens * inPrice + usage.output_tokens * outPrice) * factor);
    const delta = actualMicro - plan.estimateMicro;
    if (delta !== 0) await incrBy(spendKey(today()), delta);
  } catch { /* the estimate stands */ }
}

// ── For the owner's console ─────────────────────────────────────────────────
export interface AskStatus {
  day: string;
  mode: AskMode;
  /** What a reader asking right now would get. */
  effective: 'full' | 'economy' | 'paused';
  spentUsd: number;
  answers: number;
  limits: ReturnType<typeof askLimits>;
}

export async function getAskStatus(): Promise<AskStatus> {
  const limits = askLimits();
  const day = today();
  const [mode, spentMicro, answers] = await Promise.all([getAskMode(), readNum(spendKey(day)), readNum(countKey(day))]);
  const spentUsd = spentMicro / 1e6;
  const effective =
    mode === 'off' || spentUsd >= limits.pauseUsd ? 'paused'
    : mode === 'economy' || spentUsd >= limits.economyUsd ? 'economy'
    : 'full';
  return { day, mode, effective, spentUsd, answers, limits };
}
