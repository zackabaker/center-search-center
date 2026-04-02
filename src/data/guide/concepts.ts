export interface ConceptPassage {
  text: string;
  source: string;
  sourceSlug: string;
}

export interface ConceptPost {
  slug: string;
  title: string;
  note: string;
}

export interface Concept {
  slug: string;
  title: string;
  subtitle: string;
  definition: string;
  body: string;
  relations: string[];
  posts: ConceptPost[];
  passages: ConceptPassage[];
  selfReference: string;
}

export const CONCEPTS: Concept[] = [
  {
    slug: 'the-center',
    title: 'The Center',
    subtitle: 'Signifying center, occupied center, and the paradox at the origin of every human scene',
    definition: 'The center is the focal point of a shared scene — the object, being, or vacancy toward which all participants orient, which their common orientation simultaneously constitutes as sacred. The center is not a place but a posture: the unanimous agreement to face the same way.',
    body: `The center is the most elementary concept in Center Study, which means it is also the one most easily misunderstood. It is not a location in space. It is not a sovereign individual. It is not a metaphor for authority. It is the structural condition that makes a scene a scene — the shared object of attention that binds a group into a group.

Derrida identified the paradox correctly: "the center is at the center of the totality, and yet, since the center does not belong to the totality (is not part of the totality), the totality has its center elsewhere. The center is not the center." He drew the wrong conclusion. The paradox does not dissolve the center — it describes how the center works. The center organizes everything around it while being immune to the distribution it generates. That immunity is precisely what makes it sacred.

**Signifying center and occupied center** are the two modes in which the center exists in any social order. The signifying center is the minimal sacred — the binding force of the scene, the constraint that makes signs signs. The occupied center is the contingent individual or institution that currently embodies the scene's authority. Confusing these two is the most consequential error in political thinking. Anti-centerism — the pathological denial of the center — results from directing resentment at the occupied center and universalizing that resentment into a principle. It produces the paradox of center-occupants who are devoted to opposing the very center they occupy.

**What the center speaks.** The first message from the center is *defer appropriation.* The originary sign is the aborted gesture of reaching — the recognition that taking the object will trigger mimetic violence from all others simultaneously reaching. The center speaks through the constraint it imposes: *this is not yours alone.* Every subsequent message from the center is a variation on this first one.

The center is never absent from human activity. Where it appears absent, it has been displaced — into institutions that disavow their centrality, into procedures that pretend to be centerless, into "the market" or "the conversation" or "the process." These are not alternatives to the center but disguised occupants of it. The diagnostic question is always: *what is the actual center here, and who occupies it?*

**Omnicentrism** — the post-sacrificial condition in which every individual is potentially a center — does not abolish the center but distributes its function across the social order. The imperative of omnicentrism is not that centers disappear but that violent centralization be continuously deferred. That deferral is the moral obligation constituted by the originary scene.`,
    relations: ['originary-scene', 'deferral', 'the-sacred', 'resentment-victimary', 'succession', 'nomos'],
    posts: [
      { slug: 'gablog-how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'The opening post of the archive. Begin here.' },
      { slug: 'pdf-event-origin-center', title: 'Event, Origin, Center', note: 'The center as presupposition of all institutional action, including journalism.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The extended treatment of signifying center vs. occupied center.' },
      { slug: 'pdf-talk-of-the-center-adam-katz', title: 'Talk of the Center', note: 'How all social interaction is organized around the problem of the center.' },
    ],
    passages: [
      {
        text: 'The center is paradoxically within the structure and outside it. The center is at the center of the totality, and yet, since the center does not belong to the totality (is not part of the totality), the totality has its center elsewhere. The center is not the center.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The very operation of all the institutions of information production and provision presupposes an unwavering orientation toward the central authority, regardless of how decentralized things seem, or how impossible we might think it is to locate the sources of power and decision making.',
        source: 'Event, Origin, Center',
        sourceSlug: 'pdf-event-origin-center',
      },
      {
        text: 'Morality would have to be thought of in "vertical" rather than "horizontal" terms — that is, there is no reciprocity that is not mediated by a center.',
        source: 'Nemesis: The Jouvenelian vs. the Liberal Model',
        sourceSlug: 'pdf-nemesis-jouvenelian-liberal-model',
      },
    ],
    selfReference: 'This concept page is itself centered: every other concept in this guide radiates from it. The center of the concept of the center is the originary scene. Look there.',
  },

  {
    slug: 'originary-scene',
    title: 'The Originary Scene',
    subtitle: 'The minimal hypothetical: the hinge between animal appetite and human sign',
    definition: 'The originary scene is the minimal hypothetical reconstruction of the first human event — a group of hominids, a central object of appetite, mimetic crisis, and the simultaneous conversion of the gesture of appropriation into the first sign: this. Not history but heuristic; not myth but method.',
    body: `The originary scene is not a claim about what happened at a specific moment in prehistoric time. It is the minimum you must posit if you want to think seriously about what makes humans human — about where language comes from, where the sacred comes from, where institutions come from — without presupposing any of these things as already given.

The scene: a group of hominids converge on a central object — food, a body, something scarce and desirable. Each begins the gesture of appropriation. Each perceives that the others are making the same gesture simultaneously. That perception introduces mimetic danger: to take is to trigger violence from all others who are also taking. The gesture aborts. The aborted gesture, emitted to all others and received from all others as the same sign, *is* the sign. The first ostensive: *this.* Not "I want this" — that requires already-constituted desire and language. Just: *this.*

**The sign as deferral.** The originary sign defers violence by substituting representation for appropriation. This is why language is the deferral of violence — not metaphorically, not morally, but structurally. The sign *is* the deferral. All subsequent language, all institutions, all cultural productions are elaborations of this single movement: the conversion of mimetic danger into shared attention at a center.

**Unanimity.** The originary scene requires unanimous participation. The sign only works if everyone emits it and everyone receives it simultaneously as the same sign. This unanimity is the origin of the sacred — the binding force that holds the scene together against the centrifugal pull of individual appetite. It is also the origin of equality-on-the-scene: everyone faces the center on equal terms, whatever hierarchies obtain elsewhere.

**Hypothetical minimum.** The originary hypothesis does not claim to reconstruct an actual historical event. It claims to identify the minimum conditions for the emergence of language and the human. If you want to explain how language and the sacred could have come into existence — without presupposing language, the sacred, or any distinctively human capacity — this is the minimum you need. The hypothesis is validated not archaeologically but functionally: it explains what needs to be explained without circular appeal to what it is trying to explain.

**What follows from the scene.** The center is constituted as sacred by the scene. The sign is the originary linguistic form, prior to the declarative sentence. Debt is the original economic relation — each participant owes the center their survival. Resentment is the original moral problem — each participant desired the object and did not get it. The juridical order is the original political problem — who administers the center's dispensation? Every major concept in Center Study is a development of some feature of this scene.`,
    relations: ['the-center', 'deferral', 'the-sacred', 'nomos', 'debt-and-credit', 'ostensive-imperative-declarative', 'resentment-victimary'],
    posts: [
      { slug: 'pdf-the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Katz\'s introduction situates the hypothesis against its main philosophical obstacles.' },
      { slug: 'gablog-how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'The originary scene as the foundation of all communication.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The fullest development of the scene\'s implications for grammar and politics.' },
    ],
    passages: [
      {
        text: 'The originary hypothesis locates the origin of language and hence of the human in the unanimous acceptance of the sign as the deferral of violence on a scene of extreme mimetic danger.',
        source: 'The Origin of Language (Introduction)',
        sourceSlug: 'pdf-the-origin-of-language',
      },
      {
        text: 'If the originary event is event and sign together, then there is no event without the sign being both emitted and iterated by all the participants on the scene — just as memories are not completed until they are recalled, or represented (and are therefore never complete), the event will only have taken place once it is represented in the sign.',
        source: 'Attentionality and Originary Ethics',
        sourceSlug: 'pdf-attentionality-originary-ethics',
      },
    ],
    selfReference: 'This page is itself a scene: you are oriented toward the concept of the originary scene, which points you toward the center. Reading this is already an instance of what it describes — shared attention at a textual center.',
  },

  {
    slug: 'deferral',
    title: 'Deferral',
    subtitle: 'Language as the ongoing suspension of violence through representation',
    definition: 'Deferral is the fundamental function of the sign — the substitution of representation for appropriation that converts mimetic crisis into shared attention. If language is the deferral of violence, then the only thing we are ever talking about is how we are going about deferring violence.',
    body: `The concept of deferral is as simple and as radical as any idea in Center Study. Language — every sentence, every word, every sign — is a deferral of violence. Not a *description* of deferral. Not a *commemoration* of deferral. Deferral itself, in the act.

This is what Katz means when he writes: "If language is the deferral of violence, the only thing we are ever talking about is how we are going about deferring violence." This is not a metaphor or a philosophical allegory. It is a claim about the structural function of every act of communication. When you say anything at all, you are converting the possibility of mimetic conflict into shared attention at a center. You are doing what the originary sign did.

**From appropriation to representation.** The originary sign is the aborted gesture of appropriation — the reaching hand that becomes a pointing hand. Instead of taking the object, the participant represents it: *this.* The representation defers the conflict that taking would trigger. This deferral is the condition of possibility for everything that follows — community, language, culture, institutions. Before deferral, there is only mimetic crisis. After deferral, there is the scene.

**Ongoing deferral.** Deferral is not a historical event that happened once. It is a continuous practice. Every institution, every ritual, every law, every cultural production is a mode of ongoing deferral — a way of maintaining the substitution of representation for appropriation in the face of continuous mimetic pressure. When deferral fails, violence returns. The question that orients all political and institutional analysis is: *what is this deferring, and how well is it deferring it?*

**The linguistic turn completed.** Katz's claim is that the linguistic turn in philosophy — the turn toward language as the medium of all thought — has not been completed. It has been arrested at the level of the declarative sentence, which presupposes language as already given. Completing the linguistic turn means moving to the infralinguistic level — the level where the sign is still the deferral of a gesture, where language is still the conversion of mimetic danger into shared attention. At that level, "language is going to be generative even if we act as if it is representational."

**Deferral and institutions.** Every institution can be analyzed as a deferral mechanism. The question is not whether institutions defer violence — they all do — but *how* they defer it, *how well*, and at *what cost*. Institutions that pretend to be centerless, that deny their own deferral function, tend to defer less effectively. The pathology of modernity is not too much deferral but deferral that disavows itself.`,
    relations: ['originary-scene', 'the-center', 'the-sacred', 'ostensive-imperative-declarative', 'scenic-design'],
    posts: [
      { slug: 'pdf-linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The fullest statement of deferral as language\'s function.' },
      { slug: 'gablog-how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'Deferral as the first message from the center.' },
      { slug: 'pdf-talk-of-the-center-adam-katz', title: 'Talk of the Center', note: 'How all cultural production is organized around deferral.' },
    ],
    passages: [
      {
        text: 'Language is going to be generative even if we act as if it is representational — pretensions to a secure metalanguage really serve to guarantee a moral or political certainty that avoids the problem of creating in some space of language the shared attention directed towards some center.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'pdf-linguistic-turn-generative-literacy',
      },
      {
        text: 'The linguistic turn entails a hypothesis: that the metaphysical scene of humanism, predicated upon the metalinguistics of literacy, has reached its limits as a means of deferring violence.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'pdf-linguistic-turn-generative-literacy',
      },
    ],
    selfReference: 'This page defers the question of what deferral really is by pointing you toward the texts. That deferral is not evasion — it is the only honest way to proceed. The concept can only be understood from inside the practice.',
  },

  {
    slug: 'ostensive-imperative-declarative',
    title: 'Ostensive / Imperative / Declarative',
    subtitle: 'The three primary linguistic forms in their originary order',
    definition: 'The three primary forms of language in order of originary precedence: the ostensive points (this); the imperative commands (bring this, do not take); the declarative claims (this is the case). The error of treating the declarative as primary — the error of metaphysics — forecloses the question of origin.',
    body: `The ostensive, the imperative, and the declarative are not merely three types of sentences. They are the three fundamental postures of the sign, each requiring the previous one, each making available the next. Getting their order right is the condition of possibility for any genuine thinking about language, institutions, or human action.

**The ostensive** is the originary form. The aborted gesture of appropriation — the pointing hand — is the first ostensive. It says nothing more than *this.* It constitutes the center by pointing at it. All subsequent ostensives — names, designations, deictics — inherit this pointing function. The ostensive requires a scene: someone pointing at something for someone else. There is no ostensive without shared attention.

**The imperative** is the second form and the origin of technology. Before you can tell someone what is the case (declarative), you must be able to tell them what to do (imperative). The imperative is the first form of address — it constitutes the other as someone who can respond to a command. Katz argues that the imperative is prior to the declarative not only logically but anthropologically: it is the form of the Big Man's address to his followers, the king's command, the ritual directive. Every technology is organized around imperative exchange: the chain of commands that accomplishes what no individual could accomplish alone.

**The declarative** is the most recent and most powerful form. It is the form that claims to describe the world — "This is the case," "X is Y." The declarative is the form of science, philosophy, law, journalism. It appears to be the most fundamental form because it is the form that literacy enshrines. When you learn to read, you learn that written language is primarily declarative — sentences that state facts, propositions that claim truth or falsity. This appearance is an artifact of literacy, not a fact about language.

**Metaphysics' error.** If you assume the declarative is the primary linguistic form, you will never think to ask where it came from. The question of the origin of language becomes unaskable: language is already there, already capable of stating facts, and the question is merely how those facts are represented in it. This forecloses the originary question entirely.

**Completing the linguistic turn** requires recognizing that every declarative sentence is embedded in a scene — a scene constituted by ostensives and imperatives. The declarative *claims* to float free of that scene, to describe the world from nowhere. That claim is the illusion of metalanguage. Center Study works infralinguistically — not by abandoning the declarative, but by keeping visible the ostensive and imperative base from which every declarative emerges.

**The rhetorical posture of each section of this guide** is itself a performance of this sequence: the entry point is ostensive (*this*), the concept pages are imperative (*attend to this*), the reading paths are declarative (*this is how to proceed*).`,
    relations: ['originary-scene', 'deferral', 'originary-grammar', 'scenic-design', 'the-center'],
    posts: [
      { slug: 'pdf-the-origin-of-language', title: 'The Origin of Language', note: 'Gans\'s foundational account of the three forms.' },
      { slug: 'pdf-linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The error of treating the declarative as primary.' },
      { slug: 'pdf-originary-technics', title: 'Originary Technics', note: 'The imperative as the origin of technology.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The originary grammar that follows from the three forms.' },
    ],
    passages: [
      {
        text: 'If you assume that the declarative sentence is the primary linguistic form, you will never think to ask, or to think one can ask, whence it derived — even if a moment\'s reflection must convince us that it must have derived from some previous linguistic form.',
        source: 'The Origin of Language (Introduction)',
        sourceSlug: 'pdf-the-origin-of-language',
      },
    ],
    selfReference: 'This page is imperative in mode: it commands you to attend to the order of the forms. It cannot prove its claim without already using all three forms simultaneously. That circularity is not a defect — it is what the concept predicts.',
  },

  {
    slug: 'the-sacred',
    title: 'The Sacred',
    subtitle: 'The minimal binding force that makes a sign a sign for everyone simultaneously',
    definition: 'The sacred is not the numinous or the supernatural but the minimal guarantor of meaning — the constraint that makes a sign bind all participants on the scene simultaneously. The sacred inheres in the profane use of language in the constraint of meaning; it is what makes communication possible at all.',
    body: `The sacred is among the most misused concepts in modern thought, which is why it needs to be recovered with precision. The sacred is not religion. It is not mystery. It is not the supernatural. It is the minimal binding force that makes a sign a sign — the constraint that ensures that when you point at the center, everyone on the scene orients toward the same thing.

On the originary scene, the first sign is sacred in the precise sense that it binds everyone simultaneously. The participants do not each independently decide to emit the sign; the sign emerges simultaneously from all of them, and it binds all of them to the same center, and that binding is not a social contract made between autonomous individuals — it is the constitutive event of sociality itself. The sacred is this binding, prior to any individuals who might be bound by it.

**The minimal sacred.** Katz identifies what he calls the "minimal sacred" — the sacred that inheres in ordinary language use, in the constraint of meaning that makes a word mean the same thing for speaker and hearer. This minimal sacred is too weak to support a god or a ritual order, but it is the condition of possibility for all communication. Without it, signs would be private — each speaker's sign meaning something different from each hearer's reception of it. The minimal sacred is what prevents that collapse.

**Liturgical and secular sacrality.** Katz distinguishes between liturgical sacrality (which confers generative power on God) and secular sacrality (which confers generative power on humans). This distinction is more useful than sacred/secular because it recognizes that modernity does not abolish the sacred — it relocates it. The rights of the individual, the will of the people, the dignity of the person — these are secular sacralities. They perform the same binding function as liturgical forms; they differ in what they name as the generative source.

**Post-sacrificial sacrality.** The Christian revelation — in Center Study's reading — is the revelation that the victim is innocent, that the scapegoat mechanism is a mechanism and not a cosmic necessity. This revelation evacuates the sacrificial sacred without abolishing the sacred as such. What remains is the obligation to defer violent centralization — a moral imperative that Katz describes as the only possible repayment of the debt to the center that revealed our own potential centrality.

**The sacred and the center.** The center is sacred — its binding force over the scene is the sacred's function. To occupy the center is to borrow the sacred's authority. This borrowing is always precarious: the occupied center can always be challenged by appeal to the signifying center — the sacred itself.`,
    relations: ['the-center', 'originary-scene', 'nomos', 'resentment-victimary', 'debt-and-credit'],
    posts: [
      { slug: 'pdf-esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The most sustained treatment of sacred/significant distinction and modernity\'s sacralities.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Post-sacrificial centrality and the debt to the center.' },
      { slug: 'pdf-the-origin-of-language', title: 'The Origin of Language', note: 'The sacred as constitutional to the originary scene.' },
    ],
    passages: [
      {
        text: 'The sacred inheres in the "profane" use of language in the constraint of meaning that binds the sign independently of any ritual context. This minimal sacred inherent in the laws of language is too weak to support a god or a law of ritual sacrifice; it can guarantee only the most parsimonious of anthropologies.',
        source: 'The Esthetic, the Sacred, and Originary Modernity',
        sourceSlug: 'pdf-esthetic-sacred-originary-modernity',
      },
      {
        text: 'Rather than sacred and secular, I would propose we distinguish between the liturgical and the secular, as different modes of sacrality conferring upon either God or humans respectively the generative power constitutive of a given institution or practice.',
        source: 'The Esthetic, the Sacred, and Originary Modernity',
        sourceSlug: 'pdf-esthetic-sacred-originary-modernity',
      },
    ],
    selfReference: 'The sacred is what makes this text binding as a text — the constraint of meaning that makes these words mean the same things for writer and reader. Without that minimal sacred, this page would be noise.',
  },

  {
    slug: 'nomos',
    title: 'Nomos',
    subtitle: 'The originary distribution — the division of the center\'s dispensation among its participants',
    definition: 'Nomos is the originary act of distribution — the apportionment of the center\'s dispensation among the participants in proportion to their contributions. Before rights, before law, before contracts: the nomos. Rights without corresponding obligations are incoherent because they deny the originary distribution that constitutes them.',
    body: `Nomos is Carl Schmitt's term for the originary division of land that constitutes a political order — the first appropriation and distribution that establishes who belongs to the community and what they are owed. Center Study accepts the term and extends it: nomos is not only the origin of law but the origin of any social distribution that can claim legitimacy.

The originary scene already has a nomic structure: the central object is not immediately distributed, but the distribution that follows — the communal consumption of the sacrificial feast, the equal access to the center's dispensation — is the first nomos. Everyone who participated in the scene, everyone who emitted the sign and deferred appropriation, is owed a share of the center's output. That is the originary distribution.

**Rights and obligations.** The most important implication of nomos for political theory is this: rights without corresponding obligations are incoherent. If a right is a share of the center's dispensation, it is a share earned through participation — through the deferral of appropriation that the scene demands. To have a right without an obligation is to claim the center's dispensation without having participated in the scene that constitutes it. Katz: "we will never be able to imagine it makes sense to think of rights without corresponding obligations" once we think through the center and its distributions.

This is why liberal rights theory is incoherent from a Center Study perspective — not because rights are bad, but because the liberal account of rights suppresses the scene that generates them. Rights are presented as natural, pre-political, individual — as if they existed before any scene, before any center, before any distribution. But rights are claims on a center's dispensation, and they are only intelligible against the background of a scene that constitutes the center and its obligations.

**Nomos and legitimacy.** A judge or ruler who respects the nomos is legitimate; one who does not is not. The nomos is not positive law — it is the pre-legal distribution that positive law either honors or violates. When positive law violates the nomos, resentment follows — not as a psychological failing but as the structural consequence of the violation of the originary distribution.

**Nomos and conquest.** Schmitt emphasized the conquest dimension: the nomos arises from the seizure and distribution of land among the conquerors, in proportion to their martial contributions. Center Study accepts this but insists that the martial distribution is itself a secondary instance of the originary distribution. The originary distribution is at the scene; conquest is its historical repetition.`,
    relations: ['the-center', 'originary-scene', 'the-juridical', 'debt-and-credit', 'succession', 'resentment-victimary'],
    posts: [
      { slug: 'gablog-sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', note: 'Primary treatment of nomos in relation to sovereignty and legitimate judgment.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Nomos as originary distribution and the incoherence of rights without obligations.' },
    ],
    passages: [
      {
        text: 'In the case of conquest, distribution takes the form of what Carl Schmitt called the "Nomos," an originary division of land among the participants in the conquest, no doubt proportional to their respective contributions. If we think of the center as the source of distribution and also as the effect of its distributions, we will never be able to imagine it makes sense to think of rights without corresponding obligations.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
    ],
    selfReference: 'This page distributes the concept of nomos to the reader. That distribution is already a nomic act: you receive this concept in proportion to your willingness to engage the scene it points at.',
  },

  {
    slug: 'succession',
    title: 'Succession',
    subtitle: 'Singularized succession in perpetuity — how the center passes, and what that reveals',
    definition: 'Succession is the mode by which the center passes from occupant to occupant — the most revealing fact about any social order. Every practice depends on singularized succession in perpetuity: the selection and training of a single successor who will continue the practice in its integrity. The mode of succession is the most important question for assessing a social order.',
    body: `Succession is not merely a political question about who gets power next. It is the fundamental question about how any practice, any institution, any order maintains itself through time. How the center passes is how the center is: the mode of succession reveals everything about what the center is taken to be and what obligations it carries.

**Singularized succession in perpetuity.** Katz introduces this concept in *Originary Technics* as the foundation of any practice. A practice — any practice, from cooking to rulership — is constituted by the conditions for its own perpetuation. This means: identifying the conditions that prepare suitable candidates, providing the resources and training, ensuring public recognition and acceptance. Most importantly, it means: the current occupant of the center selects and cultivates a single successor. This singularization — not committee, not election, not inheritance, but the deliberate choice of one — is what preserves the integrity of the practice.

The alternative — succession by committee, by popular vote, by competitive market — distributes the responsibility for succession across many hands and so ensures that no one is fully responsible for it. The practice degrades, not necessarily quickly, but inevitably. The successor chosen by a committee inherits the committee's compromises rather than the practice's demands.

**Only a ruler who can see to the continuing perfection of his practices of rule in perpetuity can be said to be ruling.** This means: a ruler who cannot identify a successor, who does not actively prepare one, who treats succession as someone else's problem — is not ruling. He is occupying the center without fulfilling its obligations. The center's obligation is not merely to govern the present but to guarantee the future of governance.

**Mode of succession and social order.** Every society has a mode of succession, and that mode is not incidental to the society's character — it *is* the society's character. Hereditary monarchies, electoral democracies, revolutionary vanguard parties, meritocratic technocracies — each has a theory of who is qualified to occupy the center and how that qualification is determined and transmitted. None of these theories is neutral; each reflects a particular understanding of what the center is for.

**Succession as the political question.** Contemporary political thought focuses almost entirely on the question of *who* should occupy the center — which candidate, which party, which policy. Center Study insists that the more fundamental question is: *how* should the center pass? The answer to that question determines the quality and character of every specific occupant.`,
    relations: ['the-center', 'the-juridical', 'scenic-design', 'nomos', 'debt-and-credit'],
    posts: [
      { slug: 'gablog-successful-succession', title: 'Successful Succession', note: 'The primary essay on succession as the most important political question.' },
      { slug: 'pdf-originary-technics', title: 'Originary Technics', note: 'Singularized succession in perpetuity as the foundation of practice.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The center\'s current occupant chooses the successor.' },
    ],
    passages: [
      {
        text: 'The foundation of any practice, in that case, is what I am calling "singularized succession in perpetuity." Whatever is involved in considering the conditions that might prepare a wide enough range of suitable candidates, available resources, training, public recognition and acceptance, even participation in practices of succession — all that is part of the practice.',
        source: 'Originary Technics',
        sourceSlug: 'pdf-originary-technics',
      },
      {
        text: 'Only a ruler who can see to the continuing perfection of his practices of rule in perpetuity can be said to be ruling. Ruling involves ruling through technology, so it is ordered governance, which means continuity at the center, which comprises scenic design.',
        source: 'Originary Technics',
        sourceSlug: 'pdf-originary-technics',
      },
    ],
    selfReference: 'This concept page has a successor: the concept of the juridical order. What the juridical does is adjudicate the disputes that arise when succession is contested. Go there.',
  },

  {
    slug: 'the-juridical',
    title: 'The Juridical',
    subtitle: 'The capacity to judge — to determine what the center demands in a case of conflict',
    definition: 'The juridical is not mere law but the scene of binding determination — the capacity to judge what the center demands in cases of conflict, and to enforce that judgment with the center\'s authority. The juridical order is the maintenance of the scene against the centrifugal pull of individual interest.',
    body: `The juridical is the function of judgment — the capacity to determine, with binding force, what the center requires in a case where participants disagree. Every social order has a juridical function, whether it is named as such or not. The question is not whether there is a juridical order but whether it is adequate to the conflicts it is asked to resolve.

**The judge and the nomos.** A judge is legitimate insofar as she respects the nomos — the originary distribution that constitutes the community. This is not to say that a judge must apply positive law mechanically; the nomos is prior to positive law. When positive law violates the nomos, the judge who applies the law mechanically is complicit in the violation. The judge who respects the nomos must sometimes set aside positive law to honor the deeper distribution it pretends to serve.

**The juridical and debt.** The juridical order is the institutional mechanism for administering the debts that constitute the community. Every community member owes a debt to the center; the juridical order determines the specific form of that debt for each member, adjudicates disputes about its extent and satisfaction, and enforces its payment. Adjudication is therefore not a neutral technical function — it is the ongoing administration of the community's foundational debt structure.

**The juridical and the scene.** Katz's concept of scenic design is directly relevant to the juridical: the courtroom is a scene, and its design is not incidental to the judgments it produces. Who sits where, who speaks in what order, what evidence is admissible, what constitutes an authoritative source — these scenic choices determine what kinds of judgments are possible. A juridical order that disavows its scenic conditions produces distorted judgments.

**Victimary juridicalism.** The contemporary tendency to expand the juridical order to cover more and more domains of social life — to treat every conflict as a legal violation, every injury as a rights-claim, every inequality as a justiciable grievance — is a symptom of the failure of other deferral mechanisms. When the juridical expands to fill the space left by failing institutions, it cannot perform its own function adequately. The juridical order requires a stable social scene; it cannot be the primary source of social order itself.`,
    relations: ['nomos', 'the-center', 'succession', 'debt-and-credit', 'resentment-victimary'],
    posts: [
      { slug: 'gablog-sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', note: 'The connection between sovereignty, judgment, and legitimate speech.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The juridical as maintenance of the scene.' },
    ],
    passages: [
      {
        text: 'The only possible repayment of this debt is to defer violent centralization wherever one sees it.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
    ],
    selfReference: 'This page adjudicates the concept of the juridical. It cannot do so without already being an instance of the juridical function — the rendering of a determination that claims binding force. You may appeal.',
  },

  {
    slug: 'debt-and-credit',
    title: 'Debt and Credit',
    subtitle: 'The primary economic relation — not exchange but obligation to the center',
    definition: 'Debt is the foundational economic category — the obligation incurred by each participant in the originary scene toward the center that enabled their survival and constituted them as social beings. There is no economy, only the debt to the center. Money is the concrete realization of the sign of recognition: credit drawn on the sacred.',
    body: `Modern economics assumes that exchange — the barter of goods between autonomous individuals — is the foundation of economic life. Center Study dissolves this assumption. Before exchange, before market, before the "economy": the debt. Every participant in the originary scene incurred a debt to the center the moment the center's dispensation was distributed. That debt is not a contract between equals; it is the constitutive obligation of social membership.

**No economy — only debt.** Katz and Baker's essay "There Is No Economy" makes the argument directly: "Thinking through the center, and the transactions humans have with the center, reveals the 'economy' as nothing more than an ideological representation of our more primary debt relationship with the center." The "economy" — the self-regulating system of exchange governed by supply and demand — is not a natural fact. It is an ideological construction that conceals the debt structure it emerges from.

**Money as sign of recognition.** Money is not a medium of exchange invented to facilitate barter. It is the concrete realization of the sign of recognition — the sign that acknowledges the center's generative authority and circulates its dispensation. Money "bears a 'meaning' but as opposed to the ordinary sign, it is a credit drawn on the sacred that cannot be freely reproduced." The scarcity of money is not an accidental feature of monetary systems — it is the sign of the sacred's scarcity, the irreducibility of the center to any individual claimant.

**The Big Man and unpayable debt.** The transition from egalitarian communities to hierarchical ones is accomplished through debt. The Big Man out-gifts everyone: he gives more than can be repaid, thereby rendering everyone dependent on him for "merit-based" reasons. This is not coercion — it is the acceptance of asymmetric obligation. The community is indebted to the Big Man in the same way that community members are indebted to the center: they cannot repay the debt by equivalent exchange; they can only repay it through continued participation in the scene the Big Man constitutes.

**Credit and deferred obligation.** If debt is the primary economic category, credit is its temporal extension: the forward projection of the debt relationship. To extend credit is to advance the center's dispensation before it has been earned. All economic activity — investment, production, innovation — is organized around this forward projection. The question is always: what is the center against which this credit is drawn, and is that center adequate to the credit issued in its name?

**The only repayment.** Katz's formulation from *Anthropomorphics* should be understood as an economic statement, not only a moral one: "The only possible repayment of this debt is to defer violent centralization wherever one sees it." Deferral is payment. Every act of genuine deferral — every act that converts mimetic danger into shared attention at a center — repays something of what is owed. The debt is never fully discharged, which is why the deferral must be ongoing.`,
    relations: ['the-center', 'originary-scene', 'nomos', 'the-juridical', 'succession', 'scenic-design'],
    posts: [
      { slug: 'pdf-there-is-no-economy', title: 'There Is No Economy', note: 'The primary essay — economy as ideological disguise for the debt structure.' },
      { slug: 'gablog-discipline-and-debt', title: 'Discipline and Debt', note: 'The Big Man and the origin of hierarchical debt.' },
      { slug: 'gablog-debts-and-deferences', title: 'Debts and Deferences', note: 'Debt and deferral as paired concepts.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Post-sacrificial debt: the only repayment is ongoing deferral.' },
    ],
    passages: [
      {
        text: 'Thinking through the center, and the transactions humans have with the center, reveals the "economy" as nothing more than an ideological representation of our more primary debt relationship with the center.',
        source: 'There Is No Economy',
        sourceSlug: 'pdf-there-is-no-economy',
      },
      {
        text: 'Money is the concrete realization of this sign of recognition; it bears a "meaning" but as opposed to the ordinary sign, it is a credit drawn on the sacred that cannot be freely reproduced.',
        source: 'There Is No Economy',
        sourceSlug: 'pdf-there-is-no-economy',
      },
    ],
    selfReference: 'The reader is now indebted to this text for what it has made available. The only repayment is to read the posts it points toward and extend the analysis.',
  },

  {
    slug: 'scenic-design',
    title: 'Scenic Design',
    subtitle: 'The construction of scenes for adequate information flow — technics, media, and the post-ritual order',
    definition: 'Scenic design is the arrangement of people, media, infrastructure, and practice such that participants can orient toward a common center and receive its directives. Every practice is scenic design — the redesign of an inherited scene with available techno-media. The post-ritual order requires explicit scenic design where ritual once did the work automatically.',
    body: `The most important conceptual contribution of Center Study to the analysis of technology and institutions is the concept of scenic design. It is also one of the least developed — which is why Katz notes that he cannot recall discussions in GA that "take the notion of the 'scenic' literally enough to consider that scenes need to be constructed."

**What a scene requires.** A scene is not merely a location. It is a structured space in which participants can share attention at a center. A scene requires: a center that all participants can orient toward; a medium through which the center's dispensation can be distributed; a temporal structure that regulates the sequence of actions; and participants who understand their roles. When any of these conditions fails, the scene fails — attention fragments, the center becomes inaccessible, the community's deferral mechanism breaks down.

**Every practice is scenic design.** Katz: "Every practice is designing a scene; or, really, redesigning a scene, or some portion of a scene, with the techno-media available." This means that institutional design — the design of hospitals, schools, courtrooms, markets, parliaments, platforms — is fundamentally scenic design. The question is not only *what* these institutions do but *what scene* they constitute, and whether that scene is adequate to the deferral it is meant to accomplish.

**Techno-media.** The material conditions of scenic design — the "techno-media" — are not neutral instruments. They shape what kinds of scenes are possible. The printing press makes possible a scene constituted by silent individual reading, which is a different scene from the sermon. Television makes possible a scene constituted by passive reception, which is a different scene from debate. Digital platforms make possible a scene constituted by algorithmic curation, which is a different scene from editorial judgment. Each techno-media configuration has its own centripetal and centrifugal forces, its own affordances and limitations for shared attention.

**Post-ritual scenic design.** In ritual orders, the scene was constituted automatically — the ritual's form encoded the scene's requirements. No one needed to design the scene explicitly; the tradition carried the design. In post-ritual orders, the tradition has been dissolved without adequate replacement. Institutions must now explicitly design their scenes or inherit degraded scenes from historical accident. The pathology of contemporary institutions — their inability to maintain shared attention, their susceptibility to factional capture, their tendency to produce anti-institutional resentment — is partly a failure of scenic design.

**Data as scenic medium.** Contemporary governance depends on data — the flow of reliable signs from the periphery to the center and back. Data is not merely information; it is the medium of the post-ritual scene. The design of data flows, data structures, and data institutions is scenic design in the most direct sense. Who controls the center's information receives the center's power.`,
    relations: ['deferral', 'succession', 'ostensive-imperative-declarative', 'the-center', 'anthropomorphics'],
    posts: [
      { slug: 'gablog-scenic-design-practices', title: 'Scenic Design Practices', note: 'The primary essay on scenic design as the synthesis of practice and technology.' },
      { slug: 'pdf-mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', note: 'The extension of scenic thinking to institutional pathology.' },
      { slug: 'pdf-originary-technics', title: 'Originary Technics', note: 'Technology as organized around imperative exchange and scenic control.' },
    ],
    passages: [
      {
        text: 'I can\'t recall any discussions in GA that take the notion of the "scenic" literally enough to consider that scenes need to be constructed, and constructed in such a way as to shape actions so as to keep all members of the group in conformity with the constraints and affordances of the scene itself.',
        source: 'Mimesis, the Center and Auto-Immunology',
        sourceSlug: 'pdf-mimesis-center-auto-immunology',
      },
      {
        text: 'Every practice is designing a scene; or, really, redesigning a scene, or some portion of a scene, with the techno-media available.',
        source: 'Scenic Design Practices',
        sourceSlug: 'gablog-scenic-design-practices',
      },
    ],
    selfReference: 'This guide is a scenic design artifact — an attempt to construct a scene in which the reader can orient toward the center of Center Study. Its failures are scenic failures.',
  },

  {
    slug: 'anthropomorphics',
    title: 'Anthropomorphics / Metaperson',
    subtitle: 'The originary grammar of the center — the constituted subject as product of the scene',
    definition: 'Anthropomorphics is the originary grammar of the center: the study of how persons are constituted through their participation in scenes centered on a sacred object. The metaperson is not an autonomous individual who then enters social relations but a subject constituted by those relations from the start — whose very selfhood is an effect of the scene.',
    body: `The title *Anthropomorphics* does not mean the attribution of human characteristics to non-human things. It means the grammar of the human figure — the rules that determine how persons are generated, constituted, and sustained through their participation in scenes. This grammar is "originary" in the precise sense: it derives from the originary scene, which is the scene of human constitution itself.

**The constituted subject.** The deepest challenge to modern anthropology is the challenge to the category of the individual. Liberal political theory — and most social theory — begins with the individual as a pre-given unit: persons with desires, interests, rights, and identities who then enter social relations. Center Study inverts this picture. The person is not prior to the scene but produced by it. The subject who says *this* on the originary scene is constituted by that very act of pointing — the mimetic pressure, the shared attention, the sacred binding. There is no subject before the scene; there is only the scene, and the subject is its product.

**The metaperson.** The metaperson is the individual understood as a center in its own right — as someone who can be addressed by the center, who can embody the center's authority in a specific domain. The emergence of the metaperson is the emergence of individuality as a post-sacrificial possibility: the recognition that each person is potentially a center, potentially a locus of the sacred's authority, and therefore not to be sacrificed. This recognition is the specific moral contribution of the Christian revelation as Center Study reads it.

**Pedagogy as fundamental.** Katz argues that pedagogy is "the most fundamental human relation." The constituted subject is always constituted through instruction — through the transmission of practices, concepts, and orientations from those who have them to those who do not. This means that the master-student relation is not incidental to human development but constitutive of it. Every scene of education is a scene of constitution: the student becomes capable of new orientations by orienting toward a teacher who models them.

**Originary grammar.** The grammar implicit in the originary scene is not the grammar of any particular language but the grammar of signification itself — the rules for how signs work, how scenes are constituted, how attention is directed and maintained. Katz's project in *Anthropomorphics* is to make this grammar explicit: to identify the minimal rules that govern all human meaning-production, from the originary sign to contemporary institutional discourse.

**The individual as artifact.** Katz agrees with C.A. Bond's Jouvenelian analysis: the modern individual is not a natural social unit but an artifact created through specific power dynamics — particularly the dissolution of intermediate institutions by final power centers seeking to consolidate authority. The "individual" is a product of specific historical processes, not a metaphysical given. This does not mean individuals are not real; it means that their reality is scenic and relational, not autonomous and pre-given.`,
    relations: ['originary-scene', 'the-center', 'the-sacred', 'scenic-design', 'succession', 'originary-grammar'],
    posts: [
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The foundational text — read this first for the full grammatical treatment.' },
      { slug: 'pdf-generative-anthropology-one-big-discipline', title: 'Generative Anthropology as One Big Discipline', note: 'The institutional implications of anthropomorphics.' },
      { slug: 'gablog-the-marginal-anthropomorph', title: 'The Marginal Anthropomorph', note: 'The pointman as the constituted subject at the periphery who models deferral.' },
    ],
    passages: [
      {
        text: 'There can\'t really be a more fundamental human relation than pedagogy, and firstness on the originary scene and thereafter is really a pedagogical relation; even more, a linguistic pedagogy relation. Pedagogy is fractally hierarchical.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'This is what creates the possibility for each and every one of us to become a center — that is, as one who is not to be sacrificed or violently centralized. We owe the God who has revealed this to us everything, which is to say all that makes up our own centrality.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
    ],
    selfReference: 'The reader of this page is being constituted as a reader of Center Study by the act of reading it. That constitution is the anthropomorphic process in action.',
  },

  {
    slug: 'resentment-victimary',
    title: 'Resentment and Victimary Thinking',
    subtitle: 'The structural consequence of centeredness — and its pathological universalization',
    definition: 'Resentment is not a psychological failing but the structural consequence of centeredness: every periphery harbors the desire of the center it cannot reach. Victimary thinking universalizes this resentment into the governing political grammar of modernity, framing every inequality as an instance of oppression requiring a persecutor and an innocent victim.',
    body: `Resentment is the unavoidable product of the originary scene. Every participant desired the central object. The sign that deferred appropriation also deferred satisfaction. The equality-on-scene — everyone facing the same center on the same terms — is not a compensation for the frustration of desire; it is a transformation of it. Desire becomes the desire to occupy the center rather than to take the object. That desire, structurally frustrated for most participants most of the time, is resentment.

**Resentment is not a character defect.** It is an originary structural feature of any scene with a center. To have resentment is to have a center; to have a center is to have participants who desire it and cannot reach it. The question is not how to eliminate resentment — that would require eliminating the center, which would eliminate the scene, which would eliminate human social life — but how to channel it productively.

**Productive and destructive resentment.** Resentment is destructive when it is directed at the occupied center with the aim of eliminating it — when the resentful participant seeks not to occupy the center but to destroy it. It is productive when it generates the disciplines and practices that make the resentful participant more capable of occupying the center — when resentment becomes motivation for the hard work of self-improvement. Philosophy and drama, Katz argues, are historically the primary modes of productive resentment: they convert the frustrated desire for the center into the discipline of approaching it intellectually and aesthetically.

**Victimary thinking.** The victimary is resentment universalized and institutionalized. Victimary thinking takes the individual's frustration at not reaching the center and transforms it into a structural account of social organization: the world is divided into oppressors (those who occupy the center illegitimately) and victims (those who have been excluded from it). Every inequality becomes evidence of oppression; every privilege becomes a violation of rights; every hierarchy becomes an injustice. The victimary political grammar — which Katz traces to the twin icons of World War II, Auschwitz and Hiroshima — has become the dominant moral language of modernity.

**Anti-centerism.** The deepest pathology generated by the victimary is anti-centerism — the principled opposition to centers as such, the claim that any occupied center is ipso facto illegitimate. Anti-centerism does not abolish centers; it produces center-occupants who are devoted to opposing the center they occupy. This is the characteristic pathology of contemporary liberal institutions: they cannot affirm their own authority, cannot defend their own centrality, and therefore cannot perform the deferral function that is the only justification for their existence.

**The implied center in victimary discourse.** Every act of victimary resentment implies a center that it appeals to — a standard of justice, a vision of how things should be distributed, an authority that could redress the grievance. The victimary cannot abolish the center; it can only transfer allegiance from the occupied center to a projected ideal center. Center Study's task is to make that implied center visible and to ask whether it is adequate to the obligations it is being asked to discharge.`,
    relations: ['the-center', 'originary-scene', 'the-sacred', 'nomos', 'succession', 'anthropomorphics'],
    posts: [
      { slug: 'pdf-the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Victimary humanism as the primary obstacle to the originary hypothesis.' },
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Resentment toward the Big Man and its productive and destructive channels.' },
      { slug: 'pdf-nemesis-jouvenelian-liberal-model', title: 'Nemesis: The Jouvenelian vs. the Liberal Model', note: 'Anti-centerism as the pathology of liberal modernity.' },
    ],
    passages: [
      {
        text: 'Victimary thinking, as a product of the twin iconic markers of World War II, Auschwitz and Hiroshima, frames all inequalities as instances of "oppression," to which the Nazi-Jew model can be applied.',
        source: 'The Origin of Language (Introduction)',
        sourceSlug: 'pdf-the-origin-of-language',
      },
      {
        text: 'We need to "care" about in order to transition to the "contributory," to be blunt, is a pathological anti-centerism.',
        source: 'Event, Origin, Center',
        sourceSlug: 'pdf-event-origin-center',
      },
    ],
    selfReference: 'The reader who resists this account of resentment is already demonstrating it — the desire to exempt oneself from a structural analysis is the resentful desire to be the exception. Note that and proceed.',
  },

  {
    slug: 'pointman-uninsurable',
    title: 'The Pointman / The Uninsurable',
    subtitle: 'The marginal figure who occupies the exposed position and models deferral for the community',
    definition: 'The pointman occupies the leading edge of deferral — the exposed position where risk cannot be hedged, where conventional calculations fail, where direct orientation toward the center is required. The uninsurable is that which falls outside the actuarial calculus of managed risk, demanding scenes that no institutional routine can provide.',
    body: `The pointman is the figure who is most disciplined — who has the longest time preference, who is most capable of sustained deferral, who is most oriented toward the center rather than toward immediate satisfaction. Katz describes these individuals as people who "will therefore seek each other out, recognize one another, and model modes of deferral for the less disciplined." The pointman is not necessarily at the center; she is at the periphery, but oriented toward it with a precision and commitment that others lack.

**The marginal position.** The pointman's characteristic position is the margin — not the center but the edge of the scene, where the constraints of the scene's conventions are loosest and the demands of actual deferral are most acute. The margin is where new deferral practices are developed, tested, and eventually transmitted back to the center. Every significant cultural and institutional innovation begins at the margin, among pointmen who can sustain orientation toward the center without the support of conventional routines.

**The uninsurable.** Insurance is the actuarial management of risk: the distribution of predictable losses across a large population, making each individual's exposure manageable. The uninsurable is the risk that cannot be actuarially managed — the catastrophic, the unprecedented, the structurally excluded. The uninsurable is not merely the rare or the expensive; it is that which requires a different kind of response, one organized around direct center-engagement rather than risk-distribution.

**Uninsurability and sovereignty.** The connection between the uninsurable and sovereignty is fundamental: the sovereign is precisely the one who handles the state of exception — the situation that falls outside normal legal order and requires a direct center-occupant decision. Schmitt's definition of the sovereign as the one who decides on the exception is, from a Center Study perspective, the definition of the one who handles the uninsurable. The sovereign function is the function of last resort — the function that manages what institutional routines cannot.

**The pointman and succession.** The pointman is the natural candidate for succession: her discipline, her long time preference, her capacity for deferral, her recognition by others like her — all of these make her the kind of person who can receive the center's dispensation and transmit it forward. The succession from center-occupant to pointman is the most reliable mode of preserving a practice's integrity across generations.`,
    relations: ['the-center', 'succession', 'the-juridical', 'resentment-victimary', 'scenic-design'],
    posts: [
      { slug: 'gablog-the-marginal-anthropomorph', title: 'The Marginal Anthropomorph', note: 'The pointman as disciplined marginal figure who models deferral.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The uninsurable and its relation to the center\'s irreducibility.' },
    ],
    passages: [
      {
        text: 'Most disciplined individuals (in economic terms: those with the longest time preference), who will therefore seek each other out, recognize one another, and model modes of deferral for the less disciplined.',
        source: 'The Marginal Anthropomorph',
        sourceSlug: 'gablog-the-marginal-anthropomorph',
      },
    ],
    selfReference: 'The reader of this guide who is reading it carefully, who is following the links, who is asking what it demands rather than what it offers — that reader is performing the pointman function.',
  },

  {
    slug: 'originary-grammar',
    title: 'Originary Grammar',
    subtitle: 'The grammar of signification itself — infralinguistic, scene-dependent, prior to any metalanguage',
    definition: 'Originary grammar is the grammar implicit in the originary scene — not the grammar of any particular language but the minimal rules governing how signs work, how scenes are constituted, how attention is directed. It is infralinguistic: it operates below the level of the metalinguistic pretensions of literacy and philosophy.',
    body: `Originary grammar is what you get when you take seriously the claim that language is the deferral of violence. If that is true, then the grammar of language is not primarily a system for encoding and decoding propositional content — it is a system for organizing shared attention at a center. The minimal rules of that system are the originary grammar.

**Infralinguistics.** Katz uses the term "infralinguistic" to contrast with "metalinguistic." Metalinguistics is the pretension to stand above language and describe it from a neutral position — the position of logic, formal grammar, philosophy of language. Infralinguistics is the practice of working within language, from inside the scene, without pretending to a metalinguistic vantage. Originary grammar is infralinguistic because it can only be articulated from inside a scene, using the very resources it analyzes.

**Scene-dependence.** Every sign is scene-dependent: it means what it means in the context of a specific scene with a specific center. There is no scene-independent meaning, no meaning that floats free of the scene in which it is produced and received. This is not relativism — it is not the claim that meaning is arbitrary or variable across scenes. It is the claim that meaning is always already situated in a scene, and that the analysis of meaning requires analyzing the scene.

**The grammatical stack.** Language has a grammatical stack: the ostensive is the base, the imperative builds on it, the declarative builds on the imperative. Each level is dependent on the levels below it but generates new possibilities that the lower levels could not produce alone. The grammatical stack is the originary grammar's primary structure. Every act of communication can be analyzed in terms of which levels of the stack are in play and how they are organized.

**Completing the linguistic turn.** The linguistic turn in philosophy — Wittgenstein, Austin, the late Heidegger, Derrida — recognized that language is not a transparent medium for representing pre-linguistic thought. But it stopped short of the infralinguistic level. It remained at the level of language games, speech acts, traces, and différance — all of which are still implicitly metalinguistic, still implicitly standing outside language to describe it. Originary grammar completes the linguistic turn by recognizing the scene-dependence of language at the originary level.

**Generative literacy.** The goal of generative literacy is to produce readers and writers who can operate infralinguistically — who can recognize the scene-dependence of every text, identify the center that organizes it, trace the ostensive-imperative-declarative structure of its argument, and engage it from within rather than from above. Generative literacy is the educational project that follows from originary grammar.`,
    relations: ['ostensive-imperative-declarative', 'deferral', 'scenic-design', 'anthropomorphics', 'the-center'],
    posts: [
      { slug: 'pdf-linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The fullest statement of originary grammar as the completion of the linguistic turn.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Originary grammar as the grammar of the center.' },
      { slug: 'pdf-attentionality-originary-ethics', title: 'Attentionality and Originary Ethics', note: 'Attentionality as the ethical dimension of originary grammar.' },
    ],
    passages: [
      {
        text: 'Language is going to be generative even if we act as if it is representational — pretensions to a secure metalanguage really serve to guarantee a moral or political certainty that avoids the problem of creating in some space of language the shared attention directed towards some center.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'pdf-linguistic-turn-generative-literacy',
      },
    ],
    selfReference: 'This page is written in originary grammar — it uses the declarative to point toward the scene-dependent conditions for the declarative\'s own possibility. The self-reference is not a trick; it is the method.',
  },
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}
