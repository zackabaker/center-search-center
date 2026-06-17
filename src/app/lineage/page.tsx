import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Lineage: Girard → Gans → Katz | Center Study Center',
  description:
    'How Center Study descends from Generative Anthropology — Girard as grandfather, Gans as founder, Katz as developer — told in passages drawn directly from the corpus.',
};

// Each beat frames a verbatim passage from the corpus. The prose around the
// quote is connective tissue; the indented passage is exact source text, linked
// to the post it comes from. Quotes reproduce the corpus punctuation faithfully;
// ellipses (…) mark elided text.

interface Beat {
  id: string;
  kicker: string;
  heading: string;
  narration: string[];
  quote: string;
  cite: string;
  slug: string;
}

const BEATS: Beat[] = [
  {
    id: 'what-it-is',
    kicker: 'The claim',
    heading: 'A science of the human',
    narration: [
      'Center Study is the most fully elaborated branch of Generative Anthropology (GA), the discourse founded by Eric Gans. Before tracing the lineage, it helps to hear how GA understands itself — not as one more theory of culture, but as something more ambitious. Peter Goldman put the claim at its starkest in his standing introduction to the field:',
    ],
    quote:
      'There have been many attempts to set the humanities on a scientific basis: phenomenology, structuralism, sociobiology, various functionalist accounts. Yet, in my estimation, there has been only one successful attempt, and that is Generative Anthropology (GA), the first real science of the human.',
    cite: 'Peter Goldman, “Why Generative Anthropology” (Introduction to GA, 2013)',
    slug: 'pdf-why-generative-anthropology',
  },
  {
    id: 'girard',
    kicker: 'The grandfather',
    heading: 'Girard: mimesis and the crisis',
    narration: [
      'The grandfather of this tradition is René Girard. His insight is that human desire is mimetic — we want what others want, and want it because they want it — so that the more closely we model ourselves on someone, the more surely we become their rival. Scaled up, mimetic rivalry threatens to dissolve the group entirely. Gans took this as his starting point, and Katz states the descent precisely:',
    ],
    quote:
      'The originary hypothesis, advanced by Eric Gans in his The Origin of Language in 1981, posits a singular event within which language, or the sign, originates. Gans’s starting point is Rene Girard’s understanding of the conflictual nature of mimesis: as humans are the most mimetic species, and mimesis generates rivalry because our model, the more we model ourselves on him, becomes our rival for the same object, mimesis leads to crisis, in which the continued existence of the community can be at stake.',
    cite: 'Adam Katz, Anthropomorphics — “Origin and Hypothesis”',
    slug: 'book-anthropomorphics-origin-and-hypothesis',
  },
  {
    id: 'language',
    kicker: 'The break',
    heading: 'Why Girard is not enough: the missing account of language',
    narration: [
      'Here is the decisive turn — the reason GA is a development of Girard and not merely a restatement of him. Girard can describe how violence erupts and how it is discharged onto a victim, but he never explains how that scene becomes meaningful, how it leaves behind a shared sign rather than just a corpse. Without an account of how the sign emerges, there is no account of language — and therefore no account of meaning, morality, or community at all. This is the gap Gans was founded to close:',
    ],
    quote:
      'The limit of Girard’s account is that there is no reason for the event in question to become meaningful and memorable… nothing in Girard’s scenario accounts for how the scene would create such an order. This is another way of saying that Girard doesn’t account for the emergence of language, which would itself be a prerequisite of a moral order and a community to share it.',
    cite: 'Adam Katz, Anthropomorphics — “Origin and Hypothesis”',
    slug: 'book-anthropomorphics-origin-and-hypothesis',
  },
  {
    id: 'scale',
    kicker: 'The scale problem',
    heading: 'Girardians on the grand stage; GA on the ordinary scene',
    narration: [
      'The lack of an account of language has a downstream cost: it limits the scale at which the theory can think. Girardian analysis tends to reach for the largest, most dramatic frame — sacrificial crises, apocalypse, the fate of nations — because mimetic violence is what it is built to detect. But it has no equally precise way to read the small, ordinary, technologically mediated scenes where most of life actually happens. Katz makes the contrast playfully, and notice where it lands — on the imitation that runs through our screens and, finally, our machines:',
    ],
    quote:
      'Girardian mimetic theory likes to feel it’s playing on the biggest scenes, with angels and devils and apocalyptic crises of nations, while Gansian mimetic theory is content to admit we’re just hooked to our screens… technology joins us in the practice of imitation and always had even well before the emergence of the linguistic imitation programmed into Large Language Models.',
    cite: 'Adam Katz, “Exhaustive Imitation”',
    slug: 'substack-exhaustive-imitation',
  },
  {
    id: 'can-do',
    kicker: 'The payoff',
    heading: 'What an account of language buys you: scale',
    narration: [
      'Once the sign is on the table, the theory gains a property the Girardian frame lacks — it can move freely between the largest and the smallest scenes, because the same originary structure (a group, a center, the deferral of conflict through representation) is present at every level. Katz names this directly as the thing the hypothesis must be able to do:',
    ],
    quote:
      '…a transdisciplinary approach not bound to the limited and arbitrary lenses of sociology, economics, psychology, and so on; the capacity to scale up and down as needed, that is, to analyze geo-political fractures as effectively as and consistently with individual desires.',
    cite: 'Adam Katz, “The Prospects of the Hypothesis”',
    slug: 'substack-the-prospects-of-the-hypothesis',
  },
];

// The applications beat: one originary logic, read at every scale. Each card
// points to a representative corpus text.
const APPLICATIONS: { label: string; gloss: string; slug: string; cite: string }[] = [
  {
    label: 'Currency & capital',
    gloss: 'Money read not as a neutral medium but as a credit drawn on the sacred — a continuation of the debt to the center, not an escape from it.',
    slug: 'pdf-there-is-no-economy',
    cite: 'There Is No Economy but Only the Debt to the Center',
  },
  {
    label: 'Technology & LLMs',
    gloss: 'The machine as the latest medium of imitation — language models as linguistic imitation made programmable, continuous with the originary scene rather than a break from it.',
    slug: 'substack-exhaustive-imitation',
    cite: 'Exhaustive Imitation',
  },
  {
    label: 'Politics & institutions',
    gloss: 'Every social form read as a mode of deferral — the diagnostic question always: who actually holds the center here, and on what terms?',
    slug: 'substack-the-prospects-of-the-hypothesis',
    cite: 'The Prospects of the Hypothesis',
  },
];

export default function LineagePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">In their own words</p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        The Lineage: Girard → Gans → Katz
      </h1>

      <div className="mb-10 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
        <p
          className="text-base text-gray-500 dark:text-gray-400 italic leading-relaxed"
          style={{ fontFamily: 'var(--prose-font-family)' }}
        >
          A short introduction to Center Study told, as far as possible, in passages drawn directly from
          the corpus. Girard is the grandfather; Gans the founder; Katz the one who carries the hypothesis
          into money, institutions, politics, and the machine. Each indented passage is exact source text —
          follow the citation to read it in place.
        </p>
      </div>

      {/* Lineage strip */}
      <div className="mb-12 grid grid-cols-3 gap-2 text-center">
        {[
          ['Girard', 'mimetic desire & rivalry', 'grandfather'],
          ['Gans', 'the originary sign', 'founder'],
          ['Katz', 'the center, at every scale', 'developer'],
        ].map(([name, desc, role], i) => (
          <div key={name} className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
            {i < 2 && (
              <div className="absolute top-1/2 -right-2 z-10 text-gray-300 dark:text-gray-600 hidden sm:block">→</div>
            )}
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">{role}</p>
            <p className="font-semibold text-gray-900 dark:text-white leading-tight">{name}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {BEATS.map((beat) => (
        <section key={beat.id} id={beat.id} className="mb-14 scroll-mt-20">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">{beat.kicker}</p>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {beat.heading}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-gray-800 dark:text-gray-200 mb-5">
            {beat.narration.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
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
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">One logic, every scale</p>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Where it gets applied
        </h2>
        <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
          Because the account runs all the way down to the originary sign, the same analysis reads scenes
          that look entirely unrelated. The center is never absent; what changes is who holds it and on what
          terms. A few of the places the corpus takes it:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {APPLICATIONS.map((a) => (
            <Link
              key={a.label}
              href={`/post/${a.slug}`}
              className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{a.label}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{a.gloss}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 italic">{a.cite}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue */}
      <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/intro" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Introduction to Center Study</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">The originary scene and the center through history, step by step</p>
          </Link>
          <Link href="/ask" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Ask AI</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Put any question to the full corpus and get a grounded answer</p>
          </Link>
        </div>
      </section>

    </main>
  );
}
