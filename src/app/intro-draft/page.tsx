import Link from 'next/link';
import type { Metadata } from 'next';

// DRAFT rewrite of /intro for review — not linked from anywhere.
// Compare against /intro. All quotations verified verbatim against the corpus.

export const metadata: Metadata = {
  title: 'Introduction (draft) | Center Study Center',
  description: 'Draft rewrite of the Center Study introduction.',
  robots: { index: false, follow: false },
};

const PROSE = {
  fontFamily: 'var(--prose-font-family)',
  fontSize: 'var(--prose-font-size, 17px)',
  lineHeight: 'var(--prose-line-height, 1.85)',
} as const;

function Quote({ text, slug, source }: { text: string; slug: string; source: string }) {
  return (
    <blockquote className="my-7 border-l-2 border-gray-300 dark:border-gray-600 pl-5">
      <p className="text-base text-gray-600 dark:text-gray-400 italic leading-relaxed" style={{ fontFamily: 'var(--prose-font-family)' }}>
        &ldquo;{text}&rdquo;
      </p>
      <footer className="mt-2">
        <Link href={`/post/${slug}`} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          — {source}
        </Link>
      </footer>
    </blockquote>
  );
}

function SectionLabel({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 scroll-mt-20">
      {children}
    </h2>
  );
}

export default function IntroDraftPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12 overflow-x-hidden">

      {/* Draft banner */}
      <div className="mb-8 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
        Draft for review — the live introduction is at <Link href="/intro" className="underline">/intro</Link>. Not linked or indexed.
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 mt-4 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>

      {/* Epigraph */}
      <div className="mb-8 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
        <p className="text-base text-gray-500 dark:text-gray-400 italic leading-relaxed" style={{ fontFamily: 'var(--prose-font-family)' }}>
          &ldquo;We are beings bound to the center: everything that we say, think or do is homage to the center.&rdquo;
        </p>
      </div>

      {/* Jump links */}
      <nav className="mb-12 flex flex-wrap gap-2 text-xs">
        {[
          ['#scene', 'Begin on a scene'],
          ['#hypothesis', 'The hypothesis'],
          ['#history', 'The center since'],
          ['#grammar', 'The grammar'],
          ['#lineage', 'Lineage'],
          ['#entry', 'How to enter'],
        ].map(([href, label]) => (
          <a key={href} href={href}
            className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            {label}
          </a>
        ))}
      </nav>

      {/* ── Begin on a scene ─────────────────────────────────────────────── */}
      <section id="scene" className="mb-16 scroll-mt-20">
        <SectionLabel>Begin on a scene</SectionLabel>
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            Put anything at the center of a room and the room reorganizes around it. A microphone, a casket, a birthday cake: the bodies turn, the talk quiets or swells, and everyone present knows, without being told, where the front is. Attention has a shape — many faces, one object — and you are inside that shape right now, one reader holding one more screen at the center of one more scene. Center Study begins from the wager that this shape is not one social fact among others. It is the first social fact, the one the others are made of.
          </p>
          <p>
            Two children, one toy. Each wants it because the other wants it — want feeds on want, which is what <em>mimesis</em>{' '}means — and the grab is already underway when something interrupts: a name called out, a rule remembered, a parent&rsquo;s look. The interruption works because it turns both children toward something that outranks the toy. Every society you can name is a vast machinery of such interruptions, and every interruption borrows its force from some center — a mother&rsquo;s memory, a law, a god — that can be invoked when bodies start converging on the same object. Katz calls this the axiom of the sufficient center: &ldquo;human societies will discover/invent the centers they need in order to generate the command structure necessary to control resentment.&rdquo;
          </p>
          <p>
            Borrowed force has to be borrowed from somewhere. The parent&rsquo;s authority leans on her own mother&rsquo;s, the law leans on the oath, the oath leans on the god, and the chain runs backward until there is nothing earlier left to lean on. At the bottom there must be a scene where the interruption was not borrowed at all — where converging bodies were stopped by nothing but a sign, issued for the first time. The originary hypothesis is the hypothesis of that scene.
          </p>
        </div>
      </section>

      {/* ── The hypothesis ───────────────────────────────────────────────── */}
      <section id="hypothesis" className="mb-16 scroll-mt-20">
        <SectionLabel>The hypothesis</SectionLabel>
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            A group of early humans converges on something all of them want — say, the kill at the end of a hunt. The pecking order that keeps animal groups from tearing themselves apart has stopped working: desire has gone mimetic, each one&rsquo;s reaching intensified by everyone else&rsquo;s, and rank no longer decides anything. Whoever grabs first will be met by all the rest. For a moment no one can move forward and no one is willing to move back. In that suspension, a hand stretched out to seize the object becomes a hand designating it. The gesture aborts, and the aborted gesture is the first sign. It says, as nearly as a first sign can say anything, <em>this</em> — and in saying it, leaves the object where it is.
          </p>
          <p>
            Everyone issues the sign, because everyone is caught in the same position; everyone understands it, because everyone is issuing it. The object, untaken, acquires a charge no object carried before — set apart, untouchable, the first sacred thing. The ring of rivals becomes a ring of sign-users, each equal before the center all have renounced. And when the tension subsides they divide the object and eat it together: the first meal, the first distribution, the first repayment of a debt to the center that every ritual afterward will go on repaying.
          </p>
          <p>
            Language, the sacred, community, equality before the sign, debt, ritual — not six inventions but one event, seen from six sides. This is the originary hypothesis, proposed by Eric Gans in <em>The Origin of Language</em> (1980): language begins not as a tool for labeling the world but as the deferral of a violence that nothing else could any longer defer. The saying replaces the seizing. Fifty years of writing in this tradition is the working-out of how much follows from that replacement.
          </p>
        </div>
        <Quote
          text="All human existence is an exchange with the center. The first message from the center is to defer appropriation."
          slug="gablog-how-does-the-center-speak"
          source="How Does the Center Speak?"
        />
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            Nothing requires the scene to have happened once, cleanly, with everything delivered at a stroke. The forms of language grow out of one another by productive mistake. &ldquo;The first imperative was an inappropriate ostensive: someone named an object without realizing it wasn&rsquo;t there, and another member of the community retrieved it, so as to &lsquo;make good&rsquo; on the sign.&rdquo; A demand is a name that missed, made good by another&rsquo;s act — and, Katz continues, &ldquo;all cultural creation proceeds this way, a little bit sideways as one is sent astray by a mistake, and then forward as a new iterable form is produced.&rdquo; The discipline that studies this is itself such a creation, and proceeds the same way.
          </p>
        </div>
      </section>

      {/* ── The center since ─────────────────────────────────────────────── */}
      <section id="history" className="mb-16 scroll-mt-20">
        <SectionLabel>The center since</SectionLabel>
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            The scene does not stay empty. For most of human existence the center is a ritual center — an altar, an ancestor, a place where the community feeds what founded it — and everyone stands at the same distance from it. Then someone steps in. The Big Man earns the position by giving more than anyone can repay; his authority is personal and lapses the moment his generosity does. The chief inherits what the Big Man earned. The sacred king is the center — fed, guarded, and sometimes consumed by the community that orbits him. The state stretches kingship into law, bureaucracy, and money, where occupying the center becomes a matter of accounts rather than anointment. The modern order goes one step further and produces centers that deny being centers at all: the market, the procedure, the algorithm — each presented as no one in particular, each operated by someone in particular.
          </p>
          <p>
            Center Study is the study of this whole series as one continuous engagement between a center and its periphery. The denial changes nothing structural. Tear a center down and the tearing-down is itself organized around a center — the trial, the square, the feed. What the denial changes is accountability: a center that admits to being one can be addressed, petitioned, reformed, succeeded; a center that claims to be nobody can only be suffered or seized. Hence the diagnostic question the discourse asks of every institution put in front of it, from a coronation to a content-moderation policy: <em>what is the actual center here, and who occupies it, on what terms?</em>
          </p>
        </div>
        <Quote
          text="There is always a center whenever humans are arranged in relation to each other, and the center is always occupied, even if only by a sacred carcass."
          slug="substack-scale"
          source="Scale"
        />
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            The shortest version the archive offers: &ldquo;The center is whatever interferes with violent centralization.&rdquo; Whatever holds the convergence off — that is the center, whether it calls itself one or not. Centers are not optional. Only their occupants are.
          </p>
        </div>
      </section>

      {/* ── The grammar ──────────────────────────────────────────────────── */}
      <section id="grammar" className="mb-16 scroll-mt-20">
        <SectionLabel>The grammar</SectionLabel>
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            If language begins as a gesture toward a present center, then the other things language does must derive from that gesture, and the derivation can be reconstructed. The first sign is <em>ostensive</em>: it points at what is there — <em>this</em>. Issue an ostensive toward what is <em>not</em> there and you have demanded it: the <em>imperative</em> is the name that expects to be made good. When an imperative cannot be obeyed and is not refused, it hangs in the air and becomes a question: the <em>interrogative</em> is a demand that has learned to wait. And the <em>declarative</em> — the sentence, the form this paragraph is written in — answers the demand with what can be given when the thing cannot: a representation. The declarative tells of what is absent, which is why it can carry truth, fiction, theory, and law. It is the latest form, not the first, and it never stops resting on the others.
          </p>
          <p>
            Center Study reads everything through this stack. A courtroom, a price, a liturgy, a user agreement: each is a standing arrangement of ostensives, imperatives, and declaratives — an <em>imperative exchange</em> between center and periphery in which requests go in one direction and assurances come back in the other. And since any analysis is itself made of sentences, the analysis is always on a scene of its own, addressed to some center of its own. There is no standpoint outside. The discourse does not treat this as an embarrassment; it treats it as the first datum.
          </p>
        </div>

        {/* The four forms — quiet grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            ['Ostensive', 'Points to what is present: this. The first form.'],
            ['Imperative', 'The name issued toward what is absent: a demand to be made good.'],
            ['Interrogative', 'The demand that has learned to wait.'],
            ['Declarative', 'Tells of what is absent. The sentence — latest, never first.'],
          ].map(([label, note]) => (
            <div key={label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
              <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lineage ──────────────────────────────────────────────────────── */}
      <section id="lineage" className="mb-16 scroll-mt-20">
        <SectionLabel>Lineage</SectionLabel>
        <div className="space-y-6">
          {[
            {
              initials: 'RG',
              name: 'René Girard',
              meta: 'Mimetic theory · Violence and the Sacred (1972)',
              body: 'Desire is imitated, imitation becomes rivalry, rivalry becomes a violence the group can only discharge together — onto a victim whose expulsion brings a peace so sudden it reads as divine. For Girard the sacred is founded on this murder, remembered and managed in ritual ever after. He pursued mimesis further down than anyone before him, and at the bottom he found a corpse.',
              terms: ['mimesis', 'scapegoat', 'sacrifice'],
            },
            {
              initials: 'EG',
              name: 'Eric Gans',
              meta: 'Generative Anthropology · The Origin of Language (1980) · Chronicles of Love and Resentment (1995–2019)',
              body: 'Gans accepts the mimetic crisis and relocates the founding moment one step earlier: before the first murder there must already be a sign, or there is no community to remember any murder. Where Girard finds a corpse, Gans finds an aborted gesture — deferral, not discharge. From that single revision he derives language, the sacred, and the forms of culture, and writes the derivation out across three decades of Chronicles, all of them in this archive.',
              terms: ['originary scene', 'deferral', 'ostensive'],
            },
            {
              initials: 'AK',
              name: 'Adam Katz',
              meta: 'Center Study · GABlog (~480 posts) · Anthropomorphics · as Dennis Bouvard on Substack (~180 essays)',
              body: 'Katz holds the hypothesis to its largest consequence: the center did not retire after founding us. It persists through every social form — Big Man, king, state, market, algorithm — and a discipline that starts from the originary scene can read them all in one grammar. On GABlog the grammar is built; as Dennis Bouvard, it is put to work on money, AI, governance, and whatever else the present sends. Two names, one writer, one discourse.',
              terms: ['the center', 'succession', 'imperative exchange', 'anthropomorphics'],
            },
          ].map((person) => (
            <div key={person.name} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-sm">
                {person.initials}
              </div>
              <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <p className="font-semibold text-gray-900 dark:text-white">{person.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{person.meta}</p>
                <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'var(--prose-font-family)' }}>
                  {person.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.terms.map((t) => (
                    <Link key={t} href={`/search?q=${encodeURIComponent(t)}`}
                      className="px-2 py-0.5 text-[11px] rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How to enter ─────────────────────────────────────────────────── */}
      <section id="entry" className="mb-12 scroll-mt-20">
        <SectionLabel>How to enter</SectionLabel>
        <div className="space-y-5 text-gray-800 dark:text-gray-200" style={PROSE}>
          <p>
            A warning from inside the archive, which is also the best description of what reading it is like: &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it.&rdquo; There is no summary that substitutes for entry, because the hypothesis does not sit still while you survey it: too literal for the faiths, too foundational for the philosophies — &ldquo;like a perfectly materialist refutation of materialism, the one true faith masquerading as subversive heresy.&rdquo; Every text in the archive assumes the scene and extends it; none of them stands outside it, and after a few of them, neither will you. That is the download happening.
          </p>
          <p>
            So enter where you already are. The discourse claims there is no practice — law, code, medicine, money, teaching, writing — without a center and a grammar of exchanges with it, which means your own practice is already a way in. Name what you work on or what you are stuck on and the archive will meet you there; the vocabulary will resolve as you go, each term a compression of scenes you will by then have seen. Read one text at a time, in order or out of it, and let the alignment come sideways — the way, on this account, everything human has arrived so far.
          </p>
        </div>

        {/* Entry points */}
        <div className="mt-8 mb-5">
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Read this first</p>
          <Link
            href="/post/gablog-the-discourse-of-the-center"
            className="group block p-4 rounded-xl bg-gray-900 dark:bg-white hover:opacity-90 transition-opacity"
          >
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 font-mono uppercase tracking-widest">GABlog · Adam Katz</p>
            <p className="font-semibold text-white dark:text-gray-900 leading-snug">
              The Discourse of the Center
            </p>
            <p className="text-sm text-gray-300 dark:text-gray-600 mt-1 leading-relaxed">
              The opening sentences of this page&rsquo;s epigraph, and the clearest single text on what it means to be bound to the center.
            </p>
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/guide/reading-paths" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Get a reading path</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Name your practice or your question; receive a sequenced way in, saved as you read</p>
          </Link>
          <Link href="/concepts" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Concepts &amp; glossary</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">The vocabulary, defined by its usage in the texts themselves</p>
          </Link>
          <Link href="/ask" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Ask AI</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Put any question to the archive; answers are built from verbatim passages</p>
          </Link>
          <Link href="/browse" className="group block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all bg-white dark:bg-gray-900">
            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Browse the archive</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">1,900+ texts: GABlog, Substack, essays, the book, Chronicles, Anthropoetics</p>
          </Link>
        </div>
      </section>

    </main>
  );
}
