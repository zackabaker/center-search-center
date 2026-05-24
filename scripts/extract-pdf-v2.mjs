/**
 * Re-extract PDF text files using pdfjs-dist for position-aware spacing.
 *
 * The original pdf-parse extractor concatenated text items without inserting
 * spaces at line breaks, producing "discussedwithout" etc. pdfjs-dist gives us
 * each typeset line as a text item with x/y coordinates so we can reconstruct
 * proper paragraph structure.
 *
 * Output format: each line in a paragraph separated by \n; paragraphs by \n\n.
 * This is the "WRAPPED" format that cleanPdfText() in parser.ts handles correctly.
 *
 * Usage: node scripts/extract-pdf-v2.mjs [--force]
 *   --force  Overwrite existing .txt files (default: skip if exists)
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from '../node_modules/pdfjs-dist/legacy/build/pdf.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, '..', 'public', 'pdfs');

// Point at the worker file
const workerSrc = path.join(
  __dirname, '..', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.worker.mjs'
);
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const FORCE = process.argv.includes('--force');

/**
 * Extract text from a single PDF with proper inter-word spacing.
 *
 * Algorithm:
 *   1. Per page, collect all text items with x, y, width from pdfjs.
 *   2. Sort items by y (descending — PDF y-axis goes up from bottom).
 *   3. Group into visual lines: items whose y values are within SAME_LINE_TOL.
 *   4. Within each line, sort by x and join — inserting a space whenever the
 *      gap between consecutive items exceeds SPACE_GAP_FACTOR × avg char width.
 *   5. Between consecutive lines:
 *      - gap > PARA_BREAK_FACTOR × line height  → paragraph break (\n\n)
 *      - otherwise                               → line continuation (\n)
 *   Pages are separated by a paragraph break.
 */
async function extractText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdfDoc = await pdfjsLib.getDocument({ data }).promise;

  const SAME_LINE_TOL     = 4;   // pts — items within this y-range are "same line"
  const SPACE_GAP_FACTOR  = 0.3; // gap > 0.3× item height → insert space between items
  const PARA_BREAK_FACTOR = 1.5; // line gap > 1.5× line height → paragraph break

  const pageTexts = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const tc   = await page.getTextContent();

    // Filter truly empty items but KEEP space-only items (" ") —
    // pdfjs encodes inter-font-run spaces (e.g. roman→italic) as separate
    // text items with str=" " and width≈0.  Dropping them causes merges.
    const items = tc.items.filter(it => it.str && it.str.length > 0);
    if (items.length === 0) continue;

    // Annotate with canonical x, y, width, height
    const annotated = items.map(it => ({
      str:    it.str,
      x:      it.transform[4],
      y:      it.transform[5],
      width:  it.width  || 0,
      height: it.height || Math.abs(it.transform[3]) || 12,
    }));

    // Sort by y descending (top of page first), then x ascending
    annotated.sort((a, b) => b.y - a.y || a.x - b.x);

    // Group into lines
    const lines = [];
    let currentLine = [annotated[0]];

    for (let i = 1; i < annotated.length; i++) {
      const prev = currentLine[currentLine.length - 1];
      const curr = annotated[i];
      if (Math.abs(prev.y - curr.y) <= SAME_LINE_TOL) {
        currentLine.push(curr);
      } else {
        lines.push(currentLine);
        currentLine = [curr];
      }
    }
    lines.push(currentLine);

    // Build page text
    const lineStrings = [];
    let prevLineY    = null;
    let prevLineH    = null;

    for (const line of lines) {
      // Sort items within line by x
      line.sort((a, b) => a.x - b.x);

      // Determine paragraph break from previous line
      if (prevLineY !== null) {
        const avgH  = prevLineH ?? 12;
        const gap   = prevLineY - line[0].y;       // positive = moving down
        if (gap > avgH * PARA_BREAK_FACTOR) {
          lineStrings.push('');                     // blank line = paragraph break
        }
      }

      // Concatenate items in this line
      let lineText = '';
      for (let i = 0; i < line.length; i++) {
        const it = line[i];
        if (i === 0) {
          lineText += it.str;
        } else {
          const prev     = line[i - 1];
          const gap      = it.x - (prev.x + prev.width);
          const spaceMin = (prev.height || it.height || 12) * SPACE_GAP_FACTOR;
          lineText += (gap > spaceMin ? ' ' : '') + it.str;
        }
      }

      lineStrings.push(lineText.trim());

      prevLineY = line[line.length - 1].y;
      prevLineH = Math.max(...line.map(it => it.height || 12));
    }

    pageTexts.push(lineStrings.join('\n'));
  }

  return pageTexts.join('\n\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────

const pdfFiles = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
if (pdfFiles.length === 0) {
  console.log('No PDF files found in public/pdfs/');
  process.exit(0);
}

for (const pdfFile of pdfFiles) {
  const base    = pdfFile.replace('.pdf', '');
  const txtPath = path.join(pdfDir, base + '.txt');

  if (fs.existsSync(txtPath) && !FORCE) {
    console.log(`Skipping ${pdfFile} (already extracted — use --force to overwrite)`);
    continue;
  }

  process.stdout.write(`Extracting ${pdfFile}... `);
  try {
    const text = await extractText(path.join(pdfDir, pdfFile));
    fs.writeFileSync(txtPath, text, 'utf-8');
    const lines = text.split('\n').length;
    console.log(`done (${lines} lines, ${text.length} chars)`);
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
  }
}

console.log('\nDone. Run: npx tsx scripts/generate-posts-cache.ts');
