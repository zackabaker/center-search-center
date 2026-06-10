import { redirect } from 'next/navigation';

// The concepts index lives at /concepts (Core Concepts / Glossary / A–Z).
// Individual concept pages remain at /guide/concepts/[slug].
export default function GuideConceptsRedirect() {
  redirect('/concepts');
}
