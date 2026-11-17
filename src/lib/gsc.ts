// Google Search Console → /analytics. Pulls the last 28 days of search
// performance (queries, pages, daily totals) with a service account and
// keeps ONE snapshot in KV, refreshed daily by a cron — Search Console itself
// is the archive, so there is nothing to accumulate here.
//
// Setup (once): create a Google Cloud service account with the Search
// Console API enabled, add its email as a user on the center.study property
// in Search Console, and put its JSON key in the GSC_SERVICE_ACCOUNT_JSON
// environment variable. Until then everything here is a quiet no-op.
// Plain REST + a hand-signed JWT: no Google SDK in the bundle.
import crypto from 'crypto';
import { getKV } from './kv';

export type GscRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };
export type GscSnapshot = {
  fetchedAt: number;
  start: string;
  end: string;
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  prevTotals: { clicks: number; impressions: number } | null; // the 28 days before
  queries: GscRow[];
  pages: GscRow[];
  daily: { day: string; clicks: number; impressions: number }[];
};

const KEY = 'gsc:snapshot';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const gscConfigured = (): boolean => !!process.env.GSC_SERVICE_ACCOUNT_JSON;

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64url');

async function accessToken(): Promise<string> {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GSC not configured');
  const sa = JSON.parse(raw) as { client_email?: string; private_key?: string };
  if (!sa.client_email || !sa.private_key) throw new Error('GSC key is missing fields');

  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.` +
    b64url(JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 600 }));
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key).toString('base64url');

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`GSC token exchange failed (${res.status})`);
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('GSC token exchange returned no token');
  return json.access_token;
}

type ApiRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };

async function query(token: string, site: string, body: Record<string, unknown>): Promise<ApiRow[]> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`GSC query failed (${res.status})`);
  return ((await res.json()) as { rows?: ApiRow[] }).rows ?? [];
}

const day = (offset: number) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);
const toRow = (r: ApiRow): GscRow => ({
  key: r.keys?.[0] ?? '',
  clicks: r.clicks ?? 0,
  impressions: r.impressions ?? 0,
  ctr: r.ctr ?? 0,
  position: r.position ?? 0,
});

/** Pull a fresh snapshot from Google and store it. Throws on any failure. */
export async function syncGsc(): Promise<GscSnapshot> {
  const site = process.env.GSC_SITE_URL || 'sc-domain:center.study';
  const token = await accessToken();
  // Search Console data settles about two days behind.
  const end = day(2);
  const start = day(29);
  const range = { startDate: start, endDate: end };

  const [totals, prev, queries, pages, daily] = await Promise.all([
    query(token, site, range),
    query(token, site, { startDate: day(57), endDate: day(30) }),
    query(token, site, { ...range, dimensions: ['query'], rowLimit: 100 }),
    query(token, site, { ...range, dimensions: ['page'], rowLimit: 50 }),
    query(token, site, { ...range, dimensions: ['date'], rowLimit: 60 }),
  ]);

  const t = toRow(totals[0] ?? {});
  const snapshot: GscSnapshot = {
    fetchedAt: Date.now(),
    start,
    end,
    totals: { clicks: t.clicks, impressions: t.impressions, ctr: t.ctr, position: t.position },
    prevTotals: prev[0] ? { clicks: prev[0].clicks ?? 0, impressions: prev[0].impressions ?? 0 } : null,
    queries: queries.map(toRow),
    pages: pages.map(toRow),
    daily: daily
      .map((r) => ({ day: r.keys?.[0] ?? '', clicks: r.clicks ?? 0, impressions: r.impressions ?? 0 }))
      .sort((a, b) => (a.day < b.day ? -1 : 1)),
  };
  const kv = getKV();
  if (kv) await kv.set(KEY, JSON.stringify(snapshot));
  return snapshot;
}

export async function readGscSnapshot(): Promise<GscSnapshot | null> {
  const kv = getKV();
  if (!kv) return null;
  try {
    const v = await kv.get<GscSnapshot | string>(KEY);
    if (!v) return null;
    const snap = typeof v === 'string' ? (JSON.parse(v) as GscSnapshot) : v;
    return Array.isArray(snap?.queries) ? snap : null;
  } catch {
    return null;
  }
}
