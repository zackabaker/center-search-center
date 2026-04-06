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
    slug: 'foundation',
    title: 'The Foundation',
    subtitle: 'Begin here. The posts that establish the originary hypothesis and its Center Study inflection.',
    posture: 'ostensive',
    intro: `This path points. It does not argue or explain — it indicates, in sequence, the texts that make the originary hypothesis available. The sequence is not arbitrary: each post opens a door that the next walks through. You can read them in any order, but you will understand them better in this one. If you are entirely new to this material, start at the beginning and do not skip ahead. The hypothesis resists initiation by excerpts.`,
    posts: [
      {
        slug: 'gablog-center-and-centrality',
        title: 'Center and Centrality',
        source: 'GABlog',
        bridge: 'The concept of the center — not a metaphor but the organizing fact of all human sociality — is established as the primary analytical category. Before the hypothesis about language\'s origin, we need the concept of the center as something that structures, addresses, and issues. The next text supplies the scene from which all centering emerges.',
      },
      {
        slug: 'book-the-origin-of-language',
        title: 'The Origin of Language (Introduction)',
        source: 'Book',
        bridge: 'Gans\'s foundational text situates the originary hypothesis against the two major obstacles to its reception: metaphysics (which treats the declarative as primary) and victimary thinking (which treats inequality as oppression). Having identified the obstacles, we need the hypothesis itself — the minimal account of where language and the human come from.',
      },
      {
        slug: 'pdf-talk-of-the-center-adam-katz',
        title: 'Talk of the Center',
        source: 'PDF',
        bridge: 'The concept of the center as the organizing point of all human social life — not merely the origin of language but the ongoing condition of community. Having established the center\'s primacy, we need to understand what it means to approach it philosophically, which requires understanding the relationship between ritual and philosophy that makes originary thinking possible.',
      },
      {
        slug: 'substack-originary-hypothesis-as-mobius-strip',
        title: 'Originary Hypothesis as Möbius Strip',
        source: 'Substack',
        bridge: 'Bouvard\'s compact demonstration that the originary hypothesis has a self-referential structure — it is itself an instance of what it describes. The hypothesis about the origin of signification is itself a sign that can only be understood from within the practice of signification it describes. This paradox is not a problem to be solved but the condition of the hypothesis\'s power.',
      },
      {
        slug: 'pdf-linguistic-turn-generative-literacy',
        title: 'The Linguistic Turn and Generative Literacy',
        source: 'PDF',
        bridge: 'The completion of the linguistic turn — from representational to generative, from metalanguage to infralanguage. This essay positions Center Study within and against the broader tradition of language-philosophy. Having understood what kind of thinking Center Study is, we can now encounter its fullest theoretical statement.',
      },
      {
        slug: 'book-anthropomorphics',
        title: 'Anthropomorphics: An Originary Grammar of the Center',
        source: 'Book',
        bridge: 'The foundational text. Read the opening section "The Use of a Center" and the section "Post-Sacrificial Centrality" first; return to read the rest as you work through other paths. This text is not a beginning but a destination — the text you return to after the others have made it legible.',
      },
    ],
    conclusion: `This path has established the basic architecture. You now have: the center as originary concept; the hypothesis about language\'s origin; the distinction between ostensive, imperative, and declarative; the infralinguistic method; and the grammar of the scene. The other paths are elaborations and applications of what you have just encountered. Go to The Political or The Juridical next — they take the foundation into its most consequential domains.`,
    opensOnto: ['political', 'juridical', 'language-and-grammar'],
  },

  {
    slug: 'political',
    title: 'The Political',
    subtitle: 'Center Study\'s critique of liberalism, the victimary, sovereignty, and the anti-center pathology of modern governance.',
    posture: 'declarative',
    intro: `This path makes a claim: liberalism is not the solution to the problem of political order — it is a symptom of that problem's misdiagnosis. The claim is argued, not asserted; these posts build the case cumulatively, each adding a dimension of analysis that the previous lacked. The path assumes acquaintance with the foundation path, particularly the concept of the center and the critique of anti-centerism. Read as a sequence, not a sampling.`,
    posts: [
      {
        slug: 'pdf-nemesis-jouvenelian-liberal-model',
        title: 'Nemesis: The Jouvenelian vs. the Liberal Model',
        source: 'PDF',
        bridge: 'The Jouvenelian analysis of power establishes the basic political vocabulary: final power center, intermediate institutions, the individual as artifact. This sets the structural frame within which the subsequent posts operate. Next: what the originary hypothesis adds to the Jouvenelian analysis.',
      },
      {
        slug: 'pdf-the-anthropoetics-of-power',
        title: 'The Anthropoetics of Power',
        source: 'PDF',
        bridge: 'Power flows downward, not upward; the high generates the low. This essay establishes the originary anthropology of power — from the Big Man through sacred kingship to modern governance — that grounds the political critique. Having understood where power comes from, we can ask: what goes wrong when that origin is denied?',
      },
      {
        slug: 'pdf-event-origin-center',
        title: 'Event, Origin, Center',
        source: 'PDF',
        bridge: 'Anti-centerism as the specific pathology of modern institutions — including journalism, the primary institution of information about the center. The argument that all institutional action presupposes a center, and that pretending otherwise produces specific institutional dysfunctions. Next: how sovereignty relates to the center.',
      },
      {
        slug: 'substack-notes-on-governance-and-center-study-politics',
        title: 'Notes on Governance and Center Study Politics',
        source: 'Substack',
        bridge: 'Bouvard\'s applied extension of the political framework to contemporary governance structures — what Center Study analysis actually implies for how institutions should be assessed and designed. Next: how succession is the political question above all others.',
      },
      {
        slug: 'gablog-sovereignty-nomos-and-parrhesia',
        title: 'Sovereignty, Nomos and Parrhesia',
        source: 'GABlog',
        bridge: 'Sovereignty, the nomos, and legitimate speech — the three dimensions of political order that liberalism systematically obscures. This post provides the positive account of what political order requires, which is the necessary complement to the critique.',
      },
      {
        slug: 'substack-rotating-dictatorship',
        title: 'Rotating Dictatorship',
        source: 'Substack',
        bridge: 'The concept of rotating dictatorship as a model for understanding how legitimate authority circulates — a provocative application of Center Study\'s political vocabulary to concrete questions of governance design.',
      },
      {
        slug: 'gablog-successful-succession',
        title: 'Successful Succession',
        source: 'GABlog',
        bridge: 'Succession as the most important political question — not who rules now but how rule passes. This post brings the political analysis to its most concrete and consequential conclusion: the assessment of any social order by its mode of succession.',
      },
    ],
    conclusion: `The political analysis in Center Study is not a program or a platform — it is a diagnostic method. Having read this path, you can identify the anti-center pathology in any institutional arrangement, trace the victimary discourse to its originary source, and ask the question that political thinking systematically avoids: how does the center pass? The Juridical and Succession paths develop specific dimensions of what you have encountered here.`,
    opensOnto: ['juridical', 'succession-and-sovereignty'],
  },

  {
    slug: 'juridical',
    title: 'The Juridical',
    subtitle: 'Law, adjudication, the juridical order, and its relationship to the center.',
    posture: 'imperative',
    intro: `Attend to the juridical. Not law as a system of rules but the juridical as the capacity to judge — to determine, with binding force, what the center demands in a case of conflict. This path is imperative in mode: it directs attention to a set of concepts that are not properly visible until you have been told where to look. Look at the judge. Look at what makes judgment legitimate. Look at what happens when legitimacy fails.`,
    posts: [
      {
        slug: 'book-anthropomorphics',
        title: 'Anthropomorphics (sections on debt and the juridical)',
        source: 'Book',
        bridge: 'The foundational account of debt to the center as the originary juridical relation. Read the sections on post-sacrificial centrality and on debt carefully. Then: how that originary debt relation generates the specific institutions of adjudication.',
      },
      {
        slug: 'gablog-sovereignty-nomos-and-parrhesia',
        title: 'Sovereignty, Nomos and Parrhesia',
        source: 'GABlog',
        bridge: 'The nomos as the originary distribution that the juridical order must honor. Legitimate judgment is judgment that respects the nomos; illegitimate judgment is judgment that violates it in the name of positive law or ideological principle. Then: what happens to the juridical when the center is occupied by those devoted to opposing it.',
      },
      {
        slug: 'substack-on-the-juridical-disciplinary-line',
        title: 'On the Juridical/Disciplinary Line',
        source: 'Substack',
        bridge: 'Bouvard\'s analysis of the line between the juridical and the disciplinary — two modes of authority that derive from the center but operate by different logics. Understanding their distinction clarifies what breaks down when they collapse into each other.',
      },
      {
        slug: 'substack-tethering-and-toggling-ritual-juridical-and-disciplinary',
        title: 'Tethering and Toggling: Ritual, Juridical, and Disciplinary',
        source: 'Substack',
        bridge: 'The three modes — ritual, juridical, disciplinary — as a system of scene-management. Each mode \'tethers\' the periphery to the center differently; understanding how they toggle between each other is essential for analyzing any institutional arrangement.',
      },
      {
        slug: 'pdf-there-is-no-economy',
        title: 'There Is No Economy',
        source: 'PDF',
        bridge: 'The economic as a domain of the juridical — debt adjudication, credit administration, the enforcement of originary obligations. The insight that economic relations are juridical relations helps explain why market societies require robust juridical institutions and why their degradation tracks the degradation of the market.',
      },
    ],
    conclusion: `The juridical path does not end; it opens onto everything else. Every domain of Center Study has a juridical dimension: how are disputes settled, how are distributions adjudicated, how is the center\'s authority enforced in cases of conflict? Return to this path after the political and succession paths; the connections will be clearer.`,
    opensOnto: ['political', 'succession-and-sovereignty', 'debt-credit-economic'],
  },

  {
    slug: 'succession-and-sovereignty',
    title: 'Succession and Sovereignty',
    subtitle: 'How power is transmitted, preserved, and singularized — the deepest question of political order.',
    posture: 'declarative',
    intro: `The mode of succession is the most important question for assessing a social order. This path develops that claim in full. It begins with the originary account of how practices are perpetuated, moves through the political theory of sovereignty, and arrives at the specific question of how the center passes in conditions of post-ritual modernity. The path assumes the foundation and political paths.`,
    posts: [
      {
        slug: 'pdf-originary-technics',
        title: 'Originary Technics',
        source: 'PDF',
        bridge: 'Singularized succession in perpetuity as the foundation of any practice — the concept that makes succession not merely a political question but a condition of every domain of human activity. Having established the concept in its most general form, we can now apply it to political sovereignty specifically.',
      },
      {
        slug: 'substack-singularized-succession-in-perpetuity',
        title: 'Singularized Succession in Perpetuity',
        source: 'Substack',
        bridge: 'Bouvard\'s focused treatment of singularized succession as a theoretical concept — how the center is constituted by the practice of pointing at it, and how that pointing must be singularized (not distributed) to generate authority. The concept that makes the succession question precise.',
      },
      {
        slug: 'substack-the-sufficiency-of-singularized-succession-in-perpetuity',
        title: 'The Sufficiency of Singularized Succession in Perpetuity',
        source: 'Substack',
        bridge: 'The argument that singularized succession is not one political concept among others but the concept that makes political analysis adequate to its object. Sufficiency here means: once you have this concept, you can analyze any social order\'s political form.',
      },
      {
        slug: 'gablog-successful-succession',
        title: 'Successful Succession',
        source: 'GABlog',
        bridge: 'The political application: mode of succession as the most important question for assessing a social order. The argument that succession is not incidental to political form but constitutive of it.',
      },
      {
        slug: 'substack-options-on-succession',
        title: 'Options on Succession',
        source: 'Substack',
        bridge: 'The analysis of succession as a set of options — different modes of transmitting authority with different risk profiles, different relationships to the center, and different consequences for institutional legitimacy. A practical application of the theoretical framework.',
      },
      {
        slug: 'pdf-event-origin-center',
        title: 'Event, Origin, Center',
        source: 'PDF',
        bridge: 'Institutional dysfunction as a consequence of failed succession — the argument that the disorder of contemporary institutions reflects the absence of any adequate account of how they should pass their authority forward.',
      },
    ],
    conclusion: `Succession connects every other domain. Every practice has a succession problem; every institution has a mode of transmitting its authority. The question this path leaves you with: what mode of succession is adequate to the practices you are responsible for?`,
    opensOnto: ['political', 'juridical', 'technology-and-scenic-design'],
  },

  {
    slug: 'debt-credit-economic',
    title: 'Debt, Credit, and the Economic',
    subtitle: 'The economy as disguised debt structure — money, capital, and the tributary as originary categories.',
    posture: 'declarative',
    intro: `There is no economy. This is not a polemical claim but a theoretical one: the "economy" as a self-regulating system of exchange between autonomous individuals is an ideological representation that conceals the debt structure it rests on. This path builds the positive account: what is really going on when we exchange, borrow, invest, and price things. The foundation path is required; the political path is helpful.`,
    posts: [
      {
        slug: 'book-anthropomorphics',
        title: 'Anthropomorphics (debt to the center)',
        source: 'Book',
        bridge: 'The originary debt relation — each participant\'s obligation to the center that enabled the scene — as the foundational economic fact. Then: how that originary debt is institutionalized in historical economies.',
      },
      {
        slug: 'gablog-discipline-and-debt',
        title: 'Discipline and Debt',
        source: 'GABlog',
        bridge: 'The Big Man\'s out-gifting as the origin of hierarchical debt — the mechanism by which egalitarian communities become hierarchical ones through the acceptance of asymmetric obligation. Then: how money carries this sacred credit forward.',
      },
      {
        slug: 'pdf-there-is-no-economy',
        title: 'There Is No Economy',
        source: 'PDF',
        bridge: 'The systematic argument that money is a sign of recognition — credit drawn on the sacred — not a medium of exchange invented to solve barter\'s inefficiencies. The "economy" as ideological concealment of the tributary structure.',
      },
      {
        slug: 'substack-originary-debt-credit-succession',
        title: 'Originary Debt, Credit, Succession',
        source: 'Substack',
        bridge: 'Bouvard\'s synthesis of the three core economic-political concepts: originary debt as the condition of all exchange, credit as the institutionalization of deferred debt, and succession as the transmission of credit authority. The essay that most directly connects Center Study\'s economic and political frameworks.',
      },
      {
        slug: 'substack-data-as-currency-and-the-debt-to-the-center',
        title: 'Data as Currency and the Debt to the Center',
        source: 'Substack',
        bridge: 'The contemporary application: data as a form of credit drawn on the center, and the algorithmic economy as a new form of the tributary structure. The argument that digital capitalism is not a break from originary economics but its intensification.',
      },
      {
        slug: 'gablog-debts-and-deferences',
        title: 'Debts and Deferences',
        source: 'GABlog',
        bridge: 'Debt and deferral as paired concepts: the only repayment of the debt to the center is ongoing deferral. The moral-economic dimension: to pay one\'s debt is not to provide an equivalent exchange but to continue the practice of deferral the center demands.',
      },
      {
        slug: 'substack-debits-and-credits',
        title: 'Debits and Credits',
        source: 'Substack',
        bridge: 'A close-grained analysis of the debit/credit structure as it actually operates — the accounting logic of originary economics made concrete. The path\'s most practical text.',
      },
    ],
    conclusion: `The economic path arrives at the question that liberal economics never asks: what is the center against which all this credit is being drawn? Modern financial crises are center crises — failures of the originary credit structure that money represents. The scenic design path develops how institutions might be designed to make this visible and manageable.`,
    opensOnto: ['juridical', 'technology-and-scenic-design'],
  },

  {
    slug: 'language-and-grammar',
    title: 'Language and Grammar',
    subtitle: 'The ostensive, imperative, interrogative, and declarative — and the grammar implicit in the originary scene.',
    posture: 'ostensive',
    intro: `This path points at language. Not language as a system of rules or a medium of communication — language as the deferral of violence, as the conversion of mimetic crisis into shared attention, as the ongoing practice of constituting scenes. The path is ostensive in mode: it indicates, in sequence, the texts that make language legible as an originary phenomenon. Begin by bracketing everything you know about grammar.`,
    posts: [
      {
        slug: 'book-the-origin-of-language',
        title: 'The Origin of Language',
        source: 'Book',
        bridge: 'The foundational account of the four linguistic forms (ostensive, imperative, interrogative, declarative) and their originary precedence. The argument that treating the declarative as primary forecloses the question of origin. Then: what it means to complete the linguistic turn by recognizing the infralinguistic base.',
      },
      {
        slug: 'pdf-linguistic-turn-generative-literacy',
        title: 'The Linguistic Turn and Generative Literacy',
        source: 'PDF',
        bridge: 'The completion of the linguistic turn: from representational to generative, from metalanguage to infralanguage. The argument that all language is scene-dependent. Then: the ethical dimension of language — how attention and responsibility are constitutively linked.',
      },
      {
        slug: 'substack-back-to-grammar',
        title: 'Back to Grammar',
        source: 'Substack',
        bridge: 'Bouvard\'s return to originary grammar as a living analytical tool — not a historical reconstruction but an ongoing practice of thinking from the originary scene. The post demonstrates what it means to "do" originary grammar rather than merely describe it.',
      },
      {
        slug: 'substack-media-technology-and-originary-grammar',
        title: 'Media, Technology and Originary Grammar',
        source: 'Substack',
        bridge: 'The application of originary grammar to contemporary media and technology — the argument that every medium has a grammatical structure derivable from the originary scene. A key bridge between the grammatical and technological paths.',
      },
      {
        slug: 'pdf-attentionality-originary-ethics',
        title: 'Attentionality and Originary Ethics',
        source: 'PDF',
        bridge: 'Joint attention as the ground of ethics — the connection between the originary scene\'s shared attention and the ethical obligations it generates. Language learning as an ethical activity. Then: the full grammatical treatment in Anthropomorphics.',
      },
      {
        slug: 'book-anthropomorphics',
        title: 'Anthropomorphics (Talk of the Center section)',
        source: 'Book',
        bridge: 'The originary grammar of the center as the grammar of signification itself. This is the destination of the language path — the systematic account of how the originary scene generates the rules that govern all meaning-production.',
      },
    ],
    conclusion: `Language is not a tool you use to communicate. It is the scene you inhabit when you think, speak, write, or read. Having read this path, you should be able to identify the scene-dependency of any text, trace its ostensive-imperative-interrogative-declarative structure, and recognize the center it is organized around. That recognition is generative literacy.`,
    opensOnto: ['foundation', 'technology-and-scenic-design', 'self-referential'],
  },

  {
    slug: 'technology-and-scenic-design',
    title: 'Technology and Scenic Design',
    subtitle: 'Technics, media, data, AI, and the design of post-ritual scenes.',
    posture: 'imperative',
    intro: `Attend to the scene. Not to the content that circulates through it, not to the message it transmits, but to the scene itself — the structured space of shared attention that makes any content possible. This path develops Center Study\'s analysis of technology as fundamentally a matter of scenic design: the construction and maintenance of scenes adequate to their deferral function. Bouvard\'s Substack is the primary source here — it is where Center Study most directly engages AI, data, algorithms, and contemporary technics.`,
    posts: [
      {
        slug: 'pdf-originary-technics',
        title: 'Originary Technics',
        source: 'PDF',
        bridge: 'The imperative as the origin of technology — the argument that all technological organization is organized around command structures that originate in the ritual scene. Having established the originary account of technology, we can ask: what happens to that account in conditions of post-ritual modernity?',
      },
      {
        slug: 'substack-intelligence-and-technics',
        title: 'Intelligence and Technics',
        source: 'Substack',
        bridge: 'Intelligence as a form of technics — the argument that the capacity to read and respond to the center\'s affordances is itself a technical skill. This post bridges the originary account of technology with the contemporary analysis of algorithmic intelligence.',
      },
      {
        slug: 'substack-media-as-ritual',
        title: 'Media as Ritual',
        source: 'Substack',
        bridge: 'Media as the successor to ritual — the institution that assumes the function of constituting the center in post-sacrificial conditions. What media does and what it fails to do when measured against the ritual function it has inherited.',
      },
      {
        slug: 'substack-the-grammar-of-technology',
        title: 'The Grammar of Technology',
        source: 'Substack',
        bridge: 'Every technology has a grammar — an ostensive-imperative-declarative structure derivable from the originary scene it enacts. This post is the theoretical core of Bouvard\'s technological analysis.',
      },
      {
        slug: 'pdf-mimesis-center-auto-immunology',
        title: 'Mimesis, the Center and Auto-Immunology',
        source: 'PDF',
        bridge: 'The scaling problem: how do originary concepts apply to large institutional structures? Scenic design and the construction of scenes adequate to the deferral demands of complex societies. The auto-immunological pathology: institutions attacking the forms of centrality that their own function requires.',
      },
      {
        slug: 'substack-being-like-data-the-central-intelligence',
        title: 'Being Like Data; the Central Intelligence',
        source: 'Substack',
        bridge: 'The analysis of AI as a new form of central intelligence — not merely a tool but a new configuration of the center/periphery relation. The implications for how humans orient toward the center in conditions of algorithmic mediation.',
      },
      {
        slug: 'gablog-scenic-design-practices',
        title: 'Scenic Design Practices',
        source: 'GABlog',
        bridge: 'Every practice is scenic design — the redesign of an inherited scene with available techno-media. The synthesis of media analysis and institutional design in the concept of scenic design practices.',
      },
    ],
    conclusion: `Technology is not neutral. It is the medium of the scene, and the scene is the medium of deferral. The question this path leaves you with: what scenes are your practices constructing, and are those scenes adequate to the deferral they are meant to accomplish?`,
    opensOnto: ['succession-and-sovereignty', 'foundation', 'self-referential'],
  },

  {
    slug: 'self-referential',
    title: 'The Self-Referential',
    subtitle: 'The posts where Center Study most explicitly reflects on what it is doing — the meta-discourse that is not a metalanguage.',
    posture: 'declarative',
    intro: `Center Study holds that there is no metalanguage — no position outside language from which language can be described. This path collects the posts where Center Study reflects most explicitly on its own practice: what it is, what it is not, what it costs, and what it demands. These posts are not easier than the others because they are self-reflective; they are more demanding. They require the other paths as background. Read them last, not first.`,
    posts: [
      {
        slug: 'pdf-generative-anthropology-one-big-discipline',
        title: 'Center Study as One Big Discipline',
        source: 'PDF',
        bridge: 'The institutional claim: Center Study as the one big discipline that integrates all others through originary thinking. The argument establishes what Center Study is trying to do and why it requires more than academic scholarship.',
      },
      {
        slug: 'substack-the-transdisciplinarity-of-the-hypothesis',
        title: 'The Transdisciplinarity of the Hypothesis',
        source: 'Substack',
        bridge: 'Bouvard\'s account of why the originary hypothesis is transdisciplinary — not a claim from within any one discipline but a claim about the conditions of all disciplines. The post that most directly articulates Center Study\'s institutional ambition from a contemporary standpoint.',
      },
      {
        slug: 'pdf-introduction-to-disciplinarity',
        title: 'Introduction to Disciplinarity',
        source: 'PDF',
        bridge: 'The analysis of how disciplines are constituted, maintained, and dissolved — and what it means to practice a discipline. This provides the institutional context for understanding what Center Study is as a practice.',
      },
      {
        slug: 'substack-the-prospects-of-the-hypothesis',
        title: 'The Prospects of the Hypothesis',
        source: 'Substack',
        bridge: 'A candid assessment of what the originary hypothesis can and cannot do — its prospects for uptake, elaboration, and institutional survival. The self-reflective text that does not flinch from the hypothesis\'s difficulties.',
      },
      {
        slug: 'pdf-talk-of-the-center-adam-katz',
        title: 'Talk of the Center',
        source: 'PDF',
        bridge: 'The most compact self-reflexive text: how Center Study itself exemplifies the practice of "saying what everyone else is saying" — the discovery of transcendence within mimesis, the translation of group repetition into genuine cultural production.',
      },
      {
        slug: 'book-anthropomorphics',
        title: 'Anthropomorphics (entire)',
        source: 'Book',
        bridge: 'The foundational text as self-reflexive artifact: a work that performs originary grammar while describing it, that occupies the center while theorizing the center\'s occupation, that issues imperatives while analyzing the imperative form. Read it again after reading the other paths.',
      },
    ],
    conclusion: `Center Study cannot describe itself from outside itself. This path ends where every path in this guide ends: back inside the discourse, which is the only place from which the discourse can be understood. The guide is not a substitute for the archive. It is a scene — constructed to make the archive accessible. Now go to the archive.`,
    opensOnto: ['foundation'],
  },
];

export function getPathBySlug(slug: string): ReadingPath | undefined {
  return READING_PATHS.find((p) => p.slug === slug);
}
