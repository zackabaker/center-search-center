import { CONCEPTS, getConceptBySlug } from '@/data/guide/concepts';
import GLOSSARY from '@/data/guide/concept-glossary.json';
import { renderOgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Center Study concept';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return CONCEPTS.map((c) => ({ slug: c.slug }));
}

// Share card per concept: the verbatim defining quote is the image —
// quote-first even in the OG layer.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  const g = (GLOSSARY as Record<string, { definitionQuote?: string; definitionSource?: string; definitionAuthor?: string }>)[slug];

  const title = concept?.title ?? 'Center Study';
  const quoteRaw = g?.definitionQuote || concept?.definition || concept?.subtitle || '';
  const quote = quoteRaw.length > 240 ? quoteRaw.slice(0, 240).replace(/\s+\S*$/, '') + '…' : quoteRaw;
  const meta = g?.definitionSource
    ? `${g.definitionAuthor ? g.definitionAuthor + ' · ' : ''}${g.definitionSource}`
    : undefined;

  return renderOgCard({
    eyebrow: 'Center.Study · Concept',
    title,
    quote: quote || undefined,
    meta,
  });
}
