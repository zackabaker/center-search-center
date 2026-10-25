import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Lineage: Girard → Gans → Katz',
  description: 'Girard → Gans → Katz, in verbatim passages from the corpus.',
};

// Each indented passage is exact source text, linked to the post it comes from.
// Quotes reproduce the corpus punctuation faithfully; ellipses (…) mark elided text.

interface Beat {
  id: string;
  quote: string;
  cite: string;
  slug: string;
}

const BEATS: Beat[] = [
  {
    id: 'what-it-is',
    quote:
      'There have been many attempts to set the humanities on a scientific basis: phenomenology, structuralism, sociobiology, various functionalist accounts. Yet, in my estimation, there has been only one successful attempt, and that is Generative Anthropology (GA), the first real science of the human.',
    cite: 'Peter Goldman, “Why Generative Anthropology” (Introduction to GA, 2013)',
    slug: 'why-generative-anthropology',
  },
  {
    id: 'girard',
    quote:
      'The originary hypothesis, advanced by Eric Gans in his The Origin of Language in 1981, posits a singular event within which language, or the sign, originates. Gans’s starting point is Rene Girard’s understanding of the conflictual nature of mimesis: as humans are the most mimetic species, and mimesis generates rivalry because our model, the more we model ourselves on him, becomes our rival for the same object, mimesis leads to crisis, in which the continued existence of the community can be at stake.',
    cite: 'Adam Katz, Anthropomorphics — “Origin and Hypothesis”',
    slug: 'anthropomorphics-origin-and-hypothesis',
  },
  {
    id: 'language',
    quote:
      'The limit of Girard’s account is that there is no reason for the event in question to become meaningful and memorable… nothing in Girard’s scenario accounts for how the scene would create such an order. This is another way of saying that Girard doesn’t account for the emergence of language, which would itself be a prerequisite of a moral order and a community to share it.',
    cite: 'Adam Katz, Anthropomorphics — “Origin and Hypothesis”',
    slug: 'anthropomorphics-origin-and-hypothesis',
  },
  {
    id: 'scale',
    quote:
      'Girardian mimetic theory likes to feel it’s playing on the biggest scenes, with angels and devils and apocalyptic crises of nations, while Gansian mimetic theory is content to admit we’re just hooked to our screens… technology joins us in the practice of imitation and always had even well before the emergence of the linguistic imitation programmed into Large Language Models.',
    cite: 'Adam Katz, “Exhaustive Imitation”',
    slug: 'exhaustive-imitation',
  },
  {
    id: 'can-do',
    quote:
      '…a transdisciplinary approach not bound to the limited and arbitrary lenses of sociology, economics, psychology, and so on; the capacity to scale up and down as needed, that is, to analyze geo-political fractures as effectively as and consistently with individual desires.',
    cite: 'Adam Katz, “The Prospects of the Hypothesis”',
    slug: 'the-prospects-of-the-hypothesis',
  },
  {
    id: 'katz',
    quote:
      'I’ve suggested before that center study (I won’t complain if anyone wants to continue calling what I’m doing “GA”) might best be seen as a kind of programming idiom to be made interoperable with other idioms.',
    cite: 'Adam Katz, “Infra-Humaning”',
    slug: 'infra-humaning',
  },
];

// Topic doors into representative corpus texts.
const APPLICATIONS: { label: string; slug: string; cite: string }[] = [
  {
    label: 'Currency & capital',
    slug: 'there-is-no-economy-pdf',
    cite: 'There Is No Economy but Only the Debt to the Center',
  },
  {
    label: 'Technology & LLMs',
    slug: 'exhaustive-imitation',
    cite: 'Exhaustive Imitation',
  },
  {
    label: 'Politics & institutions',
    slug: 'the-prospects-of-the-hypothesis',
    cite: 'The Prospects of the Hypothesis',
  },
];

export default function LineagePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-gray-900 dark:text-white">
        The Lineage: Girard → Gans → Katz
      </h1>

      {BEATS.map((beat) => (
        <section key={beat.id} id={beat.id} className="mb-14 scroll-mt-20">
          <blockquote className="border-l-2 border-blue-300 dark:border-blue-700 pl-4 sm:pl-5">
            <p
              className="text-[17px] text-gray-700 dark:text-gray-300 leading-relaxed"
              style={{ fontFamily: 'var(--prose-font-family)' }}
            >
              {beat.quote}
            </p>
            <Link
              href={`/post/${beat.slug}`}
              className="mt-3 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              — {beat.cite} →
            </Link>
          </blockquote>
        </section>
      ))}

      {/* Applications */}
      <section id="applications" className="mb-14 scroll-mt-20">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">Applications</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {APPLICATIONS.map((a) => (
            <Link
              key={a.label}
              href={`/post/${a.slug}`}
              className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{a.label}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 italic">{a.cite}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
