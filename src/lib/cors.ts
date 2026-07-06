// CORS policy for the public API. The archive is built to be consumed by
// AI agents and other sites:
//   - READ endpoints (corpus, semantic search, embeddings) are open to any
//     origin — they serve public text and are rate-limited per IP.
//   - COST endpoints (/api/chat — each call bills an Anthropic request) are
//     limited to first-party + partner origins.
// Server-to-server callers (agents, scripts) send no Origin header and are
// always allowed on open endpoints; browsers get the CORS headers they need.

export const PARTNER_ORIGINS = new Set([
  'https://center.study',
  'https://www.center.study',
]);

export function openCors(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    ...extra,
  };
}

export function partnerCors(request: Request): Record<string, string> | null {
  const origin = request.headers.get('origin');
  if (!origin) return {}; // same-origin nav or server-to-server — no CORS needed
  if (origin.startsWith('http://localhost') || PARTNER_ORIGINS.has(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
  }
  return null; // unknown cross-origin caller
}

export function preflight(headers: Record<string, string>): Response {
  return new Response(null, { status: 204, headers });
}
