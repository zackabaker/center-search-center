/**
 * generate-reddit-titles.mjs
 *
 * Uses Claude to generate concise "Bouvard on X" titles for Reddit threads.
 * Reads src/data/reddit_threads.json, adds generated_title to each thread,
 * and writes back.
 *
 * Run:  node scripts/generate-reddit-titles.mjs
 *       node scripts/generate-reddit-titles.mjs --force   (re-generate existing)
 *       node scripts/generate-reddit-titles.mjs --dry     (preview without calling API)
 *       node scripts/generate-reddit-titles.mjs --min 500 (only threads with 500+ words)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const force = process.argv.includes('--force');
const dry   = process.argv.includes('--dry');
const minWords = parseInt(process.argv.find(a => a.startsWith('--min='))?.slice(6) ?? '80', 10);

// Load API key from .env.local
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

/** Summarise the thread into a short snippet for the prompt */
function buildThreadSummary(thread) {
  const goodChains = thread.chains.filter(c => c.bouvard_words >= 80);
  if (goodChains.length === 0) return '';

  // Take up to 3 of Bouvard's best responses (first 400 chars each)
  const excerpts = goodChains
    .slice(0, 3)
    .map(c => c.bouvard_body.slice(0, 400).replace(/\n+/g, ' '))
    .join('\n\n…\n\n');

  return `Thread title: "${thread.title}"
Subreddit: r/${thread.subreddit}

Bouvard's key responses (excerpts):
${excerpts}`;
}

/**
 * Call Claude to generate a short title.
 * Returns a string like "Bouvard on Sovereignty and Language".
 */
async function generateTitle(thread) {
  const summary = buildThreadSummary(thread);
  if (!summary) return null;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 60,
    messages: [
      {
        role: 'user',
        content: `You are titling archived Reddit discussions by the scholar Dennis Bouvard (writing as "bouvard1"), who works in Generative Anthropology — a theory of language, mimesis, sovereignty, and the originary scene.

Generate a SHORT title (5-9 words) in the format "Bouvard on [Topic]" that captures the central intellectual theme of this discussion. Be specific and substantive — name the actual concepts discussed, not just "Bouvard on Various Topics."

${summary}

Respond with ONLY the title (5-9 words, starting with "Bouvard on"). No quotes, no explanation.`,
      },
    ],
  });

  const raw = message.content[0]?.type === 'text' ? message.content[0].text.trim() : '';
  // Strip any accidental quotes or punctuation
  return raw.replace(/^["']|["']$/g, '').trim();
}

async function main() {
  const outputPath = path.join(ROOT, 'src/data/reddit_threads.json');
  if (!fs.existsSync(outputPath)) {
    console.error('reddit_threads.json not found. Run fetch-reddit-threads.mjs first.');
    process.exit(1);
  }

  const threads = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  const eligible = threads.filter(t => t.total_words >= minWords && t.chains.length > 0);

  console.log(`Total threads: ${threads.length}`);
  console.log(`Eligible (≥${minWords}w): ${eligible.length}`);

  const toGenerate = force
    ? eligible
    : eligible.filter(t => !t.generated_title);

  console.log(`Generating titles for: ${toGenerate.length} threads`);

  if (dry) {
    toGenerate.forEach((t, i) => {
      console.log(`  ${i+1}. [${t.total_words}w] ${t.title.slice(0, 55)}`);
    });
    return;
  }

  let generated = 0, skipped = 0, errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < toGenerate.length; i++) {
    const thread = toGenerate[i];
    const label = `[${i+1}/${toGenerate.length}]`;

    if (!force && thread.generated_title) {
      process.stdout.write(`${label} ✓ (already): ${thread.generated_title}\n`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`${label} ${thread.title.slice(0, 40)}… `);
      const title = await generateTitle(thread);
      if (title) {
        thread.generated_title = title;
        generated++;
        process.stdout.write(`→ ${title}\n`);
      } else {
        errors++;
        process.stdout.write(`→ (no title generated)\n`);
      }
    } catch (err) {
      errors++;
      process.stdout.write(`ERROR: ${err.message}\n`);
    }

    // Small delay to be polite to the API (not strictly needed with Haiku)
    if (i < toGenerate.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  // Write back
  fs.writeFileSync(outputPath, JSON.stringify(threads, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✓ Done in ${elapsed}s`);
  console.log(`  Generated: ${generated}  |  Skipped: ${skipped}  |  Errors: ${errors}`);
  console.log('\nNext step: npx tsx scripts/generate-posts-cache.ts');
}

main().catch(err => { console.error(err); process.exit(1); });
