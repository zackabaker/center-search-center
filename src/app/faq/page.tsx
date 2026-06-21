import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Objections | Center Study Center',
  description:
    'Common questions about Center Study and Generative Anthropology — and the standard objections (Is it falsifiable? Just a just-so story? Eurocentric?) answered in the discourse’s own words, with citations.',
};

// Each objection's answer is grounded in the corpus; the quote is verbatim and
// links to the source post. (See the slugs in `quote.slug`.)
type Cite = { text: string; slug: string; title: string };
type QA = { q: string; a: string[]; quote?: Cite; also?: Cite };

const OBJECTIONS: QA[] = [
  {
    q: 'Isn’t the originary hypothesis unfalsifiable — so, not really science?',
    a: [
      'Generative Anthropology doesn’t claim to be a Popper-falsifiable empirical science, and it argues that falsifiability is the wrong test for its domain. There can be no fossil or recording of a “first word,” and it never pretends otherwise.',
      'Instead it asks to be judged by minimality: how much it explains from the fewest assumptions. You don’t refute it with a physical trace — you displace it with a more minimal hypothesis that accounts for the same thing. The sharper question it turns back on its critics is why the human sciences managed for so long to avoid formulating an origin hypothesis at all.',
    ],
    quote: {
      text: 'The more it explains with a minimum of presuppositions, the more powerful a claim it makes on our intuition.',
      slug: 'clr-36',
      title: 'Is GA Falsifiable?',
    },
    also: {
      text: 'to challenge the originary hypothesis you should have a better, which is to say, more minimal, one.',
      slug: 'couple-of-basic-questions-about-generative-anthropology',
      title: 'Bouvard on Arbitrary Signs and Human Language',
    },
  },
  {
    q: 'Isn’t it just a “just-so story” about a past nobody can observe?',
    a: [
      'The charge is taken head-on, and the premise is granted: the scene can’t be excavated. But the move from no-language to language can’t be crossed gradually, nor narrated from inside language — so some hypothesis of origin is unavoidable.',
      'Its evidence is not a relic but the whole of human culture: the test is whether the model accounts for what sign-using humans actually do, better than the alternatives. And every anthropology already smuggles in an implicit origin story; GA’s distinction is making its own explicit and minimal rather than pretending to have none.',
    ],
    quote: {
      text: 'whether this model then accounts better than other ways of thinking for what we do daily and what humans have done',
      slug: 'couple-of-basic-questions-about-generative-anthropology',
      title: 'Bouvard on Arbitrary Signs and Human Language',
    },
  },
  {
    q: 'Why assume language began once, in a single scene?',
    a: [
      'The single origin is a methodological assumption, not a dogma. A singular tipping of non-meaning into meaning would be so improbable as to be near-miraculous, which is the main reason for assuming one event — but the discourse explicitly allows that it could have happened in several places, and says the core of the hypothesis survives either way.',
      'The load-bearing claim isn’t the date or the count; it’s the kind of thing a sign is. A shared sign that everyone issues and understands at once can’t accrete gradually, adaptation by adaptation — it requires an event in which each participant sees that the others see the same new thing.',
    ],
    quote: {
      text: 'human language began in ten places at once … the core of the hypothesis would remain',
      slug: 'clr-36',
      title: 'Is GA Falsifiable?',
    },
  },
  {
    q: 'Isn’t a single universal origin Eurocentric — a Western framework imposed on everyone?',
    a: [
      'GA restricts “the originary” strictly to what is universal to every culture — the cultural universals — and treats anything culture-specific (tragedy, the novel, the modern state) as explicitly not originary. That criterion is a guard against smuggling parochial content into the foundation.',
      'It also reads as a critique of the Western metaphysical tradition rather than its extension: it argues that meaning is performative and shared “between” people, against the picture of language as a window on the world inside an individual mind. (Note: the corpus engages the universality question directly; it doesn’t take up a charge phrased as “Eurocentrism” in those words.)',
    ],
    quote: {
      text: 'What is not universal to all cultures everywhere cannot be originary.',
      slug: 'what-is-originary',
      title: 'What is originary?',
    },
  },
  {
    q: 'How is this different from René Girard — and why does the difference matter?',
    a: [
      'It begins where Girard does: imitation breeds rivalry over a shared object, which escalates toward a crisis that threatens the group. But it rejects Girard’s resolution — the killing of a scapegoat. A killing is common among animals and gives no reason for the event to become meaningful or memorable; and calling it “murder” already assumes the moral order Girard is trying to explain.',
      'GA replaces the murder with the gesture of aborted appropriation: the reach to seize the central object converts into a sign that renounces it, deferring violence through representation. That single revision makes the origin of language, the sacred, and community one event — rather than leaving language unexplained behind a corpse.',
    ],
    quote: {
      text: 'no reason for the event in question to become meaningful and memorable',
      slug: 'anthropomorphics-origin-and-hypothesis',
      title: 'Origin and Hypothesis (Anthropomorphics)',
    },
  },
  {
    q: 'Do you have to be religious to accept this? Is it theology in disguise?',
    a: [
      'No. GA is built to be ontology-neutral — a deliberately minimal object of belief meant to be a shared meeting ground for believers and unbelievers alike. It brackets the question of whether God exists, the way an anthropologist of religion can take believers’ experience seriously without ruling on its truth.',
      'It does hold that shared meaning is irreducibly transcendental — not explicable in purely materialist terms — and it reads the first sign as a name for the center. So it neither requires theism nor reduces to debunking it; Gans even suggests only someone seeking a non-religious account of the human would have had the motive to devise it.',
    ],
    quote: {
      text: 'in principle an optimal meeting place for believers and unbelievers',
      slug: 'clr-358',
      title: 'Believing in GA',
    },
    also: {
      text: 'humanistic rather than a scientific theory',
      slug: 'clr-403',
      title: 'Heuristic Necessity',
    },
  },
  {
    q: 'Isn’t reading “the center” into everything circular — unfalsifiable in practice?',
    a: [
      'The discourse is alert to this trap. It warns that if everything counts as originary the concept becomes “the night in which all cows are black,” losing exactly what made it useful — hence the strict criterion that only the cultural universals qualify.',
      'More tellingly, it turns the same skepticism inward: Katz argues that even GA’s own core terms (resentment, love, desire) are conceptually unstable and should be replaced by identifiable signs and operationalizable markers, so a claim can be demonstrated in a particular case rather than asserted by fiat.',
    ],
    quote: {
      text: 'the marker is not being able to make an operationalizable request to a responsible institution',
      slug: 'hypothesis-practice-vs-narrative-the-iterative-center-reddit',
      title: 'Bouvard on Resentment’s Conceptual Instability in GA',
    },
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
      className="mt-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4 text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed"
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
        the originary hypothesis. The answers are how the discourse itself responds; each is anchored
        to a passage in the corpus you can read in full.
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
                <span className="text-gray-300 dark:text-gray-600 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0 mt-0.5">+</span>
              </summary>
              <div
                className="mt-3 space-y-3 text-gray-700 dark:text-gray-300"
                style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
              >
                {o.a.map((p, i) => <p key={i}>{p}</p>)}
                {o.quote && <Citation c={o.quote} />}
                {o.also && <Citation c={o.also} />}
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
                <span className="text-gray-300 dark:text-gray-600 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0 mt-0.5">+</span>
              </summary>
              <div
                className="mt-3 space-y-3 text-gray-700 dark:text-gray-300"
                style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.75 }}
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
