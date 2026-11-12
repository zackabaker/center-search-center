import type { Metadata } from 'next';
import Link from 'next/link';
import BeginClient from './BeginClient';
import TermLink from '@/components/TermLink';

// Dotted concept links in the intro — same style and hover-card behavior as
// term links inside posts (PostContent).
const TERM_CLASS =
  'underline decoration-dotted decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-400 transition-colors';

// /begin — the engaging introduction. The page explains what the originary
// hypothesis is and what it can do ENTIRELY in verbatim passages from the
// archive (deep-linked into their posts); the only AI involvement is the
// reading-path generator below, which is labeled and selects — never writes —
// excerpts. Every string in PASSAGES is an exact substring of the corpus
// (verified against posts-cache.json when authored).

export const metadata: Metadata = {
  title: 'Getting Started',
  description:
    'An introduction to Center Study in the archive’s own words: what the originary hypothesis is, what it can do — and a personal reading path into 1,900+ texts.',
};

interface Passage {
  text: string;
  slug: string;
  title: string;
  attribution: string; // e.g. 'GABlog, 2017'
  q: string;           // distinctive phrase for the ?q= highlight deep link
}

const WHAT_IT_IS: Passage[] = [
  {
    text: 'Now, as all start to rush to the center, the animal hierarchy is abolished. What takes its place, according to the originary hypothesis, is the sign—what Gans calls the “aborted gesture of appropriation.” Think about traditional gestures of greeting, like hand shaking—it’s a way for each side to show it is not holding any weapons. Stretching out your hand with a weapon in it would signal violence; here, the same physical gesture is converted into a renunciation of violence. Think, for that matter, of a threatening gesture (which I doubt anyone does any more), like shaking your fist at someone—by demonstratively withholding the act of violence, you actually provide a space of peace, even if coupled with a warning.',
    slug: 'mimetic-theory-and-high-low-v-the-middle',
    title: 'Mimetic Theory and High-Low v the Middle',
    attribution: 'GABlog, 2017',
    q: 'aborted gesture of appropriation',
  },
  {
    text: 'The originary hypothesis proposes a single human origin, which we can sketch out as universally shared human characteristics: there is always mimesis and therefore rivalry, and therefore the possibility or reality of mimetic crisis, and, finally, therefore, signification as the deferral of the violence consequent upon that crisis.',
    slug: 'anthropomorphics-and-reaction',
    title: 'Anthropomorphics and Reaction',
    attribution: 'GABlog, 2016',
    q: 'a single human origin',
  },
  {
    text: 'The originary hypothesis is a genuine hypothesis on how language emerged out of non-language, and therefore how humans emerged out of pre-humans—this empirical dimension, while making an unfalsifiable claim (we could obviously never obtain evidence of the event in which language was invented/discovered), is to be taken literally and seriously—but we can also see it as an answer to a very basic, inevitable question—why do words “mean”?',
    slug: 'language-the-deepest-and-most-reliable-tradition',
    title: 'Language, the Deepest and Most Reliable Tradition',
    attribution: 'GABlog, 2017',
    q: 'how language emerged out of non-language',
  },
];

const WHAT_IT_CAN_DO: Passage[] = [
  {
    text: 'To offer such guidance, which is to say, to found a research program that can diagnose the current global situation and offer remedies anyone could imagine oneself contributing to, we would need the following: first of all, a set of defensible anthropological assumptions, or an answer to the question, what is the human?; a transdisciplinary approach not bound to the limited and arbitrary lenses of sociology, economics, psychology, and so on; the capacity to scale up and down as needed, that is, to analyze geo-political fractures as effectively as and consistently with individual desires; an openness to a range of different theoretical approaches that nevertheless share a similar starting point, so that increasingly large scale collaboration is possible; ways of analyzing historical transformations that lend themselves to proposing ways of intervening in those transformations.',
    slug: 'the-prospects-of-the-hypothesis',
    title: 'The Prospects of the Hypothesis',
    attribution: 'Bouvard Substack, 2021',
    q: 'diagnose the current global situation',
  },
  {
    text: 'What this leaves us as a research program is no less than all of human self-knowledge. Far from exhausting the universe of humanistic study, originary thinking calls us to a reinterpretation of the totality of our metaphysical heritage.',
    slug: 'clr-210',
    title: 'Is GA Too Perfect?',
    attribution: 'Eric Gans, Chronicles of Love & Resentment, 2000',
    q: 'all of human self-knowledge',
  },
];

function PassageBlock({ p }: { p: Passage }) {
  return (
    <figure className="border-l-2 border-gray-300 dark:border-gray-600 pl-5 sm:pl-6">
      <blockquote className="font-serif text-[17px] leading-[1.8] text-gray-800 dark:text-gray-200">
        {p.text}
      </blockquote>
      <figcaption className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {'— '}
        <Link
          href={`/post/${p.slug}?q=${encodeURIComponent(p.q)}`}
          className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
        >
          {p.title}
        </Link>
        <span className="ml-2 text-gray-400 dark:text-gray-500">{p.attribution}</span>
      </figcaption>
    </figure>
  );
}

export default function BeginPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Getting Started
        </h1>
        {/* Owner-authored intro (2026-11-11, final), woven with verbatim archive
            sentences — the quoted, linked clauses are exact corpus substrings
            (verified against posts-cache.json). Edit only on his direction. */}
        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
          <p>
            Center Study branches off from Rene Girard&rsquo;s{' '}
            <Link href="/lineage" className={TERM_CLASS} title="The Lineage">Mimetic Theory</Link>
            {' '}and Eric Gans&rsquo;{' '}
            <Link href="/generative-anthropology" className={TERM_CLASS} title="Generative Anthropology">Generative Anthropology</Link>
            {' '}to found a new discipline grounded in the{' '}
            <TermLink href="/guide/concepts/originary-scene" defKey="g:originary-hypothesis" className={TERM_CLASS} title="Concept: originary scene">originary hypothesis</TermLink>
            : the hypothetical origin of humanity in the{' '}
            <TermLink href="/guide/concepts/deferral" defKey="c:deferral" className={TERM_CLASS} title="Concept: deferral">deferral</TermLink>
            {' '}of violence via representation (language) &mdash; which is also
            the origin of the human and{' '}
            <TermLink href="/guide/concepts/the-sacred" defKey="c:the-sacred" className={TERM_CLASS} title="Concept: the sacred">the sacred</TermLink>.
            {' '}Language originates in a gesture, issued in the midst of a{' '}
            <TermLink href="/guide/concepts/mimesis" defKey="g:mimetic-crisis" className={TERM_CLASS} title="Concept: mimesis">mimetic crisis</TermLink>
            {' '}in which an entire group of hominids converges on a
            single object, breaking down the pecking order that limits violence
            in animal groups. This gesture &mdash; a{' '}
            <TermLink href="/guide/concepts/originary-scene" defKey="g:aborted-gesture-of-appropriation" className={TERM_CLASS} title="Concept: originary scene">gesture of aborted appropriation</TermLink>
            , grasping converted into pointing &mdash; is{' '}
            <TermLink href="/guide/concepts/the-sign" defKey="c:the-sign" className={TERM_CLASS} title="Concept: the sign">the first sign</TermLink>
            , because it is iterable and has a referent: the first symbol
            that has meaning.
          </p>
          <p>
            Center Study departs from Generative Anthropology by staying focused
            on the enduring centrality of{' '}
            <TermLink href="/guide/concepts/the-center" defKey="c:the-center" className={TERM_CLASS} title="Concept: the center">the center</TermLink>
            {' '}to any form of human
            organization or sociality. The center is first a{' '}
            <TermLink href="/guide/concepts/ritual" defKey="c:ritual" className={TERM_CLASS} title="Concept: ritual">ritual</TermLink>
            , sacrificial
            center, a site of exchange with the animal consumed and deified by
            the group; it is eventually seized by a human &mdash; what
            anthropologists call the &ldquo;
            <TermLink href="/guide/concepts/big-man" defKey="c:big-man" className={TERM_CLASS} title="Concept: the Big Man">Big Man</TermLink>
            ,&rdquo; then chiefs, sacred
            kings, emperors, and the state. Center study follows this thread, and
            reads the social order as an effect of the engagement between
            periphery and center.
          </p>
          <p>
            Center Study is a source of not just hypotheses but of companies that
            sit on the boundary between the capitalist, even ultra-capitalist,
            and the no longer quite capitalist order: betting,{' '}
            <TermLink href="/guide/concepts/market" defKey="c:market" className={TERM_CLASS} title="Concept: the market">prediction markets</TermLink>
            , employment agencies, new currencies, investment inquiries
            &mdash; but also a space where well-being, learning and inquiry are
            ends in themselves. It insists on building a new vocabulary of
            thinking from the bottom up, resisting familiar phrases and reworking
            everything in terms of{' '}
            <TermLink href="/guide/concepts/center-study" defKey="c:center-study" className={TERM_CLASS} title="Concept: center study">center study fundamentals</TermLink>
            . Politically, this
            involves a critique of political theories that start from the
            &ldquo;bottom&rdquo; (the free subject, the people, etc.), insisting
            on starting from the center, from where authority and an originary
            distribution are assumed to have taken place and set the terms for
            future distributions and exchanges.
          </p>
        </div>
      </header>

      <section id="generate" className="mb-12 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
          Generate a Reading Path
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto text-center mb-6">
          Select your interests and, if you want, describe your background. The
          site assembles a reading path &mdash; five to seven texts in order, each
          opened by a verbatim passage &mdash; and saves it at a link you can
          return to.
        </p>
        <BeginClient />
      </section>

      <section className="mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          What the originary hypothesis is
        </h2>
        <div className="space-y-8">
          {WHAT_IT_IS.map((p) => <PassageBlock key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">
          What it can do
        </h2>
        <div className="space-y-8">
          {WHAT_IT_CAN_DO.map((p) => <PassageBlock key={p.slug} p={p} />)}
        </div>
      </section>

      <section className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        Other ways in:{' '}
        <Link href="/intro-center-study-zack-baker" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">the Avalon introduction</Link>{' '}
        (a talk, with slides),{' '}
        <Link href="/start" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">the guided start</Link>,{' '}
        the curated{' '}
        <Link href="/guide/reading-paths" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">reading paths</Link>,{' '}
        and the{' '}
        <Link href="/guide" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">guide</Link>.
      </section>
    </main>
  );
}
