import Link from 'next/link';
import DarkModeToggle from '@/components/DarkModeToggle';

export const metadata = {
  title: 'Introduction to Center Study | Center Study Center',
  description:
    'An introduction to Center Study and the originary hypothesis — the transdisciplinary discourse developed by Eric Gans and elaborated by Adam Katz.',
};

export default function IntroPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-6 sm:py-12 overflow-x-hidden">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <DarkModeToggle />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-gray-900 dark:text-white">
        Introduction to Center Study
      </h1>
      <p className="text-sm text-gray-400 dark:text-gray-500 italic mb-10">
        &ldquo;The originary hypothesis repels the kind of initiatory revelatory &lsquo;download&rsquo; that is nevertheless the only way of understanding it.&rdquo;
      </p>

      {/* Section 1: The Paradox */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Paradox at the Start
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            The originary hypothesis repels the kind of initiatory revelatory &ldquo;download&rdquo; that is nevertheless the only way of understanding it. It cannot claim to be an &ldquo;Enlightenment&rdquo; philosophy that stands outside of faith and debunks its pretensions — on the contrary, the implication of the originary hypothesis is that the faiths are truer than philosophy, and it&rsquo;s not even close. Nor can it subordinate itself to faith and justify it paternalistically. So it finds itself in the position of being both closest and furthest from any faith tradition, while remaining completely indigestible to philosophy and philosophy&rsquo;s children, the human sciences. It is like a perfectly materialist refutation of materialism — the one true faith masquerading as subversive heresy.
          </p>
          <p>
            To take on the originary hypothesis, you have to be prepared to be disreputable from all sides: an atheist to believers, a mere speculator to philosophers and scientists. There is, however, a powerful and irrefutable logic to it, as long as you are willing to start with the undeniable fact — attested even by Aristotle — that human beings are especially imitative. If you accept that human beings are mimetic, can you set a limit to imitation? If we are mimetic all the way down, can anyone deny that imitation leads to rivalry? And how could one deny the sheer elegance of the originary hypothesis&rsquo;s solution — a form of imitation, on the boundary between attention and intention, that reverses the trajectory of an appropriative gesture by converting it into one of aborted appropriation?
          </p>
          <p>
            What the originary hypothesis offers is the <em>miraculization of the world</em>: the very existence of the human is a miracle, constantly renewed, always on trial. Institutions, names, words, each and every human practice is illuminated by the originary aura of the yet-to-be-hypothesized event that allowed for its inauguration against the odds.
          </p>
        </div>
      </section>

      {/* Section 2: The Originary Scene */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Originary Scene
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Center Study is the study of human society and culture in the light of the originary hypothesis, formulated by Eric Gans in <em>The Origin of Language</em> (1980; New Edition 2019). The originary hypothesis is a hypothesis about the origin of language — which is also the origin of the human, religion, community, morality, and the sacred.
          </p>
          <p>
            The hypothesis posits that language originates in a gesture, issued in the midst of a mimetic crisis in which the entire group of hominids is converging on a single object, breaking down the pecking order that limits violence in animal groups. This gesture — a gesture of aborted appropriation, or grasping converted into pointing — is the first sign because it is iterable and has a referent. It is &ldquo;symbolic&rdquo; and not merely &ldquo;indexical,&rdquo; to use Charles Sanders Peirce&rsquo;s categories. The aborted gesture, emitted to all and received from all as the same sign, defers the violence that would otherwise have torn the group apart.
          </p>
          <p>
            GA has a small set of invariants — concepts like &ldquo;center,&rdquo; &ldquo;origin,&rdquo; &ldquo;mimesis,&rdquo; &ldquo;scene,&rdquo; and &ldquo;deferral&rdquo; — organized around this hypothetical founding event, which is then repeated, expanded, and made complex in innumerable ways. We are mimetically drawn to the same central object, which is also central being; because it is central being, we are also repelled from appropriating it. Being mimetically drawn to something is precise enough that we can identify it, if we learn how to look for it, in the most diverse situations: wanting to possess a consumer item, wanting to exercise authority over others, wanting public recognition. Any number of things can be at the center. Being repelled from appropriating the object involves the kinds of laws, norms, and rituals constitutive of a given community, all aiming at providing the appearance that the center has granted itself to whoever might acquire it.
          </p>
          <p>
            Center Study stays focused on the enduring nature of the center to any form of human organization or sociality. This is initially a ritual, sacrificial center, a site of exchange with the animal consumed and deified by the group. Ritual is a repetition and commemoration of the originary event itself — in each ritual we can look for a kind of dialogue with the center, in which some breach of the center and its response is commemorated so as to affirm the community in the face of that breach. From this way of thinking about ritual follows a way of thinking about myth, which is the narration of events within the frame of expected ritual effects.
          </p>
        </div>
      </section>

      {/* Section 3: The Two Revolutions */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          The Two Revolutions
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            For originary thinking, there are really two revolutions in human history, distinct but related. The first is the occupation of the sacred center by a human being — first of all the individual referred to by anthropologists as the &ldquo;Big Man.&rdquo; This revolution unites distribution and political power at the center and initiates a line leading from the Big Man, through ancient sacral and divine kingship, to the modern-day presidents and prime ministers. Once a human being occupies the center, the center can be — because it already has been — usurped. The community can now be ranged against the center in a way it could not have been previously.
          </p>
          <p>
            One significant difference between Gansian Generative Anthropology and its Girardian predecessor in mimetic theory is that whereas Girard places the scapegoating mechanism at the origin of the human, Gans places it here, in the centrality of the human charged with mediating between the divine and the human. Much of democratic politics is organized around directing resentment toward the figure at the center; we have become accustomed to see this as harmless because we trust that the rules regarding the replacement of one central figure by another will be respected — but, more recently, we have also come to notice that those rules and that trust might be quite a bit more fragile than we had realized.
          </p>
          <p>
            The second revolution is the elimination of the sacred center itself. Under sacrificial conditions, ritual is effective not because of any magical effects attributed to it, but because it brings about the &ldquo;miracle&rdquo; of a successful distribution of the social product. The destruction of the ritual scene was set in motion by the first usurpers of the center, leading, for example, to the invention of money and debt as a way of providing a mediated relationship to the ritual scene. Without the backing of ritual, all our concepts of &ldquo;justice&rdquo; and &ldquo;legitimacy&rdquo; are, in effect, fiat concepts, held together by increasingly desperate exercises of power, assertions of expertise (themselves attempts to confer a kind of ersatz sacrality on decision-makers), and the scapegoating of enemies.
          </p>
        </div>
      </section>

      {/* Section 4: Originary Grammar */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          Originary Grammar and the Scene
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Beyond this, Center Study is the work of remaking the vocabularies of the human sciences in terms of the &ldquo;originary grammar&rdquo; first developed in <em>The Origin of Language</em>, which traces language from the earliest, ostensive sign through the imperative, the interrogative, and finally the declarative.
          </p>
          <p>
            This means we are always thinking in terms of scenes — no ideas or concepts, but on scenes in which some kind of exchange with some &ldquo;metaperson&rdquo; is involved. This insistence on building a new vocabulary of thinking from the bottom up accounts for the stylistic features that involve resisting familiar phrases and reworking everything in terms of Center Study fundamentals. There is a necessary self-reflexivity here, as we are always discussing things from within some scene and therefore simultaneously referring, at least implicitly, to that scene and its relation to the center.
          </p>
          <p>
            Every name can only be a commemoration of some deferred violence. Every word is the Name of God. Since we are fundamentally mimetic beings, all social organization can be nothing more than emulation — the selection and dutiful study of models, for which study we emulate other models. We are all of us completely of the center: there is no autonomy or freedom relative to the center, even if expanded participation in the center produces the kinds of things we call &ldquo;freedom.&rdquo;
          </p>
          <p>
            Politically, this involves a critique of political theories that start from the &ldquo;bottom&rdquo; — the free subject, the people, and so on — insisting instead on starting from the center, from where authority and an originary distribution is assumed to have taken place and set the terms for future distributions and exchanges. The question is not sacred versus secular — that distinction is derived and unstable — but how sacrality persists, migrates, or attenuates as institutional forms evolve from ritual into law, into money, into code.
          </p>
        </div>
      </section>

      {/* Section 5: Center Study as Discipline */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-gray-900 dark:text-white">
          A Transdisciplinary Discourse
        </h2>
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            No way of thinking with any chance of helping change the world could ever come from within the established disciplines. One might even say the disciplines are designed so as to prevent the emergence of such thinking and, when it does emerge, to domesticate it. Any mode of thinking likely to make a difference is going to be transdisciplinary — which must mean not only extending across the subject matters of all the disciplines but capable of infiltrating their separate vocabularies and assisting &ldquo;insurgents&rdquo; within them to transform them while maintaining its own transdisciplinary base.
          </p>
          <p>
            Originary thinking does not just offer another perspective but requires one to rethink entire fields from the beginning. Fields such as anthropology, sociology, and political science can be reworked through these concepts — and, in fact, transformed into a new discipline that includes them all with considerable gains in consistency and explanatory power. Even a discipline like psychology, not obviously implicated here, can be productively rethought: consider how much of human behavior, emotion, and self-representation can be discussed in terms of the problem posed to each and every one of us by a post-ritual order of presenting ourselves as a center to others. We must constantly compete with other claims to more or less arbitrary forms of centrality; we seek to make ourselves desirable in all the ways one can be desirable while also deferring the resentments and possible violences — physical and symbolic — that endanger any center.
          </p>
          <p>
            Originary thinking can enable us to rework technology as well. The algorithm is a supplementary medium for the immense distributed archive we call the internet — scenic design without the ritual scene. To focus just on automation: every automated decision defers some rivalry over the terms on which that decision is to be made, while at the same time empowering one center over another and directing attention to the next decision node to be automated. Money, media, and technology are all real, but we can learn to &ldquo;read&rdquo; them as signs indicating the order or disorder of the center. Only a transdisciplinary approach can address this.
          </p>
          <p>
            The problem of the center is the problem of thematizing and performing social continuity — which ultimately means staging the succession from one central figure to the next. Only in this way can power be united with responsibility in transgenerational ways. This poses tremendous problems that stretch across all the disciplines, including some that have not yet been invented. Center Study is the attempt to name and work through those problems.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section className="mb-10">
        <div className="space-y-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
          <p>
            Center Study cannot claim the clarity of a system or the comfort of a tradition. It finds itself in that uncomfortable zone between all available positions — both inside and outside every discourse it touches. When applied with increasing literalness and inflexibility, it transforms. Every practice is an event on a scene. Every event is the reconstruction of the scene in accord with emerging commands of the center. Every word is already a commemoration. The originary hypothesis insists on inserting and insinuating itself everywhere so that it will eventually wither away — just becoming language itself, which knows what it is doing.
          </p>
          <p className="text-gray-500 dark:text-gray-400 italic">
            So, maybe that&rsquo;s enough for starters. The archive is always ready to take on questions.
          </p>
        </div>
      </section>

      {/* Explore Further */}
      <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Explore Further
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/guide"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">Guide</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Concepts, reading paths, and the archive in depth</p>
          </Link>
          <Link
            href="/ask"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">Ask the Archive</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Synthesized answers from the full corpus</p>
          </Link>
          <Link
            href="/?filter=substack"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">Center Study Center (Substack)</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">The latest essays and applied explorations</p>
          </Link>
          <Link
            href="/?filter=gablog"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">GABlog Archive</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">The theoretical archive of originary thinking</p>
          </Link>
          <Link
            href="/?filter=book"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">Books &amp; PDFs</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Longer works and published papers</p>
          </Link>
          <Link
            href="/concepts"
            className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <p className="font-semibold text-gray-900 dark:text-white">Concepts</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Key vocabulary index</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
