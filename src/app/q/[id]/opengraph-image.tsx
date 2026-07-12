import QUOTES from '@/data/quotes.json';
import { renderOgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Center Study — verbatim quote';
export const size = OG_SIZE;
export const contentType = 'image/png';
// 943 static quote pages — render cards on demand and cache, rather than
// prebuilding all of them.
export const revalidate = 86400;

type Quote = { id: string; text: string; sourceTitle: string; source: string; date: string | null; author?: string };

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = (QUOTES as Quote[]).find((x) => x.id === id);

  const raw = q?.text ?? '';
  const quote = raw.length > 260 ? raw.slice(0, 260).replace(/\s+\S*$/, '') + '…' : raw;
  const author = q?.author ?? (q && (q.source === 'chronicle' || q.source === 'ap') ? 'Eric Gans' : 'Adam Katz');

  return renderOgCard({
    eyebrow: 'Center.Study · Quote',
    quote: quote || undefined,
    meta: q ? `${author} · ${q.sourceTitle}` : undefined,
  });
}
