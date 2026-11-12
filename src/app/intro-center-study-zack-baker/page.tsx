import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TermLink from '@/components/TermLink';

// Dotted concept links — same style and hover-card behavior as term links
// inside posts and the /begin intro.
const TERM_CLASS =
  'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';

export const metadata: Metadata = {
  title: 'An Introduction to Center Study',
  description:
    'The Avalon Institute Exposition talk, October 30, 2026 — what Center Study is, where it comes from, the paradox of the first word, the originary scene, and what is to be done. Slides and transcript.',
  alternates: { canonical: 'https://center.study/intro-center-study-zack-baker' },
  openGraph: {
    title: 'An Introduction to Center Study',
    description:
      'The Avalon Exposition talk: the originary hypothesis, the lineage from Girard and Gans, and the companies it implies. Slides and transcript.',
    url: 'https://center.study/intro-center-study-zack-baker',
    siteName: 'Center Study Center',
    type: 'article',
  },
};

// The talk as delivered at the Avalon Institute Exposition — the speaking
// notes lightly edited into prose, in the speaker's own words and order.
// Quoted material inside quotation marks is verbatim from the archive.
// Slides render at their cue points. Two fact corrections are carried from
// the notes: Gans "among his first doctoral students" (not "his first"),
// and the 1667 insurance line (Barbon's fire insurance; the dedicated Fire
// Office is 1681). Do not re-compress or re-stylize this text.

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


// A quoted passage linked to its verbatim source in the archive — the quote
// underlines on hover and carries a small arrow so readers can see it's
// addressable. href lands on the post with the passage highlighted (?q=).
function Q({ slug, q, children }: { slug: string; q: string; children: React.ReactNode }) {
  return (
    <Link
      href={`/post/${slug}?q=${encodeURIComponent(q)}`}
      className="hover:underline decoration-1 underline-offset-2"
      title="Read this passage in its post"
    >
      {children}
      <sup className="ml-0.5 text-[11px] text-gray-400 dark:text-gray-500" aria-hidden>&#8599;</sup>
    </Link>
  );
}

export default function IntroPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <header className="mb-10 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3">
          The Avalon Institute Exposition · October 30, 2026
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          An Introduction to Center Study
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Slides and transcript · Zack Baker
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

      <H2>I. What is Center Study?</H2>
      <Slide n={3} alt="What is Center Study?" />
      <P>
        The anthropology we assume about ourselves is the implicit structure
        under every conversation about politics, religion, economics. Ignore
        the question of what the human is, and the paradoxes show up later.
      </P>
      <Slide n={4} alt="A 2×2: generativity of idioms against difficulty of learning" />
      <P>
        One way to place it: the generativity of idioms against the difficulty
        of learning them — political ideologies, programming languages, law
        school, learning a new language. Center Study is near the top on
        generativity, middling on difficulty.
      </P>
      <P>
        What it asks you to learn is a minimal hypothesis of human origin.
        First, humans are a{' '}
        <TermLink href="/guide/concepts/mimesis" defKey="c:mimesis" className={TERM_CLASS} title="Concept: mimesis">mimetic</TermLink>
        {' '}species. Second, our mimetic capacities lead to violence, which we
        resolve via representation, a mode of coordination unique to the human
        species. Third, language is the{' '}
        <TermLink href="/guide/concepts/deferral" defKey="c:deferral" className={TERM_CLASS} title="Concept: deferral">deferral</TermLink>
        {' '}of violence.
      </P>
      <P>
        Girard: &ldquo;Man is the creature who does not know what to desire,
        and who turns to others in order to make up his mind.&rdquo; How did
        you learn to do anything? &ldquo;Ape&rdquo; means both the creature and
        to imitate; humans are the most mimetic species. Aristotle, Poetics IV:
        &ldquo;man is the most mimetic of all, and it is through mimesis that
        he develops his earliest understanding.&rdquo;
      </P>
      <P>
        Center Study branches from Generative Anthropology and stays focused on
        the enduring{' '}
        <TermLink href="/guide/concepts/the-center" defKey="c:the-center" className={TERM_CLASS} title="Concept: the center">center</TermLink>
        : the{' '}
        <TermLink href="/guide/concepts/ritual" defKey="c:ritual" className={TERM_CLASS} title="Concept: ritual">ritual</TermLink>
        {' '}center, then the{' '}
        <TermLink href="/guide/concepts/big-man" defKey="c:big-man" className={TERM_CLASS} title="Concept: the Big Man">Big Man</TermLink>
        , then chiefs, kings, emperors, the state. It reads the social order as
        periphery&ndash;center engagement, and it reads language through{' '}
        <TermLink href="/guide/concepts/originary-grammar" defKey="c:originary-grammar" className={TERM_CLASS} title="Concept: originary grammar">originary grammar</TermLink>
        : ostensive, imperative, interrogative, declarative.
      </P>
      <P>
        It is not a doctrine: a programming idiom, a language programming
        language, a way of infiltrating other discourses. It is interoperable
        with others — you install it, things run differently, more explicitly.
        A maximally generative resource: the first &ldquo;solution&rdquo; and
        the model for all other solutions. It asks for one constant, a
        hypothesis about human origin; everything else is open to question.
        Like a roulette wheel, once you see the center you can&rsquo;t unsee
        it. All I ask for is an open mind.
      </P>

      <H2>II. The lineage</H2>
      <Slide n={6} alt="René Girard and Eric Gans" />
      <P>
        Three generations, each a break with the last. Girard: born in Avignon
        in 1923, to America in 1947, Johns Hopkins then Stanford, died 2015. In
        1961, <em>Deceit, Desire and the Novel</em>: mimesis. In 1972,{' '}
        <em>Violence and the Sacred</em>: the scapegoat.
      </P>
      <Slide n={7} alt="Timeline: 1961–2021, Girard to Gans to Katz" />
      <P>
        In 1966, at Johns Hopkins, Girard hosts the symposium where Derrida
        reads &ldquo;Structure, Sign, and Play&rdquo;; Gans, among his first
        doctoral students, finishes that year.
      </P>
      <P>
        The hypothesis has a date: it was only thinkable after the linguistic
        turn. Saussure: meaning from difference, not reference. Derrida,
        Baltimore 1966 and <em>Of Grammatology</em> 1967: no outside of the
        text; the &ldquo;violence of the letter,&rdquo; violence constitutive
        of the sign. Girard 1972: violence at the origin of culture. Gans in
        1981 puts the two together: language generative, not representational;
        violence at its origin; one scene that does both. As Katz puts it,
        <Q slug="linguistic-turn-generative-literacy" q="complete the linguistic turn">&ldquo;Only the originary hypothesis enables us to complete the
        linguistic turn, because only originary thinking can be free of the
        victimary investments of those critiques of metaphysics that emerged
        alongside the anti-colonial revolts.&rdquo;</Q> Completing it: no
        metalanguage, only infralanguage. <Q slug="gasc-2019-paper" q="how we are going about deferring violence">&ldquo;If language is the deferral of
        violence, the only thing we are ever talking about is how we are going
        about deferring violence.&rdquo;</Q> And the contingency of the hypothesis:
        it could have been thought and wasn&rsquo;t, until it was — <Q slug="the-contingency-of-the-hypothesis" q="contingency of the hypothesis">&ldquo;a
        fork that takes on board the contingency of the hypothesis.&rdquo;</Q>
      </P>
      <P>
        Gans: born New York, 1941; Columbia, then Johns Hopkins under Girard;
        professor of French at UCLA from 1969. 1981, <em>The Origin of
        Language</em>: the break. Girard explains ritual and the sacred but not
        language; there needs to be a sign. He went his own way;{' '}
        <em>Anthropoetics</em> and the <em>Chronicles</em> from 1995.
      </P>
      <P>
        2001: Katz reads Gans on the victimary after 9/11. GABlog;{' '}
        <em>Anthropomorphics</em> (2020); the Center Study fork (2021). He
        writes as Dennis Bouvard — 1,900 texts, all searchable here.
      </P>

      <H2>III. The paradox of the first word</H2>
      <Slide n={9} alt="The Origin of Language: the paradox of the first word" />
      <P>
        A word is only a word if others already understand it. So how can there
        be a first one? Why does the other person understand? How do you know?
        There is <Q slug="the-originary-hypothesis-in-itself" q="miraculousness of any utterance">&ldquo;the miraculousness of any utterance&mdash;to revise
        Heidegger, that there is speech rather than silence.&rdquo;</Q> Genesis
        1:3, John 1:1. Scripture puts the first word in the mouth of God
        because there&rsquo;s nowhere else it can go.
      </P>
      <P>
        The point to stress: language is a radical break from animal
        communication, not a development of it. Tomasello, &ldquo;Why
        Don&rsquo;t Apes Point?&rdquo; (2006): apes raised with humans learn to
        point for what they want, never to share attention; they never create a
        joint attentional frame, with each other or with us. Infants point to
        share before age one. The bucket: apes follow the arm and say, in
        effect, &ldquo;A bucket. So what? Now where&rsquo;s the food?&rdquo; A
        fourteen-month-old asks why you&rsquo;re showing her. Joint attention
        is &ldquo;two people experiencing the same thing at the same time and
        knowing together that they are doing this.&rdquo;
      </P>
      <Slide n={10} alt="Tomasello: joint attention — the eyes" />
      <P>
        Deacon, <em>The Symbolic Species</em>: the symbolic threshold. Peirce:
        symbolic, not merely indexical. Like being pregnant — you are or you
        aren&rsquo;t. A radical difference needs an origin at a point in time.
      </P>
      <P>
        Lévi-Strauss: language can only have arisen all at once. No half a
        sign; no agreement to institute language without language.
      </P>
      <Slide n={11} alt="Société de Linguistique de Paris, statutes of 1866, Article 2" />
      <P>
        The Société de Linguistique de Paris wrote it into their statutes of
        1866: the Society admits no communication concerning the origin of
        language. Humboldt: man is man only through language, but to invent
        language he had already to be man. The question was banned because
        nobody could pose it properly. The{' '}
        <TermLink href="/guide/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary scene">originary hypothesis</TermLink>
        {' '}poses it properly.
      </P>

      <H2>IV. The originary scene</H2>
      <Slide n={13} alt="The originary hypothesis" />
      <P>
        Proto-humans, a kill, the pecking order. Mimetic appetite escalates;
        everyone reaches at once; the order collapses.
      </P>
      <Slide n={14} alt="Pecking order versus center" />
      <P>
        Alpha beats beta, not the pack. The human: the species whose main
        danger is itself.
      </P>
      <Slide n={15} alt="The scene, in four frames" />
      <P>
        One hesitates. The grasp stops — a{' '}
        <TermLink href="/guide/concepts/originary-scene" defKey="g:aborted-gesture-of-appropriation" className={TERM_CLASS} title="Concept: the originary scene">gesture of aborted appropriation</TermLink>
        , seen by all, imitated by all. Grasping becomes pointing.
        <Q slug="the-prospects-of-the-hypothesis" q="humanity was created around a center">&ldquo;Humanity was created around a center — that central object all
        members of the group desired and that &lsquo;interdicted&rsquo; its own
        appropriation. All &lsquo;legitimate&rsquo; commands can be traced back
        to that.&rdquo;</Q>
      </P>
      <P>
        The object becomes the center:{' '}
        <TermLink href="/guide/concepts/the-sacred" defKey="c:the-sacred" className={TERM_CLASS} title="Concept: the sacred">sacred</TermLink>
        , untouchable, shared because it belongs to none. Violence deferred,
        not resolved. <Q slug="event-origin-center" q="first sign is the Name-of-God">&ldquo;The first sign is the Name-of-God, and the center
        is sacred&rdquo;</Q> — Genesis comes back. Why it&rsquo;s the best
        solution: minimal; language, the sacred and deferral as one event.
        <Q slug="ap3001-kawahara3001" q="first shared meaning in the universe">&ldquo;The first shared meaning in the universe.&rdquo;</Q> The Little
        Bang. The human: the being that threatens itself more than anything
        outside does, and so defers violence through representation.
      </P>
      <Slide n={16} alt="The center through history: ritual center to central intelligence" />
      <P>
        Ritual center, Big Man, chiefs and kings, empire, the state, central
        intelligence. The center never goes away; it changes what sits in it.
      </P>

      <H2>V. Center Study as idiom laboratory</H2>
      <P>
        There is always a center: a conversation, a classroom, a company, a
        market. <Q slug="programming-power-and-declarative-culture" q="maxim assembly kit">&ldquo;Originary programming is a kind of maxim assembly kit,
        making maxims adjustable for the occasion.&rdquo;</Q>
      </P>
      <Slide n={18} alt="Center Study is an idiom laboratory" />
      <P>
        <Q slug="scenic-linguistic-undecidability" q="infiltrate and reshape the scene">&ldquo;If you want to infiltrate and reshape a scene you need to be
        primarily concerned with formulating idioms that will stick,
        proliferate, and turn into networks.&rdquo;</Q> <Q slug="language-the-ultimate-source-and-analysis-of-data" q="styles of learning idioms">&ldquo;Style is
        technology&mdash;if you imitate and translate another&rsquo;s style
        you&rsquo;ll be saying things you wouldn&rsquo;t have thought of
        otherwise; idioms are shared styles, and creating styles of learning
        idioms is a way of proposing new idioms.&rdquo;</Q>
      </P>
      <Slide n={19} alt="Seven idioms of Center Study" />
      <P>
        Seven idioms — read them off and let each land: singularized succession
        in perpetuity · there is no economy, but only the debt to the center ·
        the conversion of assets into data · pedagogy is the residue and the
        surplus, there will always be a need to show others how to do things ·
        language will increasingly approximate programming · our primary
        ethical obligation is to provide worthy data flows and see to their
        uptake and circulation · everybody is saying the same thing so as not
        to do the same thing at the same time.
      </P>

      <H2>VI. What is to be done?</H2>
      <Slide n={21} alt="The maxim: no theories but in companies" />
      <P>
        No theories but in companies; no companies but through{' '}
        <TermLink href="/guide/concepts/sovereignty" defKey="c:sovereignty" className={TERM_CLASS} title="Concept: sovereignty">sovereignty</TermLink>
        . A theory you can&rsquo;t put into a company is a few guys talking.
        Political thinking that isn&rsquo;t thinking in companies isn&rsquo;t
        serious: rights, coalitions, petitions are asking someone else&rsquo;s
        company to do it.
      </P>
      <Slide n={22} alt="The ambition" />
      <P>
        The hypothesis is worth holding only if it can <Q slug="the-prospects-of-the-hypothesis" q="guidance out of our current crisis">&ldquo;offer us guidance
        out of our current crisis… because, otherwise, why care?&rdquo;</Q> The
        program: a research program that can diagnose the global situation and
        offer remedies anyone could imagine contributing to.
        &ldquo;Improving justice systems so much that we can imagine not
        needing them; tying money so closely to productive activity that we can
        imagine transacting without it; teaching leadership so comprehensively
        that it&rsquo;s effective, unquestioned and minimally obtrusive; making
        future possibilities so concrete and visible that they can replace
        currency. But I of course don&rsquo;t mean to close off further
        discussion with this minimal projection.&rdquo; Each one a company
        whose success is its own abolition — the firm that puts itself out of
        business by becoming governance. And the scale is the planet:
        <Q slug="the-stack-the-city" q="our stage is now the planet">&ldquo;our stage is now the planet, and we will be designing it, one
        way or another.&rdquo;</Q>
      </P>
      <Slide n={23} alt="Anglo-Modernity" />
      <P>
        &ldquo;Modernity is a corporate order, comprised of companies.&rdquo;
        The nature of Anglo modernity: the modern world&rsquo;s operating
        system. Built in late-seventeenth-century England by demolishing the
        sacral occupied center: regicide 1649, 1688, the Bank of England 1694,
        the two-party system. Sovereignty split between a central bank and a
        central intelligence; liberal democracy as the oscillation between
        them. Elections re-enact the civil war without having it. Probability
        as the thread: Nicholas Barbon starts selling fire insurance behind the
        Royal Exchange in 1667, and the first dedicated Fire Office opens in
        1681. <Q slug="muffled-transmission-from-the-center-substack" q="cloud of unknowing that blankets">&ldquo;The cloud of unknowing that blankets the modern world has
        its starting point when the British state jump-started itself an empire
        by subordinating itself to the central bank and writing itself out an
        unlimited line of credit. From that point on I don&rsquo;t think we can
        say the ruling classes themselves know what they&rsquo;re
        doing.&rdquo;</Q> Not pro- or anti-Anglo: take it all in and develop an
        exit. <Q slug="programming-the-same" q="opposing this order without entering it">&ldquo;No way of opposing this order without entering it.&rdquo;</Q>
        It ends in good governance, not collapse. The security firm that
        accumulates the contracts, absorbs the other firms and sets the
        protocols assumes, in some crisis, the attributes of sovereignty. The
        judiciary makes it legal. Sovereignty is what it always was: the
        largest property owner presiding over the{' '}
        <TermLink href="/guide/concepts/nomos" defKey="c:nomos" className={TERM_CLASS} title="Concept: nomos">nomos</TermLink>
        . The property is now data; the fees look like tribute.
      </P>
      <Slide n={24} alt="A unique politics" />
      <P>
        <Q slug="notes-on-governance-and-center-study-politics" q="placing all the bets on a center">&ldquo;Center study implies what I think is a unique politics: placing
        all the bets on a center or prospective or type of pointman so inside
        as to turn the central bank and central intelligence into a single
        entity, thereby abolishing both, along with the outside spread and
        outside option. Everything is to circulate through succession
        practices.&rdquo;</Q>
      </P>
      <Slide n={25} alt="The companies" />
      <P>
        Data security: whoever learns and tells the truth most reliably
        acquires a monopoly. Justice, insurance and credit all depend on it.
        Litigation — Nomos, Class Action: defamation and fraud suits that make
        lying expensive; civil suits where prosecutors won&rsquo;t act; media
        companies to report the cases. Judgment — Thirdness: cases constituted
        and settled;{' '}
        <TermLink href="/guide/concepts/market" defKey="c:market" className={TERM_CLASS} title="Concept: the market">prediction markets</TermLink>
        {' '}on the rulings; currency out of the bets; <Q slug="thirdness" q="a kind of world brain">&ldquo;a kind of world
        brain.&rdquo;</Q> Pedagogy — the Officer Class Academy: gifted kids
        straight from high school into the pathfinding firms; companies holding
        options on students. Insurance taken to its limit, transgenerational;
        we all become insurance companies. And currency: the party or company
        that issues its own, and protects its members.
      </P>
      <P>
        The political implications. Liberation politics is one mimetic
        scenario: Marxism, liberalism, nationalism, anti-colonialism all
        construct a rival who usurped my place at the center. Replace it with
        the center: clarify, repair, reconstruct, hand off. Start from the
        center, not the bottom: <Q slug="linguistic-turn-generative-literacy" q="authority is first of all ostensive">&ldquo;authority is first of all ostensive,
        then imperative, and only finally declarative.&rdquo;</Q> Liberalism puts
        the declarative first (the free subject, the people). Market model
        versus state-centralization model: a central authority can establish
        markets; markets can&rsquo;t establish a central authority. <Q slug="linguistic-turn-generative-literacy" q="why the massive growth of the state">&ldquo;If
        the world is becoming increasingly marketized, why the massive growth
        of the state?&rdquo;</Q> And{' '}
        <TermLink href="/guide/concepts/succession" defKey="c:succession" className={TERM_CLASS} title="Concept: succession">succession</TermLink>
        {' '}is the test of seriousness: if you are not choosing your successor
        you are not in power. Every company is a succession practice.
      </P>
      <P>
        The technological implications. Literacy was the second revelation
        after the Big Man: the autonomy of the declarative sentence. Every
        medium since is a new mode of deferral. <Q slug="exhaustive-imitation" q="joins us in the practice of imitation">&ldquo;Technology joins us in
        the practice of imitation and always had, even well before the
        linguistic imitation programmed into Large Language Models.&rdquo;</Q>
        LLMs: signs with no scene behind them; &ldquo;there is no AI alignment
        but only center alignment.&rdquo; The stack: data centers as temples
        (&ldquo;center data center&rdquo;); data as currency; the universal
        translation machine; NSM primes as the idiom AIs can be trained on.
        Language into currency: money is already data; a promise believed and
        kept is the space every company occupies and enlarges; idioms as
        tokens; currency replaced by language itself. Secondary orality versus
        secondary literacy: Center Study as a literacy program for the AI age.
      </P>

      <H2>VII. Close</H2>
      <P>
        Back to the wheel. One question to carry out: where is the center, what
        is it deferring, who succeeds it. <Q slug="the-prospects-of-the-hypothesis" q="first revolution in human affairs">&ldquo;The first revolution in human
        affairs was some individual &lsquo;seizing&rsquo; the center — what the
        anthropologists call the Big Man, and from whom follow (along extremely
        complicated routes) all the kings and emperors and prime ministers and
        presidents and even &lsquo;bosses.&rsquo;&rdquo;</Q> The most consequential
        revolution in history, and the only one worth unreserved support.
        America is the furthest point West: it conserved the Big Man revolution
        through every transition of kingship, and it is the place where that
        revolution can be unapologetically restored. American freedom is an
        executive culture: the people in charge of something should be allowed
        to actually be in charge of it.
      </P>
      <P>
        The founder carries it forward. <Q slug="trails-of-liminal-succession" q="will have to be cartographers">&ldquo;Our Big Men today will have to
        be cartographers, and being cartographers today means organizing the
        cleanest and most comprehensive data and submitting it to algorithmic
        training dedicated to the expansion of the nomos and the settling of
        cases within it.&rdquo;</Q> A new generation of robber barons, with more
        emphasis on baron. <Q slug="credit-and-succession" q="imagining and building such companies">&ldquo;There&rsquo;s nothing more important, and
        really nothing else than, imagining and building such
        companies.&rdquo;</Q> Start-ups are proto-empires. Get in on the ground
        floor.
      </P>
      <Slide n={26} alt="Diagnosis and prescription" />
      <P>
        <Q slug="hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative" q="boundary between diagnosis and prescription">&ldquo;The goal of center study is to stay as close to the boundary
        between diagnosis and prescription as possible on the longest timeline
        imaginable: to always be able to say, this is what everyone is already
        doing and here&rsquo;s how they might, given certain shifts in visible
        trajectories, do it more explicitly and accountably.&rdquo;</Q>
      </P>
      <P>
        Idioms and succession. The way I&rsquo;ll know this talk worked is if
        it succeeds: if there&rsquo;s succession, if the idioms infiltrate,
        spread and start to click. I hope I&rsquo;ve done some of that today
        and that we can start working on this together. Questions.
      </P>

      <footer className="mt-14 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
        Next:{' '}
        <Link href="/begin" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          generate a reading path
        </Link>
        {' '}·{' '}
        <Link href="/start" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          the guided start
        </Link>
        {' '}·{' '}
        <Link href="/lectures" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          the introductory lectures
        </Link>
      </footer>
    </main>
  );
}
