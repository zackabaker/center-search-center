import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// ── Shared Open Graph card ───────────────────────────────────────────────
// One template for every unfurl: a specimen of the reading experience, not a
// SaaS banner. Warm paper ground, the archive's own words set in Lora, an
// amber rule (amber = the verbatim center, per the site's colour grammar), a
// mono catalog label, and the scene glyph as the corner mark.

export const OG_SIZE = { width: 1200, height: 630 };

// Paper + ink, matched to the site's reading surface.
const PAPER = '#fbfaf7';
const INK = '#1c1917';
const INK_SOFT = '#57534e';
const INK_FAINT = '#a8a29e';
const AMBER = '#d97706';
const FIG = '#44403c';

// The scene mark — eight figures ringing the amber center (the site glyph).
const FIGURES: Array<[number, number]> = [
  [50, 12], [76.87, 23.13], [88, 50], [76.87, 76.87],
  [50, 88], [23.13, 76.87], [12, 50], [23.13, 23.13],
];

function Glyph({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {FIGURES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill={FIG} />
      ))}
      <circle cx={50} cy={50} r={11} fill={AMBER} />
    </svg>
  );
}

// Fonts are read once and reused across every card render in the process.
let fontsPromise: Promise<Array<{ name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' | 'italic' }>> | null = null;
function loadFonts() {
  if (!fontsPromise) {
    const dir = join(process.cwd(), 'src/assets/fonts');
    fontsPromise = Promise.all([
      readFile(join(dir, 'Lora-Regular.ttf')),
      readFile(join(dir, 'Lora-SemiBold.ttf')),
      readFile(join(dir, 'Lora-Italic.ttf')),
      readFile(join(dir, 'GeistMono-Medium.ttf')),
    ]).then(([reg, semi, ital, mono]) => [
      { name: 'Lora', data: reg, weight: 400 as const, style: 'normal' as const },
      { name: 'Lora', data: semi, weight: 600 as const, style: 'normal' as const },
      { name: 'Lora', data: ital, weight: 400 as const, style: 'italic' as const },
      { name: 'Geist Mono', data: mono, weight: 500 as const, style: 'normal' as const },
    ]);
  }
  return fontsPromise;
}

interface OgCardOptions {
  /** Mono catalog label, e.g. "CENTER.STUDY" or "CENTER.STUDY · CONCEPT". */
  eyebrow: string;
  /** Large Lora heading — a post/concept title, or the site name. */
  title?: string;
  /** Verbatim quote, set in Lora italic behind the amber rule. */
  quote?: string;
  /** Attribution / meta line, mono. */
  meta?: string;
}

export async function renderOgCard(opts: OgCardOptions) {
  const { eyebrow, title, quote, meta } = opts;
  const fonts = await loadFonts();

  // Scale the title down as it grows so long ones still fit on two lines.
  const titleSize = !title ? 0 : title.length > 64 ? 52 : title.length > 40 ? 62 : 76;
  const quoteText = quote ? `“${quote}”` : '';
  const quoteSize = quote && quote.length > 160 ? 30 : 36;

  return new ImageResponse(
    (
      <div
        style={{
          background: PAPER,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 76px',
          fontFamily: 'Lora',
          position: 'relative',
        }}
      >
        {/* Top row: glyph + catalog label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Glyph size={46} />
          <span
            style={{
              fontFamily: 'Geist Mono',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '0.16em',
              color: INK_SOFT,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Middle: title and/or quote */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: '36px', paddingBottom: '28px' }}>
          {title ? (
            <div
              style={{
                fontFamily: 'Lora',
                fontWeight: 600,
                fontSize: `${titleSize}px`,
                lineHeight: 1.12,
                color: INK,
                letterSpacing: '-0.01em',
                maxWidth: '1000px',
                marginBottom: quoteText ? '30px' : '0px',
              }}
            >
              {title}
            </div>
          ) : null}

          {quoteText ? (
            <div style={{ display: 'flex', borderLeft: `5px solid ${AMBER}`, paddingLeft: '30px' }}>
              <div
                style={{
                  fontFamily: 'Lora',
                  fontStyle: 'italic',
                  fontSize: `${quoteSize}px`,
                  lineHeight: 1.42,
                  color: INK,
                  maxWidth: '980px',
                }}
              >
                {quoteText}
              </div>
            </div>
          ) : null}
        </div>

        {/* Bottom: amber rule + meta */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', width: '64px', height: '3px', background: AMBER, marginBottom: '18px' }} />
          <span
            style={{
              fontFamily: 'Geist Mono',
              fontSize: '19px',
              fontWeight: 500,
              color: meta ? INK_SOFT : INK_FAINT,
              letterSpacing: '0.02em',
            }}
          >
            {meta || 'center.study'}
          </span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
