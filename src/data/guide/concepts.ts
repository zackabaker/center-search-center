export interface ConceptPassage {
  text: string;
  source: string;
  sourceSlug: string;
}

export interface ConceptPost {
  slug: string;
  title: string;
  /** No longer populated — editorial notes were removed under the quote-first content rule. */
  note?: string;
}

export interface Concept {
  slug: string;
  title: string;
  /** No longer populated — removed under the quote-first content rule. */
  subtitle?: string;
  definition?: string;
  /** No longer populated — the AI Overview text was removed under the quote-first content rule. */
  body?: string;
  relations: string[];
  posts: ConceptPost[];
  passages: ConceptPassage[];
  /** No longer populated — removed under the quote-first content rule. */
  selfReference?: string;
}

export const CONCEPTS: Concept[] = [
  {
    "slug": "the-center",
    "title": "The Center",
    "definition": "The center is the focal point of a shared scene — the object, being, or vacancy toward which all participants orient, which their common orientation simultaneously constitutes as sacred. The center is not a place but a posture: the unanimous agreement to face the same way.",
    "relations": [
      "originary-scene",
      "deferral",
      "the-sacred",
      "resentment-victimary",
      "succession",
      "nomos",
      "ostensive-imperative-declarative",
      "the-juridical"
    ],
    "posts": [
      {
        "slug": "the-center",
        "title": "Lecture 4: The Center"
      },
      {
        "slug": "the-discourse-of-the-center",
        "title": "The Discourse of the Center"
      },
      {
        "slug": "event-origin-center",
        "title": "Event, Origin, Center"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "talk-of-the-center-adam-katz",
        "title": "Talk of the Center"
      }
    ],
    "passages": [
      {
        "text": "The center is whatever interferes with violent centralization.",
        "source": "Revivalistics",
        "sourceSlug": "revivalistics"
      },
      {
        "text": "What is a center? Whatever can invoke and be referenced by an ostensive sign: the center is both cause and product of the sign—as cause it subsists beyond any particular reference, and as product it is continually renewed. Invoking the sign exceeds the reference, though—it is already the beginning of an imperative. So, a center is a locus of imperative exchange—whatever about the object commands the issuance of the ostensive sign is also an agency of which requests can be made.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "All human existence is an exchange with the center. The first message from the center is to defer appropriation, a message \"heard\" by all participants on the scene. Once deferral has been effected, the means of the deferral (the sign) can be deployed in new circumstances, to defer new conflicts.",
        "source": "How Does the Center Speak?",
        "sourceSlug": "how-does-the-center-speak"
      },
      {
        "text": "There is always a center whenever humans are arranged in relation to each other, and the center is always occupied, even if only by a sacred carcass. All the continuities and discontinuities in human history follow from successive attempts to occupy, hold, expand the reach of, or replace, the center or its present occupant.",
        "source": "Scale",
        "sourceSlug": "scale"
      },
      {
        "text": "A center establishes a hierarchy—at the very least between center and margin. But every other hierarchy is modeled on the hierarchy between center and margin—hierarchies are only possible if there is a center.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "The very operation of all the institutions of information production and provision presupposes an unwavering orientation toward the central authority, regardless of how decentralized things seem, or how impossible we might think it is to locate the sources of power and decision making.",
        "source": "Event, Origin, Center",
        "sourceSlug": "event-origin-center"
      }
    ]
  },

  {
    "slug": "originary-scene",
    "title": "The Originary Scene",
    "definition": "The originary scene is the minimal hypothetical reconstruction of the first human event — a group of hominids, a central object of appetite, mimetic crisis, and the simultaneous conversion of the gesture of appropriation into the first sign: this. Not history but heuristic; not myth but method.",
    "relations": [
      "the-center",
      "deferral",
      "the-sacred",
      "nomos",
      "debt-and-credit",
      "ostensive-imperative-declarative",
      "resentment-victimary",
      "anthropomorphics"
    ],
    "posts": [
      {
        "slug": "origin",
        "title": "Lecture 1: Origin"
      },
      {
        "slug": "mimetic",
        "title": "Lecture 2: Mimetic"
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language (Introduction)"
      },
      {
        "slug": "how-does-the-center-speak",
        "title": "How Does the Center Speak?"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "Gans assumes that the mimetic crisis is organized around some object of appetitive attention—most likely some food source, perhaps a recent kill. Ordinarily, among the higher primate species, the object would be consumed in order, first by the Alpha animal, then by the Beta, and so on. But on this occasion, the mimetic rivalry induced by the object overrides the pecking order as all members of the group move toward the object at the center. Appetite becomes \"desire,\" that is, a social phenomenon involving one's relation to others and not merely the object itself.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "The gesture indicates a renunciation, perhaps momentary (but that is enough), of the desired object. This, what Gans calls \"the gesture of aborted appropriation,\" is the first sign. The rivalrous imitation that first propels the group toward center and potentially cataclysmic violence is converted into a pacifying imitation that de-escalates the crisis; the order provided by the animal pecking order is replaced by an order mediated by the sign, which defers violence through representation. A new species is born: the human, the only species, as Gans puts it, that poses a greater danger to its own survival than is posed to it by anything in its environment.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "The paradoxes of deferral we see on the originary scene are enduring features of the human. That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "deferral",
    "title": "Deferral",
    "definition": "Deferral is the conversion of appetite into attention — violence deferred through representation. Every sign, and so every institution, is a way of keeping that deferral going; when it fails, violence returns.",
    "relations": [
      "originary-scene",
      "the-center",
      "the-sacred",
      "ostensive-imperative-declarative",
      "scenic-design",
      "originary-grammar",
      "mimesis",
      "desire"
    ],
    "posts": [
      {
        "slug": "deferral-of-violence",
        "title": "Lecture 3: Deferral of Violence"
      },
      {
        "slug": "linguistic-turn-generative-literacy",
        "title": "The Linguistic Turn and Generative Literacy"
      },
      {
        "slug": "how-does-the-center-speak",
        "title": "How Does the Center Speak?"
      },
      {
        "slug": "talk-of-the-center-adam-katz",
        "title": "Talk of the Center"
      }
    ],
    "passages": [
      {
        "text": "\"Deferral,\" meanwhile, perfectly captures the position within the act itself, along with its fundamental contingency, between the convergence heading toward destruction and what will perhaps be no more than the mere delay of that tendency.",
        "source": "On Deferral",
        "sourceSlug": "on-deferral"
      },
      {
        "text": "Such questions emerge from an understandable misunderstanding of deferral, the more advanced forms of which allow for plenty of eating, drinking, lovemaking, fighting (where necessary) and anything else needed for a full human life. The immediate effect of deferral is not an intolerable feeling of privation, since deferral emerges in response to accumulating desire more than to need—rather, the effect is of a new world opening up.",
        "source": "The Generativity of Deferral",
        "sourceSlug": "the-generativity-of-deferral"
      },
      {
        "text": "Language is going to be generative even if we act as if it is representational — pretensions to a secure metalanguage really serve to guarantee a moral or political certainty that avoids the problem of creating in some space of language the shared attention directed towards some center.",
        "source": "The Linguistic Turn and Generative Literacy",
        "sourceSlug": "linguistic-turn-generative-literacy"
      }
    ]
  },

  {
    "slug": "ostensive-imperative-declarative",
    "title": "Ostensive / Imperative / Declarative",
    "definition": "The three primary forms of language in order of originary precedence: the ostensive points (this); the imperative commands (bring this, do not take); the declarative claims (this is the case). The error of treating the declarative as primary — the error of metaphysics — forecloses the question of origin.",
    "relations": [
      "originary-scene",
      "deferral",
      "originary-grammar",
      "scenic-design",
      "the-center",
      "technology",
      "liberalism"
    ],
    "posts": [
      {
        "slug": "the-sign-pdf",
        "title": "Lecture 5: The Sign"
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language"
      },
      {
        "slug": "linguistic-turn-generative-literacy",
        "title": "The Linguistic Turn and Generative Literacy"
      },
      {
        "slug": "originary-technics",
        "title": "Originary Technics"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "This first sign is an \"ostensive\" sign, which means it says nothing \"about\" anything, it just indicates and preserves mere presence. Think of the kinds of expressions we use to alert others to an emergency situation—\"fire!\"; \"man overboard!\"—and you get the idea. Before anything can be done or examined, our attention must first of all be fixed on this thing.",
        "source": "Originary Technics",
        "sourceSlug": "originary-technics"
      },
      {
        "text": "The imperative is a result of an \"inappropriate ostensive.\" One member of the community issues the ostensive sign in the absence of the object, and another member of the community then supplies the object. The declarative emerges in response to a problem raised by the imperative—what we might call an \"inappropriate imperative.\" There would be imperatives that couldn't be fulfilled, raising the specter of a breakdown of linguistic presence.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "Beyond the heuristic value of originary grammar, I will insist on taking it quite literally: there is no way we could ever be doing anything that is not following an imperative within a network of imperatives deriving from an ostensive world and explicated by declaratives. We are semiotic beings, composed of signs and signs ourselves, and the ostensive, imperative, interrogative and declarative are the most elementary signs. All we do is try to follow what the center is telling us to do.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "the-sacred",
    "title": "The Sacred",
    "definition": "The sacred is not the numinous or the supernatural but the minimal guarantor of meaning — the constraint that makes a sign bind all participants on the scene simultaneously. The sacred inheres in the profane use of language in the constraint of meaning; it is what makes communication possible at all.",
    "relations": [
      "the-center",
      "originary-scene",
      "nomos",
      "resentment-victimary",
      "debt-and-credit",
      "deferral",
      "anthropomorphics",
      "big-man"
    ],
    "posts": [
      {
        "slug": "esthetic-sacred-originary-modernity",
        "title": "The Esthetic, the Sacred, and Originary Modernity"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language"
      }
    ],
    "passages": [
      {
        "text": "The sacred is an indirect, unaware representation of sociality, since the human contribution to the construction of sacrality cannot be explicitly represented. Directly representing the social was also the project of secular thought, but the project turned out to be impossible on those terms because the \"human\" individual must be taken as its own origin, with the signs that mediate between humans mere expressions of what is always already internal to the human individual.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "The originary event is also the origin of resentment: the same sacred Being that preserves the community restrains desire while endowing the object with a sacrality that enhances its desirability.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "Rather than sacred and secular, I would propose we distinguish between the liturgical and the secular, as different modes of sacrality conferring upon either God or humans respectively the generative power constitutive of a given institution or practice.",
        "source": "The Esthetic, the Sacred, and Originary Modernity",
        "sourceSlug": "esthetic-sacred-originary-modernity"
      }
    ]
  },

  {
    "slug": "nomos",
    "title": "Nomos",
    "definition": "Nomos is the originary act of distribution — the apportionment of the center's dispensation among the participants in proportion to their contributions. Before rights, before law, before contracts: the nomos. Rights without corresponding obligations are incoherent because they deny the originary distribution that constitutes them.",
    "relations": [
      "the-center",
      "originary-scene",
      "the-juridical",
      "debt-and-credit",
      "succession",
      "resentment-victimary",
      "the-sacred",
      "katechon"
    ],
    "posts": [
      {
        "slug": "sovereignty-nomos-and-parrhesia",
        "title": "Sovereignty, Nomos and Parrhesia"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "Carl Schmitt took the Greek word \"nomos,\" usually translated as \"law,\" but in a broad sense including \"norms,\" to refer to an originary division of land, a partition, by its first inhabitants. Whether the land has been conquered, discovered, or shared with another people, the nomos grounds the community in a more or less equal distribution and a more or less tacit covenant. The distribution may be according to contributions to the founding, or pre-existing power relations, and the covenant might be retrojected to the origin in order to conceal a more unilateral event, but, either way, the nomos provides a point of reference for all communal events going forward: they can be judged by the degree of their conformity to the nomos.",
        "source": "Sovereignty, Nomos and Parrhesia",
        "sourceSlug": "sovereignty-nomos-and-parrhesia"
      },
      {
        "text": "In the case of conquest, distribution takes the form of what Carl Schmitt called the \"Nomos,\" an originary division of land among the participants in the conquest, no doubt proportional to their respective contributions. If we think of the center as the source of distribution and also as the effect of its distributions, we will never be able to imagine it makes sense to think of rights without corresponding obligations.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "succession",
    "title": "Succession",
    "definition": "Succession is the mode by which the center passes from occupant to occupant — the most revealing fact about any social order. Every practice depends on singularized succession in perpetuity: the selection and training of a single successor who will continue the practice in its integrity. The mode of succession is the most important question for assessing a social order.",
    "relations": [
      "the-center",
      "the-juridical",
      "scenic-design",
      "nomos",
      "debt-and-credit",
      "anthropomorphics",
      "resentment-victimary",
      "pointman-uninsurable"
    ],
    "posts": [
      {
        "slug": "successful-succession",
        "title": "Successful Succession"
      },
      {
        "slug": "originary-technics",
        "title": "Originary Technics"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "The mode of succession is the most important question for assessing a social order—how is the center transferred from one occupant to the next tells us everything important we need to know about that social order. I want to further extend that argument now so as to apply it to all practices—everywhere, succession is the sign of success. Whatever you do or say is meaningful and important insofar as you create the place for and when possible install your successor.",
        "source": "Successful Succession",
        "sourceSlug": "successful-succession"
      },
      {
        "text": "The foundation of any practice, in that case, is what I am calling \"singularized succession in perpetuity.\" Whatever is involved in considering the conditions that might prepare a wide enough range of suitable candidates, available resources, training, public recognition and acceptance, even participation in practices of succession — all that is part of the practice.",
        "source": "Originary Technics",
        "sourceSlug": "originary-technics"
      },
      {
        "text": "Only a ruler who can see to the continuing perfection of his practices of rule in perpetuity can be said to be ruling. Ruling involves ruling through technology, so it is ordered governance, which means continuity at the center, which comprises scenic design.",
        "source": "Originary Technics",
        "sourceSlug": "originary-technics"
      }
    ]
  },

  {
    "slug": "the-juridical",
    "title": "The Juridical",
    "definition": "The juridical is not mere law but the scene of binding determination — the capacity to judge what the center demands in cases of conflict, and to enforce that judgment with the center's authority. The juridical order is the maintenance of the scene against the centrifugal pull of individual interest.",
    "relations": [
      "nomos",
      "the-center",
      "succession",
      "debt-and-credit",
      "resentment-victimary",
      "pointman-uninsurable",
      "sovereignty",
      "power"
    ],
    "posts": [
      {
        "slug": "sovereignty-nomos-and-parrhesia",
        "title": "Sovereignty, Nomos and Parrhesia"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "The imperial order institutes a juridical order in order to replace this asymmetrical reciprocity with symmetry between the subjects in relation to the center, whose occupant is beyond all reciprocity.",
        "source": "Tethering and Toggling: Ritual, Juridical and Disciplinary",
        "sourceSlug": "tethering-and-toggling-ritual-juridical-and-disciplinary"
      },
      {
        "text": "The juridical is in fact an imperial construct, intervening in the reciprocity of families, clans and tribes, and that reciprocity also contains certain limits that anticipate the juridical, but in this case the reciprocity falls on the head of the family, clan or tribe, to whom something is \"owed.\" The imperial institution of justice is therefore quite hostile to the heads and chiefs and the extended kinship relations they embody.",
        "source": "On the Juridical-Disciplinary Line",
        "sourceSlug": "on-the-juridical-disciplinary-line"
      }
    ]
  },

  {
    "slug": "debt-and-credit",
    "title": "Debt and Credit",
    "definition": "Debt is the foundational economic category — the obligation incurred by each participant in the originary scene toward the center that enabled their survival and constituted them as social beings. There is no economy, only the debt to the center. Money is the concrete realization of the sign of recognition: credit drawn on the sacred.",
    "relations": [
      "the-center",
      "originary-scene",
      "nomos",
      "the-juridical",
      "succession",
      "scenic-design",
      "the-sacred",
      "big-man"
    ],
    "posts": [
      {
        "slug": "there-is-no-economy-pdf",
        "title": "There Is No Economy"
      },
      {
        "slug": "discipline-and-debt",
        "title": "Discipline and Debt"
      },
      {
        "slug": "debts-and-deferences-gablog",
        "title": "Debts and Deferences"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "Thinking through the center, and the transactions humans have with the center, reveals the \"economy\" as nothing more than an ideological representation of our more primary debt relationship with the center.",
        "source": "There Is No Economy",
        "sourceSlug": "there-is-no-economy-pdf"
      },
      {
        "text": "Money is the concrete realization of this sign of recognition; it bears a \"meaning\" but as opposed to the ordinary sign, it is a credit drawn on the sacred that cannot be freely reproduced.",
        "source": "There Is No Economy",
        "sourceSlug": "there-is-no-economy-pdf"
      },
      {
        "text": "The Big Man renders everyone dependent upon him, entirely for \"merit-based\" reasons, and this is a debt which can never be paid back. Out-gifting others therefore becomes a model for the initial power differential.",
        "source": "Discipline and Debt",
        "sourceSlug": "discipline-and-debt"
      }
    ]
  },

  {
    "slug": "scenic-design",
    "title": "Scenic Design",
    "definition": "Scenic design is the arrangement of people, media, infrastructure, and practice such that participants can orient toward a common center and receive its directives. Every practice is scenic design — the redesign of an inherited scene with available techno-media. The post-ritual order requires explicit scenic design where ritual once did the work automatically.",
    "relations": [
      "deferral",
      "succession",
      "ostensive-imperative-declarative",
      "the-center",
      "anthropomorphics",
      "debt-and-credit",
      "pointman-uninsurable",
      "originary-grammar"
    ],
    "posts": [
      {
        "slug": "scenic-design-practices",
        "title": "Scenic Design Practices"
      },
      {
        "slug": "mimesis-center-auto-immunology",
        "title": "Mimesis, the Center and Auto-Immunology"
      },
      {
        "slug": "originary-technics",
        "title": "Originary Technics"
      }
    ],
    "passages": [
      {
        "text": "I can't recall any discussions in GA that take the notion of the \"scenic\" literally enough to consider that scenes need to be constructed, and constructed in such a way as to shape actions so as to keep all members of the group in conformity with the constraints and affordances of the scene itself.",
        "source": "Mimesis, the Center and Auto-Immunology",
        "sourceSlug": "mimesis-center-auto-immunology"
      },
      {
        "text": "Every practice is designing a scene; or, really, redesigning a scene, or some portion of a scene, with the techno-media available.",
        "source": "Scenic Design Practices",
        "sourceSlug": "scenic-design-practices"
      },
      {
        "text": "\"technics\" is the scenic design component of the constitution of the human; the human is scenic from the start, definitively, constitutively, but scenes, once in existence, need to be maintained and constructed; the first deliberately constructed scenes were ritual scenes, composed so as to situate the community in a relation to the sacrificial center so as to facilitate and maximize the exchange entered into with that center.",
        "source": "Originary Grammar as Model for Scenic Design Intelligence",
        "sourceSlug": "originary-grammar-as-model-for-scenic-design-intelligence"
      }
    ]
  },

  {
    "slug": "anthropomorphics",
    "title": "Anthropomorphics",
    "definition": "Anthropomorphics is the originary grammar of the center: Katz's name for the human science that studies how persons are constituted through their participation in scenes centered on a sacred object. The name marks the artificiality of the human — we anthropomorphized ourselves, on the model of the center, before we could carry out that operation on anything else.",
    "relations": [
      "originary-scene",
      "the-center",
      "the-sacred",
      "scenic-design",
      "succession",
      "originary-grammar",
      "resentment-victimary",
      "disciplinarity"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "generative-anthropology-one-big-discipline",
        "title": "Generative Anthropology as One Big Discipline"
      },
      {
        "slug": "the-marginal-anthropomorph",
        "title": "The Marginal Anthropomorph"
      }
    ],
    "passages": [
      {
        "text": "The human is modeled on the non-human center—this is why I call the human science I am presenting here an \"anthropomorphics.\" Humans anthropomorphized themselves before they could carry out this operation on anything else.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "\"anthropomorphics\" was also meant to foreground the artificiality of the human, from the beginning—we were always already imitating the center that was itself nothing more than a vectorization of our converging desires turned back at us through a prohibition. This was a way of distancing myself from GA's or any humanism and insisting on the historicity of the human.",
        "source": "Anthropomorphics (Substack)",
        "sourceSlug": "anthropomorphics-substack"
      },
      {
        "text": "There can't really be a more fundamental human relation than pedagogy, and firstness on the originary scene and thereafter is really a pedagogical relation; even more, a linguistic pedagogy relation. Pedagogy is fractally hierarchical.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "resentment-victimary",
    "title": "Resentment and Victimary Thinking",
    "definition": "Resentment is not a psychological failing but the structural consequence of centeredness: every periphery harbors the desire of the center it cannot reach. Victimary thinking universalizes this resentment into the governing political grammar of modernity, framing every inequality as an instance of oppression requiring a persecutor and an innocent victim.",
    "relations": [
      "the-center",
      "originary-scene",
      "the-sacred",
      "nomos",
      "succession",
      "anthropomorphics",
      "the-juridical",
      "pointman-uninsurable"
    ],
    "posts": [
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language (Introduction)"
      },
      {
        "slug": "the-anthropoetics-of-power",
        "title": "The Anthropoetics of Power"
      },
      {
        "slug": "nemesis-jouvenelian-liberal-model",
        "title": "Nemesis: The Jouvenelian vs. the Liberal Model"
      }
    ],
    "passages": [
      {
        "text": "Resentment is our scandalized reaction to the existence of situations where this symmetrical configuration is not maintained. Unequal treatment of anyone constitutes a disequilibrium that is scandalous because it seems to threaten the community with return to originary chaos. I am not merely upset at my own ill-treatment; I am in terror of the potential disintegration of the entire social order.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "Our resentful reaction to inequality reveals our belief in the moral model—an ostensive belief like the foxhole belief in God. Resentment points to the act of injustice, makes it known. God remains the implicit audience of our resentment as he was of our plea for help, but now we expect the rest of the human community to share our reaction.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "But victimary thinking enacts this resistance and refusal as a resentment of firstness: Nazism's extremities are just the extension of the striving for pre-eminence among nations, among firms in the economy, among ideological and religious claims, and so on.",
        "source": "Deconstructing the Victimary",
        "sourceSlug": "deconstructing-the-victimary"
      }
    ]
  },

  {
    "slug": "pointman-uninsurable",
    "title": "The Pointman / The Uninsurable",
    "definition": "The pointman occupies the leading edge of deferral — the exposed position where risk cannot be hedged, where conventional calculations fail, where direct orientation toward the center is required. The uninsurable is that which falls outside the actuarial calculus of managed risk, demanding scenes that no institutional routine can provide.",
    "relations": [
      "the-center",
      "succession",
      "the-juridical",
      "resentment-victimary",
      "scenic-design"
    ],
    "posts": [
      {
        "slug": "the-marginal-anthropomorph",
        "title": "The Marginal Anthropomorph"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      }
    ],
    "passages": [
      {
        "text": "So, I can now replace the clumsy \"occupant of the center\" with \"pointman,\" as a more resonant and less technical-sounding synonym. Nor is seeking out the pointman a merely passive stance—it's not waiting for Godot, because there are a lot of candidates out there and you're looking for them, testing them when they emerge, drawing conclusions from events they create, contributing to the conditions of their platforming.",
        "source": "The Pointman",
        "sourceSlug": "the-pointman"
      },
      {
        "text": "Like the Axial Age sacrificial figure, the pointman must draw all attention to himself, and must compel everyone to choose whether to join or deny him. Everyone will be marked by the degree to which they keep \"faith\" with him. We are speaking of the latest iteration of the Big Man, which also means that what is now commemorated is the pointman's reception, seizure and eventual transfer of power.",
        "source": "The Pointman",
        "sourceSlug": "the-pointman"
      },
      {
        "text": "Most disciplined individuals (in economic terms: those with the longest time preference), who will therefore seek each other out, recognize one another, and model modes of deferral for the less disciplined.",
        "source": "The Marginal Anthropomorph",
        "sourceSlug": "the-marginal-anthropomorph"
      }
    ]
  },

  {
    "slug": "originary-grammar",
    "title": "Originary Grammar",
    "definition": "Originary grammar is the grammar implicit in the originary scene — not the grammar of any particular language but the minimal rules governing how signs work, how scenes are constituted, how attention is directed. It is infralinguistic: it operates below the level of the metalinguistic pretensions of literacy and philosophy.",
    "relations": [
      "ostensive-imperative-declarative",
      "deferral",
      "scenic-design",
      "anthropomorphics",
      "the-center",
      "the-sign",
      "attentionality",
      "idiom"
    ],
    "posts": [
      {
        "slug": "linguistic-turn-generative-literacy",
        "title": "The Linguistic Turn and Generative Literacy"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "attentionality-originary-ethics",
        "title": "Attentionality and Originary Ethics"
      }
    ],
    "passages": [
      {
        "text": "The burden of this book is to follow those trails and work out a social, political and cultural theory, or, as I will call it, an \"anthropomorphics,\" as an originary grammar of the center. So, I will show that speaking in terms of the imperatives we are conveying, or hearing, from the center, when discussing declarative sentences and discourse, will yield insights unavailable when following more conventional imperatives to speak about sentences and discourses in terms of meanings packaged by one mind for others according to specific explicit and tacit rules.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "What we could say is that ritual is primarily ostensive, with imperative derived from the center and declaratives serving to determine which imperative to obey in particular cases; while the juridical ends up with an imperative, something someone is commanded to do or refrain from doing, and gathers ostensives and declaratives together to that end.",
        "source": "Back to Grammar",
        "sourceSlug": "back-to-grammar"
      },
      {
        "text": "A way of thinking involves a new vocabulary and grammar; it puts words to new use, generates new questions and imperatives. Any new way of thinking would do this; all the more so must one founded upon an account of the origin of language; all the more so an account of the origin of language that sees language as constitutive of the human.",
        "source": "Idioms of Inquiry",
        "sourceSlug": "idioms-of-inquiry"
      }
    ]
  },

  {
    "slug": "big-man",
    "title": "The Big Man",
    "definition": "The Big Man is the first person to usurp the sacred center — to occupy it not as a sacrificial victim but as a living individual who commands deference. The Big Man Revolution is the transition from egalitarian ritual order to hierarchical social order, generating asymmetric obligation, the beginning of debt, and the emergence of individuality.",
    "relations": [
      "the-center",
      "originary-scene",
      "succession",
      "debt-and-credit",
      "the-sacred",
      "resentment-victimary",
      "sparagmos",
      "omnicentrism"
    ],
    "posts": [
      {
        "slug": "the-anthropoetics-of-power",
        "title": "The Anthropoetics of Power"
      },
      {
        "slug": "discipline-and-debt",
        "title": "Discipline and Debt"
      },
      {
        "slug": "there-is-no-economy-pdf",
        "title": "There Is No Economy"
      }
    ],
    "passages": [
      {
        "text": "The Big Man, through enterprise, discipline, and what Gans calls \"producer's desire\" accumulates goods and prestige that place him above the egalitarian community. The Big Man marks the beginning of wealth accumulation, individual liberty, and social hierarchy. Even more, the Big Man usurps the ritual center of the community, taking on a sacred status, ultimately becoming a kind of God King.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "The resentment that is generated and resolved by the sacred center is now directed towards the Big Man: on the one hand, every one, and especially rivals, envy him his place; on the other hand, and even more importantly, all members of the community insist that he enforce a \"just\" distribution of goods, with \"just\" being based on the model of the originary scene.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "Civilization is the generalization of the experience of the Big Man, in which authority is generated by self-denial, generosity and concern for and action on the community as a whole—not necessarily its complete generalization (any civilization will contain the less and uncivilized), but the steady inclusion of more social spaces.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      }
    ]
  },

  {
    "slug": "mimesis",
    "title": "Mimesis",
    "definition": "Mimesis is the fundamental human tendency to desire what others desire — to imitate not just actions but orientations, and above all the orientation of desire itself. In Center Study, mimesis is not a defect or pathology but the structural condition that makes both crisis and language possible: it is what generates the originary scene by producing the convergence of reaching gestures, and it is what the sign defers.",
    "relations": [
      "originary-scene",
      "deferral",
      "the-sacred",
      "resentment-victimary",
      "sparagmos",
      "desire",
      "the-sign",
      "media"
    ],
    "posts": [
      {
        "slug": "mimetic",
        "title": "Lecture 2: Mimetic"
      },
      {
        "slug": "mimesis-center-auto-immunology",
        "title": "Mimesis, the Center and Auto-Immunology"
      },
      {
        "slug": "exhaustive-imitation",
        "title": "Exhaustive Imitation"
      },
      {
        "slug": "the-anthropoetics-of-power",
        "title": "The Anthropoetics of Power"
      }
    ],
    "passages": [
      {
        "text": "That which we desire and that therefore thrusts itself upon our attention, is given excess desirability through our mimetic relations with our fellows—desiring something is inseparable from imagining others desiring it. For this very reason we are forbidden our object of desire, as we intuit the violence implicit in our approach to it.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "mimesis is first of itself negentropic insofar as the capacity of members of a group to learn from each other enhances each member of the group's ability to resist entropic tendencies; but mimesis itself turns entropic once it interferes with other group stabilizing mechanisms (the pecking order) and, more precisely, subtracts rather than adding information regarding the action sequence.",
        "source": "Mimesis, the Center and Auto-Immunology",
        "sourceSlug": "mimesis-center-auto-immunology"
      }
    ]
  },

  {
    "slug": "sparagmos",
    "title": "Sparagmos",
    "definition": "The sparagmos is the ritual tearing apart and collective consumption of the central object following its sacrifice — the first distribution, in which the sacred object is divided equally among all members of the group. It is the origin of equality-in-distribution, of the communal feast, and of the model that all subsequent economic distributions must answer to.",
    "relations": [
      "originary-scene",
      "the-sacred",
      "big-man",
      "debt-and-credit",
      "resentment-victimary",
      "mimesis",
      "ritual",
      "scapegoating"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "the-anthropoetics-of-power",
        "title": "The Anthropoetics of Power"
      }
    ],
    "passages": [
      {
        "text": "In the sparagmos, the tension generated by the prior restraint is loosened, and so this danger does present itself as the community attacks the meal in this unprecedented manner. Resentment at the object itself, for imposing restraint and refusing itself, intensifies the devouring of the body. The only thing preventing each member from overreaching his bounds and turning on his fellows is the sign itself, which we can imagine working within the sparagmos as a kind of reminder of the collective limits making this peaceful consumption possible.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "Following the sparagmos, as the community faces each other over the remains of their victim/meal/deity, the sign would be issued once again, this time pointing to the remainders and mementos of the sacred being, marking the first ritual.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "desire",
    "title": "Desire",
    "definition": "Desire in Center Study is not appetite but the transformation of appetite through social prohibition. To desire something is not merely to want it — it is to want it in the context of a scene where wanting it generates recognition, obligation, and the possibility of deferral. Desire is always already scenic: it requires a center, a prohibition, and a periphery that orients toward what it cannot immediately take.",
    "relations": [
      "originary-scene",
      "mimesis",
      "resentment-victimary",
      "the-sacred",
      "deferral",
      "narrative"
    ],
    "posts": [
      {
        "slug": "esthetic-sacred-originary-modernity",
        "title": "The Esthetic, the Sacred, and Originary Modernity"
      },
      {
        "slug": "the-anthropoetics-of-power",
        "title": "The Anthropoetics of Power"
      },
      {
        "slug": "resentment",
        "title": "Resentment"
      }
    ],
    "passages": [
      {
        "text": "Appetite becomes \"desire,\" that is, a social phenomenon involving one's relation to others and not merely the object itself. Desire intensifies the mimetic crisis.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "desire cannot coincide with meaning: the purer the desire, the more any interference with that desire must be destroyed, intellectually and physically, if possible. Desire cannot tolerate an independent reality within which the object might embed itself and thereby resist possession. And by possession, I mean absolute, unquestioned, permanent possession—which is what desire aims at.",
        "source": "The Grammar of Desire and Resentment",
        "sourceSlug": "the-grammar-of-desire-and-resentment"
      },
      {
        "text": "To put it in grammatical terms, desire involves the object issuing imperatives to the subject—come and get me; be who you can be once you have me; protect me from all others, etc.—but insofar as the object then resists possession, or breaks the promises implicit in its beckoning, the subject is reduced to issuing imperatives to the object.",
        "source": "The Grammar of Desire and Resentment",
        "sourceSlug": "the-grammar-of-desire-and-resentment"
      }
    ]
  },

  {
    "slug": "omnicentrism",
    "title": "Omnicentrism",
    "definition": "Omnicentrism is the post-sacrificial moral condition in which every individual is recognized as a potential center — as someone who cannot be sacrificed, who has the inalienable right to their own scenic position. It is not the abolition of the center but the distribution of its sacred immunity to every member of the community. The imperative of omnicentrism is not equality of outcome but equality of standing before the center.",
    "relations": [
      "the-center",
      "the-sacred",
      "resentment-victimary",
      "succession",
      "big-man"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "esthetic-sacred-originary-modernity",
        "title": "The Esthetic, the Sacred, and Originary Modernity"
      },
      {
        "slug": "centering",
        "title": "Centering"
      }
    ],
    "passages": [
      {
        "text": "This is what creates the possibility for each and every one of us to become a center — that is, as one who is not to be sacrificed or violently centralized. We owe the God who has revealed this to us everything, which is to say all that makes up our own centrality.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      },
      {
        "text": "A completely marketized order is, as Eric Gans has pointed out, an \"omnicentric\" one. In that case, one's response to the emergence of new resentments or conflicts is to seek or create new centers. But any new center must draw upon the resources and authority of some existing center. At the very least, it must employ the linguistic reserves of existing centers.",
        "source": "The Linguistic Turn and Generative Literacy",
        "sourceSlug": "linguistic-turn-generative-literacy"
      }
    ]
  },

  {
    "slug": "the-sign",
    "title": "The Sign",
    "definition": "The sign in Center Study is not the Saussurean signifier-signified pair or the Peircean triadic relation — it is the aborted gesture of appropriation that constitutes the first representation on the originary scene. The sign is the conversion of reaching into pointing, of appetite into attention, of mimetic convergence into shared reference. It is what makes humans human.",
    "relations": [
      "originary-scene",
      "deferral",
      "the-sacred",
      "mimesis",
      "originary-grammar",
      "attentionality",
      "idiom",
      "idiomclining"
    ],
    "posts": [
      {
        "slug": "the-sign-pdf",
        "title": "Lecture 5: The Sign"
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language"
      },
      {
        "slug": "linguistic-turn-generative-literacy",
        "title": "The Linguistic Turn and Generative Literacy"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "inscription",
        "title": "Inscription"
      }
    ],
    "passages": [
      {
        "text": "A sign has meaning insofar as it can be repeated, which is to say, repeated as the same sign. We can go further and say that the meaning of a sign is precisely the various ways and occasions upon which it can be repeated. One's understanding of a sign is demonstrated by the ways one is able to repeat it and have it accepted as that sign. But since a sign refers to a shared center, others, whose cooperation, or even attention, cannot be ensured, meaning can never be guaranteed in advance.",
        "source": "Signing Up",
        "sourceSlug": "signing-up"
      },
      {
        "text": "Whether we speak in terms of a Peircean \"symbol,\" or the distinction between signifier and signified, the sign is different from any form of non-human communication insofar as the operation of any sign is both conventional and historical while being outside of conventionality and history. Words only mean what they mean insofar as a community of language users \"agrees\" that that is what they mean.",
        "source": "Anthropomorphics",
        "sourceSlug": "anthropomorphics-book"
      }
    ]
  },

  {
    "slug": "attentionality",
    "title": "Attentionality",
    "definition": "Attentionality is the capacity to share and mutually track attention — to know that another is attending to what you are attending to, and to know that they know this. Third-order attentionality is the specific capacity that makes language possible: the knowledge that the other knows that you know that both of you are attending to the same center. It is also the ground of ethics: responsibility begins with shared attention.",
    "relations": [
      "originary-scene",
      "the-sign",
      "originary-grammar",
      "scenic-design",
      "deferral",
      "idiom",
      "idiomclining",
      "media"
    ],
    "posts": [
      {
        "slug": "attentionality-originary-ethics",
        "title": "Attentionality and Originary Ethics"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "the-scene-on-which-you-find-yourself",
        "title": "The Scene On Which You Find Yourself"
      }
    ],
    "passages": [
      {
        "text": "Considered at its most minimal, language is grounded, as Michael Tomasello along with Eric Gans has shown, in joint attention—the capacity to pay attention to the same thing at the same time, to know that we are doing it, and to know that we know (to let each other know). It should be possible, then, to analyze all human, which is to say social, phenomena, in terms of forms of attention, articulated in ever more complex ways.",
        "source": "The Attentional Structure of Sovereignty",
        "sourceSlug": "the-attentional-structure-of-sovereignty"
      },
      {
        "text": "formal representation is itself ethical, is indeed the origin and resource of any ethics, so that ethics cannot be thought outside of it. At the same time, formal representation cannot be thought outside of ethics, since the \"formality\" of the representation lies in the shared attention it effects, and in this shared attention lies any ethics. In shared, or joint attention, is the fundamental equality-on-the-scene that constitutes the human.",
        "source": "Attentionality and Originary Ethics",
        "sourceSlug": "attentionality-originary-ethics"
      }
    ]
  },

  {
    "slug": "ritual",
    "title": "Ritual",
    "definition": "Ritual is the repetition and institutionalization of the originary scene — the formal re-enactment of the founding deferral of violence, centered on the sacrifice of the central object, that constitutes community and generates the sacred. The ritual order is the first human institution. Every subsequent institution is either a transformation of ritual or a response to ritual's absence.",
    "relations": [
      "originary-scene",
      "the-sacred",
      "big-man",
      "sparagmos",
      "scenic-design",
      "debt-and-credit",
      "technology",
      "market"
    ],
    "posts": [
      {
        "slug": "media-as-ritual",
        "title": "Media as Ritual"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics"
      },
      {
        "slug": "esthetic-sacred-originary-modernity",
        "title": "The Esthetic, the Sacred, and Originary Modernity"
      },
      {
        "slug": "originary-grammar-and-post-sacrificial-semiotic-agency",
        "title": "Originary Grammar and Post-Sacrificial Semiotic Agency"
      }
    ],
    "passages": [
      {
        "text": "What we speak of as ritual is distribution from the center returning to the center including the process of distributing people so as to manage the distribution and return.",
        "source": "Tethering and Toggling: Ritual, Juridical and Disciplinary",
        "sourceSlug": "tethering-and-toggling-ritual-juridical-and-disciplinary"
      },
      {
        "text": "The form of ritual is dictated by the center, which is to say the intentions of the center are embedded in a community's rituals. But they are not made explicit by rituals which, by definition, embody tacit knowledge. Understanding what the center wants involves, then, a reading of rituals or, more precisely, the attribution of intentions to the figures populating the ritual.",
        "source": "The Anthropoetics of Power",
        "sourceSlug": "the-anthropoetics-of-power"
      },
      {
        "text": "The first ritual following the originary scene itself would have aimed at eliminating the unevenness necessary to that scene (the staggered procession in which the sign would have been issued) by having everyone enact the originary event in sync.",
        "source": "There Is No Economy",
        "sourceSlug": "there-is-no-economy-pdf"
      }
    ]
  },

  {
    "slug": "idiom",
    "title": "Idiom",
    "definition": "An idiom in Center Study is not a linguistic figure of speech but the distinctive way a practice, community, or intelligence engages its center — its characteristic scenic signature, the set of moves it makes that cannot be fully translated into another idiom without loss. Bouvard develops idiom as a central analytical concept for understanding how practices maintain their integrity, how intelligence operates, and how data can be treated.",
    "relations": [
      "scenic-design",
      "the-sign",
      "originary-grammar",
      "attentionality",
      "debt-and-credit",
      "idiomclining"
    ],
    "posts": [
      {
        "slug": "idiom-and-the-differend",
        "title": "Idiom and the Differend"
      },
      {
        "slug": "idiomatic-intelligence-and-the-black-box",
        "title": "Idiomatic Intelligence and the Black Box"
      },
      {
        "slug": "the-transfer-idiom",
        "title": "The Transfer Idiom"
      },
      {
        "slug": "imperatives-for-idiom-creation",
        "title": "Imperatives for Idiom Creation"
      }
    ],
    "passages": [
      {
        "text": "An idiom is this articulation of group membership, the sharing of a sacred center, and its anthropological \"surplus,\" or awareness that the signs designating that center might be otherwise and in fact are otherwise, having their equivalents in every other group. The preservation of an idiom, moreover, depends upon sharpening the differences between equivalents rather than ironing them out.",
        "source": "The Right of the Idiom Yet Again",
        "sourceSlug": "the-right-of-the-idiom-yet-again"
      },
      {
        "text": "\"Idiomatic intelligence\" has us keep in mind the resistance to translation the ongoing naming constitutive of any event-scene undergoes and the corresponding need for translation practices. \"Idiomatic intelligence\" incorporates the ritual, or the most originary modes of commemoration, in a way that \"formalization,\" drawing almost exclusively upon the juridical, doesn't.",
        "source": "Generating Idiomatic Intelligences and Translation Practices",
        "sourceSlug": "generating-idiomatic-intelligences-and-translation-practices"
      }
    ]
  },

  {
    "slug": "katechon",
    "title": "Katechon",
    "definition": "The Katechon is the Christian political-theological concept of \"the restrainer of the AntiChrist,\" which Bouvard takes up as \"a very near synonym to 'deferral'\" — a way of translating the theological framing of apocalypse (via Schmitt and Thiel) into the anthropological idiom of center study, where holding off the end is the work of deferral itself.",
    "relations": [
      "deferral",
      "the-sacred",
      "nomos"
    ],
    "posts": [
      {
        "slug": "tokenizing-deferrality",
        "title": "Tokenizing Deferrality"
      },
      {
        "slug": "deferral-debt-and-the-idiom",
        "title": "Deferral, Debt and the Idiom"
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
    ]
  },

  {
    "slug": "idiomclining",
    "title": "Idiomclining",
    "definition": "Bouvard's coinage for a mode of \"semiotic research\" — the deliberate, mistaken re-setting-into-motion of fixed pieces of language within an idiom — offered in place of bureaucratized, Goodhart-vulnerable categories like \"critical thinking.\" To idiomcline is to make one's idiom at once more idiomatic and more transferable, treating stopping-and-thinking-before-doing as itself a kind of doing that opens an idiom to adjusted response and new exchange.",
    "relations": [
      "idiom",
      "the-sign",
      "originary-grammar",
      "attentionality"
    ],
    "posts": [
      {
        "slug": "idiomclining",
        "title": "Idiomclining"
      },
      {
        "slug": "media-technology-and-originary-grammar",
        "title": "Media, Technology and Originary Grammar"
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
    ]
  },

  {
    "slug": "scapegoating",
    "title": "Scapegoating",
    "definition": "Scapegoating is the convergence of communal violence and resentment upon a central figure marked as the cause of the community's ills—understood in Center Study not as the persecution of the marginal but as always directed against the center, carrying the implicit claim that the center has been secretly usurped. As the originary model of selection and of attention in general, it does violence to one who is no guiltier than the rest, and the resistance to it is the defense of the center through deferral and the open distribution of power.",
    "relations": [
      "resentment-victimary",
      "the-center",
      "sparagmos",
      "the-sacred",
      "sovereignty",
      "firstness"
    ],
    "posts": [
      {
        "slug": "the-egalitarian-vs-hierarchical-model-of-morality",
        "title": "Bouvard on Scapegoating and Egalitarian Morality"
      },
      {
        "slug": "clr-251",
        "title": "Scapegoating after September 11"
      },
      {
        "slug": "selving",
        "title": "Selving"
      },
      {
        "slug": "the-global-civil-war-of-position",
        "title": "The Global Civil War of Position"
      },
      {
        "slug": "transposing-the-scene",
        "title": "Transposing the Scene"
      },
      {
        "slug": "thirdness-and-the-same-sentence",
        "title": "Thirdness and the Same Sentence"
      },
      {
        "slug": "clr-332",
        "title": "GA and Mimetic Theory II: The Scapegoat"
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
    ]
  },

  {
    "slug": "sovereignty",
    "title": "Sovereignty",
    "definition": "In the originary/center framework, sovereignty is a mode of centrality: the assertion by an occupant of the center of the right to be the judge of last resort in all disputes among lower centers of power, extending to a human ruler the sacred difference of the center. It is never simply held but always exercised and passed on — drawing emulation and resentment toward itself, and always oriented toward securing its own succession.",
    "relations": [
      "nomos",
      "succession",
      "the-center",
      "big-man",
      "the-juridical",
      "scapegoating",
      "power",
      "money"
    ],
    "posts": [
      {
        "slug": "centrality-power-sovereignty",
        "title": "Centrality, Power, Sovereignty"
      },
      {
        "slug": "clr-215",
        "title": "Back to the Origin of Language"
      },
      {
        "slug": "securing-sovereignty",
        "title": "Securing Sovereignty"
      },
      {
        "slug": "the-temporality-of-sovereignty",
        "title": "The Temporality of Sovereignty"
      },
      {
        "slug": "what-is-to-be-undone-1",
        "title": "What is to be Undone?, 1"
      },
      {
        "slug": "power-and-paradox-pdf",
        "title": "Power and Paradox (Adam Katz)"
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
    ]
  },

  {
    "slug": "power",
    "title": "Power",
    "definition": "In Generative Anthropology, power is not a substance one holds but a position one occupies: it derives from the center, and the center from the collective deferral of violence. To wield power is to have one's interpretation of the center's demand obeyed — and so power is always relational, paradoxical, and grounded in differential capacities for deferral rather than in force as such.",
    "relations": [
      "the-center",
      "deferral",
      "sovereignty",
      "resentment-victimary",
      "the-juridical",
      "the-sacred",
      "capital",
      "liberalism"
    ],
    "posts": [
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center"
      },
      {
        "slug": "power-and-paradox-pdf",
        "title": "Power and Paradox (Adam Katz)"
      },
      {
        "slug": "power-and-paradox-gablog",
        "title": "Power and Paradox"
      },
      {
        "slug": "power",
        "title": "Power"
      },
      {
        "slug": "a-new-model-of-power",
        "title": "A New Model of Power"
      },
      {
        "slug": "market-capillarism-gablog",
        "title": "Market Capillarism"
      },
      {
        "slug": "clr-434",
        "title": "Christian and Jew at the Origin"
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
    ]
  },

  {
    "slug": "money",
    "title": "Money",
    "definition": "In Generative Anthropology, money is not a neutral medium of exchange but a sign whose referent is the center: a \"credit drawn on the sacred\" that realizes our originary debt to the center in transferable form. It is the power to command the labor of others, distributed from and paid back to central authority — a deferral commodity and tributary instrument that both extends the scene and, once unmoored from a sacralized center, corrodes it.",
    "relations": [
      "the-center",
      "debt-and-credit",
      "deferral",
      "the-sacred",
      "sovereignty",
      "the-sign",
      "capital",
      "market"
    ],
    "posts": [
      {
        "slug": "there-is-no-economy-pdf",
        "title": "There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center"
      },
      {
        "slug": "war-art-bureaucracy-and-other-miscellanies",
        "title": "War, Art, Bureaucracy and other Miscellanies"
      },
      {
        "slug": "reflections-on-political-economy-from-firstness-to-thirdness",
        "title": "Reflections on Political Economy from Firstness to Thirdness"
      },
      {
        "slug": "the-rights-of-the-anyown-1-a-politics-of-redemption",
        "title": "The Rights of the Anyown 1: A Politics of Redemption"
      },
      {
        "slug": "money-and-capital-as-media-and-power",
        "title": "Money and Capital as Media and Power"
      },
      {
        "slug": "learncoin",
        "title": "Learncoin"
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
    ]
  },

  {
    "slug": "media",
    "title": "Media",
    "definition": "In Generative Anthropology, media is not first a set of technologies but the network of mutual attention that constitutes the scene itself — the invisible lines linking each participant's sensorium to the others and to the shared center. Every later medium, from speech and writing to film and the algorithmic feed, is a more separated and technologized form of this originary mediation, in which violence is deferred and desire is routed through representation rather than discharged directly between persons.",
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
        "title": "Mediated Centrality"
      },
      {
        "slug": "anthropomorphics-book",
        "title": "Anthropomorphics: An Originary Grammar of the Center"
      },
      {
        "slug": "the-name-of-god-technomedia-and-the-model-of-the-work-of-art",
        "title": "The Name of God, Technomedia, and the Model of the Work of Art"
      },
      {
        "slug": "anthropomorphics-the-center-speaking",
        "title": "The Center, Speaking"
      },
      {
        "slug": "clr-286",
        "title": "The Market and Resentment (I)"
      },
      {
        "slug": "prolegomena-to-the-study-of-the-origins-of-the-disciplines-gablog",
        "title": "Prolegomena to the Study of the Origins of the Disciplines"
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
    ]
  },

  {
    "slug": "technology",
    "title": "Technology",
    "definition": "In GA, technology is not neutral tooling but post-ritual governance: the perfection of the imperative into an interlocking command structure that, in the wake of the desacralization of power, takes over ritual's work of managing our relation to the center and distributing from it. It is at once the dominant form of power and a mode of scenic design — the organization of the inorganic and of human collectives so as to issue, relay, and complete imperatives that originate in the center.",
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
        "title": "Anthropomorphics: An Originary Grammar of the Center"
      },
      {
        "slug": "originary-technics",
        "title": "Originary Technics (Adam Katz)"
      },
      {
        "slug": "intelligence-and-technics",
        "title": "Intelligence and Technics"
      },
      {
        "slug": "the-grammar-of-technology-substack",
        "title": "The Grammar of Technology"
      },
      {
        "slug": "the-transfer-idiom",
        "title": "The Transfer Idiom"
      },
      {
        "slug": "on-the-existence-of-world-scenes",
        "title": "On the Existence of World Scenes"
      },
      {
        "slug": "the-transdisciplinarity-of-the-hypothesis",
        "title": "The Transdisciplinarity of the Hypothesis"
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
    ]
  },

  {
    "slug": "event",
    "title": "Event",
    "definition": "In generative anthropology, \"the event\" is the category and methodological wager that the human originates not as a gradual process but as a singular, datable happening — a cut in time in which representation, and therefore meaning, emerges. To think the human as an event rather than a process is to hold that culture, esthetics, science, and history are all traces of eventful occurrences that can only be modeled scenically, from an origin, rather than derived from a continuous natural gradient.",
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
        "title": "Heuristic Necessity"
      },
      {
        "slug": "clr-205",
        "title": "Originary and Evolutionary Esthetics"
      },
      {
        "slug": "the-origin-of-language",
        "title": "The Origin of Language"
      },
      {
        "slug": "clr-402",
        "title": "The Originary Hypothesis (Stanford version)"
      },
      {
        "slug": "disciplinarity-and-the-center",
        "title": "Disciplinarity and the Center"
      },
      {
        "slug": "clr-369",
        "title": "The Esthetic Moment"
      },
      {
        "slug": "ergodism",
        "title": "Ergodism"
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
    ]
  },

  {
    "slug": "charisma",
    "title": "Charisma",
    "definition": "Charisma, in the Rieffian sense the GA writers adopt, is the centrality that accrues to a person whose display of deferral and self-discipline exceeds what the onlooker can manage — divine grace perceived in one who has transcended compulsive desire. It is generated through renunciation rather than seized, drawing the beholder to take the disciplined figure as a model for engaging his own inner scene; its modern reversal, \"transgressive charisma,\" relocates the same magnetism in the flouting of norms rather than obedience to a higher imperative.",
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
        "title": "A Kind of Apocalyptic Politics"
      },
      {
        "slug": "power",
        "title": "Power"
      },
      {
        "slug": "the-two-charismas",
        "title": "The Two Charismas"
      },
      {
        "slug": "viral-authoritarianism",
        "title": "Bouvard on Reformist Absolutism and Democratic Fragility"
      },
      {
        "slug": "civilization-and-its-end-s",
        "title": "Civilization and Its End(s)"
      },
      {
        "slug": "clr-819",
        "title": "Celebrity and Resentment"
      },
      {
        "slug": "clr-161",
        "title": "Thinking Religion"
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
    ]
  },

  {
    "slug": "narrative",
    "title": "Narrative",
    "definition": "In generative anthropology, narrative is not a construction of grammar but a retemporalization of the originary sign: the return of the sign's own deferred, self-contained temporality to the world as a model of the time of action. Structured into beginnings, middles, and ends around characters and conflict, narrative reproduces the scene of deferral, sustaining desire and resentment across the extended time that separates one sacred scene from the next.",
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
        "title": "Originary Narrative"
      },
      {
        "slug": "clr-346",
        "title": "New Thoughts on Originary Narrative"
      },
      {
        "slug": "narrative",
        "title": "Narrative"
      },
      {
        "slug": "clr-294",
        "title": "What is a Biography?"
      },
      {
        "slug": "ap1902-1902ludwigs",
        "title": "What propels narratives forward? Narrative as Janus"
      },
      {
        "slug": "hypothesis-practice-vs-narrative-the-iterative-center-gablog",
        "title": "Hypothesis/Practice Vs. Narrative: The Iterative Center"
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
    ]
  },

  {
    "slug": "capital",
    "title": "Capital",
    "definition": "In Generative Anthropology, capital is not wealth or a factor of production but a specific mode of power: the power to abstract individuals, groups, and above all disciplines from the traditions that embed them and reinsert them into new hierarchies oriented toward the center. It operates through market valuation — everything is priced as an asset by discounting its expected future earnings — so that capital is power exercised as abstraction and valuation rather than as direct command.",
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
        "title": "Anthropomorphics: An Originary Grammar of the Center"
      },
      {
        "slug": "money-and-capital-as-media-and-power",
        "title": "Money and Capital as Media and Power"
      },
      {
        "slug": "market-capillarism-gablog",
        "title": "Market Capillarism"
      },
      {
        "slug": "power-and-capital",
        "title": "Power and Capital"
      },
      {
        "slug": "successful-succession",
        "title": "Successful Succession"
      },
      {
        "slug": "converting-assets-to-data-tributarianism",
        "title": "Converting Assets to Data: Tributarianism"
      },
      {
        "slug": "scenic-design-practices-the-transfer-translation-of-events-into-scenes",
        "title": "Scenic Design Practices: The Transfer Translation of Events into Scenes"
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
    ]
  },

  {
    "slug": "firstness",
    "title": "Firstness",
    "definition": "Firstness is the ineradicable priority of the individual who first emits the sign — the freedom by which one member's innovation can be seamlessly adopted by the whole community, and which no vision of human equality can abolish. Introduced into GA by Adam Katz, it names the asymmetry latent in the otherwise symmetrical originary scene: someone signs first, and though that priority normally dissolves into the reciprocal exchange of meaning, it remains a permanent source both of cultural creation and of the resentment that dogs anyone perceived as first.",
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
        "title": "Toward a Globalist-Victimary Unified Field Theory: Part V – A Morality of Firstness"
      },
      {
        "slug": "clr-639",
        "title": "Avatars of Firstness"
      },
      {
        "slug": "clr-484",
        "title": "The Moral Model and the Scandal of the Secular Sign"
      },
      {
        "slug": "clr-451",
        "title": "Reciprocity and Firstness"
      },
      {
        "slug": "clr-496",
        "title": "Religion and Firstness"
      },
      {
        "slug": "clr-342",
        "title": "The Crisis of Firstness (Guest Chronicler: Adam Katz)"
      },
      {
        "slug": "the-single-source-of-moral-and-intellectual-innovation-gablog",
        "title": "The Single Source of Moral and Intellectual Innovation"
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
    ]
  },

  {
    "slug": "market",
    "title": "Market",
    "definition": "In Generative Anthropology the market is the scenic institution through which human beings exchange without a central authority to mediate them, relying only on the shared order of representation through signs. It is the never-completable successor to the ritual system of sacrificial distribution — decentralized in appearance, yet held open by a \"spread,\" a standing anxiety about whether circulation will continue, which is what makes anyone willing to sustain it in the first place.",
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
        "title": "There Is No Economy but Only the Debt to the Center: Money, Capital and the Tributary"
      },
      {
        "slug": "clr-34",
        "title": "The Free Market"
      },
      {
        "slug": "clr-123",
        "title": "On Political Economy"
      },
      {
        "slug": "clr-397",
        "title": "GA: The Other Intellectual Scene"
      },
      {
        "slug": "the-economic-imperative",
        "title": "The Economic Imperative"
      },
      {
        "slug": "monopoly",
        "title": "Monopoly"
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
    ]
  },

  {
    "slug": "disciplinarity",
    "title": "Disciplinarity",
    "definition": "Disciplinarity is the social form of sustained inquiry: a disciplinary space suspends immediate, differing interests and organizes attention around a center so as to drill below ordinary thresholds of significance and make sharable what is not yet visible. In its widest sense it is coextensive with the human — the originary scene was already a discipline — because disciplined inquiry is simply a more deliberate form of the deferral that generates the sign.",
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
        "title": "Programming, Power and Declarative Culture"
      },
      {
        "slug": "introduction-to-disciplinarity",
        "title": "An Introduction to Disciplinarity (Adam Katz)"
      },
      {
        "slug": "learning-discipline-and-the-thought-experiment",
        "title": "Learning, Discipline and the Thought Experiment"
      },
      {
        "slug": "disciplining-disciplines",
        "title": "Disciplining Disciplines"
      },
      {
        "slug": "competence",
        "title": "Competence"
      },
      {
        "slug": "the-single-source-of-moral-and-intellectual-innovation-gablog",
        "title": "The Single Source of Moral and Intellectual Innovation"
      },
      {
        "slug": "the-transdisciplinarity-of-the-hypothesis",
        "title": "The Transdisciplinarity of the Hypothesis"
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
    ]
  },

  {
    "slug": "justice",
    "title": "Justice",
    "definition": "In the GA framework justice is not the machinery that adjudicates disputes but the normative distinction that machinery is meant to articulate: the difference between power exercised merely to hold order and power exercised in obedience to a center greater than the one who holds it. Rooted in the egalitarian reciprocity of the originary scene, justice supplements the originary deferral of appropriation by punishing violations of a norm that the whole community once enforced — which is also why it binds even the sovereign to a \"higher power\" and \"true law\" it did not author.",
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
        "title": "Centrality, Power, Sovereignty"
      },
      {
        "slug": "ap0101-gans",
        "title": "The Unique Source of Religion and Morality"
      },
      {
        "slug": "clr-221",
        "title": "Resentment, or the Sense of Injustice"
      },
      {
        "slug": "clr-222",
        "title": "Justice and Resentment"
      },
      {
        "slug": "distribution-from-the-center",
        "title": "Distribution from the Center"
      },
      {
        "slug": "on-the-juridical-disciplinary-line",
        "title": "On the Juridical/Disciplinary Line"
      },
      {
        "slug": "the-three-resentments",
        "title": "The Three Resentments"
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
    ]
  },

  {
    "slug": "liberalism",
    "title": "Liberalism",
    "definition": "In the GA framework, liberalism is the governing ideology of modernity that treats the individual as pre-politically inviolable, reduces politics to the cataloguing and balancing of rights, and thereby works to obscure the imperatives issuing from central authority. Its distinctive effect is concealment: not the abolition of the decider but the arrangement whereby no one ever knows who decides anything, so that the center's supervision is redescribed as the servant of ostensibly free agents.",
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
        "title": "The Center and Imperative Authority"
      },
      {
        "slug": "after-liberalism-2",
        "title": "After Liberalism 2"
      },
      {
        "slug": "anthropomorphics-center-and-distribution",
        "title": "Center and Distribution"
      },
      {
        "slug": "liberal-democracy-is-the-concealment-of-power",
        "title": "“Liberal Democracy” is the Concealment of Power"
      },
      {
        "slug": "the-mistake-of-liberal-democracy",
        "title": "The Mistake of Liberal Democracy"
      },
      {
        "slug": "clr-136",
        "title": "The Moral Contradiction of Liberalism"
      },
      {
        "slug": "online-version-of-erics-gans-a-new-way-of-thinking",
        "title": "Bouvard on Individualism Beyond Liberalism's Dialectic"
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
    ]
  },

  {
    "slug": "center-study",
    "title": "Center Study",
    "definition": "Center study is the branch of Generative Anthropology developed by Adam Katz, writing as Dennis Bouvard, that makes the center itself — its occupancy, defense, maintenance, and succession — the primary object of inquiry. It works less as a doctrine than as a programming idiom: a small set of interlocking concepts designed to be made interoperable with any other discourse.",
    "relations": [
      "the-center",
      "idiom",
      "deferral",
      "the-juridical",
      "anthropomorphics",
      "originary-grammar"
    ],
    "posts": [
      {
        "slug": "infra-humaning",
        "title": "Infra-Humaning"
      },
      {
        "slug": "idiom-and-the-differend",
        "title": "Idiom and the differend"
      },
      {
        "slug": "promise-fraud-the-options-on-the-imperative-messiah",
        "title": "Promise, Fraud, the Options on the Imperative, Messiah"
      },
      {
        "slug": "imperatives-for-idiom-creation",
        "title": "Imperatives for Idiom Creation"
      },
      {
        "slug": "hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative",
        "title": "Hyperstitching the Soliciting of the Center and the Prolonging of the Imperative"
      },
      {
        "slug": "nomos-class-action",
        "title": "Nomos/Class Action"
      }
    ],
    "passages": [
      {
        "text": "Center study could be seen as a kind of metalanguage, converting all discourses into mimesis and deferral just psychoanalysis converts all discourse into desire and repression or historical materialism converts all discourse into base and superstructure.",
        "source": "Idiom and the differend",
        "sourceSlug": "idiom-and-the-differend"
      },
      {
        "text": "Center study is held together by a sufficiently small number of concepts—along with the above, we have nomos and the juridical and surely a couple of others I’m forgetting now. Creating new idioms involves using one of the concepts as a platform for the others—this is itself technological and a kind of stacking.",
        "source": "Promise, Fraud, the Options on the Imperative, Messiah",
        "sourceSlug": "promise-fraud-the-options-on-the-imperative-messiah"
      },
      {
        "text": "The previous paragraph serves as a reminder that the Natural Semantic Primes can never be far from our minds when designing idioms. For originary hypothesizing, or center study, they simply replace philosophy, providing the originary meaning of the words out of which all other meanings can be produced.",
        "source": "Imperatives for Idiom Creation",
        "sourceSlug": "imperatives-for-idiom-creation"
      },
      {
        "text": "The goal of center study is to stay as close to boundary between diagnosis and prescription as possible on the longest timeline imaginable: to always be able to say, this is what everyone is already doing and here’s how they might, given certain shifts in visible trajectories, do it more explicitly and accountably.",
        "source": "Hyperstitching the Soliciting of the Center and the Prolonging of the Imperative",
        "sourceSlug": "hyperstitching-the-soliciting-of-the-center-and-the-prolonging-of-the-imperative"
      },
      {
        "text": "It would vindicate center study as a fork-off of the originary hypothesis away from GA, with the distinctive argument I’ve been making for the juridical as a provisional space between the ritual and disciplinary.",
        "source": "Nomos/Class Action",
        "sourceSlug": "nomos-class-action"
      }
    ]
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
