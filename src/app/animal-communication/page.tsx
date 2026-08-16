import Link from 'next/link';
import type { Metadata } from 'next';
import SceneMark from '@/components/SceneMark';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'Don’t animals talk too? — the difference, for skeptics',
  description:
    'Every serious objection to the claim that human language differs in kind from animal communication — vervet alarm calls, Washoe, Nim, Kanzi — taken head-on with the sources: Deacon, Tomasello, Lévi-Strauss, and the archive’s own texts. And why the difference requires an origin event.',
  alternates: { canonical: 'https://center.study/animal-communication' },
};

// ── Verbatim quotes ─────────────────────────────────────────────────────────
// Corpus quotes (kind: 'katz' | 'gans' | 'other') were extracted by the
// research fleet and verified against /api/grep; they link to their source
// text. External quotes (kind: 'ext') were verified against the cited
// editions by the web-research fleet. Amber marks Katz's verbatim words only,
// per the site grammar; everything else takes the gray reference treatment.

type Q = {
  kind: 'katz' | 'gans' | 'other' | 'ext';
  text: string;
  author: string;
  slug?: string; // corpus source
  cite?: string; // external citation
  url?: string;  // external link
};

function Quote({ q }: { q: Q }) {
  const border =
    q.kind === 'katz'
      ? 'border-amber-600 dark:border-amber-500'
      : 'border-gray-300 dark:border-gray-600';
  return (
    <figure className={`my-6 border-l-2 ${border} pl-4`}>
      <blockquote
        className="text-[16px] leading-relaxed text-gray-800 dark:text-gray-200"
        style={{ fontFamily: 'var(--prose-font-family)' }}
      >
        &ldquo;{q.text}&rdquo;
      </blockquote>
      <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        — {q.author}
        {q.slug && (
          <>
            ,{' '}
            <Link href={`/post/${q.slug}`} className="underline decoration-dotted underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              read in context →
            </Link>
          </>
        )}
        {q.cite && (
          <>
            , {q.url ? (
              <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                {q.cite} ↗
              </a>
            ) : (
              q.cite
            )}
          </>
        )}
      </figcaption>
    </figure>
  );
}

const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2
    id={id}
    className="font-serif text-2xl sm:text-[1.7rem] font-bold leading-snug text-gray-900 dark:text-white mt-14 mb-4 scroll-mt-20"
  >
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[15.5px] leading-relaxed text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">
    {children}
  </p>
);

export default function AnimalCommunicationPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
      <Link href="/" className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        ← Home
      </Link>

      <header className="mt-6 mb-6">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          For skeptics
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          Don&rsquo;t animals talk too?
        </h1>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mt-4 max-w-2xl">
          Everything in Generative Anthropology rests on one empirical wall: human
          language differs <em>in kind</em>, not in degree, from every animal
          communication system. If that wall falls, the originary hypothesis falls
          with it. So this page takes the strongest objections head-on — the vervet
          monkeys, the signing apes, Kanzi — with the actual studies, the videos,
          and the archive&rsquo;s own texts. Watch the animals do what they do; then
          look at what they never do.
        </p>
      </header>

      <div className="flex items-center gap-3 mb-10">
        <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* ── Q1 ── */}
      <H2 id="degree">&ldquo;Isn&rsquo;t language just more sophisticated animal communication?&rdquo;</H2>
      <P>
        This is the default assumption, and the first thing to say is that the best
        neuroscience of language origin rejects it. Terrence Deacon&rsquo;s{' '}
        <em>The Symbolic Species</em> (1997) — the book Eric Gans calls &ldquo;the most
        intelligent scientific work on the origin of human language&rdquo; — draws the
        line in Peirce&rsquo;s terms: animal signals are <em>indexical</em>, learned by
        association the way Pavlov&rsquo;s dog learned the bell. Words are{' '}
        <em>symbolic</em>, and symbols are a different kind of thing:
      </P>
      <Quote q={{ kind: 'ext', author: 'Terrence Deacon', cite: 'The Symbolic Species (Norton, 1997), p. 23', url: 'https://en.wikipedia.org/wiki/The_Symbolic_Species', text: 'Biologically, we are just another ape. Mentally, we are a new phylum of organisms.' }} />
      <P>
        Deacon&rsquo;s test is behavioral, not sentimental. An indexical association
        decays when the correlation breaks — stop feeding the dog after the bell and
        the bell goes silent, semiotically. Word reference survives broken
        correlations, because a word&rsquo;s meaning is held in place by its relations
        to <em>other words</em>: &ldquo;symbolic reference derives from combinatorial
        possibilities and impossibilities.&rdquo; And crucially, he insists the two
        systems are neurologically distinct — a claim Gans leans on repeatedly:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-629', text: 'Deacon distinguishes, in C. S. Peirce’s terms, the symbolic signs of true semiotic systems from the indexical signs used by animals, and furthermore insists that they do not derive from them, being located in different parts of the brain.' }} />

      {/* Diagram 1: signal vs sign */}
      <figure className="my-8">
        <svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram contrasting the animal signal (a wired one-way arc from stimulus to reaction) with the human sign (a conventional triangle between two people and an object)" className="w-full h-auto text-gray-700 dark:text-gray-300">
          <line x1="340" y1="16" x2="340" y2="234" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          {/* Left: signal */}
          <text x="170" y="30" textAnchor="middle" fontSize="13" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="2">SIGNAL</text>
          <text x="60" y="112" textAnchor="middle" fontSize="26">🦅</text>
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="85" y1="105" x2="140" y2="105" />
            <polygon points="140,105 130,100 130,110" />
          </g>
          <circle cx="170" cy="105" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="170" y="140" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">alarm call</text>
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="196" y1="105" x2="252" y2="105" />
            <polygon points="252,105 242,100 242,110" />
          </g>
          <text x="285" y="110" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">scatter</text>
          <text x="170" y="196" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">stimulus → triggered call → reaction</text>
          <text x="170" y="214" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">one direction · wired · fires even with no one to inform</text>
          {/* Right: sign */}
          <text x="510" y="30" textAnchor="middle" fontSize="13" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="2">SIGN</text>
          <circle cx="510" cy="78" r="13" fill="#d97706" />
          <text x="510" y="60" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">the thing</text>
          <circle cx="430" cy="170" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="590" cy="170" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 4">
            <line x1="438" y1="158" x2="500" y2="92" />
            <line x1="582" y1="158" x2="520" y2="92" />
          </g>
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="448" y1="167" x2="572" y2="167" />
            <polygon points="572,167 562,162 562,172" />
            <line x1="572" y1="176" x2="448" y2="176" />
            <polygon points="448,176 458,171 458,181" />
          </g>
          <text x="510" y="150" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">&ldquo;that&rdquo;</text>
          <text x="510" y="200" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">two people + a shared object · conventional · re-issuable</text>
          <text x="510" y="218" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">each knows the other attends — and knows the other knows</text>
        </svg>
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          The signal is a wire; the sign is a scene. The arrow structures are not more and less of the same thing.
        </figcaption>
      </figure>

      <P>The archive&rsquo;s formulation of the same line, from <em>The Origin of Language</em>:</P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'the-origin-of-language', text: 'A sign is not a signal; it is a product of conscious renunciation, just the opposite of an assertion of immediate “presence.”' }} />
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-343', text: '“symbolic” human language is not an extension of animal signal systems but a radically new mode of communication. I would go still farther: language brings into being an entirely new kind of entity, the category or type –as in the type-token distinction fundamental to language–that is nowhere to be found in the real, material world.' }} />

      {/* ── Q2 ── */}
      <H2 id="vervets">&ldquo;But vervet monkeys have words for eagle and leopard.&rdquo;</H2>
      <P>
        The vervet studies are the strongest card the continuity view holds, so play
        it at full strength. In 1980, Seyfarth, Cheney and Marler showed in{' '}
        <em>Science</em> that vervet monkeys give acoustically distinct alarm calls
        for leopards, eagles, and snakes — and that playback of a recorded call, with
        no predator present, sends the troop into the right evasive action: up a tree
        for leopard, scanning the sky for eagle. The calls are, as the field came to
        say, <em>functionally referential</em>. Watch it happen:
      </P>
      <VideoCard
        videoId="q8ZG8Dpc8mM"
        title="Vervet monkey alarm calls — BBC, Talk to the Animals"
        caption="Distinct calls, distinct escapes. This is the best case for animal 'words' — which is why its limits matter."
      />
      <P>
        Now the three limits, all from the researchers themselves. First, the
        follow-up literature concluded &ldquo;functionally referential&rdquo; does not
        mean symbolic — Wheeler and Fischer&rsquo;s 2012 review argues the concept
        &ldquo;has outlived its usefulness&rdquo; as a bridge to language. Second,
        vervets keep alarm-calling <em>after every member of the group has already
        seen the predator</em> — the call is not for anyone; it fires. A human
        speaker who did this would be exhibiting a symptom, not a sentence. Third,
        and deepest — Seyfarth and Cheney&rsquo;s own conclusion:
      </P>
      <Quote q={{ kind: 'ext', author: 'Seyfarth & Cheney', cite: 'Annual Review of Psychology 54 (2003)', url: 'https://web-facstaff.sas.upenn.edu/~seyfarth/Publications/', text: 'In sum, a variety of results argue that, in marked contrast to humans, nonhuman primates do not produce vocalizations in response to their perception of another individual’s ignorance.' }} />
      <P>
        The monkey calls whether you know or not, because the call was never{' '}
        <em>about</em> your knowing. Gans draws the consequence — if language were
        for transmitting information about the environment, vervet-style signaling
        is what it would look like, and we would have stopped there:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'the-origin-of-language', text: 'What they fail to realize is that had this been the originary purpose of language, we would have evolved like vervet monkeys, emitting different signals for the different objects of interest in our environment.' }} />
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-712', text: 'The cat has no means to think about the mouse it sees, nor do the warning signals emitted by a vervet monkey share a thought ( signifié ) with its fellows. This simple truth is one that students of animal behavior do themselves no favors by not taking explicitly into consideration.' }} />

      {/* ── Q3 ── */}
      <H2 id="apes">&ldquo;What about the apes who learned sign language?&rdquo;</H2>
      <P>
        The 1970s ape-language projects are remembered as a triumph; their actual
        scientific arc runs the other way, and the man who ran the most rigorous one
        is the chief witness. Herbert Terrace set out to refute Chomsky with a
        chimpanzee he puckishly named Nim Chimpsky. Nim learned 125 signs. Then
        Terrace did what the other projects hadn&rsquo;t: he went through the
        videotapes frame by frame, and published his reversal in <em>Science</em>{' '}
        (&ldquo;Can an Ape Create a Sentence?&rdquo;, 1979). Nim&rsquo;s longest
        recorded utterance is the whole verdict in one line:
      </P>
      <Quote q={{ kind: 'ext', author: 'Nim Chimpsky, 16 signs', cite: 'Terrace et al., Science 206 (1979), p. 895', url: 'https://pubmed.ncbi.nlm.nih.gov/504995/', text: 'give orange me give eat orange me eat orange give me eat orange give me you' }} />
      <P>
        No syntax, no subject, no news — a beg, elongated. The tapes also showed
        Nim&rsquo;s teachers unconsciously signing a fraction of a second before he
        did. And then there is Koko, the most famous case and scientifically the
        weakest. Penny Patterson never published controlled data from the
        decades-long project — Stanford primatologist Robert Sapolsky&rsquo;s verdict
        was &ldquo;no data,&rdquo; just &ldquo;several heartwarming films&rdquo; with
        nothing you could analyze — and Koko&rsquo;s celebrated utterances reached
        the public only through Patterson&rsquo;s own interpretive glosses, the one
        person positioned to say what any sign &ldquo;meant.&rdquo; That is the
        Clever Hans structure: an expectant handler, an animal exquisitely tuned to
        her cues, and no way from outside to tell performance from language.
        Terrace&rsquo;s summary of the whole generation — Washoe and Koko included —
        was that the apes &ldquo;only learned to use imperatives that were
        involuntary demands for primary rewards.&rdquo; Gans had reached the same
        verdict from theory:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-423', text: 'That is, Nim had learned lots of signs for things, but he only used them to obtain those things; his syntax, in a word, never got past the imperative. Teach him the sign for “banana,” and he would use it to get a banana.' }} />
      <VideoCard
        videoId="IHoviCO7lpE"
        title="Project Nim (2011) — official trailer"
        caption="James Marsh's documentary, built from the project's own 1970s footage. The experiment that ended the first ape-language era."
      />

      {/* ── Q4 ── */}
      <H2 id="kanzi">&ldquo;Kanzi, though. Kanzi understood spoken English.&rdquo;</H2>
      <P>
        Kanzi the bonobo is the honest hard case, so take him at his best. He picked
        up lexigram symbols as an infant without training — watching researchers
        try to teach his adoptive mother — and in the landmark 1993 study he carried
        out novel spoken requests (&ldquo;put the pine needles in the
        refrigerator&rdquo;) at rates matching a two-year-old child, many delivered
        from behind a mask so he couldn&rsquo;t read faces. That is real, and it is
        the most impressive comprehension result any nonhuman has produced. Watch:
      </P>
      <VideoCard
        videoId="2Dhc2zePJFE"
        title="Kanzi and novel sentences — Great Ape Trust footage"
        caption="The strongest pro-ape data there is. What follows is what it still lacks."
      />
      <P>
        Three walls remain standing. Syntax: Robert Truswell&rsquo;s reanalysis of
        the 1993 data found Kanzi at <em>chance</em> exactly where hierarchical
        structure is required (&ldquo;fetch the toy AND the water&rdquo; — he brings
        one, the other, or both, at random). Use: across the systematic studies of
        signing apes, 96–98% of all productions are imperative — demands — versus a
        human two-year-old&rsquo;s constant declarative chatter. And the
        conversational wall, in linguist Geoffrey Pullum&rsquo;s words: &ldquo;I do
        not believe that there has ever been an example anywhere of a nonhuman
        expressing an opinion, or asking a question. Not ever.&rdquo; The archive&rsquo;s
        judo move is to accept the successes and flip them:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-245', text: 'On the contrary, the closer our cousins come to displaying a linguistic competence less developed than but similar to our own, the more crucial it becomes to explain why this competence never came to drive their evolution and consequently failed to generate a historical culture.' }} />
      <Quote q={{ kind: 'other', author: 'Sparagmos! dialogue (Anthropoetics)', slug: 'ap1101-sparagmos', text: 'What these “successful” experiments show is that there is no innate genetic reason preventing chimpanzees from acquiring language. In a sense, this provides corroboration (but not proof) of the originary hypothesis, because it proves that the deciding factor is not biological.' }} />
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-423', text: 'But when we short-circuit the procedure and teach the chimp our signs, we do not and cannot teach him the deferral that goes with them.' }} />

      {/* ── Q5 ── */}
      <H2 id="attention">&ldquo;So what exactly is missing?&rdquo;</H2>
      <P>
        A precise answer exists, and you can state it in three steps. The GA
        community&rsquo;s glossary formulates it as three <em>orders of
        attentionality</em>: first order — <em>I see X</em> — plain directed
        attention, which nearly everything with eyes has. Second order — <em>I see
        you see X</em> — awareness of another&rsquo;s attention, which social animals
        have; it is what makes a pecking order or a hunt possible. Third order —{' '}
        <em>I see you see me see X</em> — mutual, recursive, <em>acknowledged</em>{' '}
        shared attention. That is the human threshold, and it is precisely the
        structure of two people and one center.
      </P>

      {/* Diagram 2: three orders of attention */}
      <figure className="my-8">
        <svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three panels showing first-order attention (one gaze at an object), second-order (watching another's gaze), and third-order (two people mutually aware of jointly attending to a central object)" className="w-full h-auto text-gray-700 dark:text-gray-300">
          <line x1="227" y1="16" x2="227" y2="212" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="453" y1="16" x2="453" y2="212" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          {/* 1st order */}
          <text x="113" y="32" textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="1">1ST ORDER</text>
          <circle cx="60" cy="120" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="78" y1="118" x2="150" y2="112" />
            <polygon points="150,112 140,108 141,118" />
          </g>
          <circle cx="170" cy="110" r="10" fill="currentColor" opacity="0.35" />
          <text x="113" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">I see X</text>
          <text x="113" y="203" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.5">anything with eyes</text>
          {/* 2nd order */}
          <text x="340" y="32" textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="1">2ND ORDER</text>
          <circle cx="285" cy="140" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="345" cy="95" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="297" y1="132" x2="330" y2="105" />
            <polygon points="330,105 320,107 326,115" />
            <line x1="360" y1="90" x2="405" y2="82" />
            <polygon points="405,82 395,78 396,88" />
          </g>
          <circle cx="422" cy="80" r="10" fill="currentColor" opacity="0.35" />
          <text x="340" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">I see you see X</text>
          <text x="340" y="203" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.5">social animals — watch, stalk, follow</text>
          {/* 3rd order */}
          <text x="566" y="32" textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="1">3RD ORDER</text>
          <circle cx="566" cy="82" r="11" fill="#d97706" />
          <circle cx="510" cy="160" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="622" cy="160" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5 4">
            <line x1="518" y1="148" x2="558" y2="94" />
            <line x1="614" y1="148" x2="574" y2="94" />
          </g>
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="527" y1="157" x2="605" y2="157" />
            <polygon points="605,157 595,152 595,162" />
            <line x1="605" y1="166" x2="527" y2="166" />
            <polygon points="527,166 537,161 537,171" />
          </g>
          <text x="566" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">I see you see me see X</text>
          <text x="566" y="203" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.5">humans only — the scene, the center, the sign</text>
        </svg>
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          The third panel is the shape of the originary scene: joint attention on a shared center, mutually acknowledged. Compare the{' '}
          <Link href="/guide/glossary/shared-attention" className="underline decoration-dotted underline-offset-2">glossary on shared attention</Link> and{' '}
          <Link href="/guide/glossary/attentionality" className="underline decoration-dotted underline-offset-2">attentionality</Link>.
        </figcaption>
      </figure>

      <P>
        This is where the developmental science lands its heaviest blow — Michael
        Tomasello&rsquo;s three decades at the Max Planck Institute. At around nine
        months, human infants undergo what he literally titles &ldquo;the nine-month
        revolution&rdquo;: they start following gaze, checking back, and — around the
        first birthday, <em>before language</em> — pointing. Not just pointing to
        get things: pointing to <em>show</em> things. The experiment is elegant: a
        twelve-month-old points at something; if the adult merely looks at the
        object, or merely emotes at the child, the infant is unsatisfied and
        persists — satisfied only when the adult looks <em>and</em> shares the
        moment back. Apes, in thirty years of gesture research, never do this:
      </P>
      <Quote q={{ kind: 'ext', author: 'Michael Tomasello', cite: 'Origins of Human Communication (MIT Press, 2008), p. 38', url: 'https://mitpress.mit.edu/9780262515207/origins-of-human-communication/', text: 'But at the same time it is critically important to note that no apes in any kind of environment produce, either for other apes or for humans, acts of pointing declaratively, simply to share attention and interest with others.' }} />
      <P>
        His famous remark — reported by Jonathan Haidt from conversation, and worth
        keeping with its provenance — is that &ldquo;it is inconceivable that you
        would ever see two chimpanzees carrying a log together.&rdquo; The published
        version says the same: cooperation built on <em>shared</em> intention is
        &ldquo;almost unimaginable&rdquo; between chimpanzees. Katz&rsquo;s
        formulation makes the recursive structure explicit and hands it directly to
        the originary hypothesis:
      </P>
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'the-attentional-structure-of-sovereignty', text: 'Considered at its most minimal, language is grounded, as Michael Tomasello along with Eric Gans has shown, in joint attention—the capacity to pay attention to the same thing at the same time, to know that we are doing it, and to know that we know (to let each other know).' }} />
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'the-center', text: 'Two chimps can’t look at something together, and let each other know that they’re doing so. That’s really what an “object” is, something we can “let be” and look at together.' }} />
      <VideoCard
        videoId="Z-eU5xZW7cU"
        title="Warneken & Tomasello — spontaneous helping in toddlers (and chimps)"
        caption="The shared-intentionality experiments: fourteen-month-olds helping an unfamiliar adult, unprompted and unrewarded — behavior with no ape equivalent."
      />
      <P>
        One more independent measure, from structural linguistics: Charles
        Hockett&rsquo;s classic design features. <em>Displacement</em> — talking
        about what is absent, remote, past, hypothetical — and{' '}
        <em>productivity</em> — saying what has never been said — are, on
        Hockett&rsquo;s survey, essentially confined to human language. The honeybee
        waggle dance is the famous near-exception (it encodes direction and distance
        to food the audience hasn&rsquo;t seen), and its limits prove the rule: a bee
        can report only the most recent trip, cannot negate, cannot ask, and the
        dance is continuous and innate rather than discrete and conventional. The
        exception has exactly one sentence in it.
      </P>

      {/* ── Q6 ── */}
      <H2 id="event">&ldquo;Fine — a real difference. Why would it need a single origin event?&rdquo;</H2>
      <P>
        Because of a logical trap first sprung long before Generative Anthropology
        existed. In 1950, Claude Lévi-Strauss — no friend of origin scenarios —
        stated it flatly:
      </P>
      <Quote q={{ kind: 'ext', author: 'Claude Lévi-Strauss', cite: 'Introduction to the Work of Marcel Mauss (1950, trans. Baker)', url: 'https://en.wikipedia.org/wiki/Introduction_to_the_Work_of_Marcel_Mauss', text: 'Whatever may have been the moment and the circumstances of its appearance in the ascent of animal life, language can only have arisen all at once. Things cannot have begun to signify gradually.' }} />
      <P>
        Why not gradually? Because a sign is a convention, and a convention exists
        only if it is shared. Katz runs the reduction in one move — to agree on the
        first word, you would already need language to agree <em>in</em>:
      </P>
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'the-sign-substack', text: 'We already have the paradox here that the only way of arriving at such an agreement requires a pre-existing agreement—a paradox pointed out by Rousseau and then Claude Levi-Strauss, leading to the logical, if equally paradoxical conclusion that language must have emerged all at once.' }} />
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'event-origin-center', text: 'What would “part” of a “meaningful” sign be? How would it not already be meaningful? In any gradual emergence of the sign as meaningful, how could there not be a threshold under which it has no meaning and above which it does?' }} />
      <P>
        Peter Goldman&rsquo;s version is the one to quote at dinner: &ldquo;It&rsquo;s
        like being pregnant; one is either pregnant or not. There&rsquo;s no such
        thing as being a little bit pregnant.&rdquo; And here is the remarkable
        convergence: Deacon — a neuroscientist with no stake in GA — reaches the
        same structure from the learning side. Symbols, he argues, cannot be
        acquired one at a time the way associations can, because each symbol&rsquo;s
        reference depends on the system of other symbols; crossing the symbolic
        threshold is &ldquo;a restructuring event&rdquo; that &ldquo;essentially
        takes no time.&rdquo; The logician, the neuroscientist, and the
        anthropologist arrive at the same door. Gans walks through it:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-768', text: 'Language could not have emerged gradually and imperceptibly through the accretion of small improvements. Each use of language is an  event , and language could only have emerged in an  event .' }} />
      <P>
        Two honest fine-prints, both from inside the discourse. The claim absorbs
        gradualism rather than denying development: &ldquo;there is gradualism and
        gradualism. A series of events is not the same as a series of unmarked
        occurrences such as take place among animals&rdquo; (Gans). And it is not a
        one-place dogma: Gans explicitly allows that the sign may have been invented
        &ldquo;in more than one place&rdquo; — &ldquo;the originary hypothesis refers
        to the causality of the event, not to its uniqueness.&rdquo; What cannot be
        given up is the event-form itself: somewhere, a first sign was issued and{' '}
        <em>taken up together</em>, because a sign nobody else takes up is not a
        sign.
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-555', text: 'Unless the first object to become the referent of a sign was the focus of common attention in a wholly new way, it would not have been so designated at all. There is no gradual path from animal signals to human signs.' }} />

      {/* ── Q7 ── */}
      <H2 id="stakes">&ldquo;Isn&rsquo;t this all a bit convenient for your theory?&rdquo;</H2>
      <P>
        Run the logic backwards and check each link. If human language is
        qualitatively different (the science above), then it cannot have phased in
        (the convention paradox), so its origin was an event. An event of{' '}
        <em>this</em> kind — a group, a shared object, mutual attention, a gesture
        that renounces instead of grabs — is the minimal reconstruction of what that
        event had to contain. That is the entire originary hypothesis. It is not an
        add-on to the difference between animals and humans; it is what the
        difference, taken seriously, costs:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-166', text: 'The point of the originary hypothesis is not to present a particular scenario for the origin of language, but to propose the necessity of a public scene of origin, of an event that originates the function of human language to memorialize events.' }} />
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'the-origin-of-language', text: 'In reading this book, a good place to begin would be to give the question, “why are there sentences, rather than signals?,” the weight that has been given to Heidegger’s famous question, “why is there something rather than nothing?' }} />
      <P>
        And if you still think the difference is a matter of degree, the archive
        leaves you with a test you can run on yourself, from Katz: when you tell
        someone you see the same thing they do — what exactly makes it{' '}
        <em>the same</em>, and for whom? &ldquo;Can any of this pertain to anything
        any other species does?&rdquo;
      </P>

      {/* Further viewing + onward */}
      <section className="mt-12">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Further viewing</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <VideoCard videoId="KrN1KmNQUYc" title="Michael Tomasello — The Origins of Human Collaboration" caption="Full lecture: shared intentionality as the human difference." />
          <VideoCard videoId="OT-zZ0PMqgI" title="Terrence Deacon — Language and Complexity: Evolution Inside Out" caption="Deacon on the symbolic threshold, at UBC." />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 p-5">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Where to go from here</p>
        <ul className="space-y-2 text-sm">
          <li><Link href="/the-center-of-everything" className="text-blue-600 dark:text-blue-400 hover:underline">The Center of Everything</Link> <span className="text-gray-500 dark:text-gray-400">— the playful full introduction, stick figures included.</span></li>
          <li><Link href="/lineage" className="text-blue-600 dark:text-blue-400 hover:underline">The Lineage: Girard → Gans → Katz</Link> <span className="text-gray-500 dark:text-gray-400">— where the hypothesis comes from, in the authors&rsquo; own words.</span></li>
          <li><Link href="/post/the-origin-of-language" className="text-blue-600 dark:text-blue-400 hover:underline">Gans, The Origin of Language</Link> <span className="text-gray-500 dark:text-gray-400">— the source text, complete, with Katz&rsquo;s introduction.</span></li>
          <li><Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">The FAQ</Link> <span className="text-gray-500 dark:text-gray-400">— falsifiability, &ldquo;just-so story,&rdquo; and the other standing objections.</span></li>
          <li><Link href="/ask" className="text-blue-600 dark:text-blue-400 hover:underline">Ask AI</Link> <span className="text-gray-500 dark:text-gray-400">— put your own objection to the corpus.</span></li>
        </ul>
      </section>
    </main>
  );
}
