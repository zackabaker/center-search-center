/**
 * Fetch all tweets from @bouvard38829538 via X API v2.
 *
 * Requirements:
 *   - X developer account with Basic tier or above
 *   - Bearer Token set in .env.local as TWITTER_BEARER_TOKEN=...
 *
 * Run:
 *   npx tsx scripts/fetch-tweets.ts
 *
 * On subsequent runs, only NEW tweets (after the most recent already saved)
 * are fetched. Use --full to re-fetch everything from scratch.
 *
 * Output: src/data/tweets.json
 */

import fs from 'fs';
import path from 'path';

// ── Load .env.local (Next.js doesn't auto-load it for scripts) ───────────────
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const BEARER = process.env.TWITTER_BEARER_TOKEN;
if (!BEARER) {
  console.error(
    'Missing TWITTER_BEARER_TOKEN in .env.local\n' +
    'Add a line:  TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAAp...'
  );
  process.exit(1);
}

const USERNAME = 'bouvard38829538';
const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'tweets.json');
const FULL_FETCH = process.argv.includes('--full');

// ── Types ────────────────────────────────────────────────────────────────────
interface TweetRecord {
  id: string;
  text: string;
  created_at: string;
  conversation_id: string;
  in_reply_to_user_id?: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count?: number;
  };
}

interface TweetsFile {
  author_id: string;
  fetched_at: string;
  tweets: TweetRecord[];
}

// ── API helpers ───────────────────────────────────────────────────────────────
async function xGet<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${BEARER}` },
  });
  if (res.status === 429) {
    const resetAt = Number(res.headers.get('x-rate-limit-reset') || 0) * 1000;
    const waitMs = Math.max(resetAt - Date.now(), 15_000);
    console.log(`Rate limited. Waiting ${Math.ceil(waitMs / 1000)}s…`);
    await new Promise((r) => setTimeout(r, waitMs));
    return xGet<T>(url);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

async function getUserId(username: string): Promise<string> {
  const data = await xGet<{ data: { id: string; username: string } }>(
    `https://api.twitter.com/2/users/by/username/${username}`
  );
  return data.data.id;
}

/** Fetch one page of tweets. Returns tweets + next_token (if any). */
async function fetchPage(userId: string, params: URLSearchParams): Promise<{
  tweets: TweetRecord[];
  nextToken: string | null;
}> {
  const url = `https://api.twitter.com/2/users/${userId}/tweets?${params}`;
  const data = await xGet<{
    data?: TweetRecord[];
    meta?: { next_token?: string; result_count: number };
    errors?: { title: string; detail: string }[];
  }>(url);

  if (data.errors?.length) {
    console.warn('API errors:', data.errors);
  }

  return {
    tweets: data.data ?? [],
    nextToken: data.meta?.next_token ?? null,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Fetching tweets for @${USERNAME}…`);

  // Load existing data
  let existing: TweetsFile = { author_id: '', fetched_at: '', tweets: [] };
  if (fs.existsSync(DATA_FILE)) {
    try { existing = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); } catch {}
  }

  // Resolve user ID (cache it)
  let authorId = existing.author_id;
  if (!authorId) {
    console.log('Looking up user ID…');
    authorId = await getUserId(USERNAME);
    console.log(`User ID: ${authorId}`);
  }

  // The most recent tweet ID we already have — use as since_id for incremental fetch
  const existingIds = new Set(existing.tweets.map((t) => t.id));
  const mostRecentId = existing.tweets
    .map((t) => BigInt(t.id))
    .reduce((max, id) => (id > max ? id : max), BigInt(0))
    .toString();

  const baseParams = new URLSearchParams({
    max_results: '100',
    'tweet.fields': 'id,text,created_at,public_metrics,conversation_id,in_reply_to_user_id,referenced_tweets',
    exclude: 'retweets',
  });

  // Incremental fetch: start after newest tweet we have (unless --full)
  if (!FULL_FETCH && mostRecentId !== '0') {
    baseParams.set('since_id', mostRecentId);
    console.log(`Incremental fetch — tweets newer than ${mostRecentId}`);
  } else {
    console.log('Full fetch — fetching all available tweets (up to 3,200)');
  }

  const newTweets: TweetRecord[] = [];
  let nextToken: string | null = null;
  let pages = 0;

  do {
    const params = new URLSearchParams(baseParams);
    if (nextToken) params.set('pagination_token', nextToken);

    const result = await fetchPage(authorId, params);
    pages++;

    const fresh = result.tweets.filter((t) => !existingIds.has(t.id));
    newTweets.push(...fresh);

    console.log(
      `  Page ${pages}: ${result.tweets.length} tweets returned, ${fresh.length} new`
    );

    nextToken = result.nextToken;

    // Brief pause to be polite to the API
    if (nextToken) await new Promise((r) => setTimeout(r, 1_000));
  } while (nextToken);

  if (newTweets.length === 0) {
    console.log('No new tweets found.');
  } else {
    console.log(`\nFetched ${newTweets.length} new tweets across ${pages} page(s).`);
  }

  // Merge: new tweets + existing, deduplicated, sorted newest-first
  const allTweets = [...newTweets, ...existing.tweets];
  const deduped = [...new Map(allTweets.map((t) => [t.id, t])).values()];
  deduped.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const output: TweetsFile = {
    author_id: authorId,
    fetched_at: new Date().toISOString(),
    tweets: deduped,
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(output, null, 2) + '\n', 'utf-8');
  console.log(`\nSaved ${deduped.length} total tweets to ${path.relative(process.cwd(), DATA_FILE)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
