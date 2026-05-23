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
      { slug: 'gablog-the-discourse-of-the-center', title: 'The Discourse of the Center', note: 'The center as the organizing structure of all discourse. Begin here.' },
      { slug: 'pdf-event-origin-center', title: 'Event, Origin, Center', note: 'The center as presupposition of all institutional action, including journalism.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The extended treatment of signifying center vs. occupied center.' },
      { slug: 'pdf-talk-of-the-center-adam-katz', title: 'Talk of the Center', note: 'How all social interaction is organized around the problem of the center.' },
    ],
    passages: [
      {
        text: 'What is a center? Whatever can invoke and be referenced by an ostensive sign: the center is both cause and product of the sign—as cause it subsists beyond any particular reference, and as product it is continually renewed. Invoking the sign exceeds the reference, though—it is already the beginning of an imperative. So, a center is a locus of imperative exchange—whatever about the object commands the issuance of the ostensive sign is also an agency of which requests can be made.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'A center establishes a hierarchy—at the very least between center and margin. But every other hierarchy is modeled on the hierarchy between center and margin—hierarchies are only possible if there is a center.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The center issues signs to those on the margin, who in turn convey those signs to one another in collaborations and deliberations that produce signs issued back to the center.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The very operation of all the institutions of information production and provision presupposes an unwavering orientation toward the central authority, regardless of how decentralized things seem, or how impossible we might think it is to locate the sources of power and decision making.',
        source: 'Event, Origin, Center',
        sourceSlug: 'pdf-event-origin-center',
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
      { slug: 'book-the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Katz\'s introduction situates the hypothesis against its main philosophical obstacles.' },
      { slug: 'gablog-how-does-the-center-speak', title: 'How Does the Center Speak?', note: 'The originary scene as the foundation of all communication.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The fullest development of the scene\'s implications for grammar and politics.' },
    ],
    passages: [
      {
        text: 'Gans assumes that the mimetic crisis is organized around some object of appetitive attention—most likely some food source, perhaps a recent kill. Ordinarily, among the higher primate species, the object would be consumed in order, first by the Alpha animal, then by the Beta, and so on. But on this occasion, the mimetic rivalry induced by the object overrides the pecking order as all members of the group move toward the object at the center. Appetite becomes "desire," that is, a social phenomenon involving one\'s relation to others and not merely the object itself.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The gesture indicates a renunciation, perhaps momentary (but that is enough), of the desired object. This, what Gans calls "the gesture of aborted appropriation," is the first sign. The rivalrous imitation that first propels the group toward center and potentially cataclysmic violence is converted into a pacifying imitation that de-escalates the crisis; the order provided by the animal pecking order is replaced by an order mediated by the sign, which defers violence through representation. A new species is born: the human, the only species, as Gans puts it, that poses a greater danger to its own survival than is posed to it by anything in its environment.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The paradoxes of deferral we see on the originary scene are enduring features of the human. That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
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
        text: '"Deferral," meanwhile, perfectly captures the position within the act itself, along with its fundamental contingency, between the convergence heading toward destruction and what will perhaps be no more than the mere delay of that tendency.',
        source: 'On Deferral',
        sourceSlug: 'gablog-on-deferral',
      },
      {
        text: 'Such questions emerge from an understandable misunderstanding of deferral, the more advanced forms of which allow for plenty of eating, drinking, lovemaking, fighting (where necessary) and anything else needed for a full human life. The immediate effect of deferral is not an intolerable feeling of privation, since deferral emerges in response to accumulating desire more than to need—rather, the effect is of a new world opening up.',
        source: 'The Generativity of Deferral',
        sourceSlug: 'gablog-the-generativity-of-deferral',
      },
      {
        text: 'Language is going to be generative even if we act as if it is representational — pretensions to a secure metalanguage really serve to guarantee a moral or political certainty that avoids the problem of creating in some space of language the shared attention directed towards some center.',
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
      { slug: 'book-the-origin-of-language', title: 'The Origin of Language', note: 'Gans\'s foundational account of the three forms.' },
      { slug: 'pdf-linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The error of treating the declarative as primary.' },
      { slug: 'pdf-originary-technics', title: 'Originary Technics', note: 'The imperative as the origin of technology.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The originary grammar that follows from the three forms.' },
    ],
    passages: [
      {
        text: 'This first sign is an "ostensive" sign, which means it says nothing "about" anything, it just indicates and preserves mere presence. Think of the kinds of expressions we use to alert others to an emergency situation—"fire!"; "man overboard!"—and you get the idea. Before anything can be done or examined, our attention must first of all be fixed on this thing.',
        source: 'Originary Technics',
        sourceSlug: 'pdf-originary-technics',
      },
      {
        text: 'The imperative is a result of an "inappropriate ostensive." One member of the community issues the ostensive sign in the absence of the object, and another member of the community then supplies the object. The declarative emerges in response to a problem raised by the imperative—what we might call an "inappropriate imperative." There would be imperatives that couldn\'t be fulfilled, raising the specter of a breakdown of linguistic presence.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'Beyond the heuristic value of originary grammar, I will insist on taking it quite literally: there is no way we could ever be doing anything that is not following an imperative within a network of imperatives deriving from an ostensive world and explicated by declaratives. We are semiotic beings, composed of signs and signs ourselves, and the ostensive, imperative, interrogative and declarative are the most elementary signs. All we do is try to follow what the center is telling us to do.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
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
      { slug: 'book-the-origin-of-language', title: 'The Origin of Language', note: 'The sacred as constitutional to the originary scene.' },
    ],
    passages: [
      {
        text: 'The sacred is an indirect, unaware representation of sociality, since the human contribution to the construction of sacrality cannot be explicitly represented. Directly representing the social was also the project of secular thought, but the project turned out to be impossible on those terms because the "human" individual must be taken as its own origin, with the signs that mediate between humans mere expressions of what is always already internal to the human individual.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'The originary event is also the origin of resentment: the same sacred Being that preserves the community restrains desire while endowing the object with a sacrality that enhances its desirability.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
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
        text: 'Carl Schmitt took the Greek word "nomos," usually translated as "law," but in a broad sense including "norms," to refer to an originary division of land, a partition, by its first inhabitants. Whether the land has been conquered, discovered, or shared with another people, the nomos grounds the community in a more or less equal distribution and a more or less tacit covenant. The distribution may be according to contributions to the founding, or pre-existing power relations, and the covenant might be retrojected to the origin in order to conceal a more unilateral event, but, either way, the nomos provides a point of reference for all communal events going forward: they can be judged by the degree of their conformity to the nomos.',
        source: 'Sovereignty, Nomos and Parrhesia',
        sourceSlug: 'gablog-sovereignty-nomos-and-parrhesia',
      },
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
        text: 'The mode of succession is the most important question for assessing a social order—how is the center transferred from one occupant to the next tells us everything important we need to know about that social order. I want to further extend that argument now so as to apply it to all practices—everywhere, succession is the sign of success. Whatever you do or say is meaningful and important insofar as you create the place for and when possible install your successor.',
        source: 'Successful Succession',
        sourceSlug: 'gablog-successful-succession',
      },
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
        text: 'The imperial order institutes a juridical order in order to replace this asymmetrical reciprocity with symmetry between the subjects in relation to the center, whose occupant is beyond all reciprocity.',
        source: 'Tethering and Toggling: Ritual, Juridical and Disciplinary',
        sourceSlug: 'substack-tethering-and-toggling-ritual-juridical-and-disciplinary',
      },
      {
        text: 'The juridical is in fact an imperial construct, intervening in the reciprocity of families, clans and tribes, and that reciprocity also contains certain limits that anticipate the juridical, but in this case the reciprocity falls on the head of the family, clan or tribe, to whom something is "owed." The imperial institution of justice is therefore quite hostile to the heads and chiefs and the extended kinship relations they embody.',
        source: 'On the Juridical-Disciplinary Line',
        sourceSlug: 'substack-on-the-juridical-disciplinary-line',
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
      {
        text: 'The Big Man renders everyone dependent upon him, entirely for "merit-based" reasons, and this is a debt which can never be paid back. Out-gifting others therefore becomes a model for the initial power differential.',
        source: 'Discipline and Debt',
        sourceSlug: 'gablog-discipline-and-debt',
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
      {
        text: '"technics" is the scenic design component of the constitution of the human; the human is scenic from the start, definitively, constitutively, but scenes, once in existence, need to be maintained and constructed; the first deliberately constructed scenes were ritual scenes, composed so as to situate the community in a relation to the sacrificial center so as to facilitate and maximize the exchange entered into with that center.',
        source: 'Originary Grammar as Model for Scenic Design Intelligence',
        sourceSlug: 'substack-originary-grammar-as-model-for-scenic-design-intelligence',
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
        text: 'The human is modeled on the non-human center—this is why I call the human science I am presenting here an "anthropomorphics." Humans anthropomorphized themselves before they could carry out this operation on anything else.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: '"anthropomorphics" was also meant to foreground the artificiality of the human, from the beginning—we were always already imitating the center that was itself nothing more than a vectorization of our converging desires turned back at us through a prohibition. This was a way of distancing myself from GA\'s or any humanism and insisting on the historicity of the human.',
        source: 'Anthropomorphics (Substack)',
        sourceSlug: 'substack-anthropomorphics',
      },
      {
        text: 'There can\'t really be a more fundamental human relation than pedagogy, and firstness on the originary scene and thereafter is really a pedagogical relation; even more, a linguistic pedagogy relation. Pedagogy is fractally hierarchical.',
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
      { slug: 'book-the-origin-of-language', title: 'The Origin of Language (Introduction)', note: 'Victimary humanism as the primary obstacle to the originary hypothesis.' },
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Resentment toward the Big Man and its productive and destructive channels.' },
      { slug: 'pdf-nemesis-jouvenelian-liberal-model', title: 'Nemesis: The Jouvenelian vs. the Liberal Model', note: 'Anti-centerism as the pathology of liberal modernity.' },
    ],
    passages: [
      {
        text: 'Resentment is our scandalized reaction to the existence of situations where this symmetrical configuration is not maintained. Unequal treatment of anyone constitutes a disequilibrium that is scandalous because it seems to threaten the community with return to originary chaos. I am not merely upset at my own ill-treatment; I am in terror of the potential disintegration of the entire social order.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
      },
      {
        text: 'Our resentful reaction to inequality reveals our belief in the moral model—an ostensive belief like the foxhole belief in God. Resentment points to the act of injustice, makes it known. God remains the implicit audience of our resentment as he was of our plea for help, but now we expect the rest of the human community to share our reaction.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
      },
      {
        text: 'But victimary thinking enacts this resistance and refusal as a resentment of firstness: Nazism\'s extremities are just the extension of the striving for pre-eminence among nations, among firms in the economy, among ideological and religious claims, and so on.',
        source: 'Deconstructing the Victimary',
        sourceSlug: 'gablog-deconstructing-the-victimary',
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
        text: 'So, I can now replace the clumsy "occupant of the center" with "pointman," as a more resonant and less technical-sounding synonym. Nor is seeking out the pointman a merely passive stance—it\'s not waiting for Godot, because there are a lot of candidates out there and you\'re looking for them, testing them when they emerge, drawing conclusions from events they create, contributing to the conditions of their platforming.',
        source: 'The Pointman',
        sourceSlug: 'substack-the-pointman',
      },
      {
        text: 'Like the Axial Age sacrificial figure, the pointman must draw all attention to himself, and must compel everyone to choose whether to join or deny him. Everyone will be marked by the degree to which they keep "faith" with him. We are speaking of the latest iteration of the Big Man, which also means that what is now commemorated is the pointman\'s reception, seizure and eventual transfer of power.',
        source: 'The Pointman',
        sourceSlug: 'substack-the-pointman',
      },
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
        text: 'The burden of this book is to follow those trails and work out a social, political and cultural theory, or, as I will call it, an "anthropomorphics," as an originary grammar of the center. So, I will show that speaking in terms of the imperatives we are conveying, or hearing, from the center, when discussing declarative sentences and discourse, will yield insights unavailable when following more conventional imperatives to speak about sentences and discourses in terms of meanings packaged by one mind for others according to specific explicit and tacit rules.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'What we could say is that ritual is primarily ostensive, with imperative derived from the center and declaratives serving to determine which imperative to obey in particular cases; while the juridical ends up with an imperative, something someone is commanded to do or refrain from doing, and gathers ostensives and declaratives together to that end.',
        source: 'Back to Grammar',
        sourceSlug: 'substack-back-to-grammar',
      },
      {
        text: 'A way of thinking involves a new vocabulary and grammar; it puts words to new use, generates new questions and imperatives. Any new way of thinking would do this; all the more so must one founded upon an account of the origin of language; all the more so an account of the origin of language that sees language as constitutive of the human.',
        source: 'Idioms of Inquiry',
        sourceSlug: 'gablog-idioms-of-inquiry',
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
    relations: ['the-center', 'originary-scene', 'succession', 'debt-and-credit', 'the-sacred', 'resentment-victimary'],
    posts: [
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'The primary treatment of the Big Man and out-gifting as the origin of hierarchical power.' },
      { slug: 'gablog-discipline-and-debt', title: 'Discipline and Debt', note: 'The Big Man\'s out-gifting as the origin of asymmetric debt.' },
      { slug: 'pdf-there-is-no-economy', title: 'There Is No Economy', note: 'The Big Man template extended to money and the tributary structure.' },
    ],
    passages: [
      {
        text: 'The Big Man, through enterprise, discipline, and what Gans calls "producer\'s desire" accumulates goods and prestige that place him above the egalitarian community. The Big Man marks the beginning of wealth accumulation, individual liberty, and social hierarchy. Even more, the Big Man usurps the ritual center of the community, taking on a sacred status, ultimately becoming a kind of God King.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
      },
      {
        text: 'The resentment that is generated and resolved by the sacred center is now directed towards the Big Man: on the one hand, every one, and especially rivals, envy him his place; on the other hand, and even more importantly, all members of the community insist that he enforce a "just" distribution of goods, with "just" being based on the model of the originary scene.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
      },
      {
        text: 'Civilization is the generalization of the experience of the Big Man, in which authority is generated by self-denial, generosity and concern for and action on the community as a whole—not necessarily its complete generalization (any civilization will contain the less and uncivilized), but the steady inclusion of more social spaces.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
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
    relations: ['originary-scene', 'deferral', 'the-sacred', 'resentment-victimary', 'sparagmos'],
    posts: [
      { slug: 'pdf-mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', note: 'Mimesis as the structural condition of institution-building and its pathologies.' },
      { slug: 'substack-exhaustive-imitation', title: 'Exhaustive Imitation', note: 'Bouvard on the limits of imitation and the AI problem.' },
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Mimetic desire and the Big Man\'s usurpation of the center.' },
    ],
    passages: [
      {
        text: 'That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'mimesis is first of itself negentropic insofar as the capacity of members of a group to learn from each other enhances each member of the group\'s ability to resist entropic tendencies; but mimesis itself turns entropic once it interferes with other group stabilizing mechanisms (the pecking order) and, more precisely, subtracts rather than adding information regarding the action sequence.',
        source: 'Mimesis, the Center and Auto-Immunology',
        sourceSlug: 'pdf-mimesis-center-auto-immunology',
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
    relations: ['originary-scene', 'the-sacred', 'big-man', 'debt-and-credit', 'resentment-victimary'],
    posts: [
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The sparagmos as the first distribution and the origin of the sacred meal.' },
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'The sparagmos and the Big Man Revolution.' },
    ],
    passages: [
      {
        text: 'In the sparagmos, the tension generated by the prior restraint is loosened, and so this danger does present itself as the community attacks the meal in this unprecedented manner. Resentment at the object itself, for imposing restraint and refusing itself, intensifies the devouring of the body. The only thing preventing each member from overreaching his bounds and turning on his fellows is the sign itself, which we can imagine working within the sparagmos as a kind of reminder of the collective limits making this peaceful consumption possible.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'Following the sparagmos, as the community faces each other over the remains of their victim/meal/deity, the sign would be issued once again, this time pointing to the remainders and mementos of the sacred being, marking the first ritual.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
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
    relations: ['originary-scene', 'mimesis', 'resentment-victimary', 'the-sacred', 'deferral'],
    posts: [
      { slug: 'pdf-esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'Desire and deferral as the aesthetic oscillation.' },
      { slug: 'pdf-the-anthropoetics-of-power', title: 'The Anthropoetics of Power', note: 'Desire and the mimetic structure of the Big Man\'s usurpation.' },
      { slug: 'substack-resentment', title: 'Resentment', note: 'Bouvard on desire, resentment, and the structure of the sign.' },
    ],
    passages: [
      {
        text: 'Appetite becomes "desire," that is, a social phenomenon involving one\'s relation to others and not merely the object itself. Desire intensifies the mimetic crisis.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'desire cannot coincide with meaning: the purer the desire, the more any interference with that desire must be destroyed, intellectually and physically, if possible. Desire cannot tolerate an independent reality within which the object might embed itself and thereby resist possession. And by possession, I mean absolute, unquestioned, permanent possession—which is what desire aims at.',
        source: 'The Grammar of Desire and Resentment',
        sourceSlug: 'gablog-the-grammar-of-desire-and-resentment',
      },
      {
        text: 'To put it in grammatical terms, desire involves the object issuing imperatives to the subject—come and get me; be who you can be once you have me; protect me from all others, etc.—but insofar as the object then resists possession, or breaks the promises implicit in its beckoning, the subject is reduced to issuing imperatives to the object.',
        source: 'The Grammar of Desire and Resentment',
        sourceSlug: 'gablog-the-grammar-of-desire-and-resentment',
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
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Omnicentrism as the post-sacrificial recognition of universal potential centrality.' },
      { slug: 'pdf-esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The esthetic as omnicentric — the sacred extended to every individual\'s imagination.' },
      { slug: 'gablog-centering', title: 'Centering', note: 'The practice of centering as the post-sacrificial exercise of originary standing.' },
    ],
    passages: [
      {
        text: 'This is what creates the possibility for each and every one of us to become a center — that is, as one who is not to be sacrificed or violently centralized. We owe the God who has revealed this to us everything, which is to say all that makes up our own centrality.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
      },
      {
        text: 'A completely marketized order is, as Eric Gans has pointed out, an "omnicentric" one. In that case, one\'s response to the emergence of new resentments or conflicts is to seek or create new centers. But any new center must draw upon the resources and authority of some existing center. At the very least, it must employ the linguistic reserves of existing centers.',
        source: 'The Linguistic Turn and Generative Literacy',
        sourceSlug: 'pdf-linguistic-turn-generative-literacy',
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
    relations: ['originary-scene', 'deferral', 'the-sacred', 'mimesis', 'originary-grammar'],
    posts: [
      { slug: 'book-the-origin-of-language', title: 'The Origin of Language', note: 'Gans\'s foundational account of the sign as aborted gesture.' },
      { slug: 'pdf-linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', note: 'The sign as the completion of the linguistic turn.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'The sign and the grammar of scenes.' },
      { slug: 'substack-inscription', title: 'Inscription', note: 'Bouvard on inscription as extension of the originary sign.' },
    ],
    passages: [
      {
        text: 'A sign has meaning insofar as it can be repeated, which is to say, repeated as the same sign. We can go further and say that the meaning of a sign is precisely the various ways and occasions upon which it can be repeated. One\'s understanding of a sign is demonstrated by the ways one is able to repeat it and have it accepted as that sign. But since a sign refers to a shared center, others, whose cooperation, or even attention, cannot be ensured, meaning can never be guaranteed in advance.',
        source: 'Signing Up',
        sourceSlug: 'gablog-signing-up',
      },
      {
        text: 'Whether we speak in terms of a Peircean "symbol," or the distinction between signifier and signified, the sign is different from any form of non-human communication insofar as the operation of any sign is both conventional and historical while being outside of conventionality and history. Words only mean what they mean insofar as a community of language users "agrees" that that is what they mean.',
        source: 'Anthropomorphics',
        sourceSlug: 'book-anthropomorphics',
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
    relations: ['originary-scene', 'the-sign', 'originary-grammar', 'scenic-design', 'deferral'],
    posts: [
      { slug: 'pdf-attentionality-originary-ethics', title: 'Attentionality and Originary Ethics', note: 'The primary treatment of attentionality as the ground of ethics.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Attentionality as the scene\'s constitutive relation.' },
      { slug: 'substack-the-scene-on-which-you-find-yourself', title: 'The Scene On Which You Find Yourself', note: 'Bouvard on how we find ourselves always already in a scene of shared attention.' },
    ],
    passages: [
      {
        text: 'Considered at its most minimal, language is grounded, as Michael Tomasello along with Eric Gans has shown, in joint attention—the capacity to pay attention to the same thing at the same time, to know that we are doing it, and to know that we know (to let each other know). It should be possible, then, to analyze all human, which is to say social, phenomena, in terms of forms of attention, articulated in ever more complex ways.',
        source: 'The Attentional Structure of Sovereignty',
        sourceSlug: 'gablog-the-attentional-structure-of-sovereignty',
      },
      {
        text: 'formal representation is itself ethical, is indeed the origin and resource of any ethics, so that ethics cannot be thought outside of it. At the same time, formal representation cannot be thought outside of ethics, since the "formality" of the representation lies in the shared attention it effects, and in this shared attention lies any ethics. In shared, or joint attention, is the fundamental equality-on-the-scene that constitutes the human.',
        source: 'Attentionality and Originary Ethics',
        sourceSlug: 'pdf-attentionality-originary-ethics',
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
    relations: ['originary-scene', 'the-sacred', 'big-man', 'sparagmos', 'scenic-design', 'debt-and-credit'],
    posts: [
      { slug: 'substack-media-as-ritual', title: 'Media as Ritual', note: 'Bouvard on media as the post-sacrificial successor to the ritual function.' },
      { slug: 'book-anthropomorphics', title: 'Anthropomorphics', note: 'Ritual as the institutionalization of the originary scene.' },
      { slug: 'pdf-esthetic-sacred-originary-modernity', title: 'The Esthetic, the Sacred, and Originary Modernity', note: 'The esthetic as post-sacrificial ritual.' },
      { slug: 'gablog-originary-grammar-and-post-sacrificial-semiotic-agency', title: 'Originary Grammar and Post-Sacrificial Semiotic Agency', note: 'Post-sacrificial order and the grammar it requires.' },
    ],
    passages: [
      {
        text: 'What we speak of as ritual is distribution from the center returning to the center including the process of distributing people so as to manage the distribution and return.',
        source: 'Tethering and Toggling: Ritual, Juridical and Disciplinary',
        sourceSlug: 'substack-tethering-and-toggling-ritual-juridical-and-disciplinary',
      },
      {
        text: 'The form of ritual is dictated by the center, which is to say the intentions of the center are embedded in a community\'s rituals. But they are not made explicit by rituals which, by definition, embody tacit knowledge. Understanding what the center wants involves, then, a reading of rituals or, more precisely, the attribution of intentions to the figures populating the ritual.',
        source: 'The Anthropoetics of Power',
        sourceSlug: 'pdf-the-anthropoetics-of-power',
      },
      {
        text: 'The first ritual following the originary scene itself would have aimed at eliminating the unevenness necessary to that scene (the staggered procession in which the sign would have been issued) by having everyone enact the originary event in sync.',
        source: 'There Is No Economy',
        sourceSlug: 'pdf-there-is-no-economy',
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
    relations: ['scenic-design', 'the-sign', 'originary-grammar', 'attentionality', 'debt-and-credit'],
    posts: [
      { slug: 'substack-idiom-and-the-differend', title: 'Idiom and the Differend', note: 'Bouvard on idiom, translation, and the Lyotardian differend.' },
      { slug: 'substack-idiomatic-intelligence-and-the-black-box', title: 'Idiomatic Intelligence and the Black Box', note: 'Idiomatic intelligence as the capacity to operate within a scene with scenic distinctiveness.' },
      { slug: 'substack-the-transfer-idiom', title: 'The Transfer Idiom', note: 'The concept of the transfer idiom for translation between scenes.' },
      { slug: 'substack-imperatives-for-idiom-creation', title: 'Imperatives for Idiom Creation', note: 'What drives the creation of new idioms.' },
    ],
    passages: [
      {
        text: 'An idiom is this articulation of group membership, the sharing of a sacred center, and its anthropological "surplus," or awareness that the signs designating that center might be otherwise and in fact are otherwise, having their equivalents in every other group. The preservation of an idiom, moreover, depends upon sharpening the differences between equivalents rather than ironing them out.',
        source: 'The Right of the Idiom Yet Again',
        sourceSlug: 'gablog-the-right-of-the-idiom-yet-again',
      },
      {
        text: '"Idiomatic intelligence" has us keep in mind the resistance to translation the ongoing naming constitutive of any event-scene undergoes and the corresponding need for translation practices. "Idiomatic intelligence" incorporates the ritual, or the most originary modes of commemoration, in a way that "formalization," drawing almost exclusively upon the juridical, doesn\'t.',
        source: 'Generating Idiomatic Intelligences and Translation Practices',
        sourceSlug: 'substack-generating-idiomatic-intelligences-and-translation-practices',
      },
    ],
    selfReference: 'Center Study has an idiom. This guide is written in it — or as close to it as a guide can get. The reader who has followed the guide to this point has begun to acquire the idiom, even if they cannot yet name what they have acquired.',
  },

];

export function getConceptBySlug(slug: string): Concept | undefined {
  return CONCEPTS.find((c) => c.slug === slug);
}

/**
 * Maps lowercase single-word (or short-phrase) terms to their concept-page slug.
 * Used by the Concordance, A–Z index, and ClickableTerm to route clicks to
 * /guide/concepts/[slug] instead of search/ask whenever a concept page exists.
 */
export const TERM_TO_CONCEPT_SLUG: Record<string, string> = {
  // The Center
  'center': 'the-center',
  'centers': 'the-center',
  'centered': 'the-center',

  // Deferral
  'deferral': 'deferral',
  'defer': 'deferral',
  'deferred': 'deferral',
  'deferring': 'deferral',
  'defers': 'deferral',

  // Ostensive / Imperative / Declarative
  'ostensive': 'ostensive-imperative-declarative',
  'imperative': 'ostensive-imperative-declarative',
  'declarative': 'ostensive-imperative-declarative',
  'ostensives': 'ostensive-imperative-declarative',
  'imperatives': 'ostensive-imperative-declarative',
  'declaratives': 'ostensive-imperative-declarative',

  // The Sacred
  'sacred': 'the-sacred',
  'sacrality': 'the-sacred',
  'sacralities': 'the-sacred',

  // Nomos
  'nomos': 'nomos',
  'nomic': 'nomos',

  // Succession
  'succession': 'succession',
  'successor': 'succession',
  'successors': 'succession',

  // The Juridical
  'juridical': 'the-juridical',

  // Debt and Credit
  'debt': 'debt-and-credit',
  'debts': 'debt-and-credit',
  'credit': 'debt-and-credit',
  'credits': 'debt-and-credit',

  // Scenic Design
  'scenic': 'scenic-design',

  // Anthropomorphics / Metaperson
  'anthropomorphics': 'anthropomorphics',
  'metaperson': 'anthropomorphics',
  'metapersons': 'anthropomorphics',

  // Resentment / Victimary
  'resentment': 'resentment-victimary',
  'resentments': 'resentment-victimary',
  'victimary': 'resentment-victimary',
  'anticenterism': 'resentment-victimary',
  'anti-centerism': 'resentment-victimary',

  // The Pointman / The Uninsurable
  'pointman': 'pointman-uninsurable',
  'pointmen': 'pointman-uninsurable',
  'uninsurable': 'pointman-uninsurable',

  // Originary Grammar
  'grammar': 'originary-grammar',
  'infralinguistic': 'originary-grammar',
  'infralinguistics': 'originary-grammar',
  'generative literacy': 'originary-grammar',

  // Big Man
  'big man': 'big-man',
  'big-man': 'big-man',

  // Mimesis
  'mimesis': 'mimesis',
  'mimetic': 'mimesis',
  'mimeticism': 'mimesis',
  'mimetically': 'mimesis',

  // Sparagmos
  'sparagmos': 'sparagmos',

  // Desire
  'desire': 'desire',
  'desires': 'desire',

  // Omnicentrism
  'omnicentrism': 'omnicentrism',
  'omnicentric': 'omnicentrism',
  'omnicentrist': 'omnicentrism',

  // The Sign
  'sign': 'the-sign',
  'signs': 'the-sign',

  // Attentionality
  'attentionality': 'attentionality',

  // Ritual
  'ritual': 'ritual',
  'rituals': 'ritual',

  // Idiom
  'idiom': 'idiom',
  'idioms': 'idiom',
  'idiomatic': 'idiom',
};
