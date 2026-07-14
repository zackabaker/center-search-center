import { redirect } from 'next/navigation';

// The glossary is merged into /concepts (Glossary tab).
export default function GlossaryRedirect() {
  redirect('/concepts/glossary');
}
