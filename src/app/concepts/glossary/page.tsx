import { GLOSSARY } from '@/data/guide/glossary';
import { getPublicPosts } from '@/lib/parser';
import GlossaryClient from '@/components/GlossaryClient';
import ConceptsHeader from '../ConceptsHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Glossary',
  description:
    'A glossary of Center Study working terms, each defined by a verbatim passage from the corpus.',
  alternates: { canonical: 'https://center.study/concepts/glossary' },
};

// Attach the real author of each defining quote's source (server-side —
// Anthropoetics is multi-author, so venue alone misattributes). The client
// labels the rare non-Katz definition and gives it a gray rule.
function enrichedGlossary() {
  const bySlug = new Map(getPublicPosts().map((p) => [p.slug, p]));
  return GLOSSARY.map((e) => {
    const post = bySlug.get(e.definitionSlug);
    const a = (post?.author ?? '').trim();
    const definitionAuthor =
      a || (post?.source === 'chronicle' || post?.source === 'ap' ? 'Eric Gans' : 'Adam Katz');
    return { ...e, definitionAuthor };
  });
}

export default function GlossaryPage() {
  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">
      <ConceptsHeader active="glossary" />
      <GlossaryClient entries={enrichedGlossary()} />
    </main>
  );
}
