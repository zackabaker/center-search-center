import { GLOSSARY } from '@/data/guide/glossary';
import { renderOgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Center Study glossary term';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  // Only terms that render a page — concept-linked terms redirect to their hub
  // (which has its own card).
  return GLOSSARY.filter((e) => !e.concept).map((e) => ({ slug: e.slug }));
}

// Share card per term: the verbatim defining quote is the image.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = GLOSSARY.find((e) => e.slug === slug);

  const quoteRaw = entry?.definitionQuote ?? '';
  const quote = quoteRaw.length > 240 ? quoteRaw.slice(0, 240).replace(/\s+\S*$/, '') + '…' : quoteRaw;

  return renderOgCard({
    eyebrow: 'Center.Study · Term',
    title: entry?.term ?? 'Center Study',
    quote: quote || undefined,
    meta: entry?.definitionSource,
  });
}
