import { Redis } from '@upstash/redis';

// Shared Upstash client for routes that persist small records (saved reading
// paths, etc.). The live store is connected with the "centerstudy" prefix, so
// its vars are centerstudy_KV_REST_API_*; the unprefixed KV_REST_API_* still
// exist but point at an older, deleted DB — prefer the prefixed ones, then
// fall back to the legacy / UPSTASH_* names. (Same chain as /api/search-log.)
export function getKV(): Redis | null {
  const url =
    process.env.centerstudy_KV_REST_API_URL ||
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.centerstudy_KV_REST_API_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
