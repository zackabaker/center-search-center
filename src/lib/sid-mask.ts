import { createHash } from 'crypto';

// Readouts never serve a live sid. A raw sid is accepted by the log POSTs,
// so exposing it would hand out a write token into that visitor's trail
// (forged pages/searches rendered inside their session). The raw GETs serve
// this one-way mask instead: grouping by session still works, forging into
// one doesn't. The pepper prefers the secret STUDY_KEY env value — with a
// public repo, a hardcoded pepper alone would leave the 36^8 sid space
// brute-forceable; the literal is only the KV-less fallback.
const PEPPER = process.env.STUDY_KEY || 'csc-sid-mask-v1';

export function maskSid(sid: unknown): string | undefined {
  if (typeof sid !== 'string' || !sid) return undefined;
  return createHash('sha256').update(PEPPER + sid).digest('hex').slice(0, 10);
}
