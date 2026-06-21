import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Objections | Center Study Center',
  description:
    'Common questions about Center Study and Generative Anthropology — and the standard objections (Is it falsifiable? Just a just-so story? Eurocentric?) answered in the discourse’s own words, with verbatim citations.',
};

// Every quote below is verbatim from the corpus and links to its source post.
// Answers lead with a one-line frame, then let the texts speak.
type Cite = { text: string; slug: string; title: string };
type Obj = { q: string; lead: string; quotes: Cite[] };

const OBJECTIONS: Obj[] = [
  {
    q: 'Isn’t the originary hypothesis unfalsifiable — so, not really science?',
    lead:
      'It doesn’t claim to be a falsifiable empirical science — there could be no fossil of a “first word” — and asks to be judged by a different standard: minimality. You don’t refute it with evidence; you displace it with a more minimal account.',
    quotes: [
      {
        text: 'The more it explains with a minimum of presuppositions, the more powerful a claim it makes on our intuition.',
        slug: 'clr-36',
        title: 'Is GA Falsifiable?',
      },
      {
        text: '…once we have agreed we need a hypothesis, the rules of the game are that to challenge the originary hypothesis you should have a better, which is to say, more minimal, one.',
        slug: 'couple-of-basic-questions-about-generative-anthropology',
        title: 'Bouvard on Arbitrary Signs and Human Language',
      },
    ],
  },
  {
    q: 'Isn’t it just a “just-so story” about a past nobody can observe?',
    lead:
      'The scene can’t be excavated — granted. But you cannot avoid having an origin story; GA only insists on making its own explicit, and on testing it against the whole record of what sign-users do.',
    quotes: [
      {
        text: 'You will have anthropological and linguistic assumptions one way or another. You can come by them haphazardly or reflectively.',
        slug: 'honest-question-what-is-your-deal-with-ga-and-the-focus-on-linguistics',
        title: 'Bouvard on Linguistic Categories and Anthropological Foundations',
      },
      {
        text: 'The “proof” of the hypothesis is whether this model then accounts better than other ways of thinking for what we do daily and what humans have done throughout history as sign-users.',
        slug: 'couple-of-basic-questions-about-generative-anthropology',
        title: 'Bouvard on Arbitrary Signs and Human Language',
      },
    ],
  },
  {
    q: 'Why assume language began once, in a single scene?',
    lead:
      'A methodological assumption, not a dogma: a single tipping of non-meaning into meaning is so improbable as to be near-miraculous, but plural origins aren’t excluded — and the load-bearing claim survives either way.',
    quotes: [
      {
        text: 'Even if human language began in ten places at once, even if its originary function was not the deferral of violence, the core of the hypothesis would remain: we could not have begun to use language unawares.',
        slug: 'clr-36',
        title: 'Is GA Falsifiable?',
      },
    ],
  },
  {
    q: 'Isn’t a single universal origin Eurocentric — a Western frame imposed on everyone?',
    lead:
      'GA confines “the originary” to what every culture shares, and treats culture-specific content as explicitly not originary — a guard against building a parochial foundation. (The corpus engages the universality question directly; it doesn’t take up a charge phrased as “Eurocentrism.”)',
    quotes: [
      {
        text: 'What is not universal to all cultures everywhere cannot be originary.',
        slug: 'what-is-originary',
        title: 'What is originary?',
      },
    ],
  },
  {
    q: 'How is this different from René Girard — and why does the difference matter?',
    lead:
      'It begins where Girard does — mimetic rivalry escalating toward a group-destroying crisis — but rejects his resolution. The founding act is a sign, not a killing; that is the same as saying it, and not Girard, explains the birth of language.',
    quotes: [
      {
        text: 'The limit of Girard’s account is that there is no reason for the event in question to become meaningful and memorable. Why should the killing of a conspecific, not a very unusual event among mammals, transform the group in any way?',
        slug: 'anthropomorphics-origin-and-hypothesis',
        title: 'Origin and Hypothesis',
      },
      {
        text: 'The rivalrous imitation that first propels the group toward center and potentially cataclysmic violence is converted into a pacifying imitation that de-escalates the crisis.',
        slug: 'anthropomorphics-origin-and-hypothesis',
        title: 'Origin and Hypothesis',
      },
    ],
  },
  {
    q: 'Do you have to be religious to accept this? Is it theology in disguise?',
    lead:
      'No. It’s built to be ontology-neutral — a model of the human, not a creed — and is meant to be common ground for believers and unbelievers alike.',
    quotes: [
      {
        text: 'Because its hypothesis is conceived as a minimal object of belief, GA is in principle an optimal meeting place for believers and unbelievers.',
        slug: 'clr-358',
        title: 'Believing in GA',
      },
      {
        text: 'GA was a humanistic rather than a scientific theory, a “new way of thinking” that was meant to provide a model of the human rather than a set of hypotheses to be tested by paleontology.',
        slug: 'clr-403',
        title: 'Heuristic Necessity',
      },
    ],
  },
  {
    q: 'Isn’t reading “the center” into everything circular — unfalsifiable in practice?',
    lead:
      'The discourse guards against exactly this — a concept that explains everything explains nothing — and answers by demanding observable markers rather than reading the center in by fiat.',
    quotes: [
      {
        text: '…that’s like the night in which all cows are black; the definition gives up what makes the word meaningful and useful.',
        slug: 'what-is-originary',
        title: 'What is originary?',
      },
      {
        text: '…the marker is not being able to make an operationalizable request to a responsible institution or authority. If you can’t do that, you’re just addicted to the complaint.',
        slug: 'hypothesis-practice-vs-narrative-the-iterative-center-reddit',
        title: 'Bouvard on Resentment’s Conceptual Instability in GA',
      },
    ],
  },
];

type Basic = { q: string; a: string[]; cta?: { href: string; label: string } };

const BASICS: Basic[] = [
  {
    q: 'What is Center Study, in one sentence?',
    a: [
      'A way of reading every social order — language, ritual, kingship, law, money, media, the algorithm — as an attempt to hold, occupy, or deny a center. It is the most developed branch of Eric Gans’s Generative Anthropology.',
    ],
    cta: { href: '/intro', label: 'The full introduction' },
  },
  {
    q: 'Who writes it? Who are Adam Katz and Dennis Bouvard?',
    a: [
      'Both names are one person. Adam Katz develops the theory on GABlog; “Dennis Bouvard” is the pen name under which he applies it to contemporary life — AI, money, governance, media — on Substack. The book Anthropomorphics is the systematic statement.',
    ],
    cta: { href: '/lineage', label: 'Girard → Gans → Katz, in their own words' },
  },
  {
    q: 'How is Center Study different from Generative Anthropology?',
    a: [
      'Generative Anthropology, founded by Eric Gans, is the parent discourse: the originary hypothesis about the birth of language, the human, and the sacred. Center Study takes that hypothesis and keeps the enduring center in view across all of human organization — not just its origin but its ongoing operation in every later form.',
    ],
    cta: { href: '/intro#lineage', label: 'The lineage' },
  },
  {
    q: 'Do I need to read Eric Gans first?',
    a: [
      'No. You can start anywhere it grabs you and read back into the foundations as needed. If you want a single first text, “The Discourse of the Center” is the clearest one-post entry into the core claim.',
    ],
    cta: { href: '/post/the-discourse-of-the-center', label: 'Read: The Discourse of the Center' },
  },
  {
    q: 'Where should I actually start?',
    a: [
      'Take the short guided path if you’re new — it orients you, gives the lineage, and hands you the handful of essays to read first. Or put a question to the whole corpus with Ask AI and follow the citations.',
    ],
    cta: { href: '/start', label: 'Start here' },
  },
  {
    q: 'Is this academic or peer-reviewed?',
    a: [
      'Generative Anthropology has a peer-reviewed journal (Anthropoetics) and annual conferences. Center Study itself — Katz’s and Bouvard’s writing — is independent intellectual work published as a blog, a Substack, and the Anthropomorphics book; it is in continuous dialogue with the GA literature rather than routed through peer review.',
    ],
    cta: { href: '/browse', label: 'Browse the full archive' },
  },
];

function Citation({ c }: { c: Cite }) {
  return (
    <blockquote
      className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 text-[15px] text-gray-600 dark:text-gray-300 italic leading-relaxed"
      style={{ fontFamily: 'var(--prose-font-family)' }}
    >
      &ldquo;{c.text}&rdquo;
      <Link
        href={`/post/${c.slug}`}
        className="not-italic block mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
      >
        — {c.title} &rarr;
      </Link>
    </blockquote>
  );
}

const summaryToggle = (
  <span className="text-gray-300 dark:text-gray-600 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0 mt-0.5">
    +
  </span>
);

export default function FaqPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <Link href="/intro" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        ← Introduction
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 mb-4 text-gray-900 dark:text-white">
        Questions &amp; Objections
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-12 max-w-2xl">
        The questions a careful first-time reader tends to ask — including the standard objections to
        the originary hypothesis. Each answer is anchored to the discourse&rsquo;s own words: the
        framing is brief, and the texts do the rest. Every quotation is verbatim and links to the
        passage in full.
      </p>

      {/* ── Objections ─────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">
          Objections &amp; responses
        </h2>
        <div className="space-y-3">
          {OBJECTIONS.map((o) => (
            <details
              key={o.q}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3.5 [&_summary]:list-none"
            >
              <summary className="flex items-start justify-between gap-3 cursor-pointer font-semibold text-gray-900 dark:text-white leading-snug">
                <span>{o.q}</span>
                {summaryToggle}
              </summary>
              <div className="mt-3 space-y-4">
                <p
                  className="text-gray-700 dark:text-gray-300"
                  style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.7 }}
                >
                  {o.lead}
                </p>
                {o.quotes.map((c) => <Citation key={c.text} c={c} />)}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Basics ─────────────────────────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">
          Basics
        </h2>
        <div className="space-y-3">
          {BASICS.map((b) => (
            <details
              key={b.q}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3.5 [&_summary]:list-none"
            >
              <summary className="flex items-start justify-between gap-3 cursor-pointer font-semibold text-gray-900 dark:text-white leading-snug">
                <span>{b.q}</span>
                {summaryToggle}
              </summary>
              <div
                className="mt-3 space-y-3 text-gray-700 dark:text-gray-300"
                style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.7 }}
              >
                {b.a.map((p, i) => <p key={i}>{p}</p>)}
                {b.cta && (
                  <Link href={b.cta.href} className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {b.cta.label} &rarr;
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Still have a question? Put it to the whole corpus.
        </p>
        <Link href="/ask" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity">
          Ask AI
        </Link>
      </div>
    </main>
  );
}
