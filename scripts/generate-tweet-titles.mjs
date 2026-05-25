/**
 * generate-tweet-titles.mjs
 *
 * Uses Claude Haiku to generate concise "Bouvard on X" titles for the
 * long-form tweet threads kept in the archive.
 *
 * Output: src/data/tweet_titles.json  (map of conversation_id → title)
 *
 * Run:  node scripts/generate-tweet-titles.mjs
 *       node scripts/generate-tweet-titles.mjs --force   (re-generate)
 *       node scripts/generate-tweet-titles.mjs --dry     (preview only)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const force = process.argv.includes('--force');
const dry   = process.argv.includes('--dry');

const TWEET_MIN_WORDS = 150;

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateTitle(conversationId, threadText) {
  const snippet = threadText.slice(0, 800).replace(/https?:\/\/\S+/g, '').trim();

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 60,
    messages: [
      {
        role: 'user',
        content: `You are titling archived Twitter/X thread posts by the scholar Dennis Bouvard (handle: bouvard38829538), who writes about Generative Anthropology, sovereignty, mimesis, Israeli/Middle East politics, and contemporary political analysis.

Generate a SHORT title (5-9 words) in the format "Bouvard on [Topic]" that captures the central theme of this tweet thread. Be specific — name the actual political or intellectual topic.

Thread text:
${snippet}

Respond with ONLY the title (5-9 words, starting with "Bouvard on"). No quotes, no explanation.`,
      },
    ],
  });

  const raw = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';
  return raw.replace(/^["']|["']$/g, '').trim();
}

async function main() {
  const tweetsPath  = path.join(ROOT, 'src/data/tweets.json');
  const outputPath  = path.join(ROOT, 'src/data/tweet_titles.json');

  const { author_id, tweets } = JSON.parse(fs.readFileSync(tweetsPath, 'utf-8'));

  // Rebuild threads (same logic as parser)
  const threads = new Map();
  for (const t of tweets) {
    const key = t.conversation_id || t.id;
    if (!threads.has(key)) threads.set(key, []);
    threads.get(key).push(t);
  }

  // Filter to long self-threads only
  const eligible = [];
  for (const [convId, group] of threads) {
    group.sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
    const root = group.find(t => t.id === convId) || group[0];
    if (root.in_reply_to_user_id && root.in_reply_to_user_id !== author_id) continue;
    const text = group.map(t => t.text.replace(/https?:\/\/t\.co\/\S+/g, '').trim()).join('\n\n');
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words >= TWEET_MIN_WORDS) eligible.push({ convId, text, words });
  }

  // Load existing titles
  const existing = fs.existsSync(outputPath)
    ? JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
    : {};

  const toGenerate = force
    ? eligible
    : eligible.filter(t => !existing[t.convId]);

  console.log(`Eligible threads: ${eligible.length}`);
  console.log(`Need titles: ${toGenerate.length}`);

  if (dry) {
    toGenerate.forEach((t, i) => {
      console.log(`  ${i+1}. [${t.words}w] ${t.text.slice(0, 60).replace(/\n/g, ' ')}`);
    });
    return;
  }

  const titles = { ...existing };
  let generated = 0, errors = 0;

  for (let i = 0; i < toGenerate.length; i++) {
    const { convId, text, words } = toGenerate[i];
    process.stdout.write(`[${i+1}/${toGenerate.length}] ${text.slice(0, 40).replace(/\n/g,' ')}… `);
    try {
      const title = await generateTitle(convId, text);
      titles[convId] = title;
      generated++;
      process.stdout.write(`→ ${title}\n`);
    } catch (err) {
      errors++;
      process.stdout.write(`ERROR: ${err.message}\n`);
    }
    if (i < toGenerate.length - 1) await new Promise(r => setTimeout(r, 80));
  }

  fs.writeFileSync(outputPath, JSON.stringify(titles, null, 2));
  console.log(`\n✓ ${Object.keys(titles).length} titles saved → tweet_titles.json`);
  console.log(`  Generated: ${generated}  |  Errors: ${errors}`);
  console.log('\nNext step: npx tsx scripts/generate-posts-cache.ts');
}

main().catch(err => { console.error(err); process.exit(1); });
