import Link from 'next/link';
import type { Metadata } from 'next';
import { CONCEPTS } from '@/data/guide/concepts';
import { READING_PATHS } from '@/data/guide/reading-paths';
import ClickableTerm from '@/components/ClickableTerm';

export const metadata: Metadata = {
  title: 'Introduction to Center Study',
  description: 'A comprehensive, hyperlinked guide to the concepts, reading paths, and intellectual architecture of Center Study — drawn from the complete archive.',
};

export default function GuidePage() {
  const coreConceptSlugs = ['the-center', 'originary-scene', 'deferral', 'ostensive-imperative-declarative', 'the-sacred'];
  const coreConcepts = coreConceptSlugs.map((s) => CONCEPTS.find((c) => c.slug === s)!).filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16">

      <header className="mb-16">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
          Layer I · Entry Point · Ostensive
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-6">
          Introduction to Center Study
        </h1>
        <div className="max-w-none space-y-5 text-gray-900 dark:text-gray-100 leading-relaxed">
          <p className="text-lg">
            <strong>This.</strong> A group of beings converge on an object. Each reaches for it. Each perceives the others reaching. The gesture aborts. The aborted gesture, emitted to all and received from all as the same sign, is the first sign: <em>this</em>. The scene that produced it is the <ClickableTerm>originary scene</ClickableTerm>. The binding force that made the sign work for everyone simultaneously is the <ClickableTerm>sacred</ClickableTerm>. The object that organized the scene is the <ClickableTerm>center</ClickableTerm>. Every name can only be a commemoration of some deferred violence. Every word is the Name of God.
          </p>
          <p>
            The originary hypothesis repels the kind of initiatory revelatory &ldquo;download&rdquo; that is nevertheless the only way of understanding it. It is not a theory to be evaluated from outside — it is a disciplinary practice that you either enter or do not. Originary thinking does not just offer another perspective but requires one to rethink entire fields from the beginning. What it offers in return is the <em>miraculization of the world</em>: the very existence of the human is a miracle, constantly renewed, always on trial; institutions, names, words, each and every human practice is illuminated by the originary aura of the yet-to-be-hypothesized event that allowed for its inauguration against the odds.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4 pb-1">The Primary Axes</h2>

          <p>
            <strong><ClickableTerm query="What is the center-periphery distinction in Center Study? How does it structure human scenes, institutions, and attention?">Center / periphery.</ClickableTerm></strong>{' '}Every human scene has a center; every participant is on the periphery until they occupy it. The <ClickableTerm>center</ClickableTerm> is not a place but a function — whatever focuses collective <ClickableTerm>attention</ClickableTerm> and defers the violence of competing appropriation. Institutions, sovereign figures, sacred objects, algorithms, and market prices all function as centers in this sense.
          </p>
          <p>
            <strong><ClickableTerm query="What are the four forms of language in Center Study — ostensive, imperative, interrogative, declarative — and how are they derived from the originary scene?">Ostensive / imperative / interrogative / declarative.</ClickableTerm></strong>{' '}The four forms of language, in originary order — and getting the order right changes everything. The originary sign is <ClickableTerm query="What is the ostensive sign in Center Study? How does it emerge from the originary scene?">ostensive</ClickableTerm>: <em>this</em>, pointing to the central object. The <ClickableTerm query="What is the imperative in Center Study and how is it derived from the ostensive?">imperative</ClickableTerm> emerges when the sign is issued in the absence of its object: <em>bring this</em>. When the imperative cannot be enforced — when compliance is uncertain and yet the scene has not collapsed — the imperative prolongs and softens into an <ClickableTerm query="What is the interrogative in Center Study? How does it function as a transition between imperative and declarative? What is interrogative imperativity?">interrogative</ClickableTerm>: <em>will you?</em> — opening a space of choice for the one addressed. The <ClickableTerm query="What is the declarative in Center Study and how does it emerge from the impasse of the imperative and interrogative?">declarative</ClickableTerm> emerges from this impasse: a sentence that can be true or false, that predicates something of a subject, that survives the absence of both speaker and referent. The interrogative is not merely a grammatical form; it is the hinge between command and statement, between presence and representation — and in post-sacrificial orders, it becomes the primary mode of genuine inquiry.
          </p>
          <p>
            <strong><ClickableTerm query="What is deferral in Center Study? How does language defer violence and what happens when deferral fails?">Deferral / violence.</ClickableTerm></strong>{' '}Language <ClickableTerm query="What is deferral in Center Study? How does language defer violence and what happens when deferral fails?">defers</ClickableTerm> violence. All institutions — legal, economic, religious, political — are modes of <ClickableTerm>deferral</ClickableTerm>. When deferral succeeds, culture accumulates. When it fails, violence returns to reset the scene. The question is never whether deferral will be required but what form it will take and whose center it will reproduce.
          </p>
          <p>
            <strong><ClickableTerm query="What is the sacred in Center Study? How does Katz distinguish between sacrality and significance, between object and sign?">The sacred and the sign.</ClickableTerm></strong>{' '}The <ClickableTerm>sacred</ClickableTerm> is not a theological or metaphysical category — it is a functional one. The sacred is what makes a sign bind all participants on a scene simultaneously; it is the minimal <ClickableTerm query="What is transcendence in Center Study? How does it relate to the sacred and the originary sign?">transcendence</ClickableTerm> inhering in any shared reference. Sacrality attaches to the <em>object</em> at the center of the scene; significance attaches to the <em><ClickableTerm>sign</ClickableTerm></em>. The question is not sacred versus secular — that distinction is derived and unstable — but how sacrality persists, migrates, or attenuates as institutional forms evolve from ritual into law, into money, into code.
          </p>
          <p>
            <strong><ClickableTerm query="What is nomos in Center Study? How does it relate to succession and the perpetuation of the center?">Nomos / succession.</ClickableTerm></strong>{' '}The originary distribution and its perpetuation. How the center passes is how the center is. Every political order is fundamentally an answer to the question of <ClickableTerm query="What is succession in Center Study? How does singularized succession in perpetuity relate to sovereignty and leadership?">succession</ClickableTerm> — who commands the center when the one who held it is gone? The question of a successor is built into any practice; the question of who can designate one is built into any institution. Succession anxiety is the engine of political history.
          </p>
          <p>
            <strong><ClickableTerm query="What is the Center Study theory of debt and credit? How does money function as debt to the center? What does 'there is no economy but only the debt to the center' mean?">Debt / credit.</ClickableTerm></strong>{' '}The primary economic relation is not exchange but obligation. The first exchange is with the <ClickableTerm>center</ClickableTerm> that constituted you as social — the sacrifice, the tribute, the tax, the price. <ClickableTerm query="What is the Center Study theory of money? How does money function as a credit drawn on the sacred? What is 'there is no economy but only the debt to the center'?">Money</ClickableTerm> is the concrete realization of the sign of recognition: a credit drawn on the sacred that cannot be freely reproduced. There is no economy but only the <ClickableTerm query="What is the Center Study theory of debt to the center? How does this frame economic relations, currency, and financial instruments?">debt to the center</ClickableTerm>. Money is <ClickableTerm query="How does Center Study use metonymy to describe money and economic relations?">metonymy</ClickableTerm>: a means to sequence debt denomination and discharge across time and space, extending the indebtedness of a community differentially and asymmetrically among its members. <ClickableTerm query="How does Center Study analyze currency, credit markets, and financial instruments as modes of managing debt to the center?">Currency, credit markets, and financial instruments</ClickableTerm> are all attempts to manage this fundamental obligation — and their instabilities are legible as failures of scenic coherence.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4 pb-1">Contemporary Stakes</h2>

          <p>
            The archive is not a relic of academic discourse. Its most sustained engagements are with contemporary forms of power, and what it has to say about them is not available elsewhere.
          </p>
          <p>
            <strong><ClickableTerm query="How does Center Study analyze algorithmic governance, AI, and large language models? What is scenic design without the ritual scene?">Algorithmic governance and AI.</ClickableTerm></strong>{' '}The algorithm is a supplementary medium for the immense distributed archive we call the internet — <ClickableTerm query="What is scenic design in Center Study? How does it relate to power, technology, and the construction of social scenes?">scenic design</ClickableTerm> without the ritual scene. When commands of the center are mediated technologically, subjects become signs of algorithmic paradoxes: predictable yet unreliable, or unpredictable. <ClickableTerm query="How does Center Study analyze large language models and AI? What do LLMs reveal about the limits of the declarative order?">Large language models</ClickableTerm> push this logic further: an attempt to dispense with imperatives and ostensives altogether in favor of a complete declarative model of reality — and in doing so, they discover the limits of the declarative order itself. The question Center Study poses to AI is not whether it is conscious but what center it serves and what violence it defers.
          </p>
          <p>
            <strong><ClickableTerm query="How does Center Study analyze sovereignty, leadership, and succession? What makes leadership work in Center Study terms?">Sovereignty, leadership, and succession.</ClickableTerm></strong>{' '}The archive has a sophisticated theory of what makes <ClickableTerm query="What is the Center Study theory of leadership? How does singularizing succession relate to holding the center?">leadership</ClickableTerm> work — not charisma or policy but the ability to singularize <ClickableTerm>succession</ClickableTerm>: to make the center transferable without violence. <ClickableTerm query="How does Center Study analyze startups and organizations through the lens of succession and center-holding?">Startups</ClickableTerm> fail not because they run out of money but because they cannot answer the succession question. Movements fragment when no one can designate who speaks next. The study of leadership, in Center Study terms, is the study of how centers are constituted, maintained, and passed on.
          </p>
          <p>
            <strong><ClickableTerm query="How does Center Study analyze markets and price as scenic phenomena? What are prediction markets in Center Study terms?">Markets and prediction.</ClickableTerm></strong>{' '}What <ClickableTerm query="What is the Center Study theory of markets? How do markets aggregate ostensives into a shared sign (price)?">markets</ClickableTerm> do, in Center Study terms, is aggregate the distributed ostensives of participants into a <ClickableTerm query="How does price function as a sign in Center Study? What does price discovery mean in originary terms?">price</ClickableTerm> — a shared sign that temporarily resolves competing appropriations. <ClickableTerm query="How does Center Study analyze prediction markets? What is the interrogative function of price discovery?">Prediction markets</ClickableTerm> formalize the interrogative function of price discovery: to make the question <em>will this happen?</em> take on the properties of a scenic sign. The archive treats market coordination not as spontaneous order but as scenic achievement — one that inherits all the fragilities of the scene it depends on, including the fragility of the center it presupposes.
          </p>
          <p>
            <strong><ClickableTerm query="What is the victimary in Center Study? How does resentment generate victimary culture?">Victimary culture.</ClickableTerm></strong>{' '}The archive contains the most sustained analysis of what it calls the <ClickableTerm query="What is the victimary in Center Study? How is it derived from the originary scene and the logic of resentment?">victimary</ClickableTerm> — the post-sacrificial logic by which moral authority is claimed through victim status. <ClickableTerm query="What is resentment in Center Study? How is it structurally generated by the center-periphery configuration?">Resentment</ClickableTerm> is not a pathology; it is structurally generated by the center-periphery configuration. The contemporary culture of grievance, the machinery of cancellation, the weaponization of vulnerability — these are not accidents but outcomes of a specific originary logic playing out at civilizational scale.
          </p>
          <p>
            <strong><ClickableTerm query="How does Center Study analyze nationalism and globalism? What is at stake in the tension between national and global order?">Nationalism and global order.</ClickableTerm></strong>{' '}The tension between the national center and the global order is one of the archive's persistent themes. What is at stake is not culture or identity but the conditions of <ClickableTerm>deferral</ClickableTerm> at scale: can a global order maintain the center-margin configuration that makes shared signs work, without the thick scenic presence of a community? Can <ClickableTerm query="What is sovereignty in Center Study? How does it relate to the center and to succession?">sovereignty</ClickableTerm> be maintained at a level of abstraction where no one can point to the object at the center?
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4 pb-1">The Paradox of Introduction</h2>

          <p>
            There is a paradox here that is not a problem but a method. Center Study holds that there is no <ClickableTerm query="What is the critique of metalanguage in Center Study? Why does Center Study hold that there is no neutral position outside language?">metalanguage</ClickableTerm> — no position outside language from which language can be described neutrally. Any introduction to Center Study is therefore already inside Center Study. This guide cannot stand above its subject and explain it from a neutral vantage. It must teach by exemplifying. It is like a Möbius strip: you begin on the outside and find you are already inside.
          </p>
          <p>
            The entry point is ostensive: <em>this</em>. What follows are imperatives: attend to this concept, follow this reading path, orient toward this archive. At the end, if the guide has done its work, you will be in a position to make declarative claims — to say things about the structure of human experience that you could not have said before. The interrogative is the mode of the reader who has heard the imperative and is not yet sure how to comply: <em>what is this asking of me?</em> That question is where genuine reading begins.
          </p>
          <p>
            Unless you want to treat Center Study as another school of literary criticism that offers another reading of some canonical text, you have to let it dispossess you — it cannot stand alongside anything you think that has not been revisited and revised thoroughly through the hypothesis. This is why established people with a publicly confirmed identity are extremely unlikely to take up with it: you have, it seems, to be on the margins of some field that seems to you in need of refounding.
          </p>
          <p className="text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            &ldquo;The only thing we are ever talking about is how we are going about deferring violence.&rdquo; — Adam Katz, <em>The Linguistic Turn and Generative Literacy</em>
          </p>
        </div>
      </header>

      {/* Navigation to layers */}
      <section className="mb-16">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-6">Navigate the Guide</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              href: '/guide/concepts',
              label: 'Concept Pages',
              layer: 'Layer II · Imperative',
              desc: `${CONCEPTS.length} core concepts — each with originary definition, archive development, and exemplary passages.`,
              color: 'border-blue-200 hover:border-blue-400',
            },
            {
              href: '/guide/reading-paths',
              label: 'Reading Paths',
              layer: 'Layer III · Declarative',
              desc: `${READING_PATHS.length} curated sequences through the archive — ordered, bridged, and contextualized.`,
              color: 'border-green-200 hover:border-green-400',
            },
            {
              href: '/guide/map',
              label: 'Concept Map',
              layer: 'Layer IV · Visual',
              desc: 'Interactive graph of concept dependencies — centered on the originary scene, radiating outward.',
              color: 'border-purple-200 hover:border-purple-400',
            },
          ].map(({ href, label, layer, desc, color }) => (
            <Link
              key={href}
              href={href}
              className={`group block p-5 rounded-xl border-2 ${color} transition-all hover:shadow-sm bg-white dark:bg-gray-900`}
            >
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">{layer}</p>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Core concepts preview */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Five Core Concepts</h2>
          <Link href="/guide/concepts" className="text-xs text-blue-500 hover:underline">All {CONCEPTS.length} concepts →</Link>
        </div>
        <div className="space-y-3">
          {coreConcepts.map((concept) => (
            <Link
              key={concept.slug}
              href={`/guide/concepts/${concept.slug}`}
              className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                  {concept.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{concept.definition}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-blue-400 transition-colors mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Begin reading */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Start Reading</h2>
          <Link href="/guide/reading-paths" className="text-xs text-blue-500 hover:underline">All paths →</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {READING_PATHS.slice(0, 4).map((path) => (
            <Link
              key={path.slug}
              href={`/guide/reading-paths/${path.slug}`}
              className="group block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{path.posture}</span>
                <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                <span className="text-[10px] text-gray-400">{path.posts.length} texts</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1 text-sm">{path.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{path.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ask the archive */}
      <section className="mb-16 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">Go Deeper</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          The archive contains 600+ texts on these topics. Click any underlined term above to ask the archive about it, or start here:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'How does money function as debt to the center?',
            'What is interrogative imperativity?',
            'How does Center Study analyze algorithmic governance and AI?',
            'What is the originary theory of victimary culture?',
          ].map(q => (
            <Link
              key={q}
              href={`/ask?q=${encodeURIComponent(q)}`}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-400 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all bg-white dark:bg-gray-900"
            >
              {q}
            </Link>
          ))}
        </div>
        <Link href="/ask" className="text-sm font-medium text-blue-600 hover:underline">Ask the archive →</Link>
      </section>

      {/* What this guide is not */}
      <section className="border-t border-gray-100 dark:border-gray-800 pt-10">
        <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">What This Guide Is Not</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3 leading-relaxed">
          <p>
            This is not a summary of Center Study. A summary substitutes for the thing it summarizes; this guide is designed to make the thing more accessible, not to replace it. The archive is the thing. This is a map of the archive — and a map that teaches you how to read the territory.
          </p>
          <p>
            This is not a glossary. A glossary defines terms from outside the discourse in which they have meaning. The definitions here are written from inside — they use the concepts they are defining in the way those concepts demand to be used. If the definitions seem to require the concepts they are trying to introduce, that is not a failure of exposition but a feature of the subject matter.
          </p>
          <p>
            This is not neutral. There is no neutral vantage on Center Study. The guide speaks from inside the discourse, with fidelity to the archive, without pretending to evaluate Center Study from a position that would require the very metalanguage Center Study denies.
          </p>
          <p className="text-gray-400">
            Every post in the archive is referenced somewhere in this guide.{' '}
            <Link href="/search" className="text-blue-400 hover:underline">Search the full archive →</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
