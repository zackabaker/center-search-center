import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Objections | Center Study Center',
  description:
    'Common questions about Center Study and Generative Anthropology — what the center is, how it differs from Girard and from GA, how human language differs from animal communication, and the standard objections — answered in the discourse’s own words, with verbatim citations.',
};

// Every quote is verbatim from the corpus and links to its source post.
// Answers lead with a brief frame, then let the texts speak at length.
type Cite = { text: string; slug: string; title: string };
type Item = { q: string; lead: string; quotes?: Cite[]; cta?: { href: string; label: string } };

// ── 1. The basics ───────────────────────────────────────────────────────────
const BASICS: Item[] = [
  {
    q: 'What is Center Study, in one sentence?',
    lead:
      'A way of reading every social order — language, ritual, kingship, law, money, media, the algorithm — as an attempt to hold, occupy, or deny a center. It is the most developed branch of Eric Gans’s Generative Anthropology.',
    cta: { href: '/intro', label: 'The full introduction' },
  },
  {
    q: 'Who writes it? Who are Adam Katz and Dennis Bouvard?',
    lead:
      'Both names are one person. Adam Katz develops the theory on GABlog; “Dennis Bouvard” is the pen name under which he applies it to contemporary life — AI, money, governance, media — on Substack. The book Anthropomorphics is the systematic statement.',
    cta: { href: '/lineage', label: 'Girard → Gans → Katz, in their own words' },
  },
  {
    q: 'Where should I start?',
    lead:
      'You don’t need to read Eric Gans first. If you’re new, take the short guided path — it orients you, gives the lineage, and hands you the handful of essays to read first — or put a question to the whole corpus with Ask AI and follow the citations. For a single first text, “The Discourse of the Center” is the clearest entry into the core claim.',
    cta: { href: '/start', label: 'Start here' },
  },
  {
    q: 'Is it academic or peer-reviewed?',
    lead:
      'Generative Anthropology has a peer-reviewed journal (Anthropoetics) and annual conferences. Center Study itself — Katz’s and Bouvard’s writing — is independent intellectual work published as a blog, a Substack, and the Anthropomorphics book; it is in continuous dialogue with the GA literature rather than routed through peer review.',
    cta: { href: '/browse', label: 'Browse the full archive' },
  },
];

// ── 2. The ideas & the lineage ──────────────────────────────────────────────
const IDEAS: Item[] = [
  {
    q: 'What is “the center” — and why is it called Center Study?',
    lead:
      'Everything turns on this. The center is the shared focus of attention every social scene is organized around — first the desired object on the originary scene, then the sacred, the king, the institution, the algorithm. It is both cause and product of the sign, and we are never without one.',
    quotes: [
      {
        text: 'What is a center? Whatever can invoke and be referenced by an ostensive sign: the center is both cause and product of the sign—as cause it subsists beyond any particular reference, and as product it is continually renewed.',
        slug: 'anthropomorphics-the-centrality-of-the-center',
        title: 'The Centrality of the Center',
      },
      {
        text: 'We are beings bound to the center: everything that we say, think or do is homage to the center.',
        slug: 'the-discourse-of-the-center',
        title: 'The Discourse of the Center',
      },
    ],
  },
  {
    q: 'How is human language different from animal communication?',
    lead:
      'This is the load-bearing distinction. Animal signals are fixed responses to what is present; human language is made of arbitrary, conventional signs that refer — and can refer to what is absent. Because you would already need language to agree on such signs, the difference can’t have crept in gradually — which is the puzzle the originary hypothesis sets out to answer.',
    quotes: [
      {
        text: '…the fundamental difference between human language and animal communication. Only human language has signs (words, to keep it simple) that are purely “arbitrary,” or “conventional.” There’s no reason for the word “dog” to refer to that particular four-legged furry mammal and, of course, in other languages it doesn’t. So, somehow, some human community must have “agreed” to use words in shared ways. But to form such an agreement, you would already need to have language. This is a dilemma, and there’s no “natural” way of explaining how it would happen.',
        slug: 'couple-of-basic-questions-about-generative-anthropology',
        title: 'Bouvard on Arbitrary Signs and Human Language',
      },
      {
        text: '…its different mode of operation, through symbols as opposed to “indexical” signals.',
        slug: 'addressing-an-objection-to-the-originary-hypthesis',
        title: 'Addressing an Objection to the Originary Hypothesis',
      },
    ],
  },
  {
    q: 'How is this different from René Girard — and why does the difference matter?',
    lead:
      'It begins where Girard does — mimetic rivalry escalating toward a group-destroying crisis — but breaks with him twice. First on the founding act: a sign, not a killing, which is the same as saying it, and not Girard, explains the birth of language. Second on scapegoating: for Girard it lies at the origin of the human; for Gans and Katz it arrives much later, an institution of already-centralized societies.',
    quotes: [
      {
        text: 'The limit of Girard’s account is that there is no reason for the event in question to become meaningful and memorable. Why should the killing of a conspecific, not a very unusual event among mammals, transform the group in any way? I used the word “murder” in my description of the scene, but “murder” presupposes a moral order, and nothing in Girard’s scenario accounts for how the scene would create such an order.',
        slug: 'anthropomorphics-origin-and-hypothesis',
        title: 'Origin and Hypothesis',
      },
      {
        text: 'For Gans, indeed, scapegoating and human sacrifice is introduced much later, in the wake of the organization of communities around the so-called “Big Man,” who centralizes the distribution of resources. Once the origin of goods is centralized, in other words, so can be the origin of contagion.',
        slug: 'originary-grammar-and-post-sacrificial-semiotic-agency',
        title: 'Originary Grammar and Post-Sacrificial Semiotic Agency',
      },
    ],
  },
  {
    q: 'How is Center Study different from Generative Anthropology?',
    lead:
      'Center Study accepts Gans’s hypothesis whole, but keeps the center at the center. Standard GA can emphasize the originary scene and the equality of the participants ringed around the center; Center Study (Katz’s “centerism”) makes the center itself — its defense, its maintenance, its operation across all of history, from the daily reference to kingship to money to code — the primary thing. The center isn’t only where things began; it’s what holds every arrangement together.',
    quotes: [
      {
        text: 'Liberal GA works with the circle model, and can therefore emphasize the equidistance from the center over the center itself—implicitly, at least the equidistance, which is to say the “equality” of all the members is what produces the center, and it is that equality that is therefore to be preserved above all. Absolutist GA, or centerism, sees the defense of the center by those who best see the threats to it as primary, since that defense is what holds together the positions arrayed around the center.',
        slug: 'centerism-gablog',
        title: 'Centerism',
      },
      {
        text: 'If there is a logic to history it is a very uneven one: we are all working to bring all of the centers, from the mundane references we make daily, to the authorities we obey and commands we convey to others, to the divine beings we worship, to the originary event itself, into alignment.',
        slug: 'the-discourse-of-the-center',
        title: 'The Discourse of the Center',
      },
    ],
  },
];

// ── 3. Objections & responses ───────────────────────────────────────────────
const OBJECTIONS: Item[] = [
  {
    q: 'Isn’t the originary hypothesis unfalsifiable — so, not really science?',
    lead:
      'It doesn’t claim to be a falsifiable empirical science — there could be no fossil of a “first word” — and asks to be judged by a different standard: minimality. You don’t refute it with evidence; you displace it with a more minimal account that explains the same things.',
    quotes: [
      {
        text: '…once we have agreed we need a hypothesis, the rules of the game are that to challenge the originary hypothesis you should have a better, which is to say, more minimal, one. What makes it a good hypothesis? One, it accounts for the fact that everyone on the scene would have to be looking at the same thing — the best explanation for this is that they all desire it.',
        slug: 'couple-of-basic-questions-about-generative-anthropology',
        title: 'Bouvard on Arbitrary Signs and Human Language',
      },
      {
        text: 'The more it explains with a minimum of presuppositions, the more powerful a claim it makes on our intuition.',
        slug: 'clr-36',
        title: 'Is GA Falsifiable?',
      },
    ],
  },
  {
    q: 'Isn’t it just a “just-so story” about a past nobody can observe?',
    lead:
      'The scene can’t be excavated — granted. But you cannot avoid having an origin story; GA only insists on making its own explicit, and on testing it against the whole record of what sign-users do.',
    quotes: [
      {
        text: 'You will have anthropological and linguistic assumptions one way or another. You can come by them haphazardly or reflectively. Haphazardly means just trying out whatever seems convincing to whomever you want to convince right now. Reflectively means you want to understand why you have the categories you have.',
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
      'A methodological assumption, not a dogma. A shared sign that everyone issues and understands at once can’t accrete gradually — it takes an event — but plural origins aren’t excluded, and the load-bearing claim survives either way.',
    quotes: [
      {
        text: 'We draw from this the conclusion that language must have emerged in a singular event, in which a sign was used and repeated (i.e., “understood”) by everyone in a memorable way. Clearly, we can’t know there was such a scene — we don’t expect to find some archeological or fossil evidence for it. So, we can only hypothesize.',
        slug: 'couple-of-basic-questions-about-generative-anthropology',
        title: 'Bouvard on Arbitrary Signs and Human Language',
      },
      {
        text: 'Even if human language began in ten places at once, even if its originary function was not the deferral of violence, the core of the hypothesis would remain: we could not have begun to use language unawares',
        slug: 'clr-36',
        title: 'Is GA Falsifiable?',
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
        text: '…the marker is not being able to make an operationalizable request to a responsible institution or authority. If you can’t do that, you’re just addicted to the complaint. If that’s the marker, then, we can point to that dysfunctional relation to the center without having to argue about whether the person is “really” resentful.',
        slug: 'hypothesis-practice-vs-narrative-the-iterative-center-reddit',
        title: 'Bouvard on Resentment’s Conceptual Instability in GA',
      },
      {
        text: '…that’s like the night in which all cows are black; the definition gives up what makes the word meaningful and useful.',
        slug: 'what-is-originary',
        title: 'What is originary?',
      },
    ],
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

function Accordion({ item }: { item: Item }) {
  return (
    <details className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3.5 [&_summary]:list-none">
      <summary className="flex items-start justify-between gap-3 cursor-pointer font-semibold text-gray-900 dark:text-white leading-snug">
        <span>{item.q}</span>
        <span className="text-gray-300 dark:text-gray-600 group-open:rotate-45 transition-transform text-xl leading-none flex-shrink-0 mt-0.5">+</span>
      </summary>
      <div className="mt-3 space-y-4">
        <p
          className="text-gray-700 dark:text-gray-300"
          style={{ fontFamily: 'var(--prose-font-family)', fontSize: '16px', lineHeight: 1.7 }}
        >
          {item.lead}
        </p>
        {item.quotes?.map((c) => <Citation key={c.text} c={c} />)}
        {item.cta && (
          <Link href={item.cta.href} className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline">
            {item.cta.label} &rarr;
          </Link>
        )}
      </div>
    </details>
  );
}

function Section({ label, items }: { label: string; items: Item[] }) {
  return (
    <section className="mb-14">
      <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5">{label}</h2>
      <div className="space-y-3">
        {items.map((it) => <Accordion key={it.q} item={it} />)}
      </div>
    </section>
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
        What a careful first-time reader tends to ask — the orientation, the ideas and where they
        come from, and the standard objections. Most answers are anchored to the discourse&rsquo;s own
        words: the framing is brief, and the texts do the rest. Every quotation is verbatim and links
        to the passage in full.
      </p>

      <Section label="The basics" items={BASICS} />
      <Section label="The ideas &amp; the lineage" items={IDEAS} />
      <Section label="Objections &amp; responses" items={OBJECTIONS} />

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
