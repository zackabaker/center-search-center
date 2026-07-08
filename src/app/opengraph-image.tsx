import { renderOgCard, OG_SIZE } from '@/lib/og-card';

export const alt = 'Center Study Center — Archive of Adam Katz & Dennis Bouvard';
export const size = OG_SIZE;
export const contentType = 'image/png';

// The site's own signature epigraph, set on paper — the default face of the archive.
export default function Image() {
  return renderOgCard({
    eyebrow: 'Center.Study',
    quote:
      'The originary hypothesis repels the kind of initiatory revelatory ‘download’ that is nevertheless the only way of understanding it',
    meta: 'Adam Katz · Dennis Bouvard · Eric Gans',
  });
}
