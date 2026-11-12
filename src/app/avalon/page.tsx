import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PathOrientation from '@/components/PathOrientation';

export const metadata: Metadata = {
  title: 'An Introduction to Center Study',
  description:
    'The Avalon Institute Exposition talk, October 30, 2026 — what Center Study is, where it comes from, the paradox of the first word, the originary scene, and what is to be done. Slides and transcript.',
  alternates: { canonical: 'https://center.study/avalon' },
  openGraph: {
    title: 'An Introduction to Center Study',
    description:
      'The Avalon Exposition talk: the originary hypothesis, the lineage from Girard and Gans, and the companies it implies. Slides and transcript.',
    url: 'https://center.study/avalon',
    siteName: 'Center Study Center',
    type: 'article',
  },
};

// The talk as delivered at the Avalon Institute Exposition, lightly sharpened
// for the page from the speaking notes. Quoted material inside quotation
// marks is verbatim from the archive. Slides render at their cue points.

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
      </header>

      <PathOrientation />

      <Slide n={1} alt="Title slide: An Introduction to Center Study" />

      <H2>I. What is Center Study?</H2>
      <Slide n={3} alt="What is Center Study?" />
      <P>
        The anthropology we assume about ourselves is the implicit structure
        under every conversation about politics, religion, and economics.
        Ignore the question of what the human is, and the paradoxes show up
        later — in your theory of money, in your theory of the state, in your
        theory of language.
      </P>
      <Slide n={4} alt="A 2×2: generativity of idioms against difficulty of learning" />
      <P>
        One way to place Center Study is on this grid: the generativity of an
        idiom against the difficulty of learning it. Political ideologies are
        easy to learn and generate little. Programming languages, law school,
        a new natural language each buy their generativity at a price. Center
        Study sits near the top on generativity, middling on difficulty — and
        what it asks you to learn is one thing.
      </P>
      <P>
        It asks for one constant: a minimal hypothesis of human origin.
        First, humans are a mimetic species. Second, our mimetic capacities
        lead to violence, which we resolve through representation — a mode of
        coordination unique to the human species. Third, language is the
        deferral of violence. Everything else stays open to question.
      </P>
      <P>
        Girard: &ldquo;Man is the creature who does not know what to desire,
        and who turns to others in order to make up his mind.&rdquo; How did
        you learn to do anything? &ldquo;Ape&rdquo; means both the creature
        and the act of imitating, and humans are the most mimetic of apes —
        Aristotle says it in the Poetics: man is the most mimetic of all, and
        it is through mimesis that he develops his earliest understanding.
      </P>
      <P>
        Center Study branches off from Generative Anthropology and stays
        focused on the enduring center of any form of human organization: the
        ritual center, then the Big Man, then chiefs, kings, emperors, the
        state. It reads the social order as the engagement between periphery
        and center, and it reads language through originary grammar: the
        ostensive, the imperative, the interrogative, the declarative — in
        that order.
      </P>
      <P>
        It is not a doctrine. It is closer to a programming idiom — a language
        for programming languages, a way of infiltrating other discourses. It
        is interoperable: you install it, and things run differently, more
        explicitly. It is a maximally generative resource, because the first
        &ldquo;solution&rdquo; is the model for all other solutions. Like a
        roulette wheel, once you see the center you cannot unsee it. All I ask
        for tonight is an open mind.
      </P>

      <H2>II. The lineage</H2>
      <Slide n={6} alt="René Girard and Eric Gans" />
      <P>
        Three generations, each a break with the last. René Girard: born in
        Avignon in 1923, to America in 1947, Johns Hopkins and then Stanford,
        died 2015. In 1961, <em>Deceit, Desire and the Novel</em>: mimesis. In
        1972, <em>Violence and the Sacred</em>: the scapegoat.
      </P>
      <Slide n={7} alt="Timeline: 1961–2021, Girard to Gans to Katz" />
      <P>
        The hypothesis has a date — it was only thinkable after the linguistic
        turn. Saussure: meaning comes from difference, not reference. In 1966
        at Johns Hopkins, Girard hosts the symposium where Derrida reads
        &ldquo;Structure, Sign, and Play&rdquo;; Eric Gans, his first doctoral
        student, finishes that same year. Derrida: there is no outside of the
        text, and a &ldquo;violence of the letter&rdquo; constitutive of the
        sign. Girard in 1972: violence at the origin of culture. In 1981 Gans
        puts the two together — language is generative, not representational;
        violence stands at its origin; one scene does both. As Katz puts it,
        &ldquo;Only the originary hypothesis enables us to complete the
        linguistic turn, because only originary thinking can be free of the
        victimary investments of those critiques of metaphysics that emerged
        alongside the anti-colonial revolts.&rdquo; Completing the turn means
        no metalanguage, only infralanguage: &ldquo;If language is the
        deferral of violence, the only thing we are ever talking about is how
        we are going about deferring violence.&rdquo;
      </P>
      <P>
        Gans: born New York, 1941; Columbia, then Johns Hopkins under Girard;
        professor of French at UCLA from 1969. <em>The Origin of Language</em>,
        1981, is the break: Girard explains ritual and the sacred but not
        language — there needs to be a sign. Gans went his own way, and from
        1995 built <em>Anthropoetics</em> and the <em>Chronicles of Love and
        Resentment</em>. In 2001, after 9/11, Adam Katz reads Gans on the
        victimary. Then GABlog; <em>Anthropomorphics</em> in 2020; the Center
        Study fork in 2021. He writes as Dennis Bouvard — about 1,900 texts,
        all searchable here.
      </P>

      <H2>III. The paradox of the first word</H2>
      <Slide n={9} alt="The Origin of Language: the paradox of the first word" />
      <P>
        A word is only a word if others already understand it. So how can
        there be a first one? Why does the other person understand — and how
        do you know they do? There is a miraculousness to any utterance: to
        revise Heidegger, that there is speech rather than silence. Genesis
        1:3; John 1:1. Scripture puts the first word in the mouth of God
        because there is nowhere else it can go.
      </P>
      <Slide n={10} alt="Tomasello: joint attention — the eyes" />
      <P>
        The point to stress: language is a radical break from animal
        communication, not a development of it. Tomasello asks, &ldquo;Why
        don&rsquo;t apes point?&rdquo; Apes raised with humans learn to point
        for what they want — they never point to <em>share</em>. They never
        create a joint attentional frame, with each other or with us. Show an
        ape a bucket and it follows your arm and says, in effect: a bucket, so
        what — now where&rsquo;s the food? A fourteen-month-old asks why
        you&rsquo;re showing her. Joint attention is two people experiencing
        the same thing at the same time and knowing together that they are
        doing this. Deacon calls the line the symbolic threshold; in
        Peirce&rsquo;s terms, the symbol, not the index. And a radical
        difference — like being pregnant, you are or you aren&rsquo;t — needs
        an origin at a point in time.
      </P>
      <Slide n={11} alt="Société de Linguistique de Paris, statutes of 1866, Article 2" />
      <P>
        Lévi-Strauss saw that language can only have arisen all at once: there
        is no half a sign, and no agreement to institute language without
        language. The Société de Linguistique de Paris wrote it into their
        1866 statutes: the Society admits no communication concerning the
        origin of language. Humboldt had already stated the paradox — man is
        man only through language, but to invent language he would already
        have to be man. The question was banned because nobody could pose it
        properly. The originary hypothesis poses it properly.
      </P>

      <H2>IV. The originary scene</H2>
      <Slide n={13} alt="The originary hypothesis" />
      <P>
        Picture proto-humans around a kill. The pecking order that limits
        violence in animal groups is breaking down: mimetic appetite
        escalates, everyone converges on the same object at once.
      </P>
      <Slide n={14} alt="Pecking order versus center" />
      <P>
        Alpha beats beta, not the pack. An animal dominance hierarchy handles
        one rival at a time; it has no answer to everyone at once. The human
        is the species whose main danger is itself.
      </P>
      <Slide n={15} alt="The scene, in four frames" />
      <P>
        One of them hesitates. The grasp stops — a gesture of aborted
        appropriation, seen by all, imitated by all. Grasping becomes
        pointing. &ldquo;Humanity was created around a center — that central
        object all members of the group desired and that
        &lsquo;interdicted&rsquo; its own appropriation. All
        &lsquo;legitimate&rsquo; commands can be traced back to that.&rdquo;
        The object becomes the center: sacred, untouchable, shared because it
        belongs to none. Violence is deferred, not resolved. &ldquo;The first
        sign is the Name-of-God, and the center is sacred&rdquo; — Genesis
        comes back. This is the best hypothesis because it is minimal:
        language, the sacred, and deferral in one event. The first shared
        meaning in the universe. The Little Bang.
      </P>
      <Slide n={16} alt="The center through history: ritual center to central intelligence" />
      <P>
        The center never goes away; it changes what sits in it. Ritual center,
        Big Man, chiefs and kings, empire, the state, central intelligence.
        That sequence is the spine of Center Study.
      </P>

      <H2>V. Center Study as idiom laboratory</H2>
      <Slide n={18} alt="Center Study is an idiom laboratory" />
      <P>
        There is always a center: in a conversation, a classroom, a company, a
        market. &ldquo;Originary programming is a kind of maxim assembly kit,
        making maxims adjustable for the occasion.&rdquo; And: &ldquo;If you
        want to infiltrate and reshape a scene you need to be primarily
        concerned with formulating idioms that will stick, proliferate, and
        turn into networks.&rdquo; Style is technology — if you imitate and
        translate another&rsquo;s style you&rsquo;ll be saying things you
        wouldn&rsquo;t have thought of otherwise; idioms are shared styles,
        and creating styles of learning idioms is a way of proposing new
        idioms.
      </P>
      <Slide n={19} alt="Seven idioms of Center Study" />
      <P>
        Seven idioms — read them slowly and let each one land: singularized
        succession in perpetuity · there is no economy, but only the debt to
        the center · the conversion of assets into data · pedagogy is the
        residue and the surplus — there will always be a need to show others
        how to do things · language will increasingly approximate programming
        · our primary ethical obligation is to provide worthy data flows and
        see to their uptake and circulation · everybody is saying the same
        thing so as not to do the same thing at the same time.
      </P>

      <H2>VI. What is to be done?</H2>
      <Slide n={21} alt="The maxim: no theories but in companies" />
      <P>
        No theories but in companies; no companies but through sovereignty. A
        theory you can&rsquo;t put into a company is a few guys talking.
        Political thinking that isn&rsquo;t thinking in companies isn&rsquo;t
        serious — rights, coalitions, petitions are all ways of asking someone
        else&rsquo;s company to do it.
      </P>
      <Slide n={22} alt="The ambition" />
      <P>
        The hypothesis is worth holding only if it can &ldquo;offer us
        guidance out of our current crisis… because, otherwise, why
        care?&rdquo; The program is a research program that can diagnose the
        global situation and offer remedies anyone could imagine contributing
        to: &ldquo;Improving justice systems so much that we can imagine not
        needing them; tying money so closely to productive activity that we
        can imagine transacting without it; teaching leadership so
        comprehensively that it&rsquo;s effective, unquestioned and minimally
        obtrusive; making future possibilities so concrete and visible that
        they can replace currency.&rdquo; Each one a company whose success is
        its own abolition — the firm that puts itself out of business by
        becoming governance. And the scale is the planet: &ldquo;our stage is
        now the planet, and we will be designing it, one way or
        another.&rdquo;
      </P>
      <Slide n={23} alt="Anglo-Modernity" />
      <P>
        Modernity is a corporate order, comprised of companies — and the
        modern world&rsquo;s operating system is Anglo. It was built in
        late-seventeenth-century England by demolishing the sacral occupied
        center: regicide in 1649, 1688, the Bank of England in 1694, the
        two-party system. Sovereignty split between a central bank and a
        central intelligence, with liberal democracy as the oscillation
        between them — elections re-enact the civil war without having it.
        Probability is the thread: the first Insurance Office opens in 1667.
        &ldquo;The cloud of unknowing that blankets the modern world has its
        starting point when the British state jump-started itself an empire by
        subordinating itself to the central bank and writing itself out an
        unlimited line of credit. From that point on I don&rsquo;t think we
        can say the ruling classes themselves know what they&rsquo;re
        doing.&rdquo; This is not pro- or anti-Anglo: take it all in and
        develop an exit. &ldquo;No way of opposing this order without entering
        it.&rdquo; It ends in good governance, not collapse. The security firm
        that accumulates the contracts, absorbs the other firms and sets the
        protocols assumes, in some crisis, the attributes of sovereignty — and
        the judiciary makes it legal. Sovereignty is what it always was: the
        largest property owner presiding over the nomos. The property is now
        data; the fees look like tribute.
      </P>
      <Slide n={24} alt="A unique politics" />
      <P>
        &ldquo;Center study implies what I think is a unique politics: placing
        all the bets on a center or prospective or type of pointman so inside
        as to turn the central bank and central intelligence into a single
        entity, thereby abolishing both, along with the outside spread and
        outside option. Everything is to circulate through succession
        practices.&rdquo;
      </P>
      <Slide n={25} alt="The companies" />
      <P>
        The companies, concretely. Data security: whoever learns and tells the
        truth most reliably acquires a monopoly — justice, insurance and
        credit all depend on it. Litigation: defamation and fraud suits that
        make lying expensive, civil suits where prosecutors won&rsquo;t act,
        media companies to report the cases. Judgment: cases constituted and
        settled, prediction markets on the rulings, currency out of the bets —
        &ldquo;a kind of world brain.&rdquo; Pedagogy: gifted kids straight
        from high school into the pathfinding firms, companies holding options
        on students. Insurance taken to its limit, transgenerational — we all
        become insurance companies. And currency: the party or company that
        issues its own, and protects its members.
      </P>
      <P>
        The political implication: liberation politics is one mimetic scenario
        — Marxism, liberalism, nationalism, anti-colonialism all construct a
        rival who usurped my place at the center. Replace it with the center
        itself: clarify, repair, reconstruct, hand off. Start from the center,
        not the bottom — &ldquo;authority is first of all ostensive, then
        imperative, and only finally declarative,&rdquo; while liberalism puts
        the declarative first. A central authority can establish markets;
        markets cannot establish a central authority — if the world is
        becoming increasingly marketized, why the massive growth of the state?
        And succession is the test of seriousness: if you are not choosing
        your successor, you are not in power. Every company is a succession
        practice.
      </P>
      <P>
        The technological implication: literacy was the second revelation
        after the Big Man — the autonomy of the declarative sentence — and
        every medium since is a new mode of deferral.
        &ldquo;Technology joins us in the practice of imitation and always
        had, even well before the linguistic imitation programmed into Large
        Language Models.&rdquo; LLMs are signs with no scene behind them, and
        &ldquo;there is no AI alignment but only center alignment.&rdquo; Data
        centers as temples; data as currency; the universal translation
        machine; a promise believed and kept as the space every company
        occupies and enlarges. Center Study is a literacy program for the AI
        age.
      </P>

      <H2>VII. Close</H2>
      <P>
        Back to the wheel. One question to carry out of this room: where is
        the center, what is it deferring, who succeeds it. &ldquo;The first
        revolution in human affairs was some individual
        &lsquo;seizing&rsquo; the center — what the anthropologists call the
        Big Man, and from whom follow (along extremely complicated routes) all
        the kings and emperors and prime ministers and presidents and even
        &lsquo;bosses.&rsquo;&rdquo; It is the most consequential revolution
        in history, and the only one worth unreserved support. America is the
        furthest point West: it conserved the Big Man revolution through every
        transition of kingship, and it is the place where that revolution can
        be unapologetically restored — American freedom is an executive
        culture, where the people in charge of something should be allowed to
        actually be in charge of it.
      </P>
      <P>
        The founder carries it forward. &ldquo;Our Big Men today will have to
        be cartographers, and being cartographers today means organizing the
        cleanest and most comprehensive data and submitting it to algorithmic
        training dedicated to the expansion of the nomos and the settling of
        cases within it.&rdquo; A new generation of robber barons, with more
        emphasis on baron. &ldquo;There&rsquo;s nothing more important, and
        really nothing else than, imagining and building such
        companies.&rdquo; Start-ups are proto-empires. Get in on the ground
        floor.
      </P>
      <Slide n={26} alt="Diagnosis and prescription" />
      <P>
        &ldquo;The goal of center study is to stay as close to the boundary
        between diagnosis and prescription as possible on the longest timeline
        imaginable: to always be able to say, this is what everyone is already
        doing and here&rsquo;s how they might, given certain shifts in visible
        trajectories, do it more explicitly and accountably.&rdquo;
      </P>
      <P>
        Idioms and succession. The way I&rsquo;ll know this talk worked is if
        it succeeds: if there&rsquo;s succession, if the idioms infiltrate,
        spread and start to click. I hope I&rsquo;ve done some of that today,
        and that we can start working on this together.
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
