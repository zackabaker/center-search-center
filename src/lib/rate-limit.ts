// Lightweight in-memory rate limiting + browser-origin checks for the
// endpoints that spend Anthropic credits per request (/api/chat,
// /api/reading-path).
//
// In-memory state is per serverless instance, so the cap is approximate —
// each warm instance enforces independently, and cold starts reset it.
// That is fine for the threat model: it stops curl loops and runaway
// clients, while the Anthropic console spend cap remains the hard backstop.

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

// Drop stale entries occasionally so the map can't grow unboundedly
let lastSweep = Date.now();
function sweep(windowMs: number) {
  const now = Date.now();
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

/**
 * Sliding-window limiter. `key` should include the endpoint name and the
 * client IP, e.g. `chat:1.2.3.4`.
 */
export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  sweep(windowMs);
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= max) {
    const oldest = bucket.timestamps[0];
    return { ok: false, retryAfterSeconds: Math.ceil((oldest + windowMs - now) / 1000) };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true, retryAfterSeconds: 0 };
}

/** Client IP as Vercel reports it. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

const ALLOWED_HOSTS = new Set(['center.study', 'www.center.study', 'localhost', '127.0.0.1']);

/**
 * True when the request plausibly comes from our own pages: the browser
 * sends an Origin (POST) or Referer from this site. Headerless clients
 * (curl, scripts) are rejected. Spoofable by a determined attacker, but
 * it removes the entire drive-by category, and the rate limit plus the
 * Anthropic spend cap bound what spoofing can cost.
 */
export function isSameOrigin(request: Request): boolean {
  for (const header of ['origin', 'referer'] as const) {
    const value = request.headers.get(header);
    if (!value) continue;
    try {
      const host = new URL(value).hostname;
      if (ALLOWED_HOSTS.has(host) || host.endsWith('.vercel.app')) return true;
    } catch {}
  }
  return false;
}
