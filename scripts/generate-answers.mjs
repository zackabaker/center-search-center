#!/usr/bin/env node
// Generates src/data/answers.json — pre-rendered canonical answers for the
// static /ask/[slug] pages. Calls the production Ask pipeline (hybrid
// retrieval + verbatim-quote synthesis) once per question.
//
//   node scripts/generate-answers.mjs [base-url] [--only slug]
//
// Answers are REVIEWED BY THE OWNER before the route ships — this script only
// writes the data file.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'https://center.study';
const onlyIdx = process.argv.indexOf('--only');
const ONLY = onlyIdx > -1 ? process.argv[onlyIdx + 1] : null;

const QUESTIONS = [
  ['what-is-center-study', 'What is Center Study?'],
  ['what-is-the-originary-hypothesis', 'What is the originary hypothesis?'],
  ['what-is-generative-anthropology', 'What is Generative Anthropology?'],
  ['who-are-adam-katz-and-dennis-bouvard', 'Who are Adam Katz and Dennis Bouvard?'],
  ['center-study-vs-girard', 'How is Center Study different from René Girard?'],
  ['center-study-vs-generative-anthropology', 'How is Center Study different from Generative Anthropology?'],
  ['what-does-the-center-mean', 'What does “the center” actually mean?'],
  ['what-is-deferral', 'What is deferral in Center Study?'],
  ['what-is-the-sacred', 'What is the sacred in Generative Anthropology?'],
  ['language-vs-animal-communication', 'How is human language different from animal communication?'],
  ['is-the-originary-hypothesis-falsifiable', 'Is the originary hypothesis falsifiable?'],
  ['what-is-mimetic-desire', 'What is mimetic desire, and how does it lead to the originary scene?'],
  ['what-is-resentment', 'What is resentment in Generative Anthropology?'],
  ['what-is-originary-grammar', 'What is originary grammar?'],
  ['money-and-the-sacred', 'What is the relationship between money and the sacred?'],
  ['what-is-sovereignty', 'What is sovereignty in Center Study?'],
  ['scapegoating-girard-vs-gans', 'How does Center Study revise Girard’s account of the scapegoat?'],
  ['center-study-on-ai', 'How does Center Study analyze AI and large language models?'],
  ['center-study-on-liberalism', 'How does Center Study read liberalism?'],
  ['why-does-the-center-matter', 'Why does the center matter for understanding politics?'],
];

const outPath = path.join(ROOT, 'src/data/answers.json');
const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : {};

async function generate(slug, question) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: BASE },
    body: JSON.stringify({ message: question }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.text();
  let sources = [];
  let answer = '';
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      const j = JSON.parse(line);
      if (j.sources) sources = j.sources;
      if (j.text) answer += j.text;
    } catch { /* ignore partial lines */ }
  }
  if (answer.trim().length < 400) throw new Error(`answer too short (${answer.length} chars)`);
  return { question, answer: answer.trim(), sources, generatedAt: new Date().toISOString().slice(0, 10) };
}

for (const [slug, question] of QUESTIONS) {
  if (ONLY && slug !== ONLY) continue;
  if (existing[slug] && !ONLY) { console.log(`• ${slug} (cached)`); continue; }
  process.stdout.write(`→ ${slug} … `);
  try {
    existing[slug] = await generate(slug, question);
    fs.writeFileSync(outPath, JSON.stringify(existing, null, 2) + '\n');
    console.log(`✓ ${existing[slug].answer.length} chars, ${existing[slug].sources.length} sources`);
  } catch (e) {
    console.log(`✗ ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 1500));
}
console.log(`\nDone: ${Object.keys(existing).length} answers in src/data/answers.json`);
