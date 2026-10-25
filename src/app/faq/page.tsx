import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Objections',
  description:
    'Common questions about Center Study and Generative Anthropology, answered in verbatim passages from the texts, with links to each source.',
};

// Every quote is verbatim from the corpus and links to its source post.
// Entries are question + verbatim quotes + source links only.
type Cite = { text: string; slug: string; title: string };
type Item = { q: string; quotes: Cite[]; cta?: { href: string; label: string } };

// ── 1. The ideas & the lineage ──────────────────────────────────────────────
const IDEAS: Item[] = [
  {
    q: 'What is “the center” — and why is it called Center Study?',
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

// ── 2. Objections & responses ───────────────────────────────────────────────
const OBJECTIONS: Item[] = [
  {
    q: 'Is this reactionary politics?',
    quotes: [
      {
        text: 'A center establishes a hierarchy—at the very least between center and margin. But every other hierarchy is modeled on the hierarchy between center and margin—hierarchies are only possible if there is a center.',
        slug: 'anthropomorphics-the-use-of-a-center',
        title: 'The Use of a Center',
      },
      {
        text: 'Imagining a restoration of the social order is always an attempt to forget the event of founding.',
        slug: 'social-knowledge',
        title: 'Social Knowledge',
      },
    ],
    cta: { href: '/search?q=sovereignty', label: 'Search “sovereignty”' },
  },
  {
    q: 'Isn’t the originary hypothesis unfalsifiable — so, not really science?',
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
        {item.quotes.map((c) => <Citation key={c.text} c={c} />)}
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
  // FAQPage schema from every Q&A — answer text is the verbatim quotes only,
  // each attributed to its source title. No AI prose.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://center.study/faq#faq',
    mainEntity: [...IDEAS, ...OBJECTIONS].map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: it.quotes.map((c) => `“${c.text}” — ${c.title}`).join(' '),
      },
    })),
  };
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }} />
      <Link href="/lineage" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
        ← Introduction
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-4 mb-4 text-gray-900 dark:text-white">
        Questions &amp; Objections
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-12 max-w-2xl">
        Common questions, answered in passages from the texts. Every quotation is verbatim and links
        to its source.
      </p>

      <Section label="The ideas &amp; the lineage" items={IDEAS} />
      <Section label="Objections &amp; responses" items={OBJECTIONS} />

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Still have a question? Put it to the whole corpus.
        </p>
        <Link href="/search" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:opacity-90 transition-opacity">
          Search the archive
        </Link>
      </div>
    </main>
  );
}
