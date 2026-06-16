// Minimal EPUB 3 writer — no dependencies.
// EPUB is a zip whose first entry must be an uncompressed `mimetype` file;
// we store every entry uncompressed (valid per the zip spec), which keeps
// this implementation ~100 lines. Readers (Apple Books, Calibre, ElevenReader,
// Kindle via conversion) accept stored entries fine.

// ── CRC32 (required even for stored zip entries) ────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ── Store-only zip builder ──────────────────────────────────────────────────
interface ZipEntry {
  name: string;
  data: Uint8Array;
}

function u16(v: number): number[] { return [v & 0xff, (v >> 8) & 0xff]; }
function u32(v: number): number[] { return [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff]; }

export function buildZip(entries: ZipEntry[]): Uint8Array {
  const enc = new TextEncoder();
  const localParts: number[] = [];
  const centralParts: number[] = [];
  let offset = 0;
  for (const e of entries) {
    const name = enc.encode(e.name);
    const crc = crc32(e.data);
    const header = [
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(e.data.length), ...u32(e.data.length),
      ...u16(name.length), ...u16(0),
    ];
    localParts.push(...header, ...name, ...e.data);
    centralParts.push(
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(e.data.length), ...u32(e.data.length),
      ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(0), ...u32(offset), ...name,
    );
    offset += header.length + name.length + e.data.length;
  }
  const centralOffset = offset;
  const eocd = [
    ...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(entries.length), ...u16(entries.length),
    ...u32(centralParts.length), ...u32(centralOffset), ...u16(0),
  ];
  return Uint8Array.from([...localParts, ...centralParts, ...eocd]);
}

// ── EPUB assembly ───────────────────────────────────────────────────────────
export interface EpubChapter {
  title: string;
  author: string;
  sourceLabel: string;
  date: string | null;
  /** Plain text content; paragraphs separated by blank lines. */
  content: string;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function chapterXhtml(ch: EpubChapter, index: number): string {
  const paras = ch.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p === '---') return '<hr/>';
      const h = p.match(/^(#{1,3})\s+([\s\S]*)$/);
      if (h) return `<h${h[1].length + 1}>${esc(h[2])}</h${h[1].length + 1}>`;
      if (p.startsWith('> ')) return `<blockquote><p>${esc(p.slice(2))}</p></blockquote>`;
      if (p.startsWith('_') && p.endsWith('_')) return `<p class="frontmatter">${esc(p.slice(1, -1))}</p>`;
      return `<p>${esc(p)}</p>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>${esc(ch.title)}</title><link rel="stylesheet" type="text/css" href="../style.css"/></head>
<body>
<section epub:type="chapter" id="ch${index}">
<h1>${esc(ch.title)}</h1>
<p class="meta">${esc(ch.author)} · ${esc(ch.sourceLabel)}${ch.date ? ` · ${esc(ch.date)}` : ''}</p>
${paras}
</section>
</body>
</html>`;
}

export function buildEpub(title: string, chapters: EpubChapter[]): Uint8Array {
  const enc = new TextEncoder();
  const uid = `urn:center-study:${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

  const css = `
body { font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; }
h1 { font-size: 1.4em; line-height: 1.3; }
.meta { color: #666; font-size: 0.85em; margin-bottom: 2em; }
.frontmatter { color: #666; font-style: italic; }
blockquote { margin: 1em 1.5em; font-style: italic; color: #444; }
hr { border: none; border-top: 1px solid #ccc; margin: 2em 25%; }
`;

  const manifestItems = chapters
    .map((_, i) => `<item id="ch${i}" href="text/ch${i}.xhtml" media-type="application/xhtml+xml"/>`)
    .join('\n    ');
  const spineItems = chapters.map((_, i) => `<itemref idref="ch${i}"/>`).join('\n    ');

  const opf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">${esc(uid)}</dc:identifier>
    <dc:title>${esc(title)}</dc:title>
    <dc:language>en</dc:language>
    <dc:publisher>Center Study Center — center.study</dc:publisher>
    <meta property="dcterms:modified">${now}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="style.css" media-type="text/css"/>
    ${manifestItems}
  </manifest>
  <spine>
    ${spineItems}
  </spine>
</package>`;

  const navItems = chapters
    .map((ch, i) => `<li><a href="text/ch${i}.xhtml">${esc(ch.title)}</a></li>`)
    .join('\n      ');
  const nav = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Contents</title></head>
<body>
<nav epub:type="toc" id="toc">
  <h1>Contents</h1>
  <ol>
      ${navItems}
  </ol>
</nav>
</body>
</html>`;

  const container = `<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;

  const entries: ZipEntry[] = [
    { name: 'mimetype', data: enc.encode('application/epub+zip') }, // must be first, stored
    { name: 'META-INF/container.xml', data: enc.encode(container) },
    { name: 'OEBPS/content.opf', data: enc.encode(opf) },
    { name: 'OEBPS/nav.xhtml', data: enc.encode(nav) },
    { name: 'OEBPS/style.css', data: enc.encode(css) },
    ...chapters.map((ch, i) => ({
      name: `OEBPS/text/ch${i}.xhtml`,
      data: enc.encode(chapterXhtml(ch, i)),
    })),
  ];

  return buildZip(entries);
}
