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
    'The Avalon Institute Exposition talk, October 30, 2026 — what Center Study is, where it comes from, the paradox of the first word, the originary scene, and what is to be done. Slides and edited transcript.',
  authors: [{ name: 'Zack Baker', url: 'https://center.study/author/baker' }],
  alternates: { canonical: 'https://center.study/intro-center-study-zack-baker' },
  openGraph: {
    title: 'Introduction to Center Study',
    description:
      'The Avalon Exposition talk: the originary hypothesis, the lineage from Girard and Gans, and the companies it implies. Slides and edited transcript.',
    url: 'https://center.study/intro-center-study-zack-baker',
    siteName: 'Center Study Center',
    type: 'article',
  },
};

// The talk as delivered at the Avalon Institute Exposition — the lightly
// edited transcript of the recording (speech portion; the Q&A lives in the
// transcript doc). The text is the speaker's words in the speaker's order:
// do not re-compress, summarize, or re-stylize it. One fact correction is
// carried in: Gans was "among Girard's first PhD students" (not "his
// first"). Slides render at their cue points in the delivered order (11
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
    'Slides and edited transcript from the Introduction to Center Study talk at the Avalon Institute Exposition on October 30, 2026.',
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
          Slides and edited transcript from the Introduction to Center Study
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
        the nature, or origin, of the human being? During that time I
        discovered a very strange theory called{' '}
        <Link href="/generative-anthropology" className={TERM_CLASS} title="Generative Anthropology — the overview">generative anthropology</Link>
        , which I became totally fixated on and have not stopped thinking
        about since.
      </P>
      <P>
        Generative anthropology ultimately became something called{' '}
        <TermLink href="/guide/concepts/center-study" defKey="c:center-study" className={TERM_CLASS} title="Concept: Center Study">Center Study</TermLink>
        . My goal today is to give you a quick overview of what
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
        existing disciplines. It&rsquo;s also, in a way, totally indigestible
        by those disciplines. It&rsquo;s hard for the sociologist or the
        economist to &ldquo;take in&rdquo; Center Study and the{' '}
        <TermLink href="/guide/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary hypothesis">originary hypothesis</TermLink>
        &mdash;but Center Study is able to metabolize all of them: to
        infiltrate these different disciplines, the idioms and vocabulary
        they&rsquo;ve constructed, the anthropology of the human that they all
        take as an implicit model for what the human being is. The minimal
        anthropology, or{' '}
        <TermLink href="/guide/concepts/anthropomorphics" defKey="c:anthropomorphics" className={TERM_CLASS} title="Concept: anthropomorphics">anthropomorphics</TermLink>
        , that Center Study is founded on becomes a way of refounding each of
        these disciplines on the terms of the originary hypothesis, so as to
        generate a radical new vocabulary that lets us solve the currently
        unsolvable questions in each discipline&mdash;and make each of them
        able to speak with one another. So Center Study is a discipline like
        sociology, like economics, like political science; but it&rsquo;s
        unlike other disciplines insofar as it&rsquo;s radically
        interdisciplinary and radically generative.
      </P>
      <Slide n={4} alt="A 2×2: generativity of idioms against difficulty of learning" />
      <P>
        So this slide is a little bit tongue-in-cheek, but the idea here is to
        illustrate on the x-axis the difficulty of learning a new vocabulary
        or new idiom, and on the y-axis something I&rsquo;m calling,
        provisionally, the generativity of{' '}
        <TermLink href="/guide/concepts/idiom" defKey="c:idiom" className={TERM_CLASS} title="Concept: idiom">idioms</TermLink>
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
        <TermLink href="/guide/concepts/scapegoating" defKey="c:scapegoating" className={TERM_CLASS} title="Concept: scapegoating">scapegoating</TermLink>
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
        iterated. So Girard wants to say there&rsquo;s something about this
        founding scapegoating event that radically transformed the community.
        But in order to do so, he must rely on some capacity for
        representation. The event must be represented to the community of
        now-human hominids as an{' '}
        <TermLink href="/guide/concepts/event" defKey="c:event" className={TERM_CLASS} title="Concept: event">event</TermLink>
        {' '}as such. Without this capacity for representation, the killing of
        the individual would be like it is in every other animal species: not
        meaningful, not iterated, not memorable, and certainly not sacred. For
        there to be some kind of origin where the sacred, representation,
        meaning, and language originate, one would have to explain how it is
        that the violent scapegoating generates this capacity for
        representation. If it didn&rsquo;t already exist, the event
        wouldn&rsquo;t be meaningful. And if it already existed, then you
        don&rsquo;t need the event to explain it. It is that{' '}
        <Q slug="clr-5" q="pragmatic paradox created by the convergence">&ldquo;pragmatic paradox&rdquo;</Q>
        {' '}that Gans resolved with his hypothesis about the origin of
        language.
      </P>
      <Slide n={7} alt="Timeline: 1961–2021, Girard to Gans to Katz" />
      <P>
        One way of thinking about the lineage is just isolating these
        different events, over twenty years, where the origins of each theory
        were first articulated. Girard releases <em>Deceit, Desire, and the
        Novel</em> in 1961. Gans publishes <em>The Origin of Language</em> in
        1981. Adam Katz&mdash;who writes under the pseudonym Dennis
        Bouvard&mdash;starts contributing to <em>Anthropoetics</em>, the
        journal of generative anthropology, in the early 2000s, and begins to
        take the absolutist turn, where he focuses on bringing the center back
        to the center. And this culminates in the forking of Center Study from
        generative anthropology in Adam&rsquo;s book{' '}
        <TermLink href="/guide/concepts/anthropomorphics" defKey="c:anthropomorphics" className={TERM_CLASS} title="Concept: Anthropomorphics"><em>Anthropomorphics</em></TermLink>
        , released in 2020, and on his Substack, Center Study Center, which
        starts being published in 2021 and continues today.
      </P>
      <P>
        That&rsquo;s the lineage:{' '}
        <TermLink href="/guide/concepts/mimesis" defKey="g:mimetic-desire" className={TERM_CLASS} title="Concept: mimesis">mimetic theory</TermLink>
        , to generative anthropology, to Center Study.
      </P>

      <H2>III. The Paradox of the First Word</H2>
      <Slide n={9} alt="The Origin of Language: the paradox of the first word" />
      <P>
        So what was this amendment? I want to begin with a paradox: the first
        word. Girard didn&rsquo;t have a theory of the origin of language.
        It&rsquo;s a hard problem to grasp, but once you see the problem,
        you&rsquo;ll see how elegant the solution is. Where does language come
        from in the first instance?
      </P>
      <Slide n={11} alt="Société de Linguistique de Paris, statutes of 1866, Article 2" />
      <P>
        There&rsquo;s a history here, with people like Claude Lévi-Strauss and
        Wilhelm von Humboldt. <Q slug="clr-628" q="arisen all at once">&ldquo;Language can only have arisen all at
        once. Things cannot have begun to signify gradually.&rdquo;</Q>{' '}&ldquo;Man is man
        only through speech; but in order to invent speech, he must already be
        man.&rdquo; Rousseau has comments on this too. And I always
        point out that the Linguistic Society of Paris actually banned all
        discussion of the origin of language because no one could figure out
        the answer. We&rsquo;re against the ban&mdash;which I think is probably
        still in force&mdash;so we&rsquo;re going to break it and propose a
        hypothesis.
      </P>
      <P>
        It&rsquo;s very weird. Once you have some language, it&rsquo;s clear
        you can get more; you agree on more words. But to go from zero to one,
        from no language to the first word, is a very strange problem.
      </P>
      <Slide n={10} alt="Tomasello: joint attention — the eyes" />
      <P>
        Briefly, it&rsquo;s worth noting that apes don&rsquo;t point. This is a
        simple point people often have trouble with, but there&rsquo;s a lot of
        research on it&mdash;Michael Tomasello and many others. I know that you
        know that I know: third-order attention. I&rsquo;m seeing you see me
        see something. No animal does this. I have five minutes of video, which
        I won&rsquo;t play now, showing how apes and human babies differ in
        this way. Third-order attention&mdash;
        <TermLink href="/guide/concepts/attentionality" defKey="g:shared-attention" className={TERM_CLASS} title="Concept: attentionality">shared attention</TermLink>
        &mdash;is unique to the human species, and it&rsquo;s part of how
        language emerges.
      </P>

      <H2>IV. The Originary Scene</H2>
      <Slide n={13} alt="The originary hypothesis" />
      <P>
        It all comes together in what Gans called the{' '}
        <TermLink href="/guide/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: the originary scene">originary scene</TermLink>
        , or the originary hypothesis. The punchline, if I can get you to
        remember one thing when you leave: the{' '}
        <TermLink href="/guide/concepts/deferral" defKey="c:deferral" className={TERM_CLASS} title="Concept: deferral">deferral</TermLink>
        {' '}of violence through representation.
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
        <TermLink href="/guide/concepts/the-center" defKey="c:the-center" className={TERM_CLASS} title="Concept: the center">center</TermLink>
        . The originary hypothesis explains how you go from the animal pecking
        order to this human order&mdash;which, by the way, is hierarchical, not
        egalitarian.
      </P>
      <Slide n={15} alt="The scene, in four frames" />
      <P>
        Here is the scene. In the beginning you have a highly{' '}
        <TermLink href="/guide/concepts/mimesis" defKey="c:mimesis" className={TERM_CLASS} title="Concept: mimesis">mimetic</TermLink>
        {' '}proto-hominid species that comes across an appetitive object they
        all desire&mdash;some kind of food. They all reach for it at the same
        time. As they reach, there&rsquo;s something not quite a realization
        but a fear that if everyone goes for it at once, violence will ensue.
        At least one of the animals&mdash;likely a sigma, someone not quite the
        alpha, someone in the middle&mdash;holds back and turns a{' '}
        <TermLink href="/guide/concepts/originary-scene" defKey="g:aborted-gesture-of-appropriation" className={TERM_CLASS} title="Concept: the aborted gesture of appropriation">gesture of appropriation</TermLink>
        , of grabbing, into something like a point. That gesture
        is recognized by others and imitated, and they all point at the object.
      </P>
      <P>
        That scene, or something like it, was the first sign and the first
        word, and it meant something like <em>stop</em>, or <em>hold back</em>. They did
        something no animal has ever done: shared attention on a central
        object. That is deferral. They deferred the violence. The sign meant
        &ldquo;we&rsquo;re going to hold back,&rdquo; and then they would have
        gone forward and eaten the object. Maybe tensions rose again as they
        tore into the shared carcass, and maybe they issued the sign again.
      </P>
      <P>
        This very simple gesture&mdash;which you might notice is very similar
        to the pointing gesture at the origin&mdash;becomes a sign that means
        not quite love, though I want to say something like love. It&rsquo;s
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
        <strong>Singularized succession in perpetuity.</strong> All political
        problems are{' '}
        <TermLink href="/guide/concepts/succession" defKey="c:succession" className={TERM_CLASS} title="Concept: succession">succession</TermLink>
        {' '}problems. Who is going to lead in the future? How do you make that
        continuity a priority throughout the social order?
      </P>
      <P>
        <strong>There is no economy, only the debt to the center.</strong> This
        is the title of <Q slug="ap2802-ap2802katzbaker" q="debt to the center">an article I co-authored with Adam</Q>, but the phrase is
        more than that. From the first animal sacrifice to the Fed&rsquo;s
        quantitative easing yesterday, we can think about the economy as a{' '}
        <TermLink href="/guide/concepts/debt-and-credit" defKey="c:debt-and-credit" className={TERM_CLASS} title="Concept: debt and credit">debt and credit</TermLink>
        {' '}relationship with the center itself.
      </P>
      <P>
        <strong>The conversion of assets into data.</strong>{' '}There&rsquo;s a
        lot to say here, but let&rsquo;s say{' '}
        <TermLink href="/guide/concepts/money" defKey="c:money" className={TERM_CLASS} title="Concept: money">money</TermLink>
        {' '}itself is just data, and will become more so.
      </P>
      <P>
        <strong>The infinite exhaustibility of pedagogy.</strong>{' '}There will
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
        <TermLink href="/guide/concepts/sovereignty" defKey="c:sovereignty" className={TERM_CLASS} title="Concept: sovereignty">sovereignty</TermLink>
        . All of the idioms need to turn into companies.
      </P>
      <Slide n={23} alt="Anglo-Modernity" />
      <P>
        Why? We&rsquo;re in something I call Anglo-modernity. Modernity is a
        corporate order comprised of companies. In the premodern world you had
        tribes, familial relationships, kinship networks. In modernity you have
        a legal order. This begins, I want to say, with the execution of
        Charles I&mdash;the first time in human history a monarch is executed
        not by a rival faction but after being put on trial. For the first time
        the people assert sovereignty over the center. The center is punctured,
        and we&rsquo;ve been dealing with the wound ever since.
      </P>
      <P>
        Look at the largest companies in the world: they are all American
        companies. The modern world is in some sense the Anglo-American empire.
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
        the bets on a center or prospective or type of pointman so inside as
        to turn the central bank and central intelligence into a single
        entity, thereby abolishing both, along with the outside spread and
        outside option. Everything is to circulate through succession
        practices.</Q>
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
