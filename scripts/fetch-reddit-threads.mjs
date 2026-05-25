/**
 * fetch-reddit-threads.mjs
 *
 * Fetches full Reddit thread JSON for every thread where Bouvard has
 * substantive comments. Reconstructs dialogue chains (question → Bouvard
 * reply → follow-up → Bouvard reply…) by resolving parent_id ancestors.
 *
 * Output: src/data/reddit_threads.json
 *
 * Run:  node scripts/fetch-reddit-threads.mjs
 *       node scripts/fetch-reddit-threads.mjs --force   (re-fetch even cached)
 *       node scripts/fetch-reddit-threads.mjs --dry     (just list threads)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const BOUVARD_AUTHOR = 'bouvard1';
const MIN_BOUVARD_WORDS = 80;   // min words in any single comment to qualify
const MIN_TOTAL_WORDS  = 300;   // OR total Bouvard words in thread
const RATE_LIMIT_MS    = 1500;  // ms between Reddit API calls
const USER_AGENT       = 'CenterStudyArchive/1.0 (https://center.study)';

const force = process.argv.includes('--force');
const dry   = process.argv.includes('--dry');

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Recursively flatten a Reddit comment tree into a Map<id, comment> */
function flattenComments(children, map = new Map()) {
  for (const child of children ?? []) {
    if (child.kind !== 't1' || !child.data) continue;
    const d = child.data;
    if (!d.body || d.body === '[deleted]' || d.body === '[removed]') continue;
    map.set(d.id, {
      id:          d.id,
      author:      d.author,
      body:        d.body,
      parent_id:   d.parent_id,   // "t1_xxx" or "t3_xxx"
      score:       d.score ?? 0,
      created_utc: d.created_utc ?? 0,
    });
    if (d.replies?.data?.children?.length) {
      flattenComments(d.replies.data.children, map);
    }
  }
  return map;
}

/**
 * For each Bouvard comment, walk parent_id chain upward to build context.
 * Returns the immediate non-Bouvard parent (the "question") if present.
 */
function resolveParent(bouvardComment, allComments) {
  const rawId = bouvardComment.parent_id ?? '';

  if (rawId.startsWith('t3_')) {
    // Reply directly to the original post
    return { type: 'op' };
  }
  if (rawId.startsWith('t1_')) {
    const parentId = rawId.slice(3);
    const parent = allComments.get(parentId);
    if (!parent) return { type: 'missing' };
    if (parent.author === BOUVARD_AUTHOR) {
      // Bouvard replied to himself — look one level higher
      return resolveParent(parent, allComments);
    }
    return { type: 'comment', comment: parent };
  }
  return { type: 'unknown' };
}

/**
 * Build dialogue entries for a thread.
 * A "dialogue entry" = optional question + Bouvard's reply + any
 * Bouvard-authored child replies in the same chain.
 *
 * We collapse consecutive Bouvard self-replies into one block.
 */
function buildDialogueChains(bouvardComments, allComments, opText, opAuthor) {
  // Sort chronologically
  bouvardComments.sort((a, b) => a.created_utc - b.created_utc);

  const entries = [];
  const processedIds = new Set();

  for (const bc of bouvardComments) {
    if (processedIds.has(bc.id)) continue;
    const wordCount = bc.body.split(/\s+/).length;
    if (wordCount < 15) continue;                          // skip trivial one-liners
    if (/^https?:\/\/\S+\s*$/.test(bc.body.trim())) continue; // skip bare URL posts

    processedIds.add(bc.id);

    const parentInfo = resolveParent(bc, allComments);
    const entry = {
      bouvard_body:  bc.body,
      bouvard_words: wordCount,
    };

    if (parentInfo.type === 'comment') {
      entry.questioner = parentInfo.comment.author;
      entry.question   = parentInfo.comment.body;
    } else if (parentInfo.type === 'op' && opText && opText.trim().length > 20) {
      entry.questioner = opAuthor || '[OP]';
      entry.question   = opText.slice(0, 1500); // cap very long OPs
      entry.is_op_reply = true;
    }

    entries.push(entry);
  }

  return entries;
}

/** Fetch raw JSON from Reddit for a given post ID */
async function fetchThread(postId) {
  const url = `https://www.reddit.com/comments/${postId}.json?limit=500&depth=10&raw_json=1`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept':     'application/json',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const commentsPath = path.join(ROOT, 'src/data/reddit_comments.json');
  const outputPath   = path.join(ROOT, 'src/data/reddit_threads.json');

  const rawComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));

  // Group by thread
  const threadMap = new Map();
  for (const c of rawComments) {
    const key = c.link_id ?? 'unknown';
    if (!threadMap.has(key)) {
      threadMap.set(key, {
        link_id:    key,
        link_title: c.link_title,
        subreddit:  c.subreddit,
        permalink:  c.permalink,
        comments:   [],
      });
    }
    threadMap.get(key).comments.push(c);
  }

  // Filter to substantial
  const substantial = [...threadMap.values()].filter(t => {
    const total   = t.comments.reduce((s, c) => s + c.body.split(/\s+/).length, 0);
    const hasLong = t.comments.some(c => c.body.split(/\s+/).length >= MIN_BOUVARD_WORDS);
    return hasLong || total >= MIN_TOTAL_WORDS;
  });

  substantial.sort((a, b) => {
    const wa = a.comments.reduce((s,c)=>s+c.body.split(/\s+/).length,0);
    const wb = b.comments.reduce((s,c)=>s+c.body.split(/\s+/).length,0);
    return wb - wa;
  });

  console.log(`Substantial threads: ${substantial.length}`);
  if (dry) {
    substantial.forEach((t, i) => {
      const w = t.comments.reduce((s,c)=>s+c.body.split(/\s+/).length,0);
      console.log(`  ${i+1}. ${w}w / ${t.comments.length}c | r/${t.subreddit} | ${(t.link_title||'?').slice(0,55)}`);
    });
    return;
  }

  // Load existing cached results
  const existing = new Map();
  if (!force && fs.existsSync(outputPath)) {
    const arr = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    for (const t of arr) existing.set(t.thread_id, t);
    console.log(`Cached: ${existing.size} threads already fetched`);
  }

  const results = [];
  let fetched = 0, errors = 0, skipped = 0;

  for (let i = 0; i < substantial.length; i++) {
    const t      = substantial[i];
    const postId = (t.link_id ?? '').replace('t3_', '');
    const label  = `[${i+1}/${substantial.length}]`;

    if (existing.has(postId)) {
      results.push(existing.get(postId));
      skipped++;
      process.stdout.write(`${label} ✓ cached: ${(t.link_title||'').slice(0,45)}\n`);
      continue;
    }

    try {
      process.stdout.write(`${label} Fetching ${postId}… `);
      const json = await fetchThread(postId);

      // OP data
      const postData = json[0]?.data?.children?.[0]?.data ?? {};
      const opText   = postData.selftext ?? '';
      const opAuthor = postData.author   ?? '';
      const title    = t.link_title || postData.title || postId;

      // Build flat comment map from the full thread
      const commentChildren = json[1]?.data?.children ?? [];
      const allComments     = flattenComments(commentChildren);

      // Bouvard's comments for this thread
      const bouvardHere = t.comments.map(bc => ({
        id:          bc.id,
        author:      bc.author,
        body:        bc.body,
        parent_id:   bc.parent_id,
        created_utc: bc.created_utc ?? 0,
      }));

      const chains     = buildDialogueChains(bouvardHere, allComments, opText, opAuthor);
      const totalWords = bouvardHere.reduce((s, c) => s + c.body.split(/\s+/).length, 0);

      const record = {
        thread_id:             postId,
        subreddit:             t.subreddit,
        title,
        op_author:             opAuthor,
        op_text:               opText.length > 50 ? opText.slice(0, 3000) : '',
        chains,
        total_words:           totalWords,
        bouvard_comment_count: bouvardHere.length,
        fetched_at:            new Date().toISOString(),
      };

      results.push(record);
      fetched++;
      process.stdout.write(`done — ${chains.length} chains, ${totalWords}w\n`);

    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
      errors++;
      // Still add a stub so we know we tried
      results.push({
        thread_id:             postId,
        subreddit:             t.subreddit,
        title:                 t.link_title ?? postId,
        chains:                [],
        total_words:           t.comments.reduce((s,c)=>s+c.body.split(/\s+/).length,0),
        bouvard_comment_count: t.comments.length,
        fetch_error:           err.message,
        fetched_at:            new Date().toISOString(),
      });
    }

    if (i < substantial.length - 1) await sleep(RATE_LIMIT_MS);
  }

  // Sort by Bouvard word count descending
  results.sort((a, b) => b.total_words - a.total_words);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✓ ${results.length} threads saved → src/data/reddit_threads.json`);
  console.log(`  Newly fetched: ${fetched}  |  Cached: ${skipped}  |  Errors: ${errors}`);
  console.log('\nNext step: node scripts/generate-posts-cache.ts');
}

main().catch(err => { console.error(err); process.exit(1); });
