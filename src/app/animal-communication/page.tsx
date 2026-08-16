import Link from 'next/link';
import type { Metadata } from 'next';
import SceneMark from '@/components/SceneMark';
import VideoCard from '@/components/VideoCard';

export const metadata: Metadata = {
  title: 'Don’t animals talk too? — the difference, for skeptics',
  description:
    'The case that human language differs in kind from animal communication, argued entirely from outside sources — the vervet studies, the ape-language experiments, Deacon, Tomasello, Lévi-Strauss — and what follows from it.',
  alternates: { canonical: 'https://center.study/animal-communication' },
};

// Verbatim quotes. Corpus quotes (kind 'katz' | 'gans' | 'other') are
// script-verified against the archive and appear ONLY in the closing
// sections, where GA is the subject rather than the authority — the evidence
// sections stand entirely on external sources. Amber marks Katz's verbatim
// words; everything else takes the gray treatment.

type Q = {
  kind: 'katz' | 'gans' | 'other' | 'ext';
  text: string;
  author: string;
  slug?: string;
  cite?: string;
  url?: string;
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
          communication system. One rule governs this page: the evidence never
          cites the archive. Every claim below stands on primatology, neuroscience,
          and linguistics — the studies, the videos, the primary sources. The
          archive enters only at the end, to collect what follows.
        </p>
      </header>

      <div className="flex items-center gap-3 mb-10">
        <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
      </div>

      {/* ── Q1 ── */}
      <H2 id="degree">&ldquo;Isn&rsquo;t language just more sophisticated animal communication?&rdquo;</H2>
      <P>
        Terrence Deacon — a Berkeley neuroscientist and anthropologist, and no
        partisan of any origin scenario — spent <em>The Symbolic Species</em>{' '}(1997)
        dismantling exactly this assumption. His distinction, in Peirce&rsquo;s
        terms: animal signals are <em>indexical</em>{' '}— learned correlations, the way
        Pavlov&rsquo;s dog learned the bell. Words look like the same thing, a sound
        paired with an object. They are not, and Deacon&rsquo;s test is operational.
        Break the correlation and watch what happens. Stop feeding the dog after the
        bell, and the bell loses its meaning — indexical associations decay when
        the world stops cooperating. Now notice that the word &ldquo;unicorn&rdquo;
        works fine, that &ldquo;dodo&rdquo; did not die with the bird, and that no
        amount of dinner arriving without anyone saying &ldquo;dinner&rdquo; weakens
        the word. Word reference survives broken correlations because it is not held
        in place by the world at all — it is held in place by <em>other words</em>,
        a system of mutual definition. That is why he concludes:
      </P>
      <Quote q={{ kind: 'ext', author: 'Terrence Deacon', cite: 'The Symbolic Species (Norton, 1997), p. 23', url: 'https://en.wikipedia.org/wiki/The_Symbolic_Species', text: 'Biologically, we are just another ape. Mentally, we are a new phylum of organisms.' }} />

      {/* Diagram 1: signal vs sign */}
      <figure className="my-8">
        <svg viewBox="0 0 680 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram contrasting the animal signal (a wired one-way arc from stimulus to reaction) with the human sign (a conventional triangle between two people and an object)" className="w-full h-auto text-gray-700 dark:text-gray-300">
          <line x1="340" y1="16" x2="340" y2="234" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
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
          <text x="170" y="214" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">one direction · wired · decays when the correlation breaks</text>
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
          <text x="510" y="200" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">held in place by convention and other signs, not the world</text>
          <text x="510" y="218" textAnchor="middle" fontSize="11.5" fill="currentColor" opacity="0.6">works for absent, past, imaginary, and extinct referents</text>
        </svg>
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          The signal is a wire; the sign is a system. &ldquo;More sophisticated wire&rdquo; never becomes a system — that&rsquo;s the argument of this page.
        </figcaption>
      </figure>

      <P>
        Two consequences matter for everything below. Because a symbol&rsquo;s
        reference lives in its relations to other symbols, symbols cannot be
        acquired the way associations are — one at a time. And on Deacon&rsquo;s
        reading of the neuroscience, the two systems are housed differently in the
        brain: human symbolic language is not an upgraded call system but a
        different faculty. Hold both points; they return with force at the end.
      </P>

      {/* ── Q2 ── */}
      <H2 id="vervets">&ldquo;But vervet monkeys have words for eagle and leopard.&rdquo;</H2>
      <P>
        The vervet studies are the strongest card the continuity view holds, so play
        it at full strength. In 1980, Seyfarth, Cheney and Marler showed in{' '}
        <em>Science</em>{' '}that vervets give acoustically distinct alarm calls for
        leopards, eagles, and snakes — and that a recorded call played back with no
        predator present sends the troop into the correct evasive action. The calls
        are, as the field came to say, <em>functionally referential</em>. Watch:
      </P>
      <VideoCard
        videoId="q8ZG8Dpc8mM"
        title="Vervet monkey alarm calls — BBC, Talk to the Animals"
        caption="Distinct calls, distinct escapes. The best case for animal 'words' — which is why its limits matter."
      />
      <P>
        Now stay with the researchers, because they did the damage themselves.
        Vervets go on giving leopard alarms <em>after every member of the group has
        seen the leopard</em>{' '}(Cheney &amp; Seyfarth, 1990). Sit with that: a
        speaker who keeps shouting &ldquo;leopard!&rdquo; at people watching the
        leopard is not informing anyone — the call is not <em>for</em>{' '}anyone; it
        fires. The follow-up experiments located the reason. Monkeys do not track
        what their audience knows:
      </P>
      <Quote q={{ kind: 'ext', author: 'Seyfarth & Cheney', cite: 'Annual Review of Psychology 54 (2003)', url: 'https://web-facstaff.sas.upenn.edu/~seyfarth/Publications/', text: 'In sum, a variety of results argue that, in marked contrast to humans, nonhuman primates do not produce vocalizations in response to their perception of another individual’s ignorance.' }} />
      <P>
        A human utterance is aimed at a gap in someone else&rsquo;s knowledge; the
        vervet call is a triggered broadcast, indifferent to whether anyone needs
        it. That is the indexical/symbolic line from the last section, observed in
        the field. And the field itself eventually said so: Wheeler and
        Fischer&rsquo;s 2012 review concluded that &ldquo;functional
        reference&rdquo; had become &ldquo;a red herring&rdquo; in the search for
        language&rsquo;s precursors. The best case for animal words, pressed hard,
        turns into evidence for the difference.
      </P>

      {/* ── Q3 ── */}
      <H2 id="apes">&ldquo;What about the apes who learned sign language?&rdquo;</H2>
      <P>
        Herbert Terrace is the crown witness here, and what makes his testimony
        unanswerable is its direction: he ran Project Nim in order to <em>refute</em>{' '}
        Chomsky — the chimp&rsquo;s name, Nim Chimpsky, was the boast — and every
        incentive he had pointed toward finding language. Nim learned 125 signs and
        produced thousands of multi-sign sequences that looked, in the daily logs,
        like sentences. Then Terrace did the one thing the other projects never did:
        he re-watched the videotapes frame by frame. What the tape showed ends the
        argument, which is why it deserves more than a clause:{' '}
        <strong>Nim&rsquo;s teachers were signing first.</strong>{' '}A fraction of a
        second before each of Nim&rsquo;s &ldquo;spontaneous&rdquo; utterances, his
        teachers — unconsciously, in expectation — were producing the very signs he
        then mirrored back. The &ldquo;sentences&rdquo; were reflections. At normal
        speed, the humans in the room could not see themselves prompting; the
        experiment was measuring its own experimenters. Terrace published the
        reversal in <em>Science</em>{' '}(&ldquo;Can an Ape Create a Sentence?&rdquo;,
        1979), and his data made the point brutally on its own — here is Nim&rsquo;s{' '}
        <em>longest recorded utterance</em>, sixteen signs:
      </P>
      <Quote q={{ kind: 'ext', author: 'Nim Chimpsky', cite: 'Terrace et al., Science 206 (1979), p. 895', url: 'https://pubmed.ncbi.nlm.nih.gov/504995/', text: 'give orange me give eat orange me eat orange give me eat orange give me you' }} />
      <P>
        Sixteen signs, zero syntax, one message: give. More signs never added up to
        a sentence — length grew, structure didn&rsquo;t. Koko the gorilla, the most
        famous case, is scientifically the weakest form of the same story: across
        decades, no controlled data was ever published — Stanford primatologist
        Robert Sapolsky&rsquo;s verdict was &ldquo;no data,&rdquo; just
        &ldquo;several heartwarming films&rdquo; — and Koko&rsquo;s celebrated
        utterances reached the public only through her handler&rsquo;s
        interpretive glosses. An animal exquisitely tuned to an expectant
        handler&rsquo;s cues, and no way from outside to tell performance from
        language: the same structure the Nim tapes exposed, minus the tapes.
        Terrace&rsquo;s summary of the whole generation — Washoe and Koko included —
        was that the apes &ldquo;only learned to use imperatives that were
        involuntary demands for primary rewards.&rdquo; In his own blunter phrase:
        Nim &ldquo;learned how to beg.&rdquo;
      </P>
      <VideoCard
        videoId="IHoviCO7lpE"
        title="Project Nim (2011) — official trailer"
        caption="James Marsh's documentary, built from the project's own 1970s footage."
      />

      {/* ── Q4 ── */}
      <H2 id="kanzi">&ldquo;Kanzi, though. Kanzi understood spoken English.&rdquo;</H2>
      <P>
        Kanzi the bonobo is the honest hard case, and he survives the Nim critique:
        in the landmark 1993 study he carried out novel spoken requests
        (&ldquo;put the pine needles in the refrigerator&rdquo;) about as well as a
        two-year-old child — many delivered from behind a mask, so no cueing. That
        is real comprehension of arbitrary vocabulary, the best any nonhuman has
        shown. Watch it before reading on:
      </P>
      <VideoCard
        videoId="2Dhc2zePJFE"
        title="Kanzi and novel sentences — Great Ape Trust footage"
        caption="The strongest pro-ape data there is."
      />
      <P>
        Then look at where it stops, because the boundary is precise. Reanalyzing
        the same 1993 data, the linguist Robert Truswell found Kanzi at{' '}
        <em>chance</em>{' '}exactly where sentence structure has to do the work: asked
        to &ldquo;fetch the toy <em>and</em>{' '}the water,&rdquo; he brings the toy,
        the water, or both — at random. He hears words; the grammar connecting them
        never arrives. Production tells the same story: across the systematic
        studies of language-trained apes, 96–98% of everything they produce is a
        demand (Tomasello &amp; Call, 2019). And after sixty years of these
        projects, linguist Geoffrey Pullum&rsquo;s standing challenge has no
        counterexample: &ldquo;I do not believe that there has ever been an example
        anywhere of a nonhuman expressing an opinion, or asking a question. Not
        ever.&rdquo; A creature that can fetch the pine needles but cannot ask, tell,
        or wonder aloud is not partway up a slope to language. It is at the top of a
        different hill.
      </P>

      {/* ── Q5 ── */}
      <H2 id="attention">&ldquo;So what exactly is missing?&rdquo;</H2>
      <P>
        There is a precise answer, and a child demonstrates it every day. Attention
        comes in orders. First order: <em>I see X</em>{' '}— plain directed attention;
        nearly everything with eyes has it. Second order: <em>I see you see X</em>{' '}—
        tracking another&rsquo;s attention; social animals have it, and it is enough
        for hunting, stalking, and pecking orders. Third order: <em>I see you see
        me see X</em>{' '}— attention to shared attention, mutually acknowledged. The
        entire difference documented above lives on that last step.
      </P>

      {/* Diagram 2: three orders of attention */}
      <figure className="my-8">
        <svg viewBox="0 0 680 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three panels showing first-order attention (one gaze at an object), second-order (watching another's gaze), and third-order (two people mutually aware of jointly attending to a central object)" className="w-full h-auto text-gray-700 dark:text-gray-300">
          <line x1="227" y1="16" x2="227" y2="212" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="453" y1="16" x2="453" y2="212" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
          <text x="113" y="32" textAnchor="middle" fontSize="12" fontFamily="var(--font-geist-mono, monospace)" fill="currentColor" opacity="0.55" letterSpacing="1">1ST ORDER</text>
          <circle cx="60" cy="120" r="13" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <g stroke="currentColor" strokeWidth="2" fill="currentColor">
            <line x1="78" y1="118" x2="150" y2="112" />
            <polygon points="150,112 140,108 141,118" />
          </g>
          <circle cx="170" cy="110" r="10" fill="currentColor" opacity="0.35" />
          <text x="113" y="185" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.7">I see X</text>
          <text x="113" y="203" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.5">anything with eyes</text>
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
          <text x="566" y="203" textAnchor="middle" fontSize="10.5" fill="currentColor" opacity="0.5">humans only — where words become possible</text>
        </svg>
        <figcaption className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Convention needs the third panel: a sign means something only when each party knows the other takes it the same way — attention to shared attention.
        </figcaption>
      </figure>

      <P>
        The decisive experiments are Michael Tomasello&rsquo;s, from three decades
        of side-by-side child and ape studies at the Max Planck Institute. At
        around nine months — his phrase is &ldquo;the nine-month revolution&rdquo; —
        human infants begin following gaze, checking back, and, around the first
        birthday, <em>before language</em>, pointing. Not only to get things: to{' '}
        <em>show</em>{' '}them. In the classic experiment, a twelve-month-old points; if
        the adult just looks at the object, or just smiles at the child, the infant
        persists, unsatisfied — satisfied only when the adult looks <em>and</em>{' '}
        shares the moment back. The infant is not requesting; it is checking that
        the two of them are attending together. Apes, in thirty years of gesture
        research, never take this step:
      </P>
      <Quote q={{ kind: 'ext', author: 'Michael Tomasello', cite: 'Origins of Human Communication (MIT Press, 2008), p. 38', url: 'https://mitpress.mit.edu/9780262515207/origins-of-human-communication/', text: 'But at the same time it is critically important to note that no apes in any kind of environment produce, either for other apes or for humans, acts of pointing declaratively, simply to share attention and interest with others.' }} />
      <P>
        Captive apes do point — imperatively, at food, for humans. Never for each
        other, and never to share. The published version of Tomasello&rsquo;s
        much-quoted remark about chimpanzees carrying a log together puts it at the
        species level: collaboration on a genuinely joint intention is
        &ldquo;almost unimaginable&rdquo; between chimps. The same line explains
        Hockett&rsquo;s classic finding that <em>displacement</em>{' '}— talking about
        the absent, the past, the hypothetical — is essentially unique to human
        language: you can only talk about what isn&rsquo;t there with someone you
        can jointly attend with about what isn&rsquo;t there. (The honeybee waggle
        dance, the textbook near-exception, encodes exactly one displaced fact —
        the last food source — in an innate, continuous code that cannot negate,
        ask, or say anything else.) A fourteen-month-old sails past all of it:
      </P>
      <VideoCard
        videoId="Z-eU5xZW7cU"
        title="Warneken & Tomasello — spontaneous helping in toddlers (and chimps)"
        caption="Shared intentionality in the flesh: toddlers helping an unfamiliar adult, unprompted and unrewarded — behavior with no ape equivalent."
      />

      {/* ── Q6 ── */}
      <H2 id="event">&ldquo;Fine — a real difference. Why would it need an origin event?&rdquo;</H2>
      <P>
        Everything above is other people&rsquo;s science. Here is the step that
        leads to this archive. A sign is a convention: it means something only
        because everyone party to it takes it to mean that. So ask the gradualist
        question honestly — what would <em>half</em>{' '}a convention be? A signal that
        only some understand as a sign is not a weak sign; it is a strange gesture.
        Claude Lévi-Strauss — no friend of origin stories — saw the consequence in
        1950:
      </P>
      <Quote q={{ kind: 'ext', author: 'Claude Lévi-Strauss', cite: 'Introduction to the Work of Marcel Mauss (1950, trans. Baker)', url: 'https://en.wikipedia.org/wiki/Introduction_to_the_Work_of_Marcel_Mauss', text: 'Whatever may have been the moment and the circumstances of its appearance in the ascent of animal life, language can only have arisen all at once. Things cannot have begun to signify gradually.' }} />
      <P>
        And here is the convergence worth the whole page: Deacon reaches the same
        structure from the learning side, with no stake in the conclusion. Because a
        symbol&rsquo;s reference depends on the system of other symbols, he argues,
        &ldquo;symbols cannot be acquired one at a time, the way other learned
        associations can&rdquo; — crossing the symbolic threshold is &ldquo;a
        restructuring event&rdquo; that &ldquo;essentially takes no time.&rdquo; The
        structuralist and the neuroscientist, from opposite ends, both find that
        signifying has no gradual on-ramp. The archive&rsquo;s texts draw the
        conclusion:
      </P>
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'event-origin-center', text: 'What would “part” of a “meaningful” sign be? How would it not already be meaningful? In any gradual emergence of the sign as meaningful, how could there not be a threshold under which it has no meaning and above which it does?' }} />
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-768', text: 'Language could not have emerged gradually and imperceptibly through the accretion of small improvements. Each use of language is an  event , and language could only have emerged in an  event .' }} />
      <P>
        Two honest fine-prints. This is not a denial of development — &ldquo;there
        is gradualism and gradualism,&rdquo; Gans writes; what is excluded is not
        stages but a phase-in of meaning itself. And it is not a one-place dogma:
        Gans allows the sign may have been invented &ldquo;in more than one
        place&rdquo; — &ldquo;the originary hypothesis refers to the causality of
        the event, not to its uniqueness.&rdquo; What cannot be given up is the
        event-form: somewhere a first sign was issued and <em>taken up
        together</em>, because a sign nobody else takes up is not a sign.
      </P>

      {/* ── Q7 ── */}
      <H2 id="stakes">&ldquo;And this is where your originary scene comes in.&rdquo;</H2>
      <P>
        Now run the chain: the difference is qualitative (the science), so meaning
        cannot have phased in (the logic), so its origin was an event — and an
        event with specific required contents: more than one participant, a shared
        object of attention, and a gesture whose whole force is that everyone takes
        it up together. The originary hypothesis is the minimal reconstruction of
        an event with exactly those contents. It is not an ornament added to the
        human/animal difference; it is the bill the difference presents:
      </P>
      <Quote q={{ kind: 'gans', author: 'Eric Gans', slug: 'clr-166', text: 'The point of the originary hypothesis is not to present a particular scenario for the origin of language, but to propose the necessity of a public scene of origin, of an event that originates the function of human language to memorialize events.' }} />
      <Quote q={{ kind: 'katz', author: 'Adam Katz', slug: 'the-origin-of-language', text: 'In reading this book, a good place to begin would be to give the question, “why are there sentences, rather than signals?,” the weight that has been given to Heidegger’s famous question, “why is there something rather than nothing?' }} />
      <P>
        And if you still suspect the difference is one of degree, there is a test
        you can run on yourself, from Katz: tell someone you see the same thing
        they do — then say what exactly makes it <em>the same</em>, and for whom.
        &ldquo;Can any of this pertain to anything any other species does?&rdquo;
      </P>

      {/* Further viewing + onward */}
      <section className="mt-12">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Further viewing</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <VideoCard videoId="KrN1KmNQUYc" title="Michael Tomasello — The Origins of Human Collaboration" caption="Full lecture: shared intentionality as the human difference." />
          <VideoCard videoId="OT-zZ0PMqgI" title="Terrence Deacon — Language and Complexity: Evolution Inside Out" caption="Deacon on the symbolic threshold." />
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 p-5">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Where to go from here</p>
        <ul className="space-y-2 text-sm">
          <li><Link href="/the-center-of-everything" className="text-blue-600 dark:text-blue-400 hover:underline">The Center of Everything</Link>{' '}<span className="text-gray-500 dark:text-gray-400">— the playful full introduction, stick figures included.</span></li>
          <li><Link href="/lineage" className="text-blue-600 dark:text-blue-400 hover:underline">The Lineage: Girard → Gans → Katz</Link>{' '}<span className="text-gray-500 dark:text-gray-400">— where the hypothesis comes from, in the authors&rsquo; own words.</span></li>
          <li><Link href="/post/the-origin-of-language" className="text-blue-600 dark:text-blue-400 hover:underline">Gans, The Origin of Language</Link>{' '}<span className="text-gray-500 dark:text-gray-400">— the source text, complete, with Katz&rsquo;s introduction.</span></li>
          <li><Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">The FAQ</Link>{' '}<span className="text-gray-500 dark:text-gray-400">— falsifiability, &ldquo;just-so story,&rdquo; and the other standing objections.</span></li>
          <li><Link href="/ask" className="text-blue-600 dark:text-blue-400 hover:underline">Ask AI</Link>{' '}<span className="text-gray-500 dark:text-gray-400">— put your own objection to the corpus.</span></li>
        </ul>
      </section>
    </main>
  );
}
