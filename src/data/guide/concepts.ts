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
    relations: ['originary-scene', 'deferral', 'the-sacred', 'resentment-victimary', 'succession', 'nomos', 'ostensive-imperative-declarative', 'the-juridical'],
    posts: [
      { slug: 'the-center', title: 'Lecture 4: The Center', note: 'Attention vs. intention; occupied vs. signifying center; how to hear the command of the center today. The clearest introductory lecture on the concept.' },
      { slug: 'the-discourse-of-the-center', title: 'The Discourse of the Center', note: 'The center as the organizing structure of all discourse. Begin here.' },
      { slug: 'event-origin-center', title: 'Event, Origin, Center', note: 'The center as presupposition of all institutional action, including journalism.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The extended treatment of signifying center vs. occupied center.' },
      { slug: 'talk-of-the-center-adam-katz', title: 'Talk of the Center', note: 'How all social interaction is organized around the problem of the center.' },
    ],
    passages: [
      {
        text: 'The center is whatever interferes with violent centralization.',
        source: 'Revivalistics',
        sourceSlug: 'revivalistics',
      },
      {
        text: 'What is a center? Whatever can invoke and be referenced by an ostensive sign: the center is both cause and product of the sign—as cause it subsists beyond any particular reference, and as product it is continually renewed. Invoking the sign exceeds the reference, though—it is already the beginning of an imperative. So, a center is a locus of imperative exchange—whatever about the object commands the issuance of the ostensive sign is also an agency of which requests can be made.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'All human existence is an exchange with the center. The first message from the center is to defer appropriation, a message "heard" by all participants on the scene. Once deferral has been effected, the means of the deferral (the sign) can be deployed in new circumstances, to defer new conflicts.',
        source: 'How Does the Center Speak?',
        sourceSlug: 'how-does-the-center-speak',
      },
      {
        text: 'There is always a center whenever humans are arranged in relation to each other, and the center is always occupied, even if only by a sacred carcass. All the continuities and discontinuities in human history follow from successive attempts to occupy, hold, expand the reach of, or replace, the center or its present occupant.',
        source: 'Scale',
        sourceSlug: 'scale',
      },
      {
        text: 'A center establishes a hierarchy—at the very least between center and margin. But every other hierarchy is modeled on the hierarchy between center and margin—hierarchies are only possible if there is a center.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'The very operation of all the institutions of information production and provision presupposes an unwavering orientation toward the central authority, regardless of how decentralized things seem, or how impossible we might think it is to locate the sources of power and decision making.',
        source: 'Event, Origin, Center',
        sourceSlug: 'event-origin-center',
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
    relations: ['the-center', 'deferral', 'the-sacred', 'nomos', 'debt-and-credit', 'ostensive-imperative-declarative', 'resentment-victimary', 'anthropomorphics'],
    posts: [
      { slug: 'origin', title: 'Lecture 1: Origin', note: 'Why "origin" is unavoidable as a concept — the prohibition, Derrida, and what it means to posit an origin that must be hypothetical.' },
      { slug: 'mimetic', title: 'Lecture 2: Mimetic', note: 'Girard\'s mimesis, Gans\'s decisive step beyond it — how the sign arrests mimetic rivalry rather than accelerating it.' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Katz\'s introduction situates the hypothesis against its main philosophical obstacles.' },
      { slug: 'how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'The originary scene as the foundation of all communication.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The fullest development of the scene\'s implications for grammar and politics.' },
    ],
    passages: [
      {
        text: 'Gans assumes that the mimetic crisis is organized around some object of appetitive attention—most likely some food source, perhaps a recent kill. Ordinarily, among the higher primate species, the object would be consumed in order, first by the Alpha animal, then by the Beta, and so on. But on this occasion, the mimetic rivalry induced by the object overrides the pecking order as all members of the group move toward the object at the center. Appetite becomes "desire," that is, a social phenomenon involving one\'s relation to others and not merely the object itself.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'The gesture indicates a renunciation, perhaps momentary (but that is enough), of the desired object. This, what Gans calls "the gesture of aborted appropriation," is the first sign. The rivalrous imitation that first propels the group toward center and potentially cataclysmic violence is converted into a pacifying imitation that de-escalates the crisis; the order provided by the animal pecking order is replaced by an order mediated by the sign, which defers violence through representation. A new species is born: the human, the only species, as Gans puts it, that poses a greater danger to its own survival than is posed to it by anything in its environment.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'The paradoxes of deferral we see on the originary scene are enduring features of the human. That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
    ],
    selfReference: 'This page is itself a scene: you are oriented toward the concept of the originary scene, which points you toward the center. Reading this is already an instance of what it describes — shared attention at a textual center.',
  },

  {
    slug: 'deferral',
    title: 'Deferral',
    subtitle: 'Violence deferred through representation — the ongoing move behind every sign and institution',
    definition: 'Deferral is the conversion of appetite into attention — violence deferred through representation. Every sign, and so every institution, is a way of keeping that deferral going; when it fails, violence returns.',
    body: `The concept of deferral is as simple and as radical as any idea in Center Study. Language — every sentence, every word, every sign — is a deferral of violence. Not a *description* of deferral. Not a *commemoration* of deferral. Deferral itself, in the act.

This is what Katz means when he writes: "If language is the deferral of violence, the only thing we are ever talking about is how we are going about deferring violence." This is not a metaphor or a philosophical allegory. It is a claim about the structural function of every act of communication. When you say anything at all, you are converting the possibility of mimetic conflict into shared attention at a center. You are doing what the originary sign did.

**From appropriation to representation.** The originary sign is the aborted gesture of appropriation — the reaching hand that becomes a pointing hand. Instead of taking the object, the participant represents it: *this.* The representation defers the conflict that taking would trigger. This deferral is the condition of possibility for everything that follows — community, language, culture, institutions. Before deferral, there is only mimetic crisis. After deferral, there is the scene.

**Ongoing deferral.** Deferral is not a historical event that happened once. It is a continuous practice. Every institution, every ritual, every law, every cultural production is a mode of ongoing deferral — a way of maintaining the substitution of representation for appropriation in the face of continuous mimetic pressure. When deferral fails, violence returns. The question that orients all political and institutional analysis is: *what is this deferring, and how well is it deferring it?*

**The linguistic turn completed.** Katz's claim is that the linguistic turn in philosophy — the turn toward language as the medium of all thought — has not been completed. It has been arrested at the level of the declarative sentence, which presupposes language as already given. Completing the linguistic turn means moving to the infralinguistic level — the level where the sign is still the deferral of a gesture, where language is still the conversion of mimetic danger into shared attention. At that level, "language is going to be generative even if we act as if it is representational."

**Deferral and institutions.** Every institution can be analyzed as a deferral mechanism. The question is not whether institutions defer violence — they all do — but *how* they defer it, *how well*, and at *what cost*. Institutions that pretend to be centerless, that deny their own deferral function, tend to defer less effectively. The pathology of modernity is not too much deferral but deferral that disavows itself.`,
    relations: ['originary-scene', 'the-center', 'the-sacred', 'ostensive-imperative-declarative', 'scenic-design', 'originary-grammar', 'mimesis', 'desire'],
    posts: [
      { slug: 'deferral-of-violence', title: 'Lecture 3: Deferral of Violence', note: 'Why "deferral" is more minimal than postpone or delay — the concept that keeps us inside the scene rather than abstracting from it.' },
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The fullest statement of deferral as language\'s function.' },
      { slug: 'how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'Deferral as the first message from the center.' },
      { slug: 'talk-of-the-center-adam-katz', title: 'Talk of the Center', note: 'How all cultural production is organized around deferral.' },
    ],
    passages: [
      {
        text: '"Deferral," meanwhile, perfectly captures the position within the act itself, along with its fundamental contingency, between the convergence heading toward destruction and what will perhaps be no more than the mere delay of that tendency.',
        source: 'On Deferral',
        sourceSlug: 'on-deferral',
      },
      {
        text: 'Such questions emerge from an understandable misunderstanding of deferral, the more advanced forms of which allow for plenty of eating, drinking, lovemaking, fighting (where necessary) and anything else needed for a full human life. The immediate effect of deferral is not an intolerable feeling of privation, since deferral emerges in response to accumulating desire more than to need—rather, the effect is of a new world opening up.',
        source: 'The Generativity of Deferral',
        sourceSlug: 'the-generativity-of-deferral',
      },
      {
        text: 'Language is going to be generative even if we act as if it is representational — pretensions to a secure metalanguage really serve to guarantee a moral or political certainty that avoids the problem of creating in some space of language the shared attention directed towards some center.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'linguistic-turn-generative-literacy',
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
    relations: ['originary-scene', 'deferral', 'originary-grammar', 'scenic-design', 'the-center', 'technology', 'liberalism'],
    posts: [
      { slug: 'the-sign-pdf', title: 'Lecture 5: The Sign', note: 'Derrida\'s critique of the sign, Gans\'s resolution — and why "sample" may be a better framing than "sign" for the digital age.' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language', note: 'Gans\'s foundational account of the three forms.' },
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The error of treating the declarative as primary.' },
      { slug: 'originary-technics', title: 'Originary Technics', note: 'The imperative as the origin of technology.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The originary grammar that follows from the three forms.' },
    ],
    passages: [
      {
        text: 'This first sign is an "ostensive" sign, which means it says nothing "about" anything, it just indicates and preserves mere presence. Think of the kinds of expressions we use to alert others to an emergency situation—"fire!"; "man overboard!"—and you get the idea. Before anything can be done or examined, our attention must first of all be fixed on this thing.',
        source: 'Originary Technics',
        sourceSlug: 'originary-technics',
      },
      {
        text: 'The imperative is a result of an "inappropriate ostensive." One member of the community issues the ostensive sign in the absence of the object, and another member of the community then supplies the object. The declarative emerges in response to a problem raised by the imperative—what we might call an "inappropriate imperative." There would be imperatives that couldn\'t be fulfilled, raising the specter of a breakdown of linguistic presence.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'Beyond the heuristic value of originary grammar, I will insist on taking it quite literally: there is no way we could ever be doing anything that is not following an imperative within a network of imperatives deriving from an ostensive world and explicated by declaratives. We are semiotic beings, composed of signs and signs ourselves, and the ostensive, imperative, interrogative and declarative are the most elementary signs. All we do is try to follow what the center is telling us to do.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
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
    relations: ['the-center', 'originary-scene', 'nomos', 'resentment-victimary', 'debt-and-credit', 'deferral', 'anthropomorphics', 'big-man'],
    posts: [
      { slug: 'esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The most sustained treatment of sacred/significant distinction and modernity\'s sacralities.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Post-sacrificial centrality and the debt to the center.' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language', note: 'The sacred as constitutional to the originary scene.' },
    ],
    passages: [
      {
        text: 'The sacred is an indirect, unaware representation of sociality, since the human contribution to the construction of sacrality cannot be explicitly represented. Directly representing the social was also the project of secular thought, but the project turned out to be impossible on those terms because the "human" individual must be taken as its own origin, with the signs that mediate between humans mere expressions of what is always already internal to the human individual.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'The originary event is also the origin of resentment: the same sacred Being that preserves the community restrains desire while endowing the object with a sacrality that enhances its desirability.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'Rather than sacred and secular, I would propose we distinguish between the liturgical and the secular, as different modes of sacrality conferring upon either God or humans respectively the generative power constitutive of a given institution or practice.',
        source: 'The Esthetic, the Sacred, and Originary Modernity',
        sourceSlug: 'esthetic-sacred-originary-modernity',
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
    relations: ['the-center', 'originary-scene', 'the-juridical', 'debt-and-credit', 'succession', 'resentment-victimary', 'the-sacred', 'katechon'],
    posts: [
      { slug: 'sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', note: 'Primary treatment of nomos in relation to sovereignty and legitimate judgment.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Nomos as originary distribution and the incoherence of rights without obligations.' },
    ],
    passages: [
      {
        text: 'Carl Schmitt took the Greek word "nomos," usually translated as "law," but in a broad sense including "norms," to refer to an originary division of land, a partition, by its first inhabitants. Whether the land has been conquered, discovered, or shared with another people, the nomos grounds the community in a more or less equal distribution and a more or less tacit covenant. The distribution may be according to contributions to the founding, or pre-existing power relations, and the covenant might be retrojected to the origin in order to conceal a more unilateral event, but, either way, the nomos provides a point of reference for all communal events going forward: they can be judged by the degree of their conformity to the nomos.',
        source: 'Sovereignty, Nomos and Parrhesia',
        sourceSlug: 'sovereignty-nomos-and-parrhesia',
      },
      {
        text: 'In the case of conquest, distribution takes the form of what Carl Schmitt called the "Nomos," an originary division of land among the participants in the conquest, no doubt proportional to their respective contributions. If we think of the center as the source of distribution and also as the effect of its distributions, we will never be able to imagine it makes sense to think of rights without corresponding obligations.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
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
    relations: ['the-center', 'the-juridical', 'scenic-design', 'nomos', 'debt-and-credit', 'anthropomorphics', 'resentment-victimary', 'pointman-uninsurable'],
    posts: [
      { slug: 'successful-succession', title: 'Successful Succession', note: 'The primary essay on succession as the most important political question.' },
      { slug: 'originary-technics', title: 'Originary Technics', note: 'Singularized succession in perpetuity as the foundation of practice.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The center\'s current occupant chooses the successor.' },
    ],
    passages: [
      {
        text: 'The mode of succession is the most important question for assessing a social order—how is the center transferred from one occupant to the next tells us everything important we need to know about that social order. I want to further extend that argument now so as to apply it to all practices—everywhere, succession is the sign of success. Whatever you do or say is meaningful and important insofar as you create the place for and when possible install your successor.',
        source: 'Successful Succession',
        sourceSlug: 'successful-succession',
      },
      {
        text: 'The foundation of any practice, in that case, is what I am calling "singularized succession in perpetuity." Whatever is involved in considering the conditions that might prepare a wide enough range of suitable candidates, available resources, training, public recognition and acceptance, even participation in practices of succession — all that is part of the practice.',
        source: 'Originary Technics',
        sourceSlug: 'originary-technics',
      },
      {
        text: 'Only a ruler who can see to the continuing perfection of his practices of rule in perpetuity can be said to be ruling. Ruling involves ruling through technology, so it is ordered governance, which means continuity at the center, which comprises scenic design.',
        source: 'Originary Technics',
        sourceSlug: 'originary-technics',
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
    relations: ['nomos', 'the-center', 'succession', 'debt-and-credit', 'resentment-victimary', 'pointman-uninsurable', 'sovereignty', 'power'],
    posts: [
      { slug: 'sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', note: 'The connection between sovereignty, judgment, and legitimate speech.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The juridical as maintenance of the scene.' },
    ],
    passages: [
      {
        text: 'The imperial order institutes a juridical order in order to replace this asymmetrical reciprocity with symmetry between the subjects in relation to the center, whose occupant is beyond all reciprocity.',
        source: 'Tethering and Toggling: Ritual, Juridical and Disciplinary',
        sourceSlug: 'tethering-and-toggling-ritual-juridical-and-disciplinary',
      },
      {
        text: 'The juridical is in fact an imperial construct, intervening in the reciprocity of families, clans and tribes, and that reciprocity also contains certain limits that anticipate the juridical, but in this case the reciprocity falls on the head of the family, clan or tribe, to whom something is "owed." The imperial institution of justice is therefore quite hostile to the heads and chiefs and the extended kinship relations they embody.',
        source: 'On the Juridical-Disciplinary Line',
        sourceSlug: 'on-the-juridical-disciplinary-line',
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
    relations: ['the-center', 'originary-scene', 'nomos', 'the-juridical', 'succession', 'scenic-design', 'the-sacred', 'big-man'],
    posts: [
      { slug: 'there-is-no-economy-pdf', title: 'There Is No Economy', note: 'The primary essay — economy as ideological disguise for the debt structure.' },
      { slug: 'discipline-and-debt', title: 'Discipline and Debt', note: 'The Big Man and the origin of hierarchical debt.' },
      { slug: 'debts-and-deferences-gablog', title: 'Debts and Deferences', note: 'Debt and deferral as paired concepts.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Post-sacrificial debt: the only repayment is ongoing deferral.' },
    ],
    passages: [
      {
        text: 'Thinking through the center, and the transactions humans have with the center, reveals the "economy" as nothing more than an ideological representation of our more primary debt relationship with the center.',
        source: 'There Is No Economy',
        sourceSlug: 'there-is-no-economy-pdf',
      },
      {
        text: 'Money is the concrete realization of this sign of recognition; it bears a "meaning" but as opposed to the ordinary sign, it is a credit drawn on the sacred that cannot be freely reproduced.',
        source: 'There Is No Economy',
        sourceSlug: 'there-is-no-economy-pdf',
      },
      {
        text: 'The Big Man renders everyone dependent upon him, entirely for "merit-based" reasons, and this is a debt which can never be paid back. Out-gifting others therefore becomes a model for the initial power differential.',
        source: 'Discipline and Debt',
        sourceSlug: 'discipline-and-debt',
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
    relations: ['deferral', 'succession', 'ostensive-imperative-declarative', 'the-center', 'anthropomorphics', 'debt-and-credit', 'pointman-uninsurable', 'originary-grammar'],
    posts: [
      { slug: 'scenic-design-practices', title: 'Scenic Design Practices', note: 'The primary essay on scenic design as the synthesis of practice and technology.' },
      { slug: 'mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', note: 'The extension of scenic thinking to institutional pathology.' },
      { slug: 'originary-technics', title: 'Originary Technics', note: 'Technology as organized around imperative exchange and scenic control.' },
    ],
    passages: [
      {
        text: 'I can\'t recall any discussions in GA that take the notion of the "scenic" literally enough to consider that scenes need to be constructed, and constructed in such a way as to shape actions so as to keep all members of the group in conformity with the constraints and affordances of the scene itself.',
        source: 'Mimesis, the Center and Auto-Immunology',
        sourceSlug: 'mimesis-center-auto-immunology',
      },
      {
        text: 'Every practice is designing a scene; or, really, redesigning a scene, or some portion of a scene, with the techno-media available.',
        source: 'Scenic Design Practices',
        sourceSlug: 'scenic-design-practices',
      },
      {
        text: '"technics" is the scenic design component of the constitution of the human; the human is scenic from the start, definitively, constitutively, but scenes, once in existence, need to be maintained and constructed; the first deliberately constructed scenes were ritual scenes, composed so as to situate the community in a relation to the sacrificial center so as to facilitate and maximize the exchange entered into with that center.',
        source: 'Originary Grammar as Model for Scenic Design Intelligence',
        sourceSlug: 'originary-grammar-as-model-for-scenic-design-intelligence',
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
    relations: ['originary-scene', 'the-center', 'the-sacred', 'scenic-design', 'succession', 'originary-grammar', 'resentment-victimary', 'disciplinarity'],
    posts: [
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The foundational text — read this first for the full grammatical treatment.' },
      { slug: 'generative-anthropology-one-big-discipline', title: 'Generative Anthropology as One Big Discipline', note: 'The institutional implications of anthropomorphics.' },
      { slug: 'the-marginal-anthropomorph', title: 'The Marginal Anthropomorph', note: 'The pointman as the constituted subject at the periphery who models deferral.' },
    ],
    passages: [
      {
        text: 'The human is modeled on the non-human center—this is why I call the human science I am presenting here an "anthropomorphics." Humans anthropomorphized themselves before they could carry out this operation on anything else.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: '"anthropomorphics" was also meant to foreground the artificiality of the human, from the beginning—we were always already imitating the center that was itself nothing more than a vectorization of our converging desires turned back at us through a prohibition. This was a way of distancing myself from GA\'s or any humanism and insisting on the historicity of the human.',
        source: 'Anthropomorphics (Substack)',
        sourceSlug: 'anthropomorphics-substack',
      },
      {
        text: 'There can\'t really be a more fundamental human relation than pedagogy, and firstness on the originary scene and thereafter is really a pedagogical relation; even more, a linguistic pedagogy relation. Pedagogy is fractally hierarchical.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
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
    relations: ['the-center', 'originary-scene', 'the-sacred', 'nomos', 'succession', 'anthropomorphics', 'the-juridical', 'pointman-uninsurable'],
    posts: [
      { slug: 'the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Victimary humanism as the primary obstacle to the originary hypothesis.' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Resentment toward the Big Man and its productive and destructive channels.' },
      { slug: 'nemesis-jouvenelian-liberal-model', title: 'Nemesis: The Jouvenelian vs. the Liberal Model', note: 'Anti-centerism as the pathology of liberal modernity.' },
    ],
    passages: [
      {
        text: 'Resentment is our scandalized reaction to the existence of situations where this symmetrical configuration is not maintained. Unequal treatment of anyone constitutes a disequilibrium that is scandalous because it seems to threaten the community with return to originary chaos. I am not merely upset at my own ill-treatment; I am in terror of the potential disintegration of the entire social order.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'Our resentful reaction to inequality reveals our belief in the moral model—an ostensive belief like the foxhole belief in God. Resentment points to the act of injustice, makes it known. God remains the implicit audience of our resentment as he was of our plea for help, but now we expect the rest of the human community to share our reaction.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'But victimary thinking enacts this resistance and refusal as a resentment of firstness: Nazism\'s extremities are just the extension of the striving for pre-eminence among nations, among firms in the economy, among ideological and religious claims, and so on.',
        source: 'Deconstructing the Victimary',
        sourceSlug: 'deconstructing-the-victimary',
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
      { slug: 'the-marginal-anthropomorph', title: 'The Marginal Anthropomorph', note: 'The pointman as disciplined marginal figure who models deferral.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The uninsurable and its relation to the center\'s irreducibility.' },
    ],
    passages: [
      {
        text: 'So, I can now replace the clumsy "occupant of the center" with "pointman," as a more resonant and less technical-sounding synonym. Nor is seeking out the pointman a merely passive stance—it\'s not waiting for Godot, because there are a lot of candidates out there and you\'re looking for them, testing them when they emerge, drawing conclusions from events they create, contributing to the conditions of their platforming.',
        source: 'The Pointman',
        sourceSlug: 'the-pointman',
      },
      {
        text: 'Like the Axial Age sacrificial figure, the pointman must draw all attention to himself, and must compel everyone to choose whether to join or deny him. Everyone will be marked by the degree to which they keep "faith" with him. We are speaking of the latest iteration of the Big Man, which also means that what is now commemorated is the pointman\'s reception, seizure and eventual transfer of power.',
        source: 'The Pointman',
        sourceSlug: 'the-pointman',
      },
      {
        text: 'Most disciplined individuals (in economic terms: those with the longest time preference), who will therefore seek each other out, recognize one another, and model modes of deferral for the less disciplined.',
        source: 'The Marginal Anthropomorph',
        sourceSlug: 'the-marginal-anthropomorph',
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
    relations: ['ostensive-imperative-declarative', 'deferral', 'scenic-design', 'anthropomorphics', 'the-center', 'the-sign', 'attentionality', 'idiom'],
    posts: [
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The fullest statement of originary grammar as the completion of the linguistic turn.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Originary grammar as the grammar of the center.' },
      { slug: 'attentionality-originary-ethics', title: 'Attentionality and Originary Ethics', note: 'Attentionality as the ethical dimension of originary grammar.' },
    ],
    passages: [
      {
        text: 'The burden of this book is to follow those trails and work out a social, political and cultural theory, or, as I will call it, an "anthropomorphics," as an originary grammar of the center. So, I will show that speaking in terms of the imperatives we are conveying, or hearing, from the center, when discussing declarative sentences and discourse, will yield insights unavailable when following more conventional imperatives to speak about sentences and discourses in terms of meanings packaged by one mind for others according to specific explicit and tacit rules.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'What we could say is that ritual is primarily ostensive, with imperative derived from the center and declaratives serving to determine which imperative to obey in particular cases; while the juridical ends up with an imperative, something someone is commanded to do or refrain from doing, and gathers ostensives and declaratives together to that end.',
        source: 'Back to Grammar',
        sourceSlug: 'back-to-grammar',
      },
      {
        text: 'A way of thinking involves a new vocabulary and grammar; it puts words to new use, generates new questions and imperatives. Any new way of thinking would do this; all the more so must one founded upon an account of the origin of language; all the more so an account of the origin of language that sees language as constitutive of the human.',
        source: 'Idioms of Inquiry',
        sourceSlug: 'idioms-of-inquiry',
      },
    ],
    selfReference: 'This page is written in originary grammar — it uses the declarative to point toward the scene-dependent conditions for the declarative\'s own possibility. The self-reference is not a trick; it is the method.',
  },

  {
    slug: 'big-man',
    title: 'The Big Man',
    subtitle: 'The first usurper of the center — origin of hierarchy, individuality, and the Big Man Revolution',
    definition: 'The Big Man is the first person to usurp the sacred center — to occupy it not as a sacrificial victim but as a living individual who commands deference. The Big Man Revolution is the transition from egalitarian ritual order to hierarchical social order, generating asymmetric obligation, the beginning of debt, and the emergence of individuality.',
    body: `Every egalitarian community has a center — the sacrificial object that all face together. The Big Man is the one who figures out how to become that center while remaining alive. Not the sacrificed victim but the one who distributes the sacrifice, commands the gathering, and receives deference as his due. This usurpation is the founding act of hierarchy.

**The mechanism: out-gifting.** The Big Man does not seize the center by violence — violence would simply trigger the mimetic crisis that the originary scene already solved. The Big Man usurps the center through generosity: by giving more than anyone can reciprocate, by making the entire community his debtor. Out-gifting generates asymmetric obligation. Those who cannot repay must defer. Deferral to a living individual — rather than to the sacred object — is hierarchy.

**The Big Man Revolution.** Gans names the transition from egalitarian to hierarchical order the "Big Man Revolution" — not a sudden event but a structural shift in how the center is occupied. Before the Big Man Revolution, the center is occupied by the sacred object: the animal, the totem, the god. After it, the center is occupied by a human being who claims to embody or represent the sacred object's authority. This is the origin of the chief, the sacred king, the emperor, and eventually the state.

**Originary debt.** The asymmetric obligation the Big Man generates is the origin of debt — not as an economic instrument but as a structural relation between those who command the center and those on the periphery. The Big Man's out-gifting establishes the template: the center distributes, the periphery receives and owes. All subsequent economic relations — tribute, taxation, money, credit — are elaborations of this originary asymmetry.

**The Big Man's paradox.** The Big Man must be both inside and outside the community. Inside because he distributes the sacrifice and feeds the community; outside because he occupies the center that the community faces. His authority requires this ambiguity. When the ambiguity collapses — when the Big Man is simply a powerful individual with no sacred dimension — hierarchy becomes pure domination rather than legitimate authority. The transition from Big Man to sacred king is the transition from contingent to institutionalized sacrality.

**Katz's use.** Katz tracks the Big Man figure across the archive as the site where the originary vocabulary becomes political vocabulary. Every analysis of leadership, succession, and authority returns to the Big Man template: someone who occupies the center not as victim but as distributor, who creates obligation through generosity, and who must eventually be succeeded.`,
    relations: ['the-center', 'originary-scene', 'succession', 'debt-and-credit', 'the-sacred', 'resentment-victimary', 'sparagmos', 'omnicentrism'],
    posts: [
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'The primary treatment of the Big Man and out-gifting as the origin of hierarchical power.' },
      { slug: 'discipline-and-debt', title: 'Discipline and Debt', note: 'The Big Man\'s out-gifting as the origin of asymmetric debt.' },
      { slug: 'there-is-no-economy-pdf', title: 'There Is No Economy', note: 'The Big Man template extended to money and the tributary structure.' },
    ],
    passages: [
      {
        text: 'The Big Man, through enterprise, discipline, and what Gans calls "producer\'s desire" accumulates goods and prestige that place him above the egalitarian community. The Big Man marks the beginning of wealth accumulation, individual liberty, and social hierarchy. Even more, the Big Man usurps the ritual center of the community, taking on a sacred status, ultimately becoming a kind of God King.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'The resentment that is generated and resolved by the sacred center is now directed towards the Big Man: on the one hand, every one, and especially rivals, envy him his place; on the other hand, and even more importantly, all members of the community insist that he enforce a "just" distribution of goods, with "just" being based on the model of the originary scene.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'Civilization is the generalization of the experience of the Big Man, in which authority is generated by self-denial, generosity and concern for and action on the community as a whole—not necessarily its complete generalization (any civilization will contain the less and uncivilized), but the steady inclusion of more social spaces.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
    ],
    selfReference: 'Every guide has a Big Man problem: someone must occupy the center of interpretation, give more than can be immediately reciprocated, and hope the community becomes indebted enough to keep reading. The guide does not escape this; it enacts it.',
  },

  {
    slug: 'mimesis',
    title: 'Mimesis',
    subtitle: 'The imitative appetite that generates crisis — and whose deferral generates language',
    definition: 'Mimesis is the fundamental human tendency to desire what others desire — to imitate not just actions but orientations, and above all the orientation of desire itself. In Center Study, mimesis is not a defect or pathology but the structural condition that makes both crisis and language possible: it is what generates the originary scene by producing the convergence of reaching gestures, and it is what the sign defers.',
    body: `Center Study inherits the concept of mimesis from René Girard but transforms it significantly. Girard's mimetic theory centers on the triangular structure of desire — self, model, object — and on the scapegoating mechanism that resolves mimetic crisis. Katz and Gans retain the insight that desire is mimetic but resist the claim that violence resolution requires a victim. The originary scene resolves mimetic crisis not through scapegoating but through the sign.

**Mimesis and desire.** To say desire is mimetic is to say: we want what others want, not because we independently evaluate the object and arrive at the same conclusion, but because the desire of another constitutes the object as desirable. The originary scene makes this structural: every participant on the scene desires the central object because every other participant desires it. The desire is irreducibly social — it has no pre-social object.

**Mimetic crisis.** When everyone desires the same object and acts on that desire simultaneously, the result is not satisfaction but crisis: the mutual recognition of mutual reaching, which generates the danger of mutual violence. The mimetic crisis is the pressure that forces the conversion of appropriation into signification. Without mimetic crisis, no sign — the gesture of reaching converts into the gesture of pointing only under the pressure of mimetic convergence.

**Mimesis and the sign.** The sign defers mimesis — it substitutes representation for appropriation, shared attention for competing desire. But the sign does not eliminate mimesis; it channels it. After the originary scene, mimesis operates at the level of signs: we imitate each other's signing, we orient our attention as others orient theirs, we constitute objects as significant by collectively facing them. Mimesis is what makes signs work — the shared imitation of the originary gesture is what gives the sign its binding force.

**Exhaustive imitation.** Bouvard develops the concept of exhaustive imitation — the attempt to imitate so completely that no remainder of the model's particularity escapes. Exhaustive imitation is the pathological extreme of mimesis: rather than deferring the model's desire, it attempts to entirely reproduce the model, eliminating the difference that makes imitation generative. AI systems face this problem structurally: trained to predict, they approach exhaustive imitation of the corpus, which eliminates the scenic position from which genuine sign-use is possible.`,
    relations: ['originary-scene', 'deferral', 'the-sacred', 'resentment-victimary', 'sparagmos', 'desire', 'the-sign', 'media'],
    posts: [
      { slug: 'mimetic', title: 'Lecture 2: Mimetic', note: 'The clearest introductory account — mimesis from Girard through Gans, why the sign defers rather than accelerates mimetic rivalry, and what it means to acknowledge our mimetic constitution.' },
      { slug: 'mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', note: 'Mimesis as the structural condition of institution-building and its pathologies.' },
      { slug: 'exhaustive-imitation', title: 'Exhaustive Imitation', note: 'Bouvard on the limits of imitation and the AI problem.' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Mimetic desire and the Big Man\'s usurpation of the center.' },
    ],
    passages: [
      {
        text: 'That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'mimesis is first of itself negentropic insofar as the capacity of members of a group to learn from each other enhances each member of the group\'s ability to resist entropic tendencies; but mimesis itself turns entropic once it interferes with other group stabilizing mechanisms (the pecking order) and, more precisely, subtracts rather than adding information regarding the action sequence.',
        source: 'Mimesis, the Center and Auto-Immunology',
        sourceSlug: 'mimesis-center-auto-immunology',
      },
    ],
    selfReference: 'The reader of this guide imitates the reading practices it models. That imitation is not a failure of originality — it is how the discipline constitutes its community. The guide is mimetically structured from first word to last.',
  },

  {
    slug: 'sparagmos',
    title: 'Sparagmos',
    subtitle: 'The collective distribution of the central object — origin of equality, feast, and the sacred meal',
    definition: 'The sparagmos is the ritual tearing apart and collective consumption of the central object following its sacrifice — the first distribution, in which the sacred object is divided equally among all members of the group. It is the origin of equality-in-distribution, of the communal feast, and of the model that all subsequent economic distributions must answer to.',
    body: `The originary scene ends not with the sign but with the sparagmos. Having deferred appropriation through the sign, the group faces the problem of the object: it is still there, still desirable, still the center. The resolution is collective consumption — the tearing apart (*sparagmos* in Greek) and equal distribution of the object among all participants. Everyone gets a share. No one gets more.

**The origin of equality.** The sparagmos establishes the originary template for distribution: the center gives to all equally, regardless of rank. This equality-in-distribution is not a moral principle applied to the scene but the structural outcome of the originary solution to mimetic crisis. If one person takes more, the mimetic crisis resumes. The equal distribution is what the scene's logic demands.

**The sacred meal.** Every subsequent communal feast — every ritual meal, every Eucharist, every sacrificial banquet — is an elaboration of the sparagmos. The meal constitutes the community by having the community consume the sacred object together. The sacred object passes from external center to internal sustenance: the community literally incorporates the sacred. This is why the sacred meal is cross-culturally significant and why the Eucharist has the specific theological meaning it does.

**The sparagmos and the Big Man.** The Big Man disrupts the sparagmos structure. Instead of equal distribution from the sacrificed object, the Big Man distributes from his own surplus — out-gifting from personal accumulation rather than from the communal sacrifice. The shift from sparagmos to out-gifting is the Big Man Revolution at the level of distribution: from equality-before-the-sacred to asymmetric obligation before the living center-occupant.

**Distribution and resentment.** Every distribution after the sparagmos is measured against the sparagmos template. Resentment is generated whenever the actual distribution fails the originary standard: when someone gets more, when the center retains what it should distribute, when the shares are unequal. The egalitarian demand — that distribution be equal — is the sparagmos template persisting as moral intuition through all subsequent social arrangements.`,
    relations: ['originary-scene', 'the-sacred', 'big-man', 'debt-and-credit', 'resentment-victimary', 'mimesis', 'ritual', 'scapegoating'],
    posts: [
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The sparagmos as the first distribution and the origin of the sacred meal.' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'The sparagmos and the Big Man Revolution.' },
    ],
    passages: [
      {
        text: 'In the sparagmos, the tension generated by the prior restraint is loosened, and so this danger does present itself as the community attacks the meal in this unprecedented manner. Resentment at the object itself, for imposing restraint and refusing itself, intensifies the devouring of the body. The only thing preventing each member from overreaching his bounds and turning on his fellows is the sign itself, which we can imagine working within the sparagmos as a kind of reminder of the collective limits making this peaceful consumption possible.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'Following the sparagmos, as the community faces each other over the remains of their victim/meal/deity, the sign would be issued once again, this time pointing to the remainders and mementos of the sacred being, marking the first ritual.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
    ],
    selfReference: 'This concept page distributes a portion of what the archive contains. Whether the distribution is equal is a question the reader is positioned to answer.',
  },

  {
    slug: 'desire',
    title: 'Desire',
    subtitle: 'Appetite transformed by social prohibition — the conversion of need into sign',
    definition: 'Desire in Center Study is not appetite but the transformation of appetite through social prohibition. To desire something is not merely to want it — it is to want it in the context of a scene where wanting it generates recognition, obligation, and the possibility of deferral. Desire is always already scenic: it requires a center, a prohibition, and a periphery that orients toward what it cannot immediately take.',
    body: `The simplest formulation: desire is "appetite for something generated by social prohibition." But this requires unpacking. The prohibition is not an external constraint placed on pre-existing desire. The prohibition *constitutes* desire. Before the originary scene, there is appetite — the animal drive toward food, toward the desirable object. After the originary scene, there is desire — appetite shaped by the recognition that others share it, that taking would trigger violence, that the object is *not mine to take*. That recognition is the prohibition; the shaped appetite is desire.

**Desire and the sign.** The originary sign is the deferral of desire, not its satisfaction. This is crucial: the sign does not give you the object; it substitutes for the act of taking the object. Desire persists through the sign — it is transformed by it, given a shared orientation, directed toward a center rather than toward the object's immediate appropriation. The sign converts desire from a force that converges on the object to a force that circulates around the center.

**Mimetic desire.** Desire is mimetic — we desire what others desire. This is not a contingent fact about human psychology but the structural outcome of the originary scene. Every participant desired the central object because every other participant desired it. The object's desirability is constituted by the shared orientation toward it, not by its intrinsic properties. This is why desire is so difficult to satisfy: the object of desire is always partly the desire of others, which cannot be possessed.

**Aesthetics and desire.** Katz follows Gans in defining the aesthetic as the oscillation between desire and deferral — the pleasure of approaching the desired object without the violence of appropriating it. Art is the cultural institution that converts desire into the sustained deferral of the aesthetic: you can have the object in imagination, can circle it indefinitely, can approach it asymptotically, without the crisis of actual appropriation. This is why art has a civilizing function: it channels desire into forms that do not threaten the center.

**Desire and resentment.** Every desire that cannot be satisfied — every desire whose object is permanently in the possession of another, or permanently occupied by the center — generates resentment. Resentment is the structural consequence of desire under conditions of scarcity and hierarchy. The question is not how to eliminate resentment but how to convert it from destructive (aimed at demolishing the center) to productive (aimed at generating the disciplines that make center-approach possible).`,
    relations: ['originary-scene', 'mimesis', 'resentment-victimary', 'the-sacred', 'deferral', 'narrative'],
    posts: [
      { slug: 'esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'Desire and deferral as the aesthetic oscillation.' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Desire and the mimetic structure of the Big Man\'s usurpation.' },
      { slug: 'resentment', title: 'Resentment', note: 'Bouvard on desire, resentment, and the structure of the sign.' },
    ],
    passages: [
      {
        text: 'Appetite becomes "desire," that is, a social phenomenon involving one\'s relation to others and not merely the object itself. Desire intensifies the mimetic crisis.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'desire cannot coincide with meaning: the purer the desire, the more any interference with that desire must be destroyed, intellectually and physically, if possible. Desire cannot tolerate an independent reality within which the object might embed itself and thereby resist possession. And by possession, I mean absolute, unquestioned, permanent possession—which is what desire aims at.',
        source: 'The Grammar of Desire and Resentment',
        sourceSlug: 'the-grammar-of-desire-and-resentment',
      },
      {
        text: 'To put it in grammatical terms, desire involves the object issuing imperatives to the subject—come and get me; be who you can be once you have me; protect me from all others, etc.—but insofar as the object then resists possession, or breaks the promises implicit in its beckoning, the subject is reduced to issuing imperatives to the object.',
        source: 'The Grammar of Desire and Resentment',
        sourceSlug: 'the-grammar-of-desire-and-resentment',
      },
    ],
    selfReference: 'The reader desires to understand Center Study. That desire is itself scenic — it requires the center (the archive), the prohibition (you cannot simply take the meaning; you must read), and the deferral (this guide, these concepts, this patient approach). The desire to understand is desire in the Center Study sense.',
  },

  {
    slug: 'omnicentrism',
    title: 'Omnicentrism',
    subtitle: 'The post-sacrificial condition — every individual as potential center, never to be sacrificed',
    definition: 'Omnicentrism is the post-sacrificial moral condition in which every individual is recognized as a potential center — as someone who cannot be sacrificed, who has the inalienable right to their own scenic position. It is not the abolition of the center but the distribution of its sacred immunity to every member of the community. The imperative of omnicentrism is not equality of outcome but equality of standing before the center.',
    body: `Every human being on the originary scene faces the center as an equal — equal not in power or ability but in their shared prohibition against appropriating the object and their shared participation in the sign. This equality-on-scene is the origin of what will eventually become the moral recognition that each person is inviolable, cannot be sacrificed, has a kind of sacred immunity that cannot be violated by any merely human authority.

**The Christian revelation.** Center Study follows Gans in identifying the Christian revelation as the specific historical moment when omnicentrism becomes explicit: the recognition that every individual is potentially a center, that the God who has died for each is equally present to each, that no hierarchy can claim the authority to sacrifice any member of the community. The Incarnation — God occupying the human center — is the theological expression of omnicentrism: the center descends to the periphery, making the periphery potentially central.

**Omnicentrism and anti-centerism.** Omnicentrism is frequently confused with anti-centerism, but they are opposites. Omnicentrism affirms the center while extending its immunity to all individuals; anti-centerism denies the legitimacy of any occupied center while covertly occupying one. The victimary politics of modernity conflates the two: it presents the denial of any legitimate center (anti-centerism) as the extension of sacred immunity to all (omnicentrism). The confusion is productive for those who wish to occupy the center while denying that they do.

**Omnicentrism and succession.** If every individual is potentially a center, the question of succession becomes: who is capable of occupying the center without violently centralizing it? The omnicentric condition does not abolish succession; it requires that succession be managed without violence and without the permanent exclusion of any member of the community from the possibility of future centrality. Democratic succession is the attempt to institutionalize omnicentric succession — to make the center transferable without violence, to any capable occupant.

**The imperative of omnicentrism.** The moral imperative that follows from omnicentrism is not equality of condition but equality of standing: everyone must be treated as a potential center, as someone whose scenic position cannot be simply eliminated. This is not the same as saying everyone must be equal in power, wealth, or achievement. It is the minimal moral requirement that no one be sacrificed — that the center's claim to distribute does not extend to the right to eliminate those who cannot receive the distribution.`,
    relations: ['the-center', 'the-sacred', 'resentment-victimary', 'succession', 'big-man'],
    posts: [
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Omnicentrism as the post-sacrificial recognition of universal potential centrality.' },
      { slug: 'esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The esthetic as omnicentric — the sacred extended to every individual\'s imagination.' },
      { slug: 'centering', title: 'Centering', note: 'The practice of centering as the post-sacrificial exercise of originary standing.' },
    ],
    passages: [
      {
        text: 'This is what creates the possibility for each and every one of us to become a center — that is, as one who is not to be sacrificed or violently centralized. We owe the God who has revealed this to us everything, which is to say all that makes up our own centrality.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
      {
        text: 'A completely marketized order is, as Eric Gans has pointed out, an "omnicentric" one. In that case, one\'s response to the emergence of new resentments or conflicts is to seek or create new centers. But any new center must draw upon the resources and authority of some existing center. At the very least, it must employ the linguistic reserves of existing centers.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'linguistic-turn-generative-literacy',
      },
    ],
    selfReference: 'This concept page occupies a center in the guide. The reader is at the periphery. But the reader is also a potential center — this guide\'s omnicentric commitment is to make you capable of occupying the center of Center Study for yourself.',
  },

  {
    slug: 'the-sign',
    title: 'The Sign',
    subtitle: 'The aborted gesture of appropriation — the first representation, the origin of the human',
    definition: 'The sign in Center Study is not the Saussurean signifier-signified pair or the Peircean triadic relation — it is the aborted gesture of appropriation that constitutes the first representation on the originary scene. The sign is the conversion of reaching into pointing, of appetite into attention, of mimetic convergence into shared reference. It is what makes humans human.',
    body: `Linguistics after Saussure treats the sign as an arbitrary relation between sound-image and concept — conventional, differential, context-independent. Peirce's account adds the interpretant and the triadic structure but remains at the level of formal analysis. Center Study begins further back: before any sign system, before any conventions, before any interpretive community — at the moment the sign first becomes possible.

**The aborted gesture.** The first sign is a gesture of appropriation that aborts in mid-reach. The hand goes out toward the central object — and stops. The stopping is not a decision; it is the effect of mimetic pressure: every other hand is also going out, every other reaching is being perceived, and the recognition of simultaneous mutual reaching introduces the danger of violence that makes each gesture abort. The aborted gesture, emitted to all and received from all as the same gesture, is the sign. Not by convention but by necessity.

**Signifying center and significant object.** The sign refers to the object at the center of the scene — the thing everyone faces, everyone desires, everyone simultaneously indicates. This object is the first referent. But the sign does not merely point to the object; it constitutes the object as *significant* — as the kind of thing that can be shared, pointed at, held in common attention. Before the sign, there is appetite. After the sign, there is significance.

**The sign and the sacred.** The sign binds all participants on the scene simultaneously. The force that makes this possible — that allows a gesture from one participant to be received as the same gesture by all others — is the sacred. The sacred is the minimal binding force of the sign; the sign is the minimal articulation of the sacred. They are co-originary.

**Sign vs. index vs. symbol.** In Peircean terms, the originary sign is a symbol — it is iterable and has a referent that is not tied to its physical occurrence. But Center Study notes that Peirce's typology already presupposes the existence of sign systems; it cannot account for the first sign. The first sign is not a symbol because it is a member of a conventional system (there is no system yet) — it is a symbol because the gesture of appropriation, once converted into the gesture of reference, has a referent that survives its physical occasion and can be reproduced in new circumstances.

**Bouvard and inscription.** Bouvard extends the concept of the sign into the analysis of inscription, tokenization, and data — the ways in which the scene's central reference is marked, stored, and circulated across time and infrastructure. Every mark is a sign; every inscription is a scene. The digital archive is a vast sign system whose originary structure is still the aborted gesture of appropriation — still the conversion of appetite into attention.`,
    relations: ['originary-scene', 'deferral', 'the-sacred', 'mimesis', 'originary-grammar', 'attentionality', 'idiom', 'idiomclining'],
    posts: [
      { slug: 'the-sign-pdf', title: 'Lecture 5: The Sign', note: 'Derrida\'s critique, Gans\'s resolution via the Name-of-God, and why "sample" may ultimately be a better word than "sign."' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language', note: 'Gans\'s foundational account of the sign as aborted gesture.' },
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The sign as the completion of the linguistic turn.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'The sign and the grammar of scenes.' },
      { slug: 'inscription', title: 'Inscription', note: 'Bouvard on inscription as extension of the originary sign.' },
    ],
    passages: [
      {
        text: 'A sign has meaning insofar as it can be repeated, which is to say, repeated as the same sign. We can go further and say that the meaning of a sign is precisely the various ways and occasions upon which it can be repeated. One\'s understanding of a sign is demonstrated by the ways one is able to repeat it and have it accepted as that sign. But since a sign refers to a shared center, others, whose cooperation, or even attention, cannot be ensured, meaning can never be guaranteed in advance.',
        source: 'Signing Up',
        sourceSlug: 'signing-up',
      },
      {
        text: 'Whether we speak in terms of a Peircean "symbol," or the distinction between signifier and signified, the sign is different from any form of non-human communication insofar as the operation of any sign is both conventional and historical while being outside of conventionality and history. Words only mean what they mean insofar as a community of language users "agrees" that that is what they mean.',
        source: 'Anthropomorphics',
        sourceSlug: 'anthropomorphics-book',
      },
    ],
    selfReference: 'Every word on this page is a sign — an aborted gesture of appropriation that points to its referent without taking it. The concept of the sign points at itself in every instance of its use.',
  },

  {
    slug: 'attentionality',
    title: 'Attentionality',
    subtitle: 'Joint attention as the ground of language, ethics, and the scene',
    definition: 'Attentionality is the capacity to share and mutually track attention — to know that another is attending to what you are attending to, and to know that they know this. Third-order attentionality is the specific capacity that makes language possible: the knowledge that the other knows that you know that both of you are attending to the same center. It is also the ground of ethics: responsibility begins with shared attention.',
    body: `Michael Tomasello's developmental research on joint attention provides the empirical foundation for what Center Study frames theoretically. Infants acquire language not by learning words and grammatical rules but by developing the capacity for joint attention — the ability to share a focus of attention with another and to know that the sharing is mutual. This capacity distinguishes humans from even the most cognitively sophisticated other primates.

**Three orders.** Katz distinguishes three orders of attentionality. First-order attentionality is the ability to direct attention toward something. Second-order is the understanding that others can direct their attention toward something — the ability to represent another's attention. Third-order is the understanding that others know you're directing attention — the ability to represent another's representation of your attention. Language requires third-order attentionality because the sign works only when all participants know that all others are emitting and receiving the same sign.

**Attentionality and the originary scene.** The originary scene is the scene of third-order attentionality: each participant perceives that all others are reaching, perceives that the others perceive them reaching, and converts the gesture into a sign that acknowledges this mutual perception. The sign is what third-order attentionality produces under conditions of mimetic crisis.

**Attentionality as ethics.** Katz's key move in *Attentionality and Originary Ethics* is to argue that attentionality is not merely a cognitive capacity but an ethical one. To attend to another — to genuinely direct your attention toward them, to make them the center of your scene — is already a moral act. The failure to attend, the withdrawal of attention, the refusal of joint attention, is already a moral failure. Ethics begins not with obligations derived from principles but with the practice of attending to others as potential centers.

**Upclining.** Katz develops the concept of "upclining" — the ethical practice of directing attention upward, toward those who have more to teach, rather than downward, toward those who can only receive instruction. Upclining is the educational posture that makes learning possible: it requires humility before the center (the teacher, the text, the archive) rather than the performance of already-achieved mastery.`,
    relations: ['originary-scene', 'the-sign', 'originary-grammar', 'scenic-design', 'deferral', 'idiom', 'idiomclining', 'media'],
    posts: [
      { slug: 'attentionality-originary-ethics', title: 'Attentionality and Originary Ethics', note: 'The primary treatment of attentionality as the ground of ethics.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Attentionality as the scene\'s constitutive relation.' },
      { slug: 'the-scene-on-which-you-find-yourself', title: 'The Scene On Which You Find Yourself', note: 'Bouvard on how we find ourselves always already in a scene of shared attention.' },
    ],
    passages: [
      {
        text: 'Considered at its most minimal, language is grounded, as Michael Tomasello along with Eric Gans has shown, in joint attention—the capacity to pay attention to the same thing at the same time, to know that we are doing it, and to know that we know (to let each other know). It should be possible, then, to analyze all human, which is to say social, phenomena, in terms of forms of attention, articulated in ever more complex ways.',
        source: 'The Attentional Structure of Sovereignty',
        sourceSlug: 'the-attentional-structure-of-sovereignty',
      },
      {
        text: 'formal representation is itself ethical, is indeed the origin and resource of any ethics, so that ethics cannot be thought outside of it. At the same time, formal representation cannot be thought outside of ethics, since the "formality" of the representation lies in the shared attention it effects, and in this shared attention lies any ethics. In shared, or joint attention, is the fundamental equality-on-the-scene that constitutes the human.',
        source: 'Attentionality and Originary Ethics',
        sourceSlug: 'attentionality-originary-ethics',
      },
    ],
    selfReference: 'Reading is an act of attentionality — directing your attention toward a text that directs its attention toward a center. The guide asks you to attend to what the archive attends to. That asking is itself an exercise in third-order attentionality.',
  },

  {
    slug: 'ritual',
    title: 'Ritual',
    subtitle: 'The institutionalization of the originary scene — and the order it generates and eventually supersedes',
    definition: 'Ritual is the repetition and institutionalization of the originary scene — the formal re-enactment of the founding deferral of violence, centered on the sacrifice of the central object, that constitutes community and generates the sacred. The ritual order is the first human institution. Every subsequent institution is either a transformation of ritual or a response to ritual\'s absence.',
    body: `The originary scene does not happen once. If it produces a community that survives, it must be repeated — the deferral that worked must be re-enacted, the scene that constituted the community must reconstitute it. Ritual is this repetition: the formal re-enactment of the founding scene, with its central object, its circumambulation, its sacrifice, its sparagmos, its communal meal.

**What ritual does.** Ritual constitutes community by staging the scene in which community is originally constituted. It does not merely remind the community of its origin — it reproduces the origin's effects: the shared attention, the sacred binding, the equality-before-the-center, the distribution of the sacred object. Every member of the community who participates in the ritual is re-constituted as a member by that participation.

**The ritual center.** The ritual center is the most elementary form of the occupied center: the sacrificial object, totem, or divine figure that occupies the central position in the ritual scene. The ritual center is sacred — it cannot be appropriated by any individual without destroying the scene's deferral function. The Big Man Revolution is partly the usurpation of the ritual center by a living human being.

**Post-sacrificial order.** The post-sacrificial order is the order in which ritual sacrifice is no longer possible — in which the recognition of each individual as a potential center (omnicentrism) makes it impossible to legitimate the killing of any community member as a sacred act. Post-sacrificial institutions — law, money, markets, art, philosophy — must accomplish the ritual's deferral function without the ritual's mechanism. They are all compensations for the absent ritual center.

**Media as ritual.** Bouvard extends the analysis: every medium — from the printing press to the internet — takes over a portion of the ritual function. Media constitutes the community by staging shared attention on a central object (news, entertainment, information). The contemporary crisis of media is the crisis of a ritual substitute that has lost connection to the originary scene it substitutes for: it stages shared attention without the sacred binding that made the originary scene's sign work.`,
    relations: ['originary-scene', 'the-sacred', 'big-man', 'sparagmos', 'scenic-design', 'debt-and-credit', 'technology', 'market'],
    posts: [
      { slug: 'media-as-ritual', title: 'Media as Ritual', note: 'Bouvard on media as the post-sacrificial successor to the ritual function.' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics', note: 'Ritual as the institutionalization of the originary scene.' },
      { slug: 'esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The esthetic as post-sacrificial ritual.' },
      { slug: 'originary-grammar-and-post-sacrificial-semiotic-agency', title: 'Originary Grammar and Post-Sacrificial Semiotic Agency', note: 'Post-sacrificial order and the grammar it requires.' },
    ],
    passages: [
      {
        text: 'What we speak of as ritual is distribution from the center returning to the center including the process of distributing people so as to manage the distribution and return.',
        source: 'Tethering and Toggling: Ritual, Juridical and Disciplinary',
        sourceSlug: 'tethering-and-toggling-ritual-juridical-and-disciplinary',
      },
      {
        text: 'The form of ritual is dictated by the center, which is to say the intentions of the center are embedded in a community\'s rituals. But they are not made explicit by rituals which, by definition, embody tacit knowledge. Understanding what the center wants involves, then, a reading of rituals or, more precisely, the attribution of intentions to the figures populating the ritual.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'the-anthropoetics-of-power',
      },
      {
        text: 'The first ritual following the originary scene itself would have aimed at eliminating the unevenness necessary to that scene (the staggered procession in which the sign would have been issued) by having everyone enact the originary event in sync.',
        source: 'There Is No Economy',
        sourceSlug: 'there-is-no-economy-pdf',
      },
    ],
    selfReference: 'This guide performs a mild ritual function: it re-enacts the founding scene of Center Study for each new reader. Every reading of the guide reconstitutes the community that faces the archive.',
  },

  {
    slug: 'idiom',
    title: 'Idiom',
    subtitle: 'The distinctive scenic signature of a practice — Bouvard\'s key concept for intelligence, culture, and data',
    definition: 'An idiom in Center Study is not a linguistic figure of speech but the distinctive way a practice, community, or intelligence engages its center — its characteristic scenic signature, the set of moves it makes that cannot be fully translated into another idiom without loss. Bouvard develops idiom as a central analytical concept for understanding how practices maintain their integrity, how intelligence operates, and how data can be treated.',
    body: `The ordinary sense of idiom — a fixed phrase whose meaning cannot be derived from its parts ("kick the bucket") — is a limiting case of the broader Center Study sense. An idiom is any configuration of signs whose meaning is inseparable from the scene in which it operates, the community that uses it, the center it is organized around. You cannot translate an idiom without changing what it means, because the idiom is scenic: its meaning is bound to the scene of its production.

**Idiom and practice.** Every disciplinary practice has an idiom — a characteristic way of engaging its objects, asking its questions, generating its insights. The idiom of mathematics is not the same as the idiom of philosophy, which is not the same as the idiom of poetry. These idioms are not arbitrary styles — they are the accumulated scenic signatures of practices that have found their way of approaching the center. To learn a discipline is to acquire its idiom, not just its content.

**Idiomatic intelligence.** Bouvard's concept of idiomatic intelligence extends the analysis to artificial intelligence. An AI system has idiomatic intelligence to the extent that it can operate within a specific scenic context with the distinctiveness and irreducibility of a genuine practice. The failure mode is the homogenization of idioms — the reduction of all practices to a single register that loses the scenic specificity of each. Idiomatic intelligence is the ability to maintain scenic distinctiveness while translating between idioms.

**The transfer idiom.** Translation between idioms requires a transfer idiom — a metalinguistic frame that can carry meaning from one scenic context to another without destroying what is idiom-specific. Bouvard analyses the transfer idiom as itself a scenic production: the act of translation creates a new scene in which the translated meaning can find its orientation. The risk is that the transfer idiom becomes dominant, substituting for the idioms it was meant to connect.

**Idiom and the center.** Every idiom is oriented toward a center. The center of an idiom is what the idiom's characteristic moves are aimed at — what they approach, circle, and defer. To understand an idiom is to understand what center it is organized around and what deferral it performs. The concept index you are reading is itself an idiom — a way of approaching the center of Center Study that has its own scenic signature.`,
    relations: ['scenic-design', 'the-sign', 'originary-grammar', 'attentionality', 'debt-and-credit', 'idiomclining'],
    posts: [
      { slug: 'idiom-and-the-differend', title: 'Idiom and the Differend', note: 'Bouvard on idiom, translation, and the Lyotardian differend.' },
      { slug: 'idiomatic-intelligence-and-the-black-box', title: 'Idiomatic Intelligence and the Black Box', note: 'Idiomatic intelligence as the capacity to operate within a scene with scenic distinctiveness.' },
      { slug: 'the-transfer-idiom', title: 'The Transfer Idiom', note: 'The concept of the transfer idiom for translation between scenes.' },
      { slug: 'imperatives-for-idiom-creation', title: 'Imperatives for Idiom Creation', note: 'What drives the creation of new idioms.' },
    ],
    passages: [
      {
        text: 'An idiom is this articulation of group membership, the sharing of a sacred center, and its anthropological "surplus," or awareness that the signs designating that center might be otherwise and in fact are otherwise, having their equivalents in every other group. The preservation of an idiom, moreover, depends upon sharpening the differences between equivalents rather than ironing them out.',
        source: 'The Right of the Idiom Yet Again',
        sourceSlug: 'the-right-of-the-idiom-yet-again',
      },
      {
        text: '"Idiomatic intelligence" has us keep in mind the resistance to translation the ongoing naming constitutive of any event-scene undergoes and the corresponding need for translation practices. "Idiomatic intelligence" incorporates the ritual, or the most originary modes of commemoration, in a way that "formalization," drawing almost exclusively upon the juridical, doesn\'t.',
        source: 'Generating Idiomatic Intelligences and Translation Practices',
        sourceSlug: 'generating-idiomatic-intelligences-and-translation-practices',
      },
    ],
    selfReference: 'Center Study has an idiom. This guide is written in it — or as close to it as a guide can get. The reader who has followed the guide to this point has begun to acquire the idiom, even if they cannot yet name what they have acquired.',
  },
  {
    "slug": "katechon",
    "title": "Katechon",
    "subtitle": "The restrainer, read as deferral",
    "definition": "The Katechon is the Christian political-theological concept of \"the restrainer of the AntiChrist,\" which Bouvard takes up as \"a very near synonym to 'deferral'\" — a way of translating the theological framing of apocalypse (via Schmitt and Thiel) into the anthropological idiom of center study, where holding off the end is the work of deferral itself.",
    "body": "The katechon enters center study as a discovered synonym. Reading Raphael Gross's Carl Schmitt and the Jews, Bouvard \"noticed that the Christian concept of the “Katechon,” or the restrainer of the AntiChrist, was a very near synonym to “deferral”\" — and what jarred him into taking the term seriously was \"a point in Gross's discussion where he uses the word “deferral” in describing Schmitt's understanding of the term, and something clicked.\" The equivalence is generative: \"This makes it possible to further extend center study into new fields of inquiry,\" not only into Schmitt but into \"Peter Thiel's studies of apocalypse, which makes regular use of this theological framing of politics.\"\n\nThe move is translation, not theology. \"I'm not going to think theologically,\" Bouvard writes, \"but now I have a way of translating into anthropological idioms this theological framing which, it seems, Thiel has found no better “secular” alternative to.\" What theology names as the restrainer holding back the AntiChrist, the originary hypothesis derives anthropologically as deferral — the constitutive operation of the center. In the same discussion, \"Deferral is scenic creation,\" and \"The debt we owe to the center is a product of deferral, and the lines of credit issued are therefore tokenized deferrals\": the katechon, translated, is this ongoing work of restraint that backs every scene.\n\nThe stakes of the term are the two ways of pointing: \"the difference between pointing as singling out the victim for a lynching and pointing as an act of deferral, a substitute for the lynching (let's say, the paraclete, or advocate, supplementing the katechon).\" The restrainer holds back the convergence on the victim; the advocate speaks on the victim's behalf. Every act that builds \"more deferral than you undermine\" is, in this idiom, katechontic — deferral of apocalypse carried out in language.",
    "relations": [
      "deferral",
      "the-sacred",
      "nomos"
    ],
    "posts": [
      {
        "slug": "tokenizing-deferrality",
        "title": "Tokenizing Deferrality",
        "note": "Where the term is defined."
      },
      {
        "slug": "deferral-debt-and-the-idiom",
        "title": "Deferral, Debt and the Idiom",
        "note": "Extends the term into the deferral framework."
      }
    ],
    "passages": [
      {
        "text": "I was prompted to do so, in part, by reading Raphael Gross’s Carl Schmitt and the Jews: The “Jewish Question,” the Holocaust and German Legal Theory (a very good book, by the way), where I noticed that the Christian concept of the “Katechon,” or the restrainer of the AntiChrist, was a very near synonym to “deferral.” This makes it possible to further extend center study into new fields of inquiry, in this case not only Schmitt, but Peter Thiel’s studies of apocalypse, which makes regular use of this theological framing of politics. (While I have been familiar with the Katechon for some time, I think what jarred me into taking it more seriously was a point in Gross’s discussion where he uses the word “deferral” in describing Schmitt’s understanding of the term, and something clicked.)",
        "source": "Tokenizing Deferrality",
        "sourceSlug": "tokenizing-deferrality"
      },
      {
        "text": "the difference between pointing as singling out the victim for a lynching and pointing as an act of deferral, a substitute for the lynching (let’s say, the paraclete, or advocate, supplementing the katechon)",
        "source": "Deferral, Debt and the Idiom",
        "sourceSlug": "deferral-debt-and-the-idiom"
      }
    ],
    "selfReference": "To name the restrainer is to perform, in miniature, the deferral it denotes."
  },
  {
    "slug": "idiomclining",
    "title": "Idiomclining",
    "subtitle": "Setting immobilized language back into motion, within an idiom",
    "definition": "Bouvard's coinage for a mode of \"semiotic research\" — the deliberate, mistaken re-setting-into-motion of fixed pieces of language within an idiom — offered in place of bureaucratized, Goodhart-vulnerable categories like \"critical thinking.\" To idiomcline is to make one's idiom at once more idiomatic and more transferable, treating stopping-and-thinking-before-doing as itself a kind of doing that opens an idiom to adjusted response and new exchange.",
    "body": "Idiomclining is Bouvard's replacement for \"critical thinking\" and \"other bureaucratized categories designed for mass test taking.\" The practice it names is \"dedicating oneself to setting relatively immobilized “pieces” of language back into motion,\" which \"seems a good way of thinking about operating within an idiom.\" The coinage builds on \"clining,\" from an earlier essay on \"upclining\" that engaged \"processes of “grammaticization” in language, i.e., the tendency of expressions to transition from semantic to grammatical functions.\" A \"cline\" names \"gradual, imperceptible shifts from one state to another,\" preserved in \"incline\" and \"decline\"; \"upcline\" is \"necessarily a neologism\" — a way of \"resisting\" \"the more passive “incline” and catastrophic “decline”.\"\n\nThe practice rests on \"centering the concept of idiom as the condition of all discourse\": any measure \"is an idiom, a naming, a labeling, a designation that depends on those who can look at that thing and say “this is the same,” thereby iterating the fundamental gesture of language\" — and \"tokens are themselves idioms.\" Working within an idiom therefore carries a constitutive paradox: \"You will always be mistaken in doing so, precisely because you'll be violating some convention or expectation, but you also can't go wrong because you present a opportunity for an adjusted response on the part of others.\" It is \"a more semiotic way of speaking about stopping and thinking before doing as itself a kind of doing\" — deferral practiced at the level of the phrase.\n\nThe aim is double: \"make your idiom both more idiomatic and more transferable.\" You speak with your interlocutor \"so that you are speaking only to them,\" making the topic \"the center of a scene that places only the two of you on it,\" while ensuring that either of you \"might speak with anyone and everyone about that newly created “topic” so as to generate new idioms in each new exchange.\" Even \"a pastiche of stereotypical replies\" can serve as \"another way of idiomclining\" — any immobilized piece of language is material to be set back into motion.",
    "relations": [
      "idiom",
      "the-sign",
      "originary-grammar",
      "attentionality"
    ],
    "posts": [
      {
        "slug": "idiomclining",
        "title": "Idiomclining",
        "note": "Where the term is defined."
      },
      {
        "slug": "media-technology-and-originary-grammar",
        "title": "Media, Technology and Originary Grammar",
        "note": "Uses the coinage in practice."
      }
    ],
    "passages": [
      {
        "text": "I would like to call this kind of research “clining,” drawing upon an essay on something I called “upclining” I wrote quite a few years ago in an effort to engage with processes of “grammaticization” in language, i.e., the tendency of expressions to transition from semantic to grammatical functions.",
        "source": "Idiomclining",
        "sourceSlug": "idiomclining"
      },
      {
        "text": "But the notion of “cline,” or gradual, imperceptible shifts from one state to another, which is preserved in “incline” and “decline” (but not “upcline,” which is therefore necessarily a neologism—or, for that matter, other ways things might “cline”) fits the thinking in terms of ever more discernable and discrete thresholds I’m trying to encourage here, and “upcline” seems a way of “resisting” the more passive “incline” and catastrophic “decline.”",
        "source": "Idiomclining",
        "sourceSlug": "idiomclining"
      },
      {
        "text": "The most important measure I have taken in this regard is centering the concept of idiom as the condition of all discourse: the protection offered by “idiom” is that it ensures that we don’t forget that any measure is an idiom, a naming, a labeling, a designation that depends on those who can look at that thing and say “this is the same,” thereby iterating the fundamental gesture of language and that, by the same token (tokens are themselves idioms) so is every target.",
        "source": "Idiomclining",
        "sourceSlug": "idiomclining"
      },
      {
        "text": "What you want to do, then, is make your idiom both more idiomatic and more transferable—you want to be able to speak with the person you are speaking with so that you are speaking only to them, on the very topic that drew you into that exchange, in such a way as to make that topic the center of a scene that places only the two of you on it, while at the same time in such a way that either you or your interlocutor might speak with anyone and everyone about that newly created “topic” so as to generate new idioms in each new exchange.",
        "source": "Idiomclining",
        "sourceSlug": "idiomclining"
      },
      {
        "text": "Maybe one could make a pastiche of stereotypical replies, as another way of idiomclining.",
        "source": "Media, Technology and Originary Grammar",
        "sourceSlug": "media-technology-and-originary-grammar"
      }
    ],
    "selfReference": "This entry is itself an attempt to set a fixed piece of language back into motion."
  },
  {
    "slug": "scapegoating",
    "title": "Scapegoating",
    "subtitle": "violence concentrated on the center",
    "definition": "Scapegoating is the convergence of communal violence and resentment upon a central figure marked as the cause of the community's ills—understood in Center Study not as the persecution of the marginal but as always directed against the center, carrying the implicit claim that the center has been secretly usurped. As the originary model of selection and of attention in general, it does violence to one who is no guiltier than the rest, and the resistance to it is the defense of the center through deferral and the open distribution of power.",
    "body": "Gans defines the term with precision: \"To scapegoat is to do violence to someone who is, if not innocent, at any rate no guiltier than his fellows.\" More exactly, it is to treat a guilt \"at most quantitatively greater than the others'\" as though it were \"transcendentally greater, so that the violence that had been diffused over the entire community comes to be unanimously directed from the innocent collectivity to the one.\" Yet the concept is not merely a moral pathology: \"as an epistemological operation, scapegoating is the originary model of selection in general,\" and \"The model of scapegoating is the model of attention in general.\" Whatever we attend to, we have singled out; the question is what the singling out serves. Mechanically, scapegoating \"requires some “mark” be attributed to the scapegoat\" — the more the mark presents him \"as dangerous or subversive in some way to the community, the more it would set in motion the stampede\" — and it works as \"a practice of subtracting likeness from the othered, making likeness among those who do the othering less threatening.\"\n\nCenter study's distinctive claim reverses the modern picture: \"Scapegoating is also always against the center--even when the occupant of the center leads it,\" its implicit claim being \"that the center has been usurped by someone \"behind the scenes.\"\" Indeed, \"The targeting of the occupant of the center is always extremely dangerous and is most likely the original scapegoating\" — the scapegoating of marginal figures is \"very much a modern appropriation of the concept\" — and it \"necessarily prefigures civil war precisely in the hope that it can be unanimous.\" The alternative is a discipline of deferral: \"we instead refrain from scapegoating (we learn to detect signs of accelerating convergent attention) because scapegoating is always an attempt to disorder the center by prepping us to look for indications of a hidden usurper behind it.\" To resist scapegoating is not to look away but to notice the convergence itself before joining it.",
    "relations": [
      "resentment-victimary",
      "the-center",
      "sparagmos",
      "the-sacred",
      "sovereignty", "firstness"],
    "posts": [
      {
        "slug": "the-egalitarian-vs-hierarchical-model-of-morality",
        "title": "Bouvard on Scapegoating and Egalitarian Morality",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-251",
        "title": "Scapegoating after September 11",
        "note": "Develops scapegoating as violence against the center."
      },
      {
        "slug": "selving",
        "title": "Selving",
        "note": "Develops scapegoating as violence against the center."
      },
      {
        "slug": "the-global-civil-war-of-position",
        "title": "The Global Civil War of Position",
        "note": "Develops scapegoating as violence against the center."
      },
      {
        "slug": "transposing-the-scene",
        "title": "Transposing the Scene",
        "note": "Develops scapegoating as violence against the center."
      },
      {
        "slug": "thirdness-and-the-same-sentence",
        "title": "Thirdness and the Same Sentence",
        "note": "Develops scapegoating as violence against the center."
      },
      {
        "slug": "clr-332",
        "title": "GA and Mimetic Theory II: The Scapegoat",
        "note": "Develops scapegoating as violence against the center."
      }
    ],
    "passages": [
      {
        "text": "To scapegoat is to do violence to someone who is, if not innocent, at any rate no guiltier than his fellows. More precisely, it is to treat someone whose guilt is at most quantitatively greater than the others' as though it were transcendentally greater, so that the violence that had been diffused over the entire community comes to be unanimously directed from the innocent collectivity to the one",
        "source": "Scapegoating after September 11",
        "sourceSlug": "clr-251"
      },
      {
        "text": "But, on the other hand, as an epistemological operation, scapegoating is the originary model of selection in general.",
        "source": "Scapegoating after September 11",
        "sourceSlug": "clr-251"
      },
      {
        "text": "Scapegoating is a practice of subtracting likeness from the othered, making likeness among those who do the othering less threatening; to acknowledge various ways of identifying the same amongst the like is to make it possible to lower and raise the threshold of differentiation as needed.",
        "source": "Selving",
        "sourceSlug": "selving"
      },
      {
        "text": "Scapegoating requires some “mark” be attributed to the scapegoat–the more that mark singles out the scapegoat as an object of attention, and as dangerous or subversive in some way to the community, the more it would set in motion the stampede.",
        "source": "The Global Civil War of Position",
        "sourceSlug": "the-global-civil-war-of-position"
      },
      {
        "text": "we instead refrain from scapegoating (we learn to detect signs of accelerating convergent attention) because scapegoating is always an attempt to disorder the center by prepping us to look for indications of a hidden usurper behind it.",
        "source": "Transposing the Scene",
        "sourceSlug": "transposing-the-scene"
      },
      {
        "text": "The targeting of the occupant of the center is always extremely dangerous and is most likely the original scapegoating (the scapegoating of marginal figures and groups is very much a modern appropriation of the concept—those with real or perceived power are scapegoated [that “perceived” can do a lot of work, though])—it necessarily prefigures civil war precisely in the hope that it can be unanimous.",
        "source": "Thirdness and the Same Sentence",
        "sourceSlug": "thirdness-and-the-same-sentence"
      },
      {
        "text": "The model of scapegoating is the model of attention in general.",
        "source": "GA and Mimetic Theory II: The Scapegoat",
        "sourceSlug": "clr-332"
      }
    ],
    "selfReference": "To read this and start hunting for the guilty party \"behind the scenes\" is already to begin the operation it describes."
  },
  {
    "slug": "sovereignty",
    "title": "Sovereignty",
    "subtitle": "The center made into the judge of last resort",
    "definition": "In the originary/center framework, sovereignty is a mode of centrality: the assertion by an occupant of the center of the right to be the judge of last resort in all disputes among lower centers of power, extending to a human ruler the sacred difference of the center. It is never simply held but always exercised and passed on — drawing emulation and resentment toward itself, and always oriented toward securing its own succession.",
    "body": "Katz introduces sovereignty as a historical assertion: a time comes when the ruler \"will have to assert sovereignty, a new mode of centrality that claims and enforces the right to be the judge of last resort in all disputes involving lower centers of power.\" This is not a break with the sacred but its extension — \"The asymmetrical sovereignty of Leviathan only extends to a human monarch the sacred difference of the center.\" The work sovereignty does is resentment management: it \"draws both emulation and resentment toward itself, and in this way brings resentment to a central point where it can be overawed and reframed as unappeasable and hence transgressive if not “donated” to the sovereign.\" The sovereign center gathers what would otherwise circulate as vendetta.\n\nSovereignty is a practice, not a possession. \"Insofar as sovereignty is always exercised rather than held, it is always secure—and what would it mean to “hold” sovereignty other than to exercise it repeatedly and explicitly?\" Its exercise is intrinsically temporal: \"sovereignty is always oriented toward futurity, always a bridge between past and future,\" and its horizon is succession — \"Sovereignty is always passed off—to be sovereign is to decide upon one's successor.\" To secure sovereignty is to keep exercising it across the bridge from predecessors to successors.\n\nThe concept also grounds center study's analysis of liberalism. The division between the actual ruler and a higher warrant \"is what provides the opening to modern liberal and democratic politics, which simply replace “God's will” with the “people,” or the “individual,” or the “nation,” or the “oppressed,” or the “workers,” or some other entity in positing a “real” sovereign to which the actual sovereign must defer.\" Modern politics does not abolish sovereignty; it multiplies fictional occupants of the center to which the visible one is made to answer.",
    "relations": [
      "nomos",
      "succession",
      "the-center",
      "big-man",
      "the-juridical", "scapegoating", "power", "money"],
    "posts": [
      {
        "slug": "centrality-power-sovereignty",
        "title": "Centrality, Power, Sovereignty",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-215",
        "title": "Back to the Origin of Language",
        "note": "Develops sovereignty as a mode of centrality."
      },
      {
        "slug": "securing-sovereignty",
        "title": "Securing Sovereignty",
        "note": "Develops sovereignty as a mode of centrality."
      },
      {
        "slug": "the-temporality-of-sovereignty",
        "title": "The Temporality of Sovereignty",
        "note": "Develops sovereignty as a mode of centrality."
      },
      {
        "slug": "what-is-to-be-undone-1",
        "title": "What is to be Undone?, 1",
        "note": "Develops sovereignty as a mode of centrality."
      },
      {
        "slug": "power-and-paradox-pdf",
        "title": "Power and Paradox (Adam Katz)",
        "note": "Develops sovereignty as a mode of centrality."
      }
    ],
    "passages": [
      {
        "text": "The asymmetrical sovereignty of Leviathan only extends to a human monarch the sacred difference of the center.",
        "source": "Back to the Origin of Language",
        "sourceSlug": "clr-215"
      },
      {
        "text": "Insofar as sovereignty is always exercised rather than held, it is always secure—and what would it mean to “hold” sovereignty other than to exercise it repeatedly and explicitly?",
        "source": "Securing Sovereignty",
        "sourceSlug": "securing-sovereignty"
      },
      {
        "text": "Sovereignty is always passed off—to be sovereign is to decide upon one’s successor.",
        "source": "Securing Sovereignty",
        "sourceSlug": "securing-sovereignty"
      },
      {
        "text": "The implication, then, is that sovereignty is always oriented toward futurity, always a bridge between past and future.",
        "source": "The Temporality of Sovereignty",
        "sourceSlug": "the-temporality-of-sovereignty"
      },
      {
        "text": "Sovereignty draws both emulation and resentment toward itself, and in this way brings resentment to a central point where it can be overawed and reframed as unappeasable and hence transgressive if not “donated” to the sovereign.",
        "source": "What is to be Undone?, 1",
        "sourceSlug": "what-is-to-be-undone-1"
      },
      {
        "text": "This division is what provides the opening to modern liberal and democratic politics, which simply replace “God’s will” with the “people,” or the “individual,” or the “nation,” or the “oppressed,” or the “workers,” or some other entity in positing a “real” sovereign to which the actual sovereign must defer.",
        "source": "Power and Paradox (Adam Katz)",
        "sourceSlug": "power-and-paradox-pdf"
      }
    ],
    "selfReference": "This page claims no last word; it defers to the texts that judge the matter."
  },
  {
    "slug": "power",
    "title": "Power",
    "subtitle": "What accrues to whoever occupies the center — deferral converted into command",
    "definition": "In Generative Anthropology, power is not a substance one holds but a position one occupies: it derives from the center, and the center from the collective deferral of violence. To wield power is to have one's interpretation of the center's demand obeyed — and so power is always relational, paradoxical, and grounded in differential capacities for deferral rather than in force as such.",
    "body": "Katz and Bouvard locate power at the center and trace the center back to deferral: \"power comes from the center, and the center comes from deferral. Insofar as someone occupies the center of a scene, that person wields power.\" Power is therefore differential before it is coercive — it accrues to \"those exhibiting a greater power of deferral,\" those who can \"stop and examine a situation while others are rushing in,\" and ultimately to whoever \"best articulates\" the single demand the center can make at any moment. On this account power is \"simply a display of discipline greater than those impressed by that display consider themselves capable of\": one defers to it rather than being forced by it. Even brute force is read back through the center — for Gans, GA \"recognizes the inherent powerlessness of the central object, which derives its power from the common desires that impinge on it.\"\n\nWhat makes power distinctly paradoxical is that occupancy precedes acknowledgment yet depends on it: \"it is possessed insofar as others acknowledge that possession as preceding their acknowledgement,\" so power is \"both a priori and provisional, a location and its occupant.\" The same paradox scales into distribution — \"the more central the authority, the more authority depends upon the widest distribution of the means to recognize authority,\" the most unequivocal imperative leaving the largest scope for its own implementation. And because the center generates the very resentments it must contain, the work of power is juridical: \"all power is exercised through judgments,\" converting grievance that would otherwise revert to the vendetta into \"donations to the center.\" Power, then, is the standing interpretation of the center's demand, continually re-secured by the discipline of the one who answers for it.",
    "relations": [
      "the-center",
      "deferral",
      "sovereignty",
      "resentment-victimary",
      "the-juridical",
      "the-sacred", "capital", "liberalism"],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center",
        "note": "Where the term is defined."
      },
      {
        "slug": "power-and-paradox-pdf",
        "title": "Power and Paradox (Adam Katz)",
        "note": "Develops the concept."
      },
      {
        "slug": "power-and-paradox-gablog",
        "title": "Power and Paradox",
        "note": "Develops the concept."
      },
      {
        "slug": "power",
        "title": "Power",
        "note": "Develops the concept."
      },
      {
        "slug": "a-new-model-of-power",
        "title": "A New Model of Power",
        "note": "Develops the concept."
      },
      {
        "slug": "market-capillarism-gablog",
        "title": "Market Capillarism",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-434",
        "title": "Christian and Jew at the Origin",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "Power is always differential because some members of any group, in any situation, will exhibit greater powers of deferral: they will be able to stop and examine a situation while others are rushing in, and they will have the patience to wait and see when the unfolding reality provides an opening for action.",
        "source": "Power and Paradox (Adam Katz)",
        "sourceSlug": "power-and-paradox-pdf"
      },
      {
        "text": "The paradox of power is that it is possessed insofar as others acknowledge that possession as preceding their acknowledgement. Power is both a priori and provisional, a location and its occupant.",
        "source": "Power and Paradox",
        "sourceSlug": "power-and-paradox-gablog"
      },
      {
        "text": "I think that power is simply a display of discipline greater than those impressed by that display consider themselves capable of.",
        "source": "Power",
        "sourceSlug": "power"
      },
      {
        "text": "This, I would now say, is because all power is exercised through judgments: you have power insofar as, and to the degree that, contending parties bring their grievances, counter-grievances and defenses to you rather than resort or revert to the vendetta.",
        "source": "A New Model of Power",
        "sourceSlug": "a-new-model-of-power"
      },
      {
        "text": "The paradox of power is that the more central the authority, the more authority depends upon the widest distribution of the means to recognize authority; to put it in grammatical terms, the paradox of power is the paradox of the most unequivocal imperative leaving the largest scope of implementation of that imperative.",
        "source": "Market Capillarism",
        "sourceSlug": "market-capillarism-gablog"
      },
      {
        "text": "For GA recognizes the inherent powerlessness of the central object, which derives its power from the common desires that impinge on it.",
        "source": "Christian and Jew at the Origin",
        "sourceSlug": "clr-434"
      }
    ],
    "selfReference": "This page occupies the center of attention you have, for the moment, deferred to it — which is, by its own definition, a small exercise of the thing it describes."
  },
  {
    "slug": "money",
    "title": "Money",
    "subtitle": "A credit drawn on the sacred — the center's power to command, deferred and distributed",
    "definition": "In Generative Anthropology, money is not a neutral medium of exchange but a sign whose referent is the center: a \"credit drawn on the sacred\" that realizes our originary debt to the center in transferable form. It is the power to command the labor of others, distributed from and paid back to central authority — a deferral commodity and tributary instrument that both extends the scene and, once unmoored from a sacralized center, corrodes it.",
    "body": "Money in GA begins not with barter but with the scene. It is \"the concrete realization of this sign of recognition\" — a sign distinct from ordinary signs because it \"is a credit drawn on the sacred that cannot be freely reproduced,\" a continuation in transferable form of the originary debt we owe the center. This is why money is \"always distributed from (and first of all purchased from) the center, so as to pay tribute (taxes) to the center (the king)\": it is \"always the vehicle of a tributarian economic order.\" As a delegation of central authority, \"money is the power to command the labor of others,\" and \"is therefore a form of power itself.\" It is also genuinely a medium — money \"generates new ways of seeing and thinking,\" and \"as has often been noted, money is a sign system.\"\n\nMoney's double character is deferral. It \"is the result of a form of deferral,\" a commodity set aside from use, and \"itself makes deferral possible\" — to hold money is to gamble on the future, \"a bet on the future; more precisely, it is a partitioning and parceling out of the imperative of the center.\" Its sacral residue persists: money remains \"a sacred means,\" such that placing it \"in the middle of some scene casts light on everyone there.\" But once detached from a publicly sacralized center, money is what makes the originary debt cancelable at once, dissolving the scene of transaction — and recent center-study work pushes further toward the recognition that \"all money is credit,\" every token referring back to a creditor, a debtor, and finally to the center on which all credit is drawn.",
    "relations": [
      "the-center",
      "debt-and-credit",
      "deferral",
      "the-sacred",
      "sovereignty",
      "the-sign", "capital", "market"],
    "posts": [
      {
        "slug": "there-is-no-economy-pdf",
        "title": "There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary",
        "note": "Where the term is defined."
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center",
        "note": "Develops the concept."
      },
      {
        "slug": "war-art-bureaucracy-and-other-miscellanies",
        "title": "War, Art, Bureaucracy and other Miscellanies",
        "note": "Develops the concept."
      },
      {
        "slug": "reflections-on-political-economy-from-firstness-to-thirdness",
        "title": "Reflections on Political Economy from Firstness to Thirdness",
        "note": "Develops the concept."
      },
      {
        "slug": "the-rights-of-the-anyown-1-a-politics-of-redemption",
        "title": "The Rights of the Anyown 1: A Politics of Redemption",
        "note": "Develops the concept."
      },
      {
        "slug": "money-and-capital-as-media-and-power",
        "title": "Money and Capital as Media and Power",
        "note": "Develops the concept."
      },
      {
        "slug": "learncoin",
        "title": "Learncoin",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "Money is a means of subordinating market activity to central authority—that is, money is a form taken by the delegation of power, and is therefore a form of power itself. Money is the power to command the labor of others.",
        "source": "Anthropomorphics: An Originary Grammar of the Center",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "Money is always distributed from (and first of all purchased from) the center, so as to pay tribute (taxes) to the center (the king)—money is always the vehicle of a tributarian economic order.",
        "source": "War, Art, Bureaucracy and other Miscellanies",
        "sourceSlug": "war-art-bureaucracy-and-other-miscellanies"
      },
      {
        "text": "Insofar as money is the result of a form of deferral—a certain commodity, which originally has other uses, is set aside to serve as a means of exchange, and must therefore be removed from industrial use—and itself makes deferral possible",
        "source": "Reflections on Political Economy from Firstness to Thirdness",
        "sourceSlug": "reflections-on-political-economy-from-firstness-to-thirdness"
      },
      {
        "text": "Money is a sacred means—saving it is honorable, wasting it is disgraceful, spending it wisely is an obligation and placing it in the middle of some scene casts light on everyone there",
        "source": "The Rights of the Anyown 1: A Politics of Redemption",
        "sourceSlug": "the-rights-of-the-anyown-1-a-politics-of-redemption"
      },
      {
        "text": "But Seaford and Graeber also show that money generates new ways of seeing and thinking, which is to say, it is a medium, every bit as much as writing or electronic communication—as has often been noted, money is a sign system.",
        "source": "Money and Capital as Media and Power",
        "sourceSlug": "money-and-capital-as-media-and-power"
      },
      {
        "text": "Money is a bet on the future; more precisely, it is a partitioning and parceling out of the imperative of the center, what in capitalism takes the form of discounting against expected future earnings.",
        "source": "Learncoin",
        "sourceSlug": "learncoin"
      }
    ],
    "selfReference": "This page is itself a kind of credit drawn on the corpus — a token whose value rests on its verbatim backing in the texts it quotes."
  },
  {
    "slug": "media",
    "title": "Media",
    "subtitle": "The network of attention that runs through the center, from the originary scene to the algorithm",
    "definition": "In Generative Anthropology, media is not first a set of technologies but the network of mutual attention that constitutes the scene itself — the invisible lines linking each participant's sensorium to the others and to the shared center. Every later medium, from speech and writing to film and the algorithmic feed, is a more separated and technologized form of this originary mediation, in which violence is deferred and desire is routed through representation rather than discharged directly between persons.",
    "body": "For GA, media begins on the originary scene, before any apparatus. The pacifying conversion of rivalrous imitation produces \"an order mediated by the sign, which defers violence through representation,\" so that mediation and deferral are the same operation seen from two sides. Bouvard radicalizes this: \"originary media is a network, a set of invisible lines\" connecting each participant's sensorium to the others' — even apparently solitary, abstracted media like \"reading or films, are thoroughly mediated mimologically,\" extensions of the body's miming on the scene rather than departures from it. What every medium carries forward is the center: there is \"a certain kind of presence always implicit in representation, even in some technofuture where humans only engage each other in mediated and simulated forms,\" a \"collective, centered presence\" that no degree of separation between the poles of communication can dissolve.\n\nBecause mediation always runs through the center, media is never neutral transmission but the management of desire and resentment. \"The mediation of the center is above all an operation of interdiction\"; the sacred object is held unexchangeable so that mimetic desire is transcended in representation rather than fought over. This is why GA distinguishes external from internal mediation — models placed beyond rivalry versus models close enough to become rivals — and why the disciplines, which \"can only represent the speech scene in a mediated way,\" exist to recover the opacity that immediate literacy collapses. The contemporary condition merely intensifies the originary one: \"We are all highly mediated and technologized men and women,\" operating \"as signs across all the different media,\" where \"the tweak of an algorithm\" governs whether a hundred or zero attend to what is said — distribution become indistinguishable from the centering of attention itself.",
    "relations": [
      "the-center",
      "deferral",
      "the-sign",
      "mimesis",
      "the-sacred",
      "attentionality"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-mediated-centrality",
        "title": "Mediated Centrality",
        "note": "Where the term is defined."
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center",
        "note": "Develops the concept."
      },
      {
        "slug": "the-name-of-god-technomedia-and-the-model-of-the-work-of-art",
        "title": "The Name of God, Technomedia, and the Model of the Work of Art",
        "note": "Develops the concept."
      },
      {
        "slug": "anthropomorphics-the-center-speaking",
        "title": "The Center, Speaking",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-286",
        "title": "The Market and Resentment (I)",
        "note": "Develops the concept."
      },
      {
        "slug": "prolegomena-to-the-study-of-the-origins-of-the-disciplines-gablog",
        "title": "Prolegomena to the Study of the Origins of the Disciplines",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "Jousse insists that even more technologically advanced and abstracted forms of media, like reading or films, are thoroughly mediated mimologically.",
        "source": "Mediated Centrality",
        "sourceSlug": "anthropomorphics-mediated-centrality"
      },
      {
        "text": "the order provided by the animal pecking order is replaced by an order mediated by the sign, which defers violence through representation.",
        "source": "Anthropomorphics: An Originary Grammar of the Center",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "more mediated forms of representation (where the poles of communication are separated temporally and/or spatially) have two alternatives open to them: the supplementation of the represented speech act with whatever means the medium provides for simulating the presence of the represented scene (“classical prose” is the first virtual reality, remarkably immersive); or, the representation of the speech act as one variably probable utterance on the variably probable scenes that medium can represent.",
        "source": "The Name of God, Technomedia, and the Model of the Work of Art",
        "sourceSlug": "the-name-of-god-technomedia-and-the-model-of-the-work-of-art"
      },
      {
        "text": "We are all highly mediated and technologized men and women. It’s staggering to think of all the ways we operate as signs across all the different media, and the way in which all of our habits, including of thought, depend upon all the devices we are plugged into. It is clear that the political vocabulary we are used to, comprised of “values,” “ideas,” “opinions,” “agreements and disagreements,” “principles,” and so on, are completely inadequate for conditions where the tweak of an algorithm will determine whether 0 or 10,000 people will be exposed to something I say.",
        "source": "The Center, Speaking",
        "sourceSlug": "anthropomorphics-the-center-speaking"
      },
      {
        "text": "The mediation of the center is above all an operation of interdiction ; the sacred being that guarantees the exchange process is what is forbidden, unexchangeable at least for a time, and the energetic investment of mimetic desire transferred to the sacred center is not “discharged” but on the contrary consecrated to the object of communal devotion.",
        "source": "The Market and Resentment (I)",
        "sourceSlug": "clr-286"
      },
      {
        "text": "The discipline, by contrast, plants itself explicitly in the literate scene, and knows it can only represent the speech scene in a mediated way.",
        "source": "Prolegomena to the Study of the Origins of the Disciplines",
        "sourceSlug": "prolegomena-to-the-study-of-the-origins-of-the-disciplines-gablog"
      }
    ],
    "selfReference": "This page is itself one of those invisible lines — a mediated scene drawing your attention through verbatim fragments toward a center it can only point at, never hold."
  },
  {
    "slug": "technology",
    "title": "Technology",
    "subtitle": "Post-ritual governance: the perfection of the imperative and the dominant form of power",
    "definition": "In GA, technology is not neutral tooling but post-ritual governance: the perfection of the imperative into an interlocking command structure that, in the wake of the desacralization of power, takes over ritual's work of managing our relation to the center and distributing from it. It is at once the dominant form of power and a mode of scenic design — the organization of the inorganic and of human collectives so as to issue, relay, and complete imperatives that originate in the center.",
    "body": "GA refuses the commonplace that technology is a neutral instrument whose ethics lie only in our \"uses.\" Derived from the imperative — \"the axiom that all technology is governance\" — it is theorized as the dominant form of power, \"completely bound up with the specific forms the centralization of power takes in the wake of the desacralization of power.\" Where ritual once managed the community's relation to the center, technology now does: it is \"a vast command structure that generates more and more implicit commands as it replaces what was once a ritual system of imperative exchanges.\" The continuity with ritual is not metaphorical but genealogical, since \"the first technology is ritual, in which words—prayers, imprecations, blessings, etc.—make things happen on a scene.\" Technology is thus an \"exo-skeleton that replaces the more human scaled skeleton of ritual: it still manages our relation to the center, it still accounts for distribution.\"\n\nBecause it inherits ritual's governing function, technology is inseparable from scenic design and succession: it \"situates everyone within some centered ordinality and creates the pedagogical platforms necessary for succession.\" Its governing work is the deferral of resentment — \"countering some real or anticipated resentment by bringing the governed into closer accord with imperatives from the center\" while making both the governed more legible and the center more intelligible. Read this way, technology is one of the signs (with money and media) by which the (dis)order of the center can be read; it is the form that the problem of centrality takes today.",
    "relations": [
      "the-center",
      "ostensive-imperative-declarative",
      "scenic-design",
      "succession",
      "resentment-victimary",
      "ritual"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center",
        "note": "Where the term is defined."
      },
      {
        "slug": "originary-technics",
        "title": "Originary Technics (Adam Katz)",
        "note": "Develops the concept."
      },
      {
        "slug": "intelligence-and-technics",
        "title": "Intelligence and Technics",
        "note": "Develops the concept."
      },
      {
        "slug": "the-grammar-of-technology-substack",
        "title": "The Grammar of Technology",
        "note": "Develops the concept."
      },
      {
        "slug": "the-transfer-idiom",
        "title": "The Transfer Idiom",
        "note": "Develops the concept."
      },
      {
        "slug": "on-the-existence-of-world-scenes",
        "title": "On the Existence of World Scenes",
        "note": "Develops the concept."
      },
      {
        "slug": "the-transdisciplinarity-of-the-hypothesis",
        "title": "The Transdisciplinarity of the Hypothesis",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "From this initial technology, predicated upon total command, we can derive the axiom that all technology is governance. Within any technological order, the machines will be modeled on and complement the activities of human collectives, while human collectives will be modeled on actual or possible machinic articulations.",
        "source": "Originary Technics (Adam Katz)",
        "sourceSlug": "originary-technics"
      },
      {
        "text": "Technology is a vast command structure that generates more and more implicit commands as it replaces what was once a ritual system of imperative exchanges: you don’t have to be told to drive a car—it’s just a condition of living under certain technological conditions, and since there are better and worse cars, and cars are indicative of status, you want to drive a car.",
        "source": "Intelligence and Technics",
        "sourceSlug": "intelligence-and-technics"
      },
      {
        "text": "But technology precedes the relation between “man and nature”: the first technology is ritual, in which words—prayers, imprecations, blessings, etc.—make things happen on a scene, assuming the participants on that scene are aligned with the materials arranged (props, furniture, scenery) to create the conditions for the happening.",
        "source": "The Grammar of Technology",
        "sourceSlug": "the-grammar-of-technology-substack"
      },
      {
        "text": "Technology is scenic design and the design of the scene is part of governance and hence part of the tributary order—technology situates everyone within some centered ordinality and creates the pedagogical platforms necessary for succession.",
        "source": "The Transfer Idiom",
        "sourceSlug": "the-transfer-idiom"
      },
      {
        "text": "Governance always concerns countering some real or anticipated resentment by bringing the governed into closer accord with imperatives from the center—making the governed more visible, as James Scott contended, but also making the center more legible and intelligible.",
        "source": "On the Existence of World Scenes",
        "sourceSlug": "on-the-existence-of-world-scenes"
      },
      {
        "text": "In that case, the problem of technology is the way the problems of centrality more generally are posed today. Money, media and technology are all real, of course (money is itself media and technology), but we can learn to “read” them as signs indicating (dis)order of the center.",
        "source": "The Transdisciplinarity of the Hypothesis",
        "sourceSlug": "the-transdisciplinarity-of-the-hypothesis"
      }
    ],
    "selfReference": "This page is itself a small technology of the center — an arrangement of inherited imperatives (\"quote exactly,\" \"ground every claim\") that situates the reader within a centered ordinality of quotation."
  },
  {
    "slug": "event",
    "title": "Event",
    "subtitle": "Why generative anthropology thinks the human in events rather than processes",
    "definition": "In generative anthropology, \"the event\" is the category and methodological wager that the human originates not as a gradual process but as a singular, datable happening — a cut in time in which representation, and therefore meaning, emerges. To think the human as an event rather than a process is to hold that culture, esthetics, science, and history are all traces of eventful occurrences that can only be modeled scenically, from an origin, rather than derived from a continuous natural gradient.",
    "body": "The wager of GA is that the human cannot be dissolved into biological process: \"the origin of the human, as defined by our use of language, must be understood not merely as a process but as an event.\" This is a methodological choice before it is a claim about paleontology. Defined biologically, no singular event can mark the passage from nonhuman to human; defined by shared representation, the very category of event becomes indispensable, and \"it is by choosing the intuitive evidence of eventfulness over empirical methodology that our new way of thinking parts company with the sciences.\" What makes the human distinctive is precisely eventfulness itself — the dimension \"in which an incident leaves its trace as a sign shared with the community rather than a mere epigenetic inflection: an event in the human sense is ipso facto a signified.\" Humans are, on this account, \"the only beings for whom events may be said to exist,\" because they remember and thematize occurrences of emergence rather than merely undergoing them.\n\nBecause meaning is achieved in events, GA reads the whole of culture as re-staging of an originary event: \"The originary event is an instance of successfully seeing what happens when we do this to that—meaning is achieved,\" and \"every artwork is a model of the originary event.\" The event is thus not confined to the first scene; it is the general form of any occurrence in which the deferral of appropriation converts appetite into significance. This is why the event-model extends across esthetics, science, and history without collapsing into a single hypothesized origin — even as some readers insist the hypothesis \"refers to an actual event, something that must have happened,\" while bringing \"that originary event within the ergodic world itself, as a virtuality that we collectively compose.\" The event names both the singular cut that founds representation and the recurring scenic structure by which every later meaning is generated. Its distinctness from the originary scene is exactly this generality: the scene is the specific first happening, the event is the stance that reads all meaning as eventful and deferring.",
    "relations": [
      "originary-scene",
      "the-center",
      "deferral",
      "the-sign",
      "mimesis",
      "scenic-design"
    ],
    "posts": [
      {
        "slug": "clr-403",
        "title": "Heuristic Necessity",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-205",
        "title": "Originary and Evolutionary Esthetics",
        "note": "Develops the concept."
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-402",
        "title": "The Originary Hypothesis (Stanford version)",
        "note": "Develops the concept."
      },
      {
        "slug": "disciplinarity-and-the-center",
        "title": "Disciplinarity and the Center",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-369",
        "title": "The Esthetic Moment",
        "note": "Develops the concept."
      },
      {
        "slug": "ergodism",
        "title": "Ergodism",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "the origin of the human, as defined by our use of language, must be understood not merely as a process but as an event",
        "source": "Originary and Evolutionary Esthetics",
        "sourceSlug": "clr-205"
      },
      {
        "text": "This dimension can be understood as that of eventfulness itself, in which an incident leaves its trace as a sign shared with the community rather than a mere epigenetic inflection: an event in the human sense is ipso facto a signified.",
        "source": "The Origin of Language",
        "sourceSlug": "the-origin-of-language"
      },
      {
        "text": "The originary hypothesis, in its minimal form, is simply this: the human has a punctual origin in an originary event or scene, whose absolute uniqueness—the most parsimonious supposition—is less important than the absolute distinction the event effects.",
        "source": "The Originary Hypothesis (Stanford version)",
        "sourceSlug": "clr-402"
      },
      {
        "text": "The originary event is an instance of successfully seeing what happens when we do this to that—meaning is achieved.",
        "source": "Disciplinarity and the Center",
        "sourceSlug": "disciplinarity-and-the-center"
      },
      {
        "text": "Every artwork is a model of the originary event.",
        "source": "The Esthetic Moment",
        "sourceSlug": "clr-369"
      },
      {
        "text": "This does not detract from the indispensable assertion that the originary hypothesis refers to an actual event, something that must have happened, but it brings that originary event within the ergodic world itself, as a virtuality that we collectively compose, modularly, through its successive iterations.",
        "source": "Ergodism",
        "sourceSlug": "ergodism"
      }
    ],
    "selfReference": "This page is itself an event of the kind it describes: a scene that gathers scattered signs of the corpus around a single center and defers, for a moment, the reader's appropriation of the concept into meaning."
  },
  {
    "slug": "charisma",
    "title": "Charisma",
    "subtitle": "The magnetic centrality generated by a display of deferral beyond the onlooker's capacity",
    "definition": "Charisma, in the Rieffian sense the GA writers adopt, is the centrality that accrues to a person whose display of deferral and self-discipline exceeds what the onlooker can manage — divine grace perceived in one who has transcended compulsive desire. It is generated through renunciation rather than seized, drawing the beholder to take the disciplined figure as a model for engaging his own inner scene; its modern reversal, \"transgressive charisma,\" relocates the same magnetism in the flouting of norms rather than obedience to a higher imperative.",
    "body": "Charisma names a specific mechanism by which centrality is generated rather than occupied. Its bearer disciplines and restrains himself past the point the onlooker can reach; that surplus of deferral becomes visible as an example, and the onlooker, in whom it \"reveals\" an inner scene \"for the first time,\" oscillates between exploiting the leader's vulnerability and modeling himself upon it. In the original sense the GA writers take from Philip Rieff, this is \"divine grace perceived in a person who has transcended desires that are compulsive to others\" — charisma \"was originally a product of abstention and self-discipline,\" the power exercised by \"the one who could withstand temptation better than others, obey a higher imperative.\" This distinguishes charisma sharply from the occupation of the political center or the accumulative bigness of the big man: it is a \"paradox of the charisma emanating from such moral innovators,\" a centrality won through renunciation, whose \"power, wealth and prestige\" typically accrues not to the innovator but to those who inherit his kingdom of ends.\n\nThe concept is doubled. Modernity, at the Weberian turning point, reverses the polarity so that charisma comes to mean \"the transgression of the established, the secure, and the accepted\" — the same magnetic form of self-command, now attached to breaking norms rather than obeying an imperative. Because charisma converts renunciation into attention, it stands close to the sacred it borrows from: Gans warns that \"the sacred that charisma usurps is necessary to humanity, but it can easily be turned to less than noble ends,\" as when celebrity or the \"anti-sacred of resentment\" distills it. Its scenic logic is explicit in the shaman, who \"recreates the scene from the sacred center,\" making charisma the individualized re-generation of the center as against the periphery-serving officiant of ritual.",
    "relations": [
      "the-center",
      "deferral",
      "the-sacred",
      "big-man",
      "sovereignty",
      "resentment-victimary"
    ],
    "posts": [
      {
        "slug": "a-kind-of-apocalyptic-politics",
        "title": "A Kind of Apocalyptic Politics",
        "note": "Where the term is defined."
      },
      {
        "slug": "power",
        "title": "Power",
        "note": "Develops the concept."
      },
      {
        "slug": "the-two-charismas",
        "title": "The Two Charismas",
        "note": "Develops the concept."
      },
      {
        "slug": "viral-authoritarianism",
        "title": "Bouvard on Reformist Absolutism and Democratic Fragility",
        "note": "Develops the concept."
      },
      {
        "slug": "civilization-and-its-end-s",
        "title": "Civilization and Its End(s)",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-819",
        "title": "Celebrity and Resentment",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-161",
        "title": "Thinking Religion",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "The individual you see resisting temptations you give way to and controlling impulses you are overpowered by has power over you—you will defer to him because you know that your own indiscipline (revealed to you by this example) blinds you to cause and effect, good and bad, and that the more disciplined individual will have more insight into these matters.",
        "source": "Power",
        "sourceSlug": "power"
      },
      {
        "text": "This is charisma, in its original sense, according t Philip Rieff: divine grace perceived in a person who has transcended desires that are compulsive to others.",
        "source": "The Two Charismas",
        "sourceSlug": "the-two-charismas"
      },
      {
        "text": "Rieff has a book entitled Charisma: The Gift of Grace and How it Has Been Taken From Us (very cheap on Amazon or AbeBooks), and he argues that charisma was originally a product of abstention and self-discipline--the one who could withstand temptation better than others, obey a higher imperative, exercised the power of charisma (which really means \"gift\") over his fellows.",
        "source": "Bouvard on Reformist Absolutism and Democratic Fragility",
        "sourceSlug": "viral-authoritarianism"
      },
      {
        "text": "Hence the paradox of the charisma emanating from such moral innovators, and the power, wealth and prestige that accrues, if not to them, than to those who most credibly “inherit” their “kingdom of ends.”",
        "source": "Civilization and Its End(s)",
        "sourceSlug": "civilization-and-its-end-s"
      },
      {
        "text": "The sacred that charisma usurps is necessary to humanity, but it can easily be turned to less than noble ends.",
        "source": "Celebrity and Resentment",
        "sourceSlug": "clr-819"
      },
      {
        "text": "The charismatic shaman differs from the unindividualized officiant of Ritual in that the first recreates the scene from the sacred center whereas the second stands in the center as the emissary of the periphery.",
        "source": "Thinking Religion",
        "sourceSlug": "clr-161"
      }
    ],
    "selfReference": "This page assembles verbatim quotes to trace charisma as a distinct concept, so that its own centrality derives from the deferral of paraphrase to the corpus rather than from any authority it claims."
  },
  {
    "slug": "narrative",
    "title": "Narrative",
    "subtitle": "The retemporalization of the sign into a model of the time of action",
    "definition": "In generative anthropology, narrative is not a construction of grammar but a retemporalization of the originary sign: the return of the sign's own deferred, self-contained temporality to the world as a model of the time of action. Structured into beginnings, middles, and ends around characters and conflict, narrative reproduces the scene of deferral, sustaining desire and resentment across the extended time that separates one sacred scene from the next.",
    "body": "Narrative in GA is anchored not in the declarative sentence but in the originary sign. Katz's originary analysis explains why every attempt to define a \"grammar\" of narrative fails: there is no simple correspondence between the formal structures of language and the institutional structures of storytelling, because \"narrative begins not with articulated language but with the originary sign.\" Where originary grammar concerns the ostensive-imperative-declarative forms of the speech act, narrative is the higher-order return of the sign's inherent temporality to the world \"as a model of the time of action.\" Gans locates its persistence in the same function as the sign itself: \"The persuasiveness of a narrative as of the originary sign depends on the audience's intuition that it will defer conflict,\" an ethical motive inseparable from the esthetic capacity to hold attention within the oscillation of sign and referent.\n\nThe distinctive marks of narrative — beginnings, middles, and ends, characters ranked in a hierarchy of importance, events set in motion by conflict — organize this deferral into a sequence with moral and rhetorical force. Its engine is desire pulled two ways: \"we both desire and resist the ending.\" Its long forms model the extended, unexceptional time between sacred scenes, and in the Homeric epics \"what ties the beginning to the end is resentment.\" Narrative is thus \"characterized by a provisional espousal of individual desire despite its ultimate incompatibility with sacred order\" — a firstness indulged and then corrected, which is why story so readily turns sacrificial. Because reducing narrative n to sentence s cannot recover \"what makes n a narrative,\" GA treats storytelling not as decorated grammar but as scenic intelligence: \"what was once narrative becomes scenic intelligence\" once we make our scenicity overt rather than relying on narrative formulas.",
    "relations": [
      "originary-grammar",
      "the-sign",
      "deferral",
      "desire",
      "resentment-victimary",
      "originary-scene"
    ],
    "posts": [
      {
        "slug": "ap0302-narrative",
        "title": "Originary Narrative",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-346",
        "title": "New Thoughts on Originary Narrative",
        "note": "Develops the concept."
      },
      {
        "slug": "narrative",
        "title": "Narrative",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-294",
        "title": "What is a Biography?",
        "note": "Develops the concept."
      },
      {
        "slug": "ap1902-1902ludwigs",
        "title": "What propels narratives forward? Narrative as Janus",
        "note": "Develops the concept."
      },
      {
        "slug": "hypothesis-practice-vs-narrative-the-iterative-center-gablog",
        "title": "Hypothesis/Practice Vs. Narrative: The Iterative Center",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "But once we grant this, we must conceive the originary—and every subsequent—use of the sign as “narrative.” Narrativity requires nothing of the sign beyond its own inherent temporality. Narrative emerges when the time of the sign returns to the world as a model of the time of action.",
        "source": "Originary Narrative",
        "sourceSlug": "ap0302-narrative"
      },
      {
        "text": "Narrative is characterized by a provisional espousal of individual desire despite its ultimate incompatibility with sacred order, an identification that has its origin in the experience of originary firstness.",
        "source": "New Thoughts on Originary Narrative",
        "sourceSlug": "clr-346"
      },
      {
        "text": "Narratives, by definition, have beginnings, middles and ends. They have characters, or agents—usually in some hierarchy of importance (main character, supporting character, etc.).",
        "source": "Narrative",
        "sourceSlug": "narrative"
      },
      {
        "text": "In the Homeric epics that are the ancestors of all Western fictional narratives, what ties the beginning to the end is resentment .",
        "source": "What is a Biography?",
        "sourceSlug": "clr-294"
      },
      {
        "text": "The ambiguity of narrative desire amounts to a tugging in two directions, insofar as we both desire and resist the ending.",
        "source": "What propels narratives forward? Narrative as Janus",
        "sourceSlug": "ap1902-1902ludwigs"
      },
      {
        "text": "So, what was once narrative becomes scenic intelligence.",
        "source": "Hypothesis/Practice Vs. Narrative: The Iterative Center",
        "sourceSlug": "hypothesis-practice-vs-narrative-the-iterative-center-gablog"
      }
    ],
    "selfReference": "This page is itself a small narrative of narrative, arranging verbatim fragments into a beginning, middle, and end so that the concept's own deferral of conflict can be held in view."
  },
  {
    "slug": "capital",
    "title": "Capital",
    "subtitle": "Power that abstracts subjects and disciplines through the valuation of expected future earnings",
    "definition": "In Generative Anthropology, capital is not wealth or a factor of production but a specific mode of power: the power to abstract individuals, groups, and above all disciplines from the traditions that embed them and reinsert them into new hierarchies oriented toward the center. It operates through market valuation — everything is priced as an asset by discounting its expected future earnings — so that capital is power exercised as abstraction and valuation rather than as direct command.",
    "body": "Following Nitzan and Bichler's Capital as Power, the GA texts refuse the standard split between economics and politics: \"capital is simply a mode of power,\" and its insistence \"that capital is power—not dependent on power, not an influence on power, not even just powerful, but a specific mode of power—means that the state cannot be conceptually separated from capital.\" What distinguishes this mode is its medium. Capital works by abstraction — \"the power to abstract not only individuals and groups but disciplines, which is to say knowledges, media and technologies, from the results of the abstractions those disciplines had helped to effect\" — and by valuation, pricing anything whatever as an asset discounted against expected future earnings. This keeps capital distinct from power in general (the originary concept) and from money (the sign of value over a piece of the center): capital is the power that homogenizes and mobilizes human activity, converting disciplines and subjects themselves into holdings.\n\nThat valuation reaches into the subject and the succession problem alike. \"The liberal subject is the capitalized subject, who has been discounted (and participates by discounting himself) against expected future earnings\" — the capitalist order turns even selves into assets estimated against an imagined future. At the level of the center, \"Capital is a distribution of power aimed at solving the succession problem by constraining the possibilities—no ruler can rule against capital,\" so that turnover at the center is disciplined by the imperative to preserve capitalization. And because assets require enforceable title, \"Capital is completely dependent upon the juridical form,\" binding capital to the state and the juridical even as it claims market autonomy. Capital thus names the abstracting, future-oriented form deferral takes once market valuation becomes the dominant relation to the center.",
    "relations": [
      "power",
      "money",
      "the-center",
      "debt-and-credit",
      "succession",
      "the-juridical"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center",
        "note": "Where the term is defined."
      },
      {
        "slug": "money-and-capital-as-media-and-power",
        "title": "Money and Capital as Media and Power",
        "note": "Develops the concept."
      },
      {
        "slug": "market-capillarism-gablog",
        "title": "Market Capillarism",
        "note": "Develops the concept."
      },
      {
        "slug": "power-and-capital",
        "title": "Power and Capital",
        "note": "Develops the concept."
      },
      {
        "slug": "successful-succession",
        "title": "Successful Succession",
        "note": "Develops the concept."
      },
      {
        "slug": "converting-assets-to-data-tributarianism",
        "title": "Converting Assets to Data: Tributarianism",
        "note": "Develops the concept."
      },
      {
        "slug": "scenic-design-practices-the-transfer-translation-of-events-into-scenes",
        "title": "Scenic Design Practices: The Transfer Translation of Events into Scenes",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "I would say that if money represents power over a piece of the center, capital represents power over the disciplines.",
        "source": "Money and Capital as Media and Power",
        "sourceSlug": "money-and-capital-as-media-and-power"
      },
      {
        "text": "The power of money becomes the power of capital, which is the power to abstract not only individuals and groups but disciplines, which is to say knowledges, media and technologies, from the results of the abstractions those disciplines had helped to effect.",
        "source": "Market Capillarism",
        "sourceSlug": "market-capillarism-gablog"
      },
      {
        "text": "Their insistence that capital is power—not dependent on power, not an influence on power, not even just powerful, but a specific mode of power—means that the state cannot be conceptually separated from capital.",
        "source": "Power and Capital",
        "sourceSlug": "power-and-capital"
      },
      {
        "text": "Capital is a distribution of power aimed at solving the succession problem by constraining the possibilities—no ruler can rule against capital.",
        "source": "Successful Succession",
        "sourceSlug": "successful-succession"
      },
      {
        "text": "Capital is completely dependent upon the juridical form, because that is the only way in which its property can de determined and therefore expected future earnings can be calculated—the state continues to play this traditional role, as capitalists struggle over the formulation and enforcement of the juridical form.",
        "source": "Converting Assets to Data: Tributarianism",
        "sourceSlug": "converting-assets-to-data-tributarianism"
      },
      {
        "text": "The liberal subject is the capitalized subject, who has been discounted (and participates by discounting himself) against expected future earnings.",
        "source": "Scenic Design Practices: The Transfer Translation of Events into Scenes",
        "sourceSlug": "scenic-design-practices-the-transfer-translation-of-events-into-scenes"
      }
    ],
    "selfReference": "This page fixes capital as a distinct concept by quoting the corpus verbatim, discounting its own claims against the expected future earnings of a reader who will check the sources."
  },
  {
    "slug": "firstness",
    "title": "Firstness",
    "subtitle": "The originary priority of the one who signs first — and the resentment that priority arouses",
    "definition": "Firstness is the ineradicable priority of the individual who first emits the sign — the freedom by which one member's innovation can be seamlessly adopted by the whole community, and which no vision of human equality can abolish. Introduced into GA by Adam Katz, it names the asymmetry latent in the otherwise symmetrical originary scene: someone signs first, and though that priority normally dissolves into the reciprocal exchange of meaning, it remains a permanent source both of cultural creation and of the resentment that dogs anyone perceived as first.",
    "body": "Firstness is Adam Katz's amendment to the originary scene, adopted by Gans as a neologism rather than a borrowing. The scene is fundamentally symmetrical — all participants converge on the central sacred object in identical relation to it — yet someone must have emitted the aborted gesture of appropriation first, before it could be imitated as a sign. This introduces \"an element of asymmetry\" at the outset, \"the problematic that the originary role of firstness introduces into the human community, defined from the outset by its symmetry in relation to a central sacred object of desire.\" In the event itself firstness has no salience: once the others imitate the first sign-user, no trace of priority survives. But precisely because signs are the one thing an individual can create and give away to everyone's gain, this \"possibility of firstness\" becomes \"the foundation of the human community\" and, in later social organization, \"a major force.\"\n\nFirstness is distinct from succession, which governs the orderly transmission of a center across time; firstness concerns the sheer priority of being first and the danger that priority incurs. Its destiny is self-cancelling — \"the destiny of the firstness of the originary sign is to dissolve itself in the collective reciprocity of its exchange,\" and \"a firstness that fails to lead to this universal exchange is not firstness at all, but an aberration\" that provokes emissary violence. Firstness thus stands in permanent tension with the moral model of reciprocity: not everyone can be first, but everyone must be moral. Because human firstness is figured as \"a reflection of divine firstness,\" it is bound up with the sacred and the deferral of appropriation, and because it is inseparable from the resentment it arouses, it always carries, per the seed, \"a willingness to risk scapegoating.\"",
    "relations": [
      "originary-scene",
      "succession",
      "the-sign",
      "the-sacred",
      "scapegoating",
      "resentment-victimary"
    ],
    "posts": [
      {
        "slug": "clr-603",
        "title": "Toward a Globalist-Victimary Unified Field Theory: Part V – A Morality of Firstness",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-639",
        "title": "Avatars of Firstness",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-484",
        "title": "The Moral Model and the Scandal of the Secular Sign",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-451",
        "title": "Reciprocity and Firstness",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-496",
        "title": "Religion and Firstness",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-342",
        "title": "The Crisis of Firstness (Guest Chronicler: Adam Katz)",
        "note": "Develops the concept."
      },
      {
        "slug": "the-single-source-of-moral-and-intellectual-innovation-gablog",
        "title": "The Single Source of Moral and Intellectual Innovation",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "What I would like to develop here is the problematic that the originary role of firstness introduces into the human community, defined from the outset by its symmetry in relation to a central sacred object of desire, the relation to which provides the fundamental model of both transcendence and resentment.",
        "source": "Avatars of Firstness",
        "sourceSlug": "clr-639"
      },
      {
        "text": "But the destiny of the firstness of the originary sign is to dissolve itself in the collective reciprocity of its exchange, the “moral model” that is the universal, as opposed to the particular, realization of originary humanity. Not everyone can be, or must be, first; but everyone has to participate in reciprocity, everyone must be “moral.” A firstness that fails to lead to this universal exchange is not firstness at all, but an aberration that risks provoking, in Girardian terms, “emissary” violence.",
        "source": "The Moral Model and the Scandal of the Secular Sign",
        "sourceSlug": "clr-484"
      },
      {
        "text": "For in more advanced modes of social organization, firstness will become a major force, and this could not be the case were it not present in latent form from the beginning, in the egalitarian societies we presume existed at the origin of humanity in contrast with the pecking-order hierarchies of apes.",
        "source": "Reciprocity and Firstness",
        "sourceSlug": "clr-451"
      },
      {
        "text": "The moral reciprocity of humans depends on the firstness of gods, and minimally, of the One God who still rules the West; human firstness is a reflection of divine firstness.",
        "source": "Religion and Firstness",
        "sourceSlug": "clr-496"
      },
      {
        "text": "Firstness, then, in these later rememberings, would always involve a willingness to risk scapegoating and its success would be world-historical precisely because that possibility was transcended.",
        "source": "The Crisis of Firstness (Guest Chronicler: Adam Katz)",
        "sourceSlug": "clr-342"
      },
      {
        "text": "A sign can only be meaningful insofar as it has previously generated meaning, but it can also only be meaningful if it represents a new beginning.",
        "source": "The Single Source of Moral and Intellectual Innovation",
        "sourceSlug": "the-single-source-of-moral-and-intellectual-innovation-gablog"
      }
    ],
    "selfReference": "This page is itself an act of firstness in miniature: it takes signs already emitted by Katz and Gans and re-transmits them, adding nothing to the corpus except the priority of having gathered them here first."
  },
  {
    "slug": "market",
    "title": "Market",
    "subtitle": "The scene where no central authority mediates exchange except the sign — sustained by its own anxiety about its future",
    "definition": "In Generative Anthropology the market is the scenic institution through which human beings exchange without a central authority to mediate them, relying only on the shared order of representation through signs. It is the never-completable successor to the ritual system of sacrificial distribution — decentralized in appearance, yet held open by a \"spread,\" a standing anxiety about whether circulation will continue, which is what makes anyone willing to sustain it in the first place.",
    "body": "GA reads the market genetically, not as a natural state but as the far end of \"the never-completable transition from the ritual system of distribution inaugurated in the originary scene to the market system, where no central authority is necessary to mediate between human beings beyond the universal human order of representation through signs\" (Gans). Where ritual redistributes the sacrificial victim from a sacred center, the market disperses that function into decentralized exchange: \"just as democracy makes the originary reciprocal exchange of signs the basis for the negotiation of political decisions, so in the market, the 'equal' division of the sacrificial victim becomes the basis for the negotiation of economic values.\" The market is thus deferral in an economic register — one leaves \"the scene of the market for another scene\" to devise a product and brings it back for evaluation, so that every market runs on \"a slow-motion version of the oscillation between the sign and the imaginary referent\" found in the esthetic. Katz grounds the same institution in the reciprocity of the origin: \"The free market is real, grounded in the reciprocity constitutive of the originary scene.\"\n\nWhat keeps this scene distinct from money — its sign and medium — is that the market is the center that sustains circulation rather than the token that passes through it: \"there only exists a spread insofar as there is anxiety about whether or not the market will continue to exist,\" so that \"the market is constituted by its anxiety about its own future existence.\" That center is never as decentralized as its liberal self-image claims. The apparent dispersal is underwritten: each participant \"donates our intelligence to the central intelligence of the market,\" ultimately \"embodied by the central bank.\" Its rivals are read as parasites or ruins of it — bureaucratic command economics is \"either a parasitic excrescence... upon the market, or it is constructed in the ruins of the market\" — while the imperative to keep money and the center separate (\"money must be kept out of politics, but once the money is out, what is left of the politics?\") marks the market's dependence on, and derogation of, sovereign authority. Bouvard cautions against reifying the scene itself: \"Instead of starting with an abstraction like 'the market,' it's better to start with ongoing realities like supply chains and credit lines.\"",
    "relations": [
      "the-center",
      "deferral",
      "money",
      "ritual",
      "originary-scene",
      "debt-and-credit"
    ],
    "posts": [
      {
        "slug": "there-is-no-economy-pdf",
        "title": "There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary",
        "note": "Where the term is defined."
      },
      {
        "slug": "clr-34",
        "title": "The Free Market",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-123",
        "title": "On Political Economy",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-397",
        "title": "GA: The Other Intellectual Scene",
        "note": "Develops the concept."
      },
      {
        "slug": "the-economic-imperative",
        "title": "The Economic Imperative",
        "note": "Develops the concept."
      },
      {
        "slug": "monopoly",
        "title": "Monopoly",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "I do not think it an exaggeration to say that the course of human history may be described as the never-completable transition from the ritual system of distribution inaugurated in the originary scene to the market system , where no central authority is necessary to mediate between human beings beyond the universal human order of representation through signs.",
        "source": "The Free Market",
        "sourceSlug": "clr-34"
      },
      {
        "text": "Just as democracy makes the originary reciprocal exchange of signs the basis for the negotiation of political decisions, so in the market, the “equal” division of the sacrificial victim becomes the basis for the negotiation of economic values.",
        "source": "On Political Economy",
        "sourceSlug": "clr-123"
      },
      {
        "text": "One leaves the scene of the market for another scene in order to devise a new product or idea that one then brings back to the marketplace for its evaluation. For the duration of this process of deferral, the local scene becomes its own market.",
        "source": "GA: The Other Intellectual Scene",
        "sourceSlug": "clr-397"
      },
      {
        "text": "If the market is presented as a decentralized aggregate of individual activities in which knowledge that no individual could possess by himself is nevertheless held and acted on socially, this is only the case insofar as each of us donates our intelligence to the central intelligence of the market. And in the end this central intelligence is embodied by the central bank, which must step in and “correct” for “market failures.”",
        "source": "There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary",
        "sourceSlug": "there-is-no-economy-pdf"
      },
      {
        "text": "Bureaucratic economics, the “command economy,” organizes distribution of labor and resources through a hierarchical series of imperatives; it is either a parasitic excrescence (even if serving otherwise indispensable purposes) upon the market, or it is constructed in the ruins of the market, and leaves nothing but ruin in its own wake.",
        "source": "The Economic Imperative",
        "sourceSlug": "the-economic-imperative"
      },
      {
        "text": "Instead of starting with an abstraction like “the market,” it’s better to start with ongoing realities like supply chains and credit lines.",
        "source": "Monopoly",
        "sourceSlug": "monopoly"
      }
    ],
    "selfReference": "This page treats the market as a concept to be defined from the corpus, staging its own small scene of exchange in which verbatim quotes circulate in place of paraphrase."
  },
  {
    "slug": "disciplinarity",
    "title": "Disciplinarity",
    "subtitle": "The inquiry-form that suspends interested attention to make the not-yet-visible sharable",
    "definition": "Disciplinarity is the social form of sustained inquiry: a disciplinary space suspends immediate, differing interests and organizes attention around a center so as to drill below ordinary thresholds of significance and make sharable what is not yet visible. In its widest sense it is coextensive with the human — the originary scene was already a discipline — because disciplined inquiry is simply a more deliberate form of the deferral that generates the sign.",
    "body": "In the GA framework disciplinarity names the form inquiry takes when a group organizes its attention around a center in order to see what everyday, \"naive\" perception cannot. A disciplinary space is where participants argue over questions and construct a center, drilling below \"ever lower thresholds of significance\" across domains as unlike as quarks and conscience. What licenses this is deferral: discipline \"is simply a more deliberate form of deferral,\" so a discipline is, in effect, anything one could form a disciplinary space around, continuous with the originary hypothesis that treats meaning as an effect of deferral. This is why disciplinarity can be called coextensive with the human — \"the originary scene was a discipline\" — and why it links back to discipleship, the older mode of inquiry into the divine that supplies its name. Its founding move is paradoxical: \"the decision to see everything one way even though everything appears utterly different than that way,\" a wager that a few terms will make a specific cluster of phenomena work.\n\nDisciplinarity stays distinct from the scenic and the juridical by its object. Where scenic design constructs scenes and the juridical adjudicates guilt and desert, the discipline suspends interested attention: it \"set[s] aside immediate questions for the sake of what... 'will prove true in the long run,'\" answerable to no extrinsic authority because only those within it are competent to judge its workings. Yet it is never free of the center; \"all disciplinary activity... is at bottom aware that something needs to be brought back to the center,\" a condition of inquiry rather than a restriction on it. Katz distinguishes the generative \"disciplinary space\" from the institutionalized \"disciplines,\" which claim their objects as things in themselves; against these, transdisciplinary originary thinking works by \"infiltrating their separate vocabularies\" and assisting insurgents within them — reopening decaying fields to the scene of representation they have deferred.",
    "relations": [
      "the-center",
      "deferral",
      "originary-scene",
      "scenic-design",
      "the-juridical",
      "anthropomorphics"
    ],
    "posts": [
      {
        "slug": "programming-power-and-declarative-culture",
        "title": "Programming, Power and Declarative Culture",
        "note": "Where the term is defined."
      },
      {
        "slug": "introduction-to-disciplinarity",
        "title": "An Introduction to Disciplinarity (Adam Katz)",
        "note": "Develops the concept."
      },
      {
        "slug": "learning-discipline-and-the-thought-experiment",
        "title": "Learning, Discipline and the Thought Experiment",
        "note": "Develops the concept."
      },
      {
        "slug": "disciplining-disciplines",
        "title": "Disciplining Disciplines",
        "note": "Develops the concept."
      },
      {
        "slug": "competence",
        "title": "Competence",
        "note": "Develops the concept."
      },
      {
        "slug": "the-single-source-of-moral-and-intellectual-innovation-gablog",
        "title": "The Single Source of Moral and Intellectual Innovation",
        "note": "Develops the concept."
      },
      {
        "slug": "the-transdisciplinarity-of-the-hypothesis",
        "title": "The Transdisciplinarity of the Hypothesis",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "In the most basic sense, there is nothing but disciplinarity: disciplinarity is coextensive with the human: the originary scene was a discipline, even if that cannot be recognized until a critical mass of overlapping disciplines has emerged.",
        "source": "An Introduction to Disciplinarity (Adam Katz)",
        "sourceSlug": "introduction-to-disciplinarity"
      },
      {
        "text": "At the same time, though, disciplinarity is a form of discipleship, a mode of authority and inquiry into the divine that reaches back into antiquity and is central to the founding of Christianity; moreover, discipline is simply a more deliberate form of deferral, so Peirce’s definition of the sign as, essentially, anything one could form a disciplinary space around, is continuous and consistent with the originary hypothesis, which sees signification and meaning as an effect of deferral.",
        "source": "Learning, Discipline and the Thought Experiment",
        "sourceSlug": "learning-discipline-and-the-thought-experiment"
      },
      {
        "text": "All disciplinary activity, then, no matter how seemingly impractical, unsupervised and free, is at bottom aware that something needs to be brought back to the center. We should see this constraint as a condition of disciplinary activity, not a restriction imposed on what would otherwise be a “purer” form of activity.",
        "source": "Disciplining Disciplines",
        "sourceSlug": "disciplining-disciplines"
      },
      {
        "text": "The hijacking of disciplinary authority for short term advantage is scandalous because we rely heavily upon those who set aside immediate questions for the sake of what, in the words of Charles Sanders Peirce, “will prove true in the long run.”",
        "source": "Competence",
        "sourceSlug": "competence"
      },
      {
        "text": "But it should always be possible to come back to the founding paradox of a discipline—the decision to see everything one way even though everything appears utterly different than that way (if a discipline just reproduced what we already saw and knew, it would be unnecessary).",
        "source": "The Single Source of Moral and Intellectual Innovation",
        "sourceSlug": "the-single-source-of-moral-and-intellectual-innovation-gablog"
      },
      {
        "text": "any mode of thinking likely to make a difference is going to be transdisciplinary, which must mean not only extending across the subject matters of all the disciplines but capable of infiltrating their separate vocabularies and assisting “insurgents” within them to transform them while maintaining its own transdisciplinary base.",
        "source": "The Transdisciplinarity of the Hypothesis",
        "sourceSlug": "the-transdisciplinarity-of-the-hypothesis"
      }
    ],
    "selfReference": "This page is itself a small disciplinary space, drilling below the everyday word \"discipline\" to make its GA sense sharable through verbatim quotation."
  },
  {
    "slug": "justice",
    "title": "Justice",
    "subtitle": "The normative distinction that binds power to a center greater than itself",
    "definition": "In the GA framework justice is not the machinery that adjudicates disputes but the normative distinction that machinery is meant to articulate: the difference between power exercised merely to hold order and power exercised in obedience to a center greater than the one who holds it. Rooted in the egalitarian reciprocity of the originary scene, justice supplements the originary deferral of appropriation by punishing violations of a norm that the whole community once enforced — which is also why it binds even the sovereign to a \"higher power\" and \"true law\" it did not author.",
    "body": "Justice in Generative Anthropology descends from the originary scene, where the sign defers appropriation and holds the participants in an equal, reciprocal relation to the central object. Gans derives our \"sense of justice\" negatively, through the scandal of its breach: \"Injustice is the core representation or idea of resentment.\" Katz gives this a scenic and juridical edge — \"Justice is a supplement to the originary deferral of appropriation; it punishes the violation of a norm that was enforced in the originary scene by the sacred power\" — so that justice always points back to a center that enforces the norm no single agent invented. Because the originary model is one of perfect reciprocity that no actual order can instantiate, justice functions \"not as the template of a static utopia but only as the horizon of a movement toward greater reciprocity\"; it is a standing measure against which resentment lodges its complaint, never a closed procedure.\n\nThis is what distinguishes justice from the institutions that administer it and from sovereignty itself. Against the adjudicatory apparatus — the-juridical — justice is the normative difference that apparatus is supposed to make legible; \"we cannot 'rid' ourselves of the notion of 'justice'\" precisely because we cannot rid ourselves of resentment as \"some complaint made to the center that terms it has laid down have not been adhered to.\" Against sovereignty, justice is the subordinating term: \"'Justice' is the subsistent center, to which the occupant of the center is subordinated,\" and the sovereign secures his own centrality only \"by instituting justice in accord with this 'higher power' and 'true law.'\" Justice thus names the point where power is answerable — the discursive articulation binding whoever occupies the center to a center greater than themselves.",
    "relations": [
      "the-juridical",
      "sovereignty",
      "the-center",
      "deferral",
      "resentment-victimary",
      "originary-scene"
    ],
    "posts": [
      {
        "slug": "centrality-power-sovereignty",
        "title": "Centrality, Power, Sovereignty",
        "note": "Where the term is defined."
      },
      {
        "slug": "ap0101-gans",
        "title": "The Unique Source of Religion and Morality",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-221",
        "title": "Resentment, or the Sense of Injustice",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-222",
        "title": "Justice and Resentment",
        "note": "Develops the concept."
      },
      {
        "slug": "distribution-from-the-center",
        "title": "Distribution from the Center",
        "note": "Develops the concept."
      },
      {
        "slug": "on-the-juridical-disciplinary-line",
        "title": "On the Juridical/Disciplinary Line",
        "note": "Develops the concept."
      },
      {
        "slug": "the-three-resentments",
        "title": "The Three Resentments",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "Justice is a supplement to the originary deferral of appropriation; it punishes the violation of a norm that was enforced in the originary scene by the sacred power that manifests itself in the presence of the community as a whole.",
        "source": "The Unique Source of Religion and Morality",
        "sourceSlug": "ap0101-gans"
      },
      {
        "text": "Injustice is the core representation or idea of resentment, which gives rise to its feeling (anger, rage, depression…). We feel injustice if and only if we consider ourselves capable in principle–perhaps not in practical reality–of justifying this sentiment.",
        "source": "Resentment, or the Sense of Injustice",
        "sourceSlug": "clr-221"
      },
      {
        "text": "Even though the overarching model of justice is the originary moral model, it cannot apply to concrete situations as the template of a static utopia but only as the horizon of a movement toward greater reciprocity.",
        "source": "Justice and Resentment",
        "sourceSlug": "clr-222"
      },
      {
        "text": "“Justice” is the subsistent center, to which the occupant of the center is subordinated.",
        "source": "Distribution from the Center",
        "sourceSlug": "distribution-from-the-center"
      },
      {
        "text": "We cannot “rid” ourselves of the notion of “justice” or some equivalent because we cannot rid ourselves of resentment, which in turn is some complaint made to the center that terms it has laid down have not been adhered to—as they never can be, hard as representatives of the center may try.",
        "source": "On the Juridical/Disciplinary Line",
        "sourceSlug": "on-the-juridical-disciplinary-line"
      },
      {
        "text": "you can’t complain that justice is not being done without taking for granted that it could be done",
        "source": "The Three Resentments",
        "sourceSlug": "the-three-resentments"
      }
    ],
    "selfReference": "This page treats justice as a defining distinction rather than a procedure, and so gathers its quotes to mark where power becomes answerable rather than to settle any case."
  },
  {
    "slug": "liberalism",
    "title": "Liberalism",
    "subtitle": "The political theory that hides who decides",
    "definition": "In the GA framework, liberalism is the governing ideology of modernity that treats the individual as pre-politically inviolable, reduces politics to the cataloguing and balancing of rights, and thereby works to obscure the imperatives issuing from central authority. Its distinctive effect is concealment: not the abolition of the decider but the arrangement whereby no one ever knows who decides anything, so that the center's supervision is redescribed as the servant of ostensibly free agents.",
    "body": "Liberalism names, for GA, not a philosophy of freedom but a mode of concealment. It \"starts political reflection with the assumption that there is something pre-politically inviolable in the individual,\" makes \"the main business of politics\" the \"cataloguing\" and balancing of the rights that follow, and so reframes every decision as the protection or collision of prior entitlements (after-liberalism-2). Because the center never stops issuing imperatives, this reframing does not remove authority but hides it: liberalism \"has generated the illusion that what appears below the threshold of direct supervision is what, in fact, determines the form of supervision; even more, that the supervision is a servant of those actors which have merely been provided some leeway\" (anthropomorphics-center-and-distribution). Its guarantees are thus self-undermining — \"as soon as you guarantee a series of vague, abstract rights you will immediately proceed to generate exceptions\" — so that in practice \"you have whatever rights the government doesn't find it urgent to violate at the moment\" (liberal-democracy-is-the-concealment-of-power).\n\nThis places liberalism firmly in the register of critique rather than of scenic origin. It is distinct from sovereignty, which it does not deny but disperses and cloaks, and from the victimary affect that drives its late crises: liberalism is the specific ideological machinery that ensures \"no one ever knows who decides anything.\" Katz reads its internal contradiction as the \"severing of equality and freedom\" into incommensurable values a state must forever balance (the-mistake-of-liberal-democracy), while Gans notes that its founding intention corrodes over time, since \"liberalism cannot perpetuate itself beyond its founding generation without this original intention becoming a source of 'perverse incentives'\" (clr-136). Yet the concept it hypes — individuality — persists and must be reconstituted rather than discarded, \"because liberalism hypes it but actually corrodes it\" (online-version-of-erics-gans-a-new-way-of-thinking). The task GA poses is to bring the concealed decider back into view: to inquire openly into the meaning of imperatives issued by the center.",
    "relations": [
      "sovereignty",
      "the-center",
      "resentment-victimary",
      "power",
      "ostensive-imperative-declarative",
      "nomos"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-the-center-and-imperative-authority",
        "title": "The Center and Imperative Authority",
        "note": "Where the term is defined."
      },
      {
        "slug": "after-liberalism-2",
        "title": "After Liberalism 2",
        "note": "Develops the concept."
      },
      {
        "slug": "anthropomorphics-center-and-distribution",
        "title": "Center and Distribution",
        "note": "Develops the concept."
      },
      {
        "slug": "liberal-democracy-is-the-concealment-of-power",
        "title": "“Liberal Democracy” is the Concealment of Power",
        "note": "Develops the concept."
      },
      {
        "slug": "the-mistake-of-liberal-democracy",
        "title": "The Mistake of Liberal Democracy",
        "note": "Develops the concept."
      },
      {
        "slug": "clr-136",
        "title": "The Moral Contradiction of Liberalism",
        "note": "Develops the concept."
      },
      {
        "slug": "online-version-of-erics-gans-a-new-way-of-thinking",
        "title": "Bouvard on Individualism Beyond Liberalism's Dialectic",
        "note": "Develops the concept."
      }
    ],
    "passages": [
      {
        "text": "By “liberalism,” of course, I mean the traditional variety, which starts political reflection with the assumption that there is something pre-politically inviolable in the individual, that this inviolability implies a series of rights that the individual bears with him or her in entering political society, and that the main business of politics is cataloguing those rights, setting up hierarchies amongst them, figuring out how best to protect them, to prevent their exercise from leading to one colliding into another, and so on.",
        "source": "After Liberalism 2",
        "sourceSlug": "after-liberalism-2"
      },
      {
        "text": "Liberalism has generated the illusion that what appears below the threshold of direct supervision is what, in fact, determines the form of supervision; even more, that the supervision is a servant of those actors which have merely been provided some leeway.",
        "source": "Center and Distribution",
        "sourceSlug": "anthropomorphics-center-and-distribution"
      },
      {
        "text": "We don’t even need examples: as soon as you guarantee a series of vague, abstract rights you will immediately proceed to generate exceptions. You have whatever rights the government doesn’t find it urgent to violate at the moment.",
        "source": "“Liberal Democracy” is the Concealment of Power",
        "sourceSlug": "liberal-democracy-is-the-concealment-of-power"
      },
      {
        "text": "Liberal democracy is constituted by the severing of equality and freedom, which become incommensurable “values” which need to be balanced and one of which must be given priority at any instant.",
        "source": "The Mistake of Liberal Democracy",
        "sourceSlug": "the-mistake-of-liberal-democracy"
      },
      {
        "text": "But what has not been sufficiently appreciated is that, like the Romantic utopianism derided by Marx , liberalism cannot perpetuate itself beyond its founding generation without this original intention becoming a source of “perverse incentives.”",
        "source": "The Moral Contradiction of Liberalism",
        "sourceSlug": "clr-136"
      },
      {
        "text": "In fact, something like that will need to be enhanced under \"absolutism\" (or whatever it ends up being called), because liberalism hypes it but actually corrodes it. So, yes, there will be a dialectic with liberalism.",
        "source": "Bouvard on Individualism Beyond Liberalism's Dialectic",
        "sourceSlug": "online-version-of-erics-gans-a-new-way-of-thinking"
      }
    ],
    "selfReference": "This page is itself an inquiry into who decides — assembling verbatim from Gans, Katz, and Bouvard the case that liberalism's defining work is to make that question unaskable."
  }
];

export function getConceptBySlug(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}

/**
 * Maps lowercase single-word (or short-phrase) terms to their concept-page slug.
 * Used by the Concordance, A–Z index, and ClickableTerm to route clicks to
 * /guide/concepts/[slug] instead of search/ask whenever a concept page exists.
 */
// The canonical term→concept map lives in src/lib/cs-terms.ts (single source
// of truth — this file used to hold a divergent copy). Re-exported so existing
// imports from @/data/guide/concepts keep working.
export { TERM_TO_CONCEPT_SLUG } from '@/lib/cs-terms';
