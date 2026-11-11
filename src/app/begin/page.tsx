import type { Metadata } from 'next';
import Link from 'next/link';
import BeginClient from './BeginClient';
import PathOrientation from '@/components/PathOrientation';

// /begin — the engaging introduction. The page explains what the originary
// hypothesis is and what it can do ENTIRELY in verbatim passages from the
// archive (deep-linked into their posts); the only AI involvement is the
// reading-path generator below, which is labeled and selects — never writes —
// excerpts. Every string in PASSAGES is an exact substring of the corpus
// (verified against posts-cache.json when authored).

export const metadata: Metadata = {
  title: 'Begin',
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Begin
        </h1>
        {/* Owner-authored intro (2026-11-11, final), woven with verbatim archive
            sentences — the quoted, linked clauses are exact corpus substrings
            (verified against posts-cache.json). Edit only on his direction. */}
        <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
          <p>
            Center Study branches off from Rene Girard&rsquo;s Mimetic Theory and
            Eric Gans&rsquo; Generative Anthropology to found a new discipline
            grounded in the originary hypothesis: a hypothesis of the origin of
            language, which is also the origin of the human and the sacred.
            &ldquo;
            <Link
              href={`/post/the-modernity-of-absolutism?q=${encodeURIComponent('At the origin of humanity lies representation')}`}
              className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
            >
              At the origin of humanity lies representation as the deferral of violence.
            </Link>
            &rdquo; Language originates in a gesture, issued in the midst of a
            mimetic crisis in which an entire group of hominids converges on a
            single object, breaking down the pecking order that limits violence
            in animal groups. This gesture &mdash; a gesture of aborted
            appropriation, grasping converted into pointing &mdash; is the first
            sign, because it is iterable and has a referent: the first symbol
            that has meaning.
          </p>
          <p>
            Center Study departs from Generative Anthropology by staying focused
            on the enduring centrality of the center to any form of human
            organization or sociality. The center is first a ritual, sacrificial
            center, a site of exchange with the animal consumed and deified by
            the group; it is eventually seized by a human &mdash; what
            anthropologists call the &ldquo;Big Man,&rdquo; then chiefs, sacred
            kings, emperors, and the state. &ldquo;
            <Link
              href={`/post/centering?q=${encodeURIComponent('Any occupation of the center, then, means')}`}
              className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
            >
              Any occupation of the center, then, means absolute power within the space of attention producing that center.
            </Link>
            &rdquo; Center study reads the social order as an effect of the
            engagement between periphery and center &mdash; on the premise that
            &ldquo;
            <Link
              href={`/post/the-scene-is-the-same?q=${encodeURIComponent('the originary scene has never closed')}`}
              className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2"
            >
              the originary scene has never closed
            </Link>
            .&rdquo;
          </p>
          <p>
            Center Study is a source of not just hypotheses but of companies that
            sit on the boundary between the capitalist, even ultra-capitalist,
            and the no longer quite capitalist order: betting, prediction
            markets, employment agencies, new currencies, investment inquiries
            &mdash; but also a space where well-being, learning and inquiry are
            ends in themselves. It insists on building a new vocabulary of
            thinking from the bottom up, resisting familiar phrases and reworking
            everything in terms of center study fundamentals. Politically, this
            involves a critique of political theories that start from the
            &ldquo;bottom&rdquo; (the free subject, the people, etc.), insisting
            on starting from the center, from where authority and an originary
            distribution are assumed to have taken place and set the terms for
            future distributions and exchanges.
          </p>
        </div>
      </header>

      <PathOrientation />

      <form action="/search" method="get" className="mb-10" role="search">
        <label htmlFor="begin-search" className="sr-only">Search the archive</label>
        <div className="flex gap-2">
          <input
            id="begin-search"
            type="search"
            name="q"
            placeholder="Search the archive"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-[15px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-500 dark:focus:border-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-gray-500 dark:hover:border-gray-400 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <section className="mb-12">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-6">
          Select your interests and, if you want, describe your background. The
          site assembles a reading path &mdash; five to seven texts in order, each
          opened by a verbatim passage &mdash; and saves it at a link you can
          return to. No account; nothing personal is asked.
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
        <Link href="/start" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">the guided start</Link>,{' '}
        the curated{' '}
        <Link href="/guide/reading-paths" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">reading paths</Link>,{' '}
        and the{' '}
        <Link href="/guide" className="text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2">guide</Link>.
      </section>
    </main>
  );
}
