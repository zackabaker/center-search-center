/**
 * Extract text from PDFs in public/pdfs/ and save as .txt files
 *
 * Usage: npx tsx scripts/extract-pdf.ts
 */

import fs from 'fs';
import path from 'path';

async function main() {
  // pdf-parse v1 uses require-style default export
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');

  const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
    console.log('Created public/pdfs/ directory. Add PDF files and re-run.');
    return;
  }

  const pdfFiles = fs.readdirSync(pdfDir).filter((f: string) => f.endsWith('.pdf'));
  if (pdfFiles.length === 0) {
    console.log('No PDF files found in public/pdfs/');
    return;
  }

  for (const pdfFile of pdfFiles) {
    const txtFile = pdfFile.replace('.pdf', '.txt');
    const txtPath = path.join(pdfDir, txtFile);

    if (fs.existsSync(txtPath)) {
      console.log(`Skipping ${pdfFile} (already extracted)`);
      continue;
    }

    console.log(`Extracting text from ${pdfFile}...`);
    const pdfBuffer = fs.readFileSync(path.join(pdfDir, pdfFile));
    const data = await pdfParse(pdfBuffer);
    fs.writeFileSync(txtPath, data.text, 'utf-8');
    console.log(`  Saved ${txtFile} (${data.numpages} pages, ${data.text.length} chars)`);
  }

  console.log('Done.');
}

main().catch(console.error);
