export interface PathPost {
  slug: string;
  title: string;
  source: string;
  bridge?: string; // sentence(s) connecting this post to the next
}

export interface ReadingPath {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  posture: 'ostensive' | 'imperative' | 'declarative';
  posts: PathPost[];
  conclusion: string;
  opensOnto: string[]; // slugs of other paths this opens onto
}

export const READING_PATHS: ReadingPath[] = [
  {
    slug: 'lectures',
    title: 'The Five Lectures',
    subtitle: 'The clearest path in. Five introductory lectures that unfold the core concepts of Center Study in sequence.',
    posture: 'ostensive',
    intro: `This is the shortest path in. Five lectures written specifically as introductions to Center Study — each one pointing at a single concept and unfolding it from the inside. They were designed to be read in order: each lecture prepares the next. If you are entirely new to this material, start here and read them straight through. You will come out the other side with the vocabulary the rest of the archive assumes.`,
    posts: [
      {
        slug: 'origin',
        title: 'Lecture 1: Origin',
        source: 'Lecture',
        bridge: 'Why the question of origin is unavoidable — despite the modern interdiction on origins discourse. Derrida, the French Academy, the social sciences — and what it means to take originary thinking seriously rather than retreating to the safe position of endless deferral. The concept that makes Center Study possible is established: we can and must ask where the human begins.',
      },
      {
        slug: 'mimetic',
        title: 'Lecture 2: Mimetic',
        source: 'Lecture',
        bridge: 'Girard\'s mimesis — its extraordinary explanatory power and its one crucial limitation. Rivalry, resentment, the scapegoat mechanism, the sacred as the product of collective violence. Then Gans\'s decisive move: the sign arrests mimetic crisis rather than merely redirecting it. The originary scene is not a murder but an aborted appropriation — the first word.',
      },
      {
        slug: 'deferral-of-violence',
        title: 'Lecture 3: Deferral of Violence',
        source: 'Lecture',
        bridge: 'Why "deferral" is the right word — not postpone, not delay, not adjourn. Deferral keeps us inside the scene, within the act itself, at the moment of its occurring. Every genuine human act is a deferral: it inhabits the horizon of violence without consummating it. The concept that makes originary ethics possible.',
      },
      {
        slug: 'the-center',
        title: 'Lecture 4: The Center',
        source: 'Lecture',
        bridge: 'Attention versus intention. The occupied center and the signifying center. How centrality structures every thought, every institution, every act of meaning — and what it means to "hear" the command of the center today. The most immediate concept in Center Study: you are already inside it.',
      },
      {
        slug: 'the-sign-pdf',
        title: 'Lecture 5: The Sign',
        source: 'Lecture',
        bridge: 'Derrida\'s critique of the sign, and Gans\'s resolution of it. Every word as the Name-of-God. Why "sample" may be a better framing than "sign" — and what this means for how we understand disciplinary knowledge, expertise, and the relationship between language and what it gestures at.',
      },
    ],
    conclusion: `You now have the five core concepts: origin, mimesis, deferral, center, sign. These are not definitions to memorize but tools to use. Every other path in this guide is an elaboration or application of something established here. The Foundation path develops the underlying theoretical apparatus. The Political and Juridical paths take the concepts into their most consequential domains. Or go directly to the texts — you have enough vocabulary now to find your way in.`,
    opensOnto: ['foundation', 'political', 'language-and-grammar'],
  },

  {
    slug: 'foundation',
    title: 'The Foundation',
    subtitle: 'The posts that establish the originary hypothesis and its Center Study inflection.',
    posture: 'ostensive',
    intro: `This path points. It does not argue or explain — it indicates, in sequence, the texts that make the originary hypothesis available. The sequence is not arbitrary: each post opens a door that the next walks through. If you have already read the Five Lectures, this path extends what they established into the fuller theoretical apparatus. If you have not, start there — the lectures are the shortest way in, and this path assumes the concepts they establish.`,
    posts: [
      {
        slug: 'origin',
        title: 'Lecture 1: Origin',
        source: 'Lecture',
        bridge: 'The concept of origin — why it is unavoidable, and what it means to take originary thinking seriously. This establishes the methodological stance of the entire path: we are willing to ask where the human begins.',
      },
      {
        slug: 'center-and-centrality',
        title: 'Center and Centrality',
        source: 'GABlog',
        bridge: 'The concept of the center — not a metaphor but the organizing fact of all human sociality — established as the primary analytical category. Before the hypothesis about language\'s origin, we need the concept of the center as something that structures, addresses, and issues. The next text supplies the scene from which all centering emerges.',
      },
      {
        slug: 'the-origin-of-language',
        title: 'The Origin of Language (Introduction)',
        source: 'Book',
        bridge: 'Gans\'s foundational text situates the originary hypothesis against the two major obstacles to its reception: metaphysics (which treats the declarative as primary) and victimary thinking (which treats inequality as oppression). Having identified the obstacles, we need the hypothesis itself — the minimal account of where language and the human come from.',
      },
      {
        slug: 'talk-of-the-center-adam-katz',
        title: 'Talk of the Center',
        source: 'PDF',
        bridge: 'The concept of the center as the organizing point of all human social life — not merely the origin of language but the ongoing condition of community. Having established the center\'s primacy, we need to understand what it means to approach it philosophically, which requires understanding the relationship between ritual and philosophy that makes originary thinking possible.',
      },
      {
        slug: 'originary-hypothesis-as-mobius-strip',
        title: 'Originary Hypothesis as Möbius Strip',
        source: 'Substack',
        bridge: 'A compact demonstration that the originary hypothesis has a self-referential structure — it is itself an instance of what it describes. The hypothesis about the origin of signification is itself a sign that can only be understood from within the practice of signification it describes. This paradox is not a problem to be solved but the condition of the hypothesis\'s power.',
      },
      {
        slug: 'linguistic-turn-generative-literacy',
        title: 'The Linguistic Turn and Generative Literacy',
        source: 'PDF',
        bridge: 'The completion of the linguistic turn — from representational to generative, from metalanguage to infralanguage. This essay positions Center Study within and against the broader tradition of language-philosophy. Having understood what kind of thinking Center Study is, we can now encounter its fullest theoretical statement.',
      },
      {
        slug: 'anthropomorphics-book',
        title: 'Anthropomorphics: An Originary Grammar of the Center',
        source: 'Book',
        bridge: 'The foundational text. Read the opening section "The Use of a Center" and the section "Post-Sacrificial Centrality" first; return to read the rest as you work through other paths. This text is not a beginning but a destination — the text you return to after the others have made it legible.',
      },
    ],
    conclusion: `This path has established the basic architecture. You now have: the center as originary concept; the hypothesis about language\'s origin; the distinction between ostensive, imperative, and declarative; the infralinguistic method; and the grammar of the scene. The other paths are elaborations and applications of what you have just encountered. Go to The Political or The Juridical next — they take the foundation into its most consequential domains.`,
    opensOnto: ['political', 'juridical', 'language-and-grammar'],
  },

  {
    slug: 'sacred-and-social',
    title: 'The Sacred and the Social',
    subtitle: 'Mimesis, ritual, sacrifice, and the originary account of religion — why the sacred is not a human invention but the first human fact.',
    posture: 'ostensive',
    intro: `This path is for anyone who finds religion fascinating or troubling, who works with ritual in any form, who studies anthropology or social theory, or who suspects that something important is missing from accounts of the social that leave out the sacred. Center Study's originary hypothesis is, at its core, a theory of the sacred: the first human act was an act of collective deferral that generated both the sign and the sacred simultaneously. This path makes that claim legible.`,
    posts: [
      {
        slug: 'mimetic',
        title: 'Lecture 2: Mimetic',
        source: 'Lecture',
        bridge: 'Girard\'s mimetic theory — rivalry, resentment, the scapegoat mechanism — and Gans\'s decisive refinement of it. The originary scene is not a murder but a collective aborted appropriation that generates language and the sacred in a single gesture. Understanding this is the prerequisite for everything else in this path.',
      },
      {
        slug: 'deferral-of-violence',
        title: 'Lecture 3: Deferral of Violence',
        source: 'Lecture',
        bridge: 'The deferral of violence as the constitutive act of the human. Every ritual is a repetition of this deferral — a reenactment of the originary scene that sustains the social order by re-generating the shared attention that founded it. Having established deferral as the concept, we can ask: what happened to ritual in modernity?',
      },
      {
        slug: 'the-anthropoetics-of-power',
        title: 'The Anthropoetics of Power',
        source: 'PDF',
        bridge: 'Power flows from the center outward, not from the periphery upward — and the center is always, at its origin, a sacred center. This essay traces the movement from the originary scene through sacred kingship to modern forms of power, showing how the sacred was the original form of the social. Having established the anthropoetics of power, we can ask: what replaces ritual in post-sacrificial societies?',
      },
      {
        slug: 'media-as-ritual',
        title: 'Media as Ritual',
        source: 'Substack',
        bridge: 'Media as the successor to ritual — the institution that assumes the function of constituting the center in post-sacrificial conditions. What media does and what it fails to do when measured against the ritual function it has inherited. The argument that secular modernity has not eliminated the need for ritual but displaced it into forms that are inadequate to it.',
      },
      {
        slug: 'discipline-and-debt',
        title: 'Discipline and Debt',
        source: 'GABlog',
        bridge: 'The Big Man\'s out-gifting as the origin of hierarchical debt — the mechanism by which egalitarian communities become hierarchical ones through the acceptance of asymmetric obligation. The sacred dimension of debt: what we owe the center is not a financial obligation but a constitutive one. Then: how that sacred debt survives in secular forms.',
      },
      {
        slug: 'mimesis-center-auto-immunology',
        title: 'Mimesis, the Center and Auto-Immunology',
        source: 'PDF',
        bridge: 'The auto-immunological pathology: institutions attacking the forms of centrality that their own function requires. The specific form this takes in post-ritual modernity — when the sacred is denied but its function cannot be dispensed with — produces the characteristic dysfunctions of contemporary institutions.',
      },
    ],
    conclusion: `The sacred is not primitive superstition that modernity outgrew. It is the first human institution — the shared attention that made social life possible — and its traces are everywhere in secular form. Having read this path, you can identify the sacred dimension in any institution: what does it treat as central, how does it generate and sustain collective attention, and what happens when it can no longer acknowledge what it is doing? The Foundation path develops the full originary apparatus from which these insights derive.`,
    opensOnto: ['foundation', 'political', 'technology-and-scenic-design'],
  },

  {
    slug: 'political',
    title: 'Power, Order, and Succession',
    subtitle: 'Center Study\'s analysis of political order — from the anthropoetics of power through sovereignty, liberalism, and how authority passes.',
    posture: 'declarative',
    intro: `This path makes a claim: the most important question for assessing any social order is how it passes authority — not who rules now but how rule transfers. This claim is argued, not asserted; these posts build the case cumulatively. The path begins with the originary account of power, moves through the analysis of liberalism and the victimary, and arrives at the concept of succession that makes the political critique actionable. Read as a sequence.`,
    posts: [
      {
        slug: 'the-center',
        title: 'Lecture 4: The Center',
        source: 'Lecture',
        bridge: 'Every political order is an order of the center: who occupies it, what it demands, how it passes. Before the theoretical analysis, we need the basic concept. Then: the anthropological account of how power flows from the center.',
      },
      {
        slug: 'the-anthropoetics-of-power',
        title: 'The Anthropoetics of Power',
        source: 'PDF',
        bridge: 'Power flows downward, not upward; the high generates the low. This essay establishes the originary anthropology of power — from the Big Man through sacred kingship to modern governance — that grounds the political critique. Having understood where power comes from, we can ask: what goes wrong when that origin is denied?',
      },
      {
        slug: 'nemesis-jouvenelian-liberal-model',
        title: 'Nemesis: The Jouvenelian vs. the Liberal Model',
        source: 'PDF',
        bridge: 'The Jouvenelian analysis of power establishes the basic political vocabulary: final power center, intermediate institutions, the individual as artifact. This sets the structural frame within which the subsequent posts operate. Next: what the originary hypothesis adds to the Jouvenelian analysis.',
      },
      {
        slug: 'event-origin-center',
        title: 'Event, Origin, Center',
        source: 'PDF',
        bridge: 'Anti-centerism as the specific pathology of modern institutions — including journalism, the primary institution of information about the center. The argument that all institutional action presupposes a center, and that pretending otherwise produces specific institutional dysfunctions. Next: how sovereignty relates to the center.',
      },
      {
        slug: 'sovereignty-nomos-and-parrhesia',
        title: 'Sovereignty, Nomos and Parrhesia',
        source: 'GABlog',
        bridge: 'Sovereignty, the nomos, and legitimate speech — the three dimensions of political order that liberalism systematically obscures. This post provides the positive account of what political order requires, which is the necessary complement to the critique.',
      },
      {
        slug: 'singularized-succession-in-perpetuity',
        title: 'Singularized Succession in Perpetuity',
        source: 'Substack',
        bridge: 'The concept that makes succession the political question above all others: authority must be singularized — concentrated in a single identifiable locus — and transmitted in a practice that continues the form rather than rupturing it. Without this concept, political theory cannot ask the question that matters most.',
      },
      {
        slug: 'successful-succession',
        title: 'Successful Succession',
        source: 'GABlog',
        bridge: 'The political application: mode of succession as the most important question for assessing a social order. The argument that succession is not incidental to political form but constitutive of it — and that every contemporary institutional crisis is, underneath, a succession crisis.',
      },
    ],
    conclusion: `The political analysis in Center Study is not a program or a platform — it is a diagnostic method. Having read this path, you can identify the anti-center pathology in any institutional arrangement, trace the victimary discourse to its originary source, and ask the question that political thinking systematically avoids: how does the center pass? The Juridical path develops the adjudicative dimension; Debt and Credit develops the economic dimension.`,
    opensOnto: ['juridical', 'debt-credit-economic', 'technology-and-scenic-design'],
  },

  {
    slug: 'juridical',
    title: 'Law and Judgment',
    subtitle: 'The juridical as the capacity to judge with binding force — and what happens when that capacity fails.',
    posture: 'imperative',
    intro: `Attend to the juridical. Not law as a system of rules but the juridical as the capacity to determine, with binding force, what the center demands in a case of conflict. This path is written for anyone who works with law, adjudication, institutional governance, or any situation where disputes must be resolved with authority. It directs attention to a set of concepts that are not properly visible until you have been told where to look. Look at the judge. Look at what makes judgment legitimate. Look at what happens when legitimacy fails.`,
    posts: [
      {
        slug: 'anthropomorphics-book',
        title: 'Anthropomorphics (sections on debt and the juridical)',
        source: 'Book',
        bridge: 'The foundational account of debt to the center as the originary juridical relation. Read the sections on post-sacrificial centrality and on debt carefully. Then: how that originary debt relation generates the specific institutions of adjudication.',
      },
      {
        slug: 'sovereignty-nomos-and-parrhesia',
        title: 'Sovereignty, Nomos and Parrhesia',
        source: 'GABlog',
        bridge: 'The nomos as the originary distribution that the juridical order must honor. Legitimate judgment is judgment that respects the nomos; illegitimate judgment is judgment that violates it in the name of positive law or ideological principle. Then: what happens to the juridical when the center is occupied by those devoted to opposing it.',
      },
      {
        slug: 'on-the-juridical-disciplinary-line',
        title: 'On the Juridical/Disciplinary Line',
        source: 'Substack',
        bridge: 'Two modes of authority that derive from the center but operate by different logics — the juridical and the disciplinary. Understanding their distinction clarifies what breaks down when they collapse into each other, which is the characteristic failure of contemporary institutions.',
      },
      {
        slug: 'tethering-and-toggling-ritual-juridical-and-disciplinary',
        title: 'Tethering and Toggling: Ritual, Juridical, and Disciplinary',
        source: 'Substack',
        bridge: 'The three modes — ritual, juridical, disciplinary — as a system of scene-management. Each mode \'tethers\' the periphery to the center differently; understanding how they toggle between each other is essential for analyzing any institutional arrangement.',
      },
      {
        slug: 'there-is-no-economy-pdf',
        title: 'There Is No Economy',
        source: 'PDF',
        bridge: 'The economic as a domain of the juridical — debt adjudication, credit administration, the enforcement of originary obligations. The insight that economic relations are juridical relations helps explain why market societies require robust juridical institutions and why their degradation tracks the degradation of the market.',
      },
    ],
    conclusion: `The juridical path does not end; it opens onto everything else. Every domain of Center Study has a juridical dimension: how are disputes settled, how are distributions adjudicated, how is the center\'s authority enforced in cases of conflict? Return to this path after the political and succession paths; the connections will be clearer.`,
    opensOnto: ['political', 'debt-credit-economic'],
  },

  {
    slug: 'debt-credit-economic',
    title: 'Debt, Credit, and the Economic',
    subtitle: 'The economy as disguised debt structure — what money, capital, and exchange really are when seen from the originary scene.',
    posture: 'declarative',
    intro: `There is no economy. This is not a polemical claim but a theoretical one: the "economy" as a self-regulating system of exchange between autonomous individuals is an ideological representation that conceals the debt structure it rests on. This path is for anyone who works in finance, economics, or who has ever felt that conventional accounts of money and exchange are missing something fundamental. The foundation path is recommended first; the political path is helpful.`,
    posts: [
      {
        slug: 'anthropomorphics-book',
        title: 'Anthropomorphics (debt to the center)',
        source: 'Book',
        bridge: 'The originary debt relation — each participant\'s obligation to the center that enabled the scene — as the foundational economic fact. Then: how that originary debt is institutionalized in historical economies.',
      },
      {
        slug: 'discipline-and-debt',
        title: 'Discipline and Debt',
        source: 'GABlog',
        bridge: 'The Big Man\'s out-gifting as the origin of hierarchical debt — the mechanism by which egalitarian communities become hierarchical ones through the acceptance of asymmetric obligation. Then: how money carries this sacred credit forward.',
      },
      {
        slug: 'there-is-no-economy-pdf',
        title: 'There Is No Economy',
        source: 'PDF',
        bridge: 'The systematic argument that money is a sign of recognition — credit drawn on the sacred — not a medium of exchange invented to solve barter\'s inefficiencies. The "economy" as ideological concealment of the tributary structure.',
      },
      {
        slug: 'originary-debt-credit-succession',
        title: 'Originary Debt, Credit, Succession',
        source: 'Substack',
        bridge: 'The synthesis of three core concepts: originary debt as the condition of all exchange, credit as the institutionalization of deferred debt, and succession as the transmission of credit authority. The essay that most directly connects Center Study\'s economic and political frameworks.',
      },
      {
        slug: 'data-as-currency-and-the-debt-to-the-center',
        title: 'Data as Currency and the Debt to the Center',
        source: 'Substack',
        bridge: 'The contemporary application: data as a form of credit drawn on the center, and the algorithmic economy as a new form of the tributary structure. The argument that digital capitalism is not a break from originary economics but its intensification.',
      },
      {
        slug: 'debts-and-deferences-gablog',
        title: 'Debts and Deferences',
        source: 'GABlog',
        bridge: 'Debt and deferral as paired concepts: the only repayment of the debt to the center is ongoing deferral. The moral-economic dimension: to pay one\'s debt is not to provide an equivalent exchange but to continue the practice of deferral the center demands.',
      },
      {
        slug: 'debits-and-credits',
        title: 'Debits and Credits',
        source: 'Substack',
        bridge: 'A close-grained analysis of the debit/credit structure as it actually operates — the accounting logic of originary economics made concrete.',
      },
    ],
    conclusion: `The economic path arrives at the question that liberal economics never asks: what is the center against which all this credit is being drawn? Modern financial crises are center crises — failures of the originary credit structure that money represents. The scenic design path develops how institutions might be designed to make this visible and manageable.`,
    opensOnto: ['juridical', 'technology-and-scenic-design'],
  },

  {
    slug: 'language-and-grammar',
    title: 'Language and the Sign',
    subtitle: 'The ostensive, imperative, and declarative — and the grammar hidden in the originary scene.',
    posture: 'ostensive',
    intro: `This path is for anyone who works with language — writers, scholars, linguists, teachers, anyone who has felt that existing accounts of how language works leave something important out. Center Study's originary grammar is not a descriptive grammar but an explanatory one: it asks where language comes from, what it does at its most basic level, and what that implies for how we read, write, and speak. Start by bracketing everything you know about grammar. The linguistic forms you learned in school are effects; this path goes to the causes.`,
    posts: [
      {
        slug: 'the-sign-pdf',
        title: 'Lecture 5: The Sign',
        source: 'Lecture',
        bridge: 'The starting point: Derrida\'s critique of the sign and Gans\'s resolution of it. What the sign actually is, where it comes from, and why every word is, in its deepest structure, the Name-of-God. The lecture that makes the linguistic analysis available.',
      },
      {
        slug: 'the-origin-of-language',
        title: 'The Origin of Language',
        source: 'Book',
        bridge: 'The foundational account of the four linguistic forms (ostensive, imperative, interrogative, declarative) and their originary precedence. The argument that treating the declarative as primary forecloses the question of origin. Then: what it means to complete the linguistic turn by recognizing the infralinguistic base.',
      },
      {
        slug: 'linguistic-turn-generative-literacy',
        title: 'The Linguistic Turn and Generative Literacy',
        source: 'PDF',
        bridge: 'The completion of the linguistic turn: from representational to generative, from metalanguage to infralanguage. The argument that all language is scene-dependent. Then: the ethical dimension of language — how attention and responsibility are constitutively linked.',
      },
      {
        slug: 'back-to-grammar',
        title: 'Back to Grammar',
        source: 'Substack',
        bridge: 'A return to originary grammar as a living analytical tool — not a historical reconstruction but an ongoing practice of thinking from the originary scene. This post demonstrates what it means to "do" originary grammar rather than merely describe it.',
      },
      {
        slug: 'media-technology-and-originary-grammar',
        title: 'Media, Technology and Originary Grammar',
        source: 'Substack',
        bridge: 'The application of originary grammar to contemporary media and technology — every medium has a grammatical structure derivable from the originary scene. A key bridge between the grammatical and technological paths.',
      },
      {
        slug: 'attentionality-originary-ethics',
        title: 'Attentionality and Originary Ethics',
        source: 'PDF',
        bridge: 'Joint attention as the ground of ethics — the connection between the originary scene\'s shared attention and the ethical obligations it generates. Language learning as an ethical activity.',
      },
      {
        slug: 'anthropomorphics-book',
        title: 'Anthropomorphics (Talk of the Center section)',
        source: 'Book',
        bridge: 'The originary grammar of the center as the grammar of signification itself. This is the destination of the language path — the systematic account of how the originary scene generates the rules that govern all meaning-production.',
      },
    ],
    conclusion: `Language is not a tool you use to communicate. It is the scene you inhabit when you think, speak, write, or read. Having read this path, you should be able to identify the scene-dependency of any text, trace its ostensive-imperative-declarative structure, and recognize the center it is organized around. That recognition is generative literacy.`,
    opensOnto: ['foundation', 'technology-and-scenic-design', 'self-referential'],
  },

  {
    slug: 'technology-and-scenic-design',
    title: 'AI, Technology, and Scenic Design',
    subtitle: 'Technics, media, data, AI, and the design of scenes adequate to their deferral function.',
    posture: 'imperative',
    intro: `Attend to the scene. Not to the content that circulates through it, not to the message it transmits, but to the scene itself — the structured space of shared attention that makes any content possible. This path is for anyone working in technology, AI, or media who wants a framework that goes deeper than utility or disruption. Center Study's analysis of technology is fundamentally about scenic design: the construction and maintenance of scenes adequate to their deferral function. Bouvard's Substack is the primary source here — it is where Center Study most directly engages AI, data, algorithms, and contemporary technics.`,
    posts: [
      {
        slug: 'the-center',
        title: 'Lecture 4: The Center',
        source: 'Lecture',
        bridge: 'Every technology is organized around a center — it structures attention toward something. Understanding this makes technology visible as scenic design from the start, rather than arriving at that insight late.',
      },
      {
        slug: 'originary-technics',
        title: 'Originary Technics',
        source: 'PDF',
        bridge: 'The imperative as the origin of technology — the argument that all technological organization is organized around command structures that originate in the ritual scene. Having established the originary account of technology, we can ask: what happens to that account in conditions of post-ritual modernity?',
      },
      {
        slug: 'intelligence-and-technics',
        title: 'Intelligence and Technics',
        source: 'Substack',
        bridge: 'Intelligence as a form of technics — the capacity to read and respond to the center\'s affordances is itself a technical skill. This post bridges the originary account of technology with the contemporary analysis of algorithmic intelligence.',
      },
      {
        slug: 'media-as-ritual',
        title: 'Media as Ritual',
        source: 'Substack',
        bridge: 'Media as the successor to ritual — the institution that assumes the function of constituting the center in post-sacrificial conditions. What media does and what it fails to do when measured against the ritual function it has inherited.',
      },
      {
        slug: 'the-grammar-of-technology-substack',
        title: 'The Grammar of Technology',
        source: 'Substack',
        bridge: 'Every technology has a grammar — an ostensive-imperative-declarative structure derivable from the originary scene it enacts. This is the theoretical core of the technological analysis.',
      },
      {
        slug: 'being-like-data-the-central-intelligence',
        title: 'Being Like Data; the Central Intelligence',
        source: 'Substack',
        bridge: 'AI as a new form of central intelligence — not merely a tool but a new configuration of the center/periphery relation. The implications for how humans orient toward the center in conditions of algorithmic mediation.',
      },
      {
        slug: 'mimesis-center-auto-immunology',
        title: 'Mimesis, the Center and Auto-Immunology',
        source: 'PDF',
        bridge: 'The scaling problem: how do originary concepts apply to large institutional structures? Scenic design and the construction of scenes adequate to the deferral demands of complex societies.',
      },
      {
        slug: 'scenic-design-practices',
        title: 'Scenic Design Practices',
        source: 'GABlog',
        bridge: 'Every practice is scenic design — the redesign of an inherited scene with available techno-media. The synthesis of media analysis and institutional design in the concept of scenic design practices.',
      },
    ],
    conclusion: `Technology is not neutral. It is the medium of the scene, and the scene is the medium of deferral. The question this path leaves you with: what scenes are your practices constructing, and are those scenes adequate to the deferral they are meant to accomplish?`,
    opensOnto: ['political', 'foundation', 'self-referential'],
  },

  {
    slug: 'self-referential',
    title: 'What Center Study Is',
    subtitle: 'The posts where Center Study most explicitly reflects on its own practice — the meta-discourse that is not a metalanguage.',
    posture: 'declarative',
    intro: `Center Study holds that there is no metalanguage — no position outside language from which language can be described. This path collects the posts where Center Study reflects most explicitly on its own practice: what it is, what it is not, what it costs, and what it demands. These posts are more demanding than the others. They require the other paths as background. Read them last, not first — or return to them when you want to understand not just what the hypothesis says but what it is.`,
    posts: [
      {
        slug: 'generative-anthropology-one-big-discipline',
        title: 'Center Study as One Big Discipline',
        source: 'PDF',
        bridge: 'The institutional claim: Center Study as the one big discipline that integrates all others through originary thinking. The argument establishes what Center Study is trying to do and why it requires more than academic scholarship.',
      },
      {
        slug: 'the-transdisciplinarity-of-the-hypothesis',
        title: 'The Transdisciplinarity of the Hypothesis',
        source: 'Substack',
        bridge: 'Why the originary hypothesis is transdisciplinary — not a claim from within any one discipline but a claim about the conditions of all disciplines. The post that most directly articulates Center Study\'s institutional ambition.',
      },
      {
        slug: 'introduction-to-disciplinarity',
        title: 'Introduction to Disciplinarity',
        source: 'PDF',
        bridge: 'How disciplines are constituted, maintained, and dissolved — and what it means to practice a discipline. This provides the institutional context for understanding what Center Study is as a practice.',
      },
      {
        slug: 'the-prospects-of-the-hypothesis',
        title: 'The Prospects of the Hypothesis',
        source: 'Substack',
        bridge: 'A candid assessment of what the originary hypothesis can and cannot do — its prospects for uptake, elaboration, and institutional survival. The self-reflective text that does not flinch from the hypothesis\'s difficulties.',
      },
      {
        slug: 'talk-of-the-center-adam-katz',
        title: 'Talk of the Center',
        source: 'PDF',
        bridge: 'The most compact self-reflexive text: how Center Study itself exemplifies the practice of "saying what everyone else is saying" — the discovery of transcendence within mimesis, the translation of group repetition into genuine cultural production.',
      },
      {
        slug: 'anthropomorphics-book',
        title: 'Anthropomorphics (entire)',
        source: 'Book',
        bridge: 'The foundational text as self-reflexive artifact: a work that performs originary grammar while describing it, that occupies the center while theorizing the center\'s occupation, that issues imperatives while analyzing the imperative form. Read it again after reading the other paths.',
      },
    ],
    conclusion: `Center Study cannot describe itself from outside itself. This path ends where every path ends: back inside the discourse, which is the only place from which the discourse can be understood. The guide is not a substitute for the texts. It is a scene — constructed to make the texts accessible. Now go to the texts.`,
    opensOnto: ['foundation'],
  },
];

export function getPathBySlug(slug: string): ReadingPath | undefined {
  return READING_PATHS.find((p) => p.slug === slug);
}
