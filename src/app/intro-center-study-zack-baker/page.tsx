import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TermLink from '@/components/TermLink';

// Dotted concept links — same style and hover-card behavior as term links
// inside posts and the /begin intro.
const TERM_CLASS =
  'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';

export const metadata: Metadata = {
  title: 'Introduction to Center Study',
  description:
    'The Avalon Institute Exposition talk, October 30, 2026 — what Center Study is, where it comes from, the paradox of the first word, the originary scene, and what is to be done. Slides and transcript.',
  authors: [{ name: 'Zack Baker', url: 'https://center.study/author/baker' }],
  alternates: { canonical: 'https://center.study/intro-center-study-zack-baker' },
  openGraph: {
    title: 'Introduction to Center Study',
    description:
      'The Avalon Exposition talk: the originary hypothesis, the lineage from Girard and Gans, and the companies it implies. Slides and transcript.',
    url: 'https://center.study/intro-center-study-zack-baker',
    siteName: 'Center Study Center',
    type: 'article',
  },
};

// The talk as delivered at the Avalon Institute Exposition — the lightly
// edited transcript of the recording (speech portion; the Q&A lives in the
// transcript doc). The text is the speaker's words in the speaker's order:
// do not re-compress, summarize, or re-stylize it. Fact corrections
// carried in: Gans was "among Girard's first PhD students" (not "his
// first"); and, by the owner on 2026-11-19, "inexhaustibility" of pedagogy,
// "nearly all" American companies, Charles I "tried by his own subjects",
// events "about twenty years apart". One sentence was added by the owner
// the same day: the Gans quotation after "something like love". On 2026-11-21 the owner had
// the opening of section IV rewritten (it replaces the bridge added on the
// 19th), the punchline in IV set bold, three
// sentences of section III reworded (the taboo, "The origin of language is
// a paradoxical question", "that zero-to-one moment"), slide 10 moved down
// to sit before "And what Tomasello has shown", a sentence added after
// section III's opening question ("His amendment was that he solved…"), and
// the end of section I's first paragraph and the start of its second were
// reworded by the owner (the originary hypothesis, "the foundation of
// Center Study", in place of generative anthropology). Long paragraphs may be split; the
// sentences stay as spoken. Slides render at their cue points in the delivered order (11
// before 10, 23 before 22, 25 before 24 follow the spoken sequence).

function Slide({ n, alt }: { n: number; alt: string }) {
  return (
    <figure className="my-8">
      <Image
        src={`/avalon/slide-${String(n).padStart(2, '0')}.webp`}
        alt={alt}
        width={1920}
        height={1080}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
        sizes="(max-width: 768px) 100vw, 768px"
        priority={n === 1}
      />
    </figure>
  );
}

// Tomasello's three levels of engagement as three small pictures: two
// figures, and (from the second level) the thing they attend to. The paragraph
// they sit in was hard to follow as one block (owner, 2026-11-19); the
// speaker's sentences are unchanged, only broken up around this.
function AttentionLevels() {
  const a = { cx: 22, cy: 58 };
  const b = { cx: 98, cy: 58 };
  const obj = { cx: 60, cy: 16 };
  const figure = (c: { cx: number; cy: number }) => <circle {...c} r={9} fill="currentColor" />;
  const arrow = (x1: number, y1: number, x2: number, y2: number, both = false) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={1.75} markerEnd="url(#al-head)" markerStart={both ? 'url(#al-tail)' : undefined} />
  );
  const levels = [
    { name: 'Dyadic', gloss: 'Two respond to each other.', object: false, toObject: false, between: true },
    { name: 'Triadic', gloss: 'Both look at the same thing: “joint perception.”', object: true, toObject: true, between: false },
    { name: 'Collaborative', gloss: 'Each knows the other is looking: joint attention.', object: true, toObject: true, between: true },
  ];
  return (
    <figure className="my-7">
      <svg width="0" height="0" className="absolute text-gray-500 dark:text-gray-400" aria-hidden>
        <defs>
          <marker id="al-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
          <marker id="al-tail" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M10,0 L0,5 L10,10 z" fill="currentColor" />
          </marker>
        </defs>
      </svg>
      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {levels.map((l) => (
          <div key={l.name} className="min-w-0 text-center">
            <svg viewBox="0 0 120 76" role="img" aria-label={`${l.name} engagement: ${l.gloss}`} className="mx-auto w-full max-w-[150px] text-gray-500 dark:text-gray-400">
              {l.object && <circle {...obj} r={7} fill="#d97706" />}
              {l.toObject && arrow(29, 49, 53, 24)}
              {l.toObject && arrow(91, 49, 67, 24)}
              {l.between && arrow(36, 58, 84, 58, true)}
              {figure(a)}
              {figure(b)}
            </svg>
            <p className="mt-1.5">
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{l.name}</span>
              <span className="block text-xs leading-snug text-gray-500 dark:text-gray-400">{l.gloss}</span>
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-5">
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-14 mb-5">
      {children}
    </h2>
  );
}


// A quoted passage linked to its verbatim source in the archive — always
// visibly underlined (dotted) with a small arrow so readers can see it's
// addressable. href lands on the post with the passage highlighted (?q=).
function Q({ slug, q, children }: { slug: string; q: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/post/${slug}?q=${encodeURIComponent(q)}`}
      className="underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 underline-offset-2 hover:decoration-solid hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors"
      title="Read this passage in its post"
    >
      {children}
      <sup className="ml-0.5 text-[11px] text-gray-400 dark:text-gray-500" aria-hidden>&#8599;</sup>
    </Link>
  );
}

// Article JSON-LD crediting the talk to Zack Baker's Person entity, so the
// page is machine-readably his (the author page carries the matching @id).
const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Introduction to Center Study',
  description:
    'Slides and transcript from the Introduction to Center Study talk at the Avalon Institute Exposition on October 30, 2026.',
  url: 'https://center.study/intro-center-study-zack-baker',
  datePublished: '2026-10-30',
  author: {
    '@type': 'Person',
    '@id': 'https://center.study/author/baker',
    name: 'Zack Baker',
    url: 'https://center.study/author/baker',
  },
};

export default function IntroPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Introduction to Center Study
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <Link href="/author/baker" className="hover:underline underline-offset-2" title="Zack Baker — author page">
            Zack Baker
          </Link>
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Slides and transcript from the Introduction to Center Study
          talk at the Avalon Institute Exposition on October 30, 2026.
        </p>
        <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
          Thank you to{' '}
          <a
            href="https://x.com/yitzzzzz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-1 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Isaac Friedman (Yitzz)
          </a>
          {' '}for recording the talk, and to the{' '}
          <a
            href="https://avalon.institute"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-1 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Avalon Institute
          </a>
          {' '}for hosting.
        </p>
      </header>

      <Slide n={1} alt="Title slide: An Introduction to Center Study" />

      <H2>I. What Is Center Study?</H2>
      <P>
        Thank you all so much for coming out to this introduction to Center
        Study. It&rsquo;s a full-circle moment for me, because I went to Cal
        about ten years ago, and some of the people who first opened my mind to
        these questions of political philosophy and anthropology are in the
        audience&mdash;Mr. Tivy and others who, in Berkeley at that time, were
        asking questions about the nature of this social order itself. And
        those questions led me ultimately to questions of anthropology: What is
        the nature, or origin, of the human being? During that time, I
        discovered a strange hypothesis called the{' '}
        <TermLink href="/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary hypothesis">originary hypothesis</TermLink>
        , which I became totally fixated on and haven&rsquo;t stopped
        thinking about and working with since.
      </P>
      <P>
        The originary hypothesis ultimately was the foundation of{' '}
        <TermLink href="/concepts/center-study" defKey="c:center-study" className={TERM_CLASS} title="Concept: Center Study">Center Study</TermLink>
        . And my goal today is to give you a quick overview of what
        Center Study is, where it comes from, and what you can do with it. What
        I want to convince you of is that it&rsquo;s one of the most powerful
        ways of thinking I&rsquo;ve discovered, and that for any of the
        projects, companies, or prospects you have, it will be an invaluable
        source of new ideas at a minimum.
      </P>
      <Slide n={3} alt="What is Center Study? — the quote on the disciplines" />
      <P>
        Let&rsquo;s begin with a quote: <Q slug="the-transdisciplinarity-of-the-hypothesis" q="could ever come from within the established disciplines">&ldquo;No way of thinking with any
        chance of helping change the world could ever come from within the
        established disciplines. One might even say the disciplines are
        designed so as to prevent the emergence of such thinking and, when it
        does emerge, to domesticate it.&rdquo;</Q>
      </P>
      <P>
        Center Study is a discipline similar to existing disciplines like
        sociology, economics, or political science&mdash;but unlike them
        insofar as Center Study is much more radical than any of these
        existing disciplines.
      </P>
      <P>
        It&rsquo;s also, in a way, totally indigestible by those disciplines. It&rsquo;s hard for the sociologist or the
        economist to &ldquo;take in&rdquo; Center Study and the{' '}
        <TermLink href="/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary hypothesis">originary hypothesis</TermLink>
        &mdash;but Center Study is able to metabolize all of them: to
        infiltrate these different disciplines, the idioms and vocabulary
        they&rsquo;ve constructed, the anthropology of the human that they all
        take as an implicit model for what the human being is.
      </P>
      <P>
        The minimal anthropology, or{' '}
        <TermLink href="/concepts/anthropomorphics" defKey="c:anthropomorphics" className={TERM_CLASS} title="Concept: anthropomorphics">anthropomorphics</TermLink>
        , that Center Study is founded on becomes a way of refounding each of
        these disciplines on the terms of the originary hypothesis, so as to
        generate a radical new vocabulary that lets us solve the currently
        unsolvable questions in each discipline&mdash;and make each of them
        able to speak with one another.
      </P>
      <P>
        So Center Study is a discipline like sociology, like economics, like political science; but it&rsquo;s
        unlike other disciplines insofar as it&rsquo;s radically
        interdisciplinary and radically generative.
      </P>
      <Slide n={4} alt="A 2×2: generativity of idioms against difficulty of learning" />
      <P>
        So this slide is a little bit tongue-in-cheek, but the idea here is to
        illustrate on the x-axis the difficulty of learning a new vocabulary
        or new idiom, and on the y-axis something I&rsquo;m calling,
        provisionally, the generativity of{' '}
        <TermLink href="/concepts/idiom" defKey="c:idiom" className={TERM_CLASS} title="Concept: idiom">idioms</TermLink>
        &mdash;i.e., how profoundly does the vocabulary you learn from the
        discipline shape your worldview and give you new insights and new ways
        of thinking about existing problems you&rsquo;ve been wrestling with?
        So you can imagine learning a language like French, and different
        French idioms and vocabularies giving you new perches on the
        world&mdash;maybe French culture specifically, but also probably the
        English language, which will change for you once you&rsquo;ve learned
        French. I want to say Center Study is much less difficult to learn
        than an entirely new language. However, it&rsquo;s radically more
        generative once you&rsquo;re able to start thinking in terms of the
        center. So it&rsquo;s hard to take in&mdash;at least it resists a kind
        of <Q slug="originary-hypothesis-as-mobius-strip" q="the kind of initiatory download">&ldquo;initiatory download,&rdquo;</Q>{' '}
        the way most &ldquo;theory&rdquo; lends itself to. But it&rsquo;s
        precisely that difficulty that makes it such a generative way of
        thinking.
      </P>

      <H2>II. The Lineage</H2>
      <Slide n={6} alt="René Girard and Eric Gans" />
      <P>
        Center Study, like everything, comes from somewhere. And at least for
        this conversation, I want to try to situate its origin with René
        Girard. Who in this room has heard of René Girard? Okay, the whole
        room. So I won&rsquo;t spend any time on Girard. This gentleman to his
        right is Eric Gans. Gans was among Girard&rsquo;s first PhD students.
        Gans studied under Girard at Johns Hopkins&mdash;and realized that
        Girard had a kind of &ldquo;plot hole&rdquo; in his{' '}
        <TermLink href="/concepts/scapegoating" defKey="c:scapegoating" className={TERM_CLASS} title="Concept: scapegoating">scapegoating</TermLink>
        {' '}mechanism.
      </P>
      <P>
        In Girard&rsquo;s model of the scapegoating event that founds the
        origin of the human, the proto-hominids&mdash;the not-yet-human
        creatures&mdash;gang up and lynch a selected individual. But the
        question for Gans was: why would this event be a meaningful one? In
        fact, animals kill individual animals in their groups all the
        time&mdash;and nothing &ldquo;event-al&rdquo; happens. The event
        isn&rsquo;t meaningful. It&rsquo;s not remembered. It&rsquo;s not
        iterated.
      </P>
      <P>
        So Girard wants to say there&rsquo;s something about this
        founding scapegoating event that radically transformed the community.
        But in order to do so, he must rely on some capacity for
        representation. The event must be represented to the community of
        now-human hominids as an{' '}
        <TermLink href="/concepts/event" defKey="c:event" className={TERM_CLASS} title="Concept: event">event</TermLink>
        {' '}as such. Without this capacity for representation, the killing of
        the individual would be like it is in every other animal species: not
        meaningful, not iterated, not memorable, and certainly not sacred.
      </P>
      <P>
        For there to be some kind of origin where the sacred, representation,
        meaning, and language originate, one would have to explain how it is
        that the violent scapegoating generates this capacity for
        representation. If it didn&rsquo;t already exist, the event
        wouldn&rsquo;t be meaningful. And if it already existed, then you
        don&rsquo;t need the event to explain it. It is that paradox that Gans
        resolves with his hypothesis about the origin of language.
      </P>
      <Slide n={7} alt="Timeline: 1961–2021, Girard to Gans to Katz" />
      <P>
        One way of thinking about the lineage is just isolating these
        different events, about twenty years apart, where the origins of each theory
        were first articulated. Girard releases <em>Deceit, Desire, and the
        Novel</em>{' '}in 1961. Gans publishes <em>The Origin of Language</em>{' '}in
        1981. <Link href="/author/katz" className={TERM_CLASS}>Adam Katz</Link>
        &mdash;who writes under the pseudonym{' '}
        <Link href="/author/katz" className={TERM_CLASS}>Dennis Bouvard</Link>
        &mdash;starts contributing to <em>Anthropoetics</em>, the
        journal of generative anthropology, in the early 2000s, and begins to
        take the absolutist turn, where he focuses on bringing the center back
        to the center. And this culminates in the forking of Center Study from
        generative anthropology in Adam&rsquo;s book{' '}
        <TermLink href="/concepts/anthropomorphics" defKey="c:anthropomorphics" className={TERM_CLASS} title="Concept: Anthropomorphics"><em>Anthropomorphics</em></TermLink>
        , released in 2020, and on his Substack, Center Study Center, which
        starts being published in 2021 and continues today.
      </P>
      <P>
        That&rsquo;s the lineage:{' '}
        <TermLink href="/concepts/mimesis" defKey="g:mimetic-desire" className={TERM_CLASS} title="Concept: mimesis">mimetic theory</TermLink>
        , to generative anthropology, to Center Study.
      </P>

      <H2>III. The Paradox of the First Word</H2>
      <Slide n={9} alt="The Origin of Language: the paradox of the first word. “In the beginning was the Word, and the Word was with God, and the Word was God.” John 1:1" />
      <P>
        So, what exactly was Gans&rsquo; amendment to Girard&rsquo;s mimetic
        theory? His amendment was that he solved a fundamental problem for the
        human sciences, and in doing so, made Girard&rsquo;s theory even more
        minimal. I want
        to begin with a paradox: the first word. Girard didn&rsquo;t have a theory of the origin of language.
        It&rsquo;s a hard problem to grasp, but once you see the problem,
        you&rsquo;ll see how elegant Gans&rsquo; solution is. Where does language come
        from in the first instance?
      </P>
      <Slide n={11} alt="Société de Linguistique de Paris, statutes of 1866, Article 2" />
      <P>
        There&rsquo;s a history here, with people like Claude Lévi-Strauss
        and Wilhelm von Humboldt.{' '}
        <Q slug="clr-628" q="arisen all at once">&ldquo;Language can only have arisen all at
        once. Things cannot have begun to signify gradually.&rdquo;</Q>{' '}&ldquo;Man is man
        only through speech; but in order to invent speech, he must already be
        man.&rdquo; Gans would always point out how the Linguistic Society of
        Paris banned discussion of the origin of language. Today we&rsquo;re
        going to break that taboo, and see what possibilities are enabled by
        the originary hypothesis.
      </P>
      <P>
        The origin of language is a paradoxical question because it&rsquo;s obvious and even
        trivial how you can get more language once you already have some
        language. Once there&rsquo;s a word or a few words or a few signs in a
        sign system, you can combine and iterate those signs to generate more
        signs or words. But how do you go from zero words to one word? How do
        you go from a being or species without language to a species with
        language? That initial jump, that zero-to-one moment, is the problem
        that must be solved. Eric Gans once defined the originary hypothesis as{' '}
        <Q slug="ap0501-gans-2" q="not a gradual development of animal communication">&ldquo;an attempt to come to grips with the most salient truth about
        human language: that language as we know it, the language of the sign
        rather than the signal, represents not a gradual development of animal
        communication but a radical break from it.&rdquo;</Q>
      </P>
      <P>
        The reason that language, or representation, or sign usage is a
        radical break from animal communication is not that animal
        communication is not complex. Indeed, it&rsquo;s very complex. And
        there are certainly lots of modes of animal and maybe even plant
        communication that we haven&rsquo;t yet scratched the surface of.
        However, there&rsquo;s a difference in kind between animal
        communication and human language. And there&rsquo;s been lots of great
        research into this, including books like <em>The Symbolic Species</em>{' '}
        and the research of Michael Tomasello.
      </P>
      <P>
        A quick way of explaining the difference is in terms of attention.
        Tomasello and his colleagues describe{' '}
        <a
          href="https://doi.org/10.1017/S0140525X05000129"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 underline-offset-2 hover:decoration-solid hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors"
          title="Tomasello, Carpenter, Call, Behne & Moll, “Understanding and sharing intentions: The origins of cultural cognition,” Behavioral and Brain Sciences 28 (2005)"
        >
          three levels of engagement
          <sup className="ml-0.5 text-[11px] text-gray-400 dark:text-gray-500" aria-hidden>&#8599;</sup>
        </a>
        .
      </P>
      <AttentionLevels />
      <P>
        In dyadic engagement, an individual &ldquo;interacts with, and is
        mutually responsive to, an animate agent directly.&rdquo;
      </P>
      <P>
        In triadic engagement, an individual &ldquo;interacts together with a
        goal-directed agent toward some shared goal.&rdquo; The shared looking
        at this level is often called joint attention, but Tomasello calls it
        only &ldquo;joint perception.&rdquo;
      </P>
      <P>
        Collaborative engagement adds &ldquo;joint attention (mutual
        knowledge).&rdquo; Adam Katz,{' '}
        <Link href="/post/double-helix-v2-tomasello-review" className={TERM_CLASS} title="Adam Katz’s review of Tomasello, A Natural History of Human Thinking">reviewing Tomasello</Link>
        , calls joint attention{' '}
        <Q slug="double-helix-v2-tomasello-review" q="Joint attention is a simple enough concept">&ldquo;a simple enough concept: I indicate to you that I am attending to
        something and that I know you are attending to it along with me, and
        you indicate the same.&rdquo;</Q>
      </P>
      <Slide n={10} alt="Tomasello: joint attention — the eyes" />
      <P>
        And what Tomasello has shown{' '}
        <Q slug="double-helix-v2-tomasello-review" q="apes do not point, at least not in such a way">&ldquo;is that apes do not point, at least not in such a way as to
        provide information or attract another&rsquo;s interest.&rdquo;</Q>{' '}
        You can see this in the way that human babies look back at their
        parents as they try to do things, or in the way that a human being can
        follow the plot of a movie or a play in a way that an animal cannot.
        This capacity for joint attention,{' '}
        <TermLink href="/concepts/attentionality" defKey="g:shared-attention" className={TERM_CLASS} title="Concept: attentionality">shared attention</TermLink>
        , is absolutely unique to the human species.
      </P>

      <H2>IV. The Originary Scene</H2>
      <Slide n={13} alt="The originary hypothesis" />
      <P>
        The originary hypothesis proposes an answer to this question in the
        form of what Gans called the{' '}
        <TermLink href="/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary scene">originary scene</TermLink>
        . The punchline, if I can get you to remember one thing when you leave
        this lecture today, is that the originary scene is where human beings
        discover language as the solution to their mimetic problem:{' '}
        <strong>
          the{' '}
          <TermLink href="/concepts/deferral" defKey="c:deferral" className={TERM_CLASS} title="Concept: deferral">deferral</TermLink>
          {' '}of violence through representation.
        </strong>
      </P>
      <P>
        Gans preserves from Girard the violent origin, but unlike Girard,
        it&rsquo;s not violence that forges the human&mdash;it&rsquo;s
        non-violence. It&rsquo;s our ability to withhold. Not so much free will
        as <em>free won&rsquo;t</em>. Humans are non-instinctual creatures. We
        don&rsquo;t just act on our animal appetites; we&rsquo;re also able to
        withhold them.
      </P>
      <Slide n={14} alt="Pecking order versus center" />
      <P>
        Think about an animal pecking order: alpha, beta, gamma, sigmas
        somewhere down there&mdash;I see some in the crowd. It&rsquo;s normally
        one against all. It&rsquo;s the alpha beating the beta for the meat.
        That&rsquo;s how wolf packs and ape hierarchies work. The human has a
        very different structure: centripetal, organized around a{' '}
        <TermLink href="/concepts/the-center" defKey="c:the-center" className={TERM_CLASS} title="Concept: the center">center</TermLink>
        . The originary hypothesis explains how you go from the animal pecking
        order to this human order&mdash;which, by the way, is hierarchical, not
        egalitarian.
      </P>
      <Slide n={15} alt="The scene, in four frames" />
      <P>
        Here is the scene. In the beginning you have a highly{' '}
        <TermLink href="/concepts/mimesis" defKey="c:mimesis" className={TERM_CLASS} title="Concept: mimesis">mimetic</TermLink>
        {' '}proto-hominid species that comes across an appetitive object they
        all desire&mdash;some kind of food. They all reach for it at the same
        time. As they reach, there&rsquo;s something not quite a realization
        but a fear that if everyone goes for it at once, violence will ensue.
        At least one of the animals&mdash;likely a sigma, someone not quite the
        alpha, someone in the middle&mdash;holds back and turns a{' '}
        <TermLink href="/concepts/originary-scene" defKey="g:aborted-gesture-of-appropriation" className={TERM_CLASS} title="Concept: the aborted gesture of appropriation">gesture of appropriation</TermLink>
        , of grabbing, into something like a point. That gesture
        is recognized by others and imitated, and they all point at the object.
      </P>
      <P>
        That scene, or something like it, was the first gesture, word, or
        &ldquo;thing&rdquo; in the universe that has meaning, and it meant
        something like <em>stop</em>, or <em>hold back</em>. They did
        something no animal has ever done: shared attention on a central
        object. That is deferral. They deferred the violence. The sign meant
        &ldquo;we&rsquo;re going to hold back,&rdquo; and then they would have
        gone forward and eaten the object. Maybe tensions rose again as they
        tore into the shared carcass, and maybe they issued the sign again.
      </P>
      <P>
        This very simple gesture&mdash;which you might notice is very similar
        to the pointing gesture at the origin&mdash;becomes a sign that means
        not quite love, though I want to say something like love. Gans calls
        it{' '}
        <Q slug="clr-411" q="the first gesture of human love">&ldquo;the first gesture of human love as distinct from mere animal
        affection.&rdquo;</Q>{' '}It&rsquo;s
        the ability to restrain yourself and let things be, and in that being,
        anything is possible. That&rsquo;s what deferral is, and that&rsquo;s
        what generativity is.
      </P>
      <Slide n={16} alt="The center through history: ritual center to central intelligence" />
      <P>
        You have this originary scene far back in our prehistory, and then you
        have the center throughout history. The point of Center Study is to
        start with that originary point and trace it through history like a
        thread: the first chiefs, the early kings, the empires, the
        twentieth-century states, and ultimately the central intelligence and
        the new kind of center we&rsquo;re opening into today. The center
        extends, and we can use the vocabulary of the center to talk about each
        of these and make them compatible with one another. It&rsquo;s a very
        minimal vocabulary that can explain the anthropology and the political
        theory of our social orders.
      </P>

      <H2>V. Center Study as Idiom Laboratory</H2>
      <Slide n={18} alt="Center Study is an idiom laboratory" />
      <P>
        So what is the discipline? It&rsquo;s an idiom laboratory. That sounds
        like a crazy claim, but two sentences get at it.
      </P>
      <P>
        First: <Q slug="scenic-linguistic-undecidability" q="infiltrate and reshape the scene">if you want to infiltrate and reshape a scene, you need to be
        primarily concerned with formulating idioms that will stick,
        proliferate, and turn into networks.</Q>{' '}I think this is even more true
        in the age of artificial intelligence and large language models. What
        matters is that the idioms you create&mdash;the new language, the
        neologisms, the terms you coin&mdash;go places. They succeed. They fly
        through the networks, come back to you, and work as new modes of
        thinking.
      </P>
      <P>
        Second: style is technology. If you imitate and translate
        another&rsquo;s style, you&rsquo;ll be saying things you wouldn&rsquo;t
        have thought of otherwise. <Q slug="language-the-ultimate-source-and-analysis-of-data" q="styles of learning idioms">Idioms are shared styles, and creating styles of learning
        idioms is a way of proposing new idioms.</Q>
      </P>
      <P>
        The goal is new idioms, new maxims, new durable phrases that let other
        people think in new ways. This goes back to the beginning: other
        disciplines are shutting down thinking, and the goal of Center Study is
        to radically open it up&mdash;radical in the sense of the root, the
        origin point. We always want to go back and see what more we can say.
      </P>
      <Slide n={19} alt="Seven idioms of Center Study" />
      <P>
        Here are seven idioms I selected; I&rsquo;ll talk through a few.
      </P>
      <P>
        <strong>Singularized succession in perpetuity.</strong>{' '}All political
        problems are{' '}
        <TermLink href="/concepts/succession" defKey="c:succession" className={TERM_CLASS} title="Concept: succession">succession</TermLink>
        {' '}problems. Who is going to lead in the future? How do you make that
        continuity a priority throughout the social order?
      </P>
      <P>
        <strong>There is no economy, only the debt to the center.</strong>{' '}This
        is the title of <Q slug="ap2802-ap2802katzbaker" q="debt to the center">an article I co-authored with Adam</Q>, but the phrase is
        more than that. From the first animal sacrifice to the Fed&rsquo;s
        quantitative easing yesterday, we can think about the economy as a{' '}
        <TermLink href="/concepts/debt-and-credit" defKey="c:debt-and-credit" className={TERM_CLASS} title="Concept: debt and credit">debt and credit</TermLink>
        {' '}relationship with the center itself.
      </P>
      <P>
        <strong>The conversion of assets into data.</strong>{' '}There&rsquo;s a
        lot to say here, but let&rsquo;s say{' '}
        <TermLink href="/concepts/money" defKey="c:money" className={TERM_CLASS} title="Concept: money">money</TermLink>
        {' '}itself is just data, and will become more so.
      </P>
      <P>
        <strong>The infinite inexhaustibility of pedagogy.</strong>{' '}There will
        always be a need to show others how to do things. When we think about
        what large language models are doing to work and the social order, one
        thing we&rsquo;ll never run out of is ways of teaching and learning
        from each other. Something like continual learning is what the economy
        turns into.
      </P>
      <P>
        <strong>Language will increasingly approximate programming.</strong>
        {' '}Our programming will increasingly be done in language, and language
        becomes a kind of programming we&rsquo;re always doing. One way to
        describe Center Study is as a language programming language&mdash;a way
        of getting at language itself, from the origin, in order to work on
        language. A lot of what we&rsquo;ll be doing is working on language in
        meta-linguistic ways.
      </P>

      <H2>VI. What Is to Be Done?</H2>
      <Slide n={21} alt="The maxim: no theories but in companies" />
      <P>
        If you take Center Study and the originary scene seriously, what can
        you do? One idiom I haven&rsquo;t said yet: No theories but in
        companies; no companies but through{' '}
        <TermLink href="/concepts/sovereignty" defKey="c:sovereignty" className={TERM_CLASS} title="Concept: sovereignty">sovereignty</TermLink>
        . All of the idioms need to turn into companies.
      </P>
      <Slide n={23} alt="Anglo-Modernity" />
      <P>
        Why? We&rsquo;re in something I call Anglo-modernity. Modernity is a
        corporate order comprised of companies. In the premodern world you had
        tribes, familial relationships, kinship networks. In modernity you have
        a legal order. This begins, I want to say, with the execution of
        Charles I&mdash;the first time in human history a reigning king is
        tried by his own subjects and executed, not killed by a rival faction. For the first time
        the people assert sovereignty over the center. The center is punctured,
        and we&rsquo;ve been dealing with the wound ever since.
      </P>
      <P>
        Look at the largest companies in the world: they are nearly all
        American companies. The modern world is in some sense the Anglo-American empire.
        It&rsquo;s the US dollar order. It&rsquo;s an order comprised of
        companies. And if you&rsquo;re serious about your ideas, you need to
        turn them into companies.
      </P>
      <Slide n={22} alt="Company ideas from Adam Katz" />
      <P>Here are a few company ideas from Adam:</P>
      <ul className="text-gray-800 dark:text-gray-200 leading-relaxed mb-5 list-disc pl-6 space-y-2">
        <li>Improving the justice system so much we can imagine not needing it.</li>
        <li>Tying money so closely to productive activity we can transact without it.</li>
        <li>Teaching leadership so comprehensively that it&rsquo;s effective, unquestioned, and minimally obtrusive.</li>
        <li>Making future possibilities so concrete and visible that they can replace currency.</li>
      </ul>
      <P>
        And then he closes the list: &ldquo;But I of course don&rsquo;t mean
        to close off further discussion with this minimal projection.&rdquo;
        These are very minimal. Where we&rsquo;re going is far more radical
        than any of this. But take the justice one: justice so deeply inscribed
        into the social order that people don&rsquo;t commit crimes because
        they know they&rsquo;d be prosecuted. You don&rsquo;t even need a
        justice order because it works so well.
      </P>
      <Slide n={25} alt="The companies: data security, litigation, judgment, pedagogy, insurance, currency" />
      <P>
        Some categories of companies: data security, litigation, judgment,
        pedagogy, insurance, currency.
      </P>
      <Slide n={24} alt="A unique politics" />
      <P>
        Center Study implies what I think is a unique politics: <Q slug="notes-on-governance-and-center-study-politics" q="placing all the bets on a center">placing all
        the bets on a center or prospective or type of</Q>{' '}
        <TermLink href="/concepts/pointman-uninsurable" defKey="c:pointman-uninsurable" className={TERM_CLASS} title="Concept: the pointman">pointman</TermLink>
        {' '}so inside as to turn the central bank and central intelligence
        into a single entity, thereby abolishing both, along with the{' '}
        <Q slug="originary-debt-credit-succession" q="The outside spread is the lender of last resort">outside spread</Q>
        {' '}and{' '}
        <Q slug="originary-debt-credit-succession" q="whoever within a monarchical order">outside option</Q>
        . Everything is to circulate through{' '}
        <TermLink href="/concepts/succession" defKey="c:succession" className={TERM_CLASS} title="Concept: succession">succession</TermLink>
        {' '}practices.
        {' '}That&rsquo;s a lot, and I could go through those terms, but the
        idea is this: at the beginning of Anglo-modernity you get the first
        central bank, the first central intelligence, parliamentary
        governance&mdash;the modern world. Part of what Center Study will do is
        bring all those dislocated, factional, infighting elements of
        sovereignty and governance into a single entity.
      </P>
      <Slide n={26} alt="Diagnosis and prescription" />
      <P>
        <Q slug="hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" q="boundary between diagnosis and prescription">The goal of Center Study is to stay as close as possible to the
        boundary between diagnosis and prescription, on the longest timeline
        imaginable&mdash;to always be able to say: this is what everyone is
        already doing, and here&rsquo;s how they might, given certain shifts
        in visible trajectories, do it more explicitly and accountably.</Q>
      </P>
      <P>
        There&rsquo;s an oscillation with many of these idioms, where at one
        level they seem very profound and at another very trivial. That&rsquo;s
        because what we&rsquo;re trying to do is describe, first, what
        we&rsquo;re already doing, and second, how we might do it even more
        explicitly.
      </P>
      <P>
        So that&rsquo;s Center Study. There&rsquo;s a{' '}
        <a
          href="https://x.com/centerstudy_"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Center Study Twitter account
        </a>
        {' '}if you want to follow along. Thank you everyone, and now
        we&rsquo;ll go into Q&amp;A.
      </P>

      <footer className="mt-14 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
        Next:{' '}
        <Link href="/begin" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          generate a reading path
        </Link>
        {' '}·{' '}
        <Link href="/guide" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          the guide
        </Link>
        {' '}·{' '}
        <Link href="/lectures" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          the introductory lectures
        </Link>
      </footer>
    </main>
  );
}
