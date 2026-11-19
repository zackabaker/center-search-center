// The tutor's model call, kept thin on purpose: the prepared material (canon,
// index, prompt, retrieval) is the asset, and this file is the only place that
// knows which vendor reads it. To try another provider, implement streamTutor
// against the same TutorRequest and nothing else changes.
import Anthropic from '@anthropic-ai/sdk';

export interface TutorRequest {
  /** Stable blocks, in order; each is cached up to and including itself. */
  stable: string[];
  messages: { role: 'user' | 'assistant'; content: string }[];
}
export type TutorEvent =
  | { type: 'text'; text: string }
  | {
      type: 'done';
      model: string;
      stop: string | null;
      usage: { input: number; cacheWrite: number; cacheRead: number; output: number };
    };

export const TUTOR_MODEL = process.env.TUTOR_MODEL || 'claude-opus-5-5';
const EFFORT = process.env.TUTOR_EFFORT || 'high';
const MAX_TOKENS = 16000;

const anthropic = new Anthropic();

export async function* streamTutor(req: TutorRequest): AsyncGenerator<TutorEvent> {
  // The canon is hundreds of thousands of tokens and identical for every
  // visitor, so it is cached for an hour: a conversation pays to load it once.
  // `fallbacks` re-runs a declined request on another model inside the same
  // call. Both are newer than this SDK's types, hence the cast.
  type Params = Parameters<typeof anthropic.beta.messages.stream>[0];
  const stream = anthropic.beta.messages.stream({
    model: TUTOR_MODEL,
    max_tokens: MAX_TOKENS,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: EFFORT },
    system: req.stable.map((text) => ({ type: 'text', text, cache_control: { type: 'ephemeral', ttl: '1h' } })),
    messages: req.messages,
  } as unknown as Params);

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield { type: 'text', text: event.delta.text };
    }
  }
  const final = await stream.finalMessage();
  yield {
    type: 'done',
    model: final.model,
    stop: final.stop_reason,
    usage: {
      input: final.usage.input_tokens,
      cacheWrite: final.usage.cache_creation_input_tokens ?? 0,
      cacheRead: final.usage.cache_read_input_tokens ?? 0,
      output: final.usage.output_tokens,
    },
  };
}

/** Dollars for one answer at Opus 5.5 / Sonnet 5.5 list prices (1-hour cache writes cost double). */
export function tutorCost(model: string, u: { input: number; cacheWrite: number; cacheRead: number; output: number }): number {
  const sonnet = /sonnet/.test(model);
  const inPrice = sonnet ? 2 : 4;
  const outPrice = sonnet ? 10 : 20;
  const readPrice = sonnet ? 0.1 : 0.2;
  return (u.input * inPrice + u.cacheWrite * inPrice * 2 + u.cacheRead * readPrice + u.output * outPrice) / 1e6;
}
