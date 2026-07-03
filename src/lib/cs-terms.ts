// Center Study vocabulary for auto-linking in responses.
// Ordered longest-first so multi-word phrases match before their components.
export interface CSTerm {
  term: string;
  query: string;
}

export const CS_TERMS: CSTerm[] = [

  // ── Flagship multi-word idioms (Bouvard) ─────────────────────────────────
  { term: 'singularized succession in perpetuity', query: 'What is singularized succession in perpetuity in Center Study? How does it function as both a political and anthropological concept?' },
  { term: 'there is no economy but only the debt to the center', query: 'What does "there is no economy but only the debt to the center" mean in Center Study? What does it reveal about money and exchange?' },
  { term: 'converting assets to data', query: 'What does converting assets to data mean in Center Study? How does Bouvard connect it to tributarianism and the center?' },
  { term: 'conversion of assets to data', query: 'What does converting assets to data mean in Center Study? How does Bouvard connect it to tributarianism and the center?' },
  { term: 'debt to the center', query: 'What is the debt to the center in Center Study? How does it ground economic, political, and linguistic relations?' },
  { term: 'muffled transmission from the center', query: 'What is muffled transmission from the center in Center Study? How does it describe the attenuation of the center\'s signal in complex societies?' },
  { term: 'the center its affordances and issuances', query: 'What are the affordances and issuances of the center in Center Study? How does the center emit, distribute, and address its periphery?' },
  { term: 'idiomatic intelligence', query: 'What is idiomatic intelligence in Center Study? How does Bouvard develop it as a concept for AI, practice, and scenic design?' },
  { term: 'transfer idiom', query: 'What is the transfer idiom in Center Study? How does it function as a mechanism for translating between scenes and practices?' },
  { term: 'imperative exchange', query: 'What is imperative exchange in Center Study? How does Bouvard develop it as an economic and linguistic concept grounded in the originary scene?' },
  { term: 'imperative perfection', query: 'What is imperative perfection in Center Study? How does perfecting the imperative extend and intensify the command structure of the scene?' },
  { term: 'expectant scene', query: 'What is an expectant scene in Center Study? How does the expectant scene structure credit, promise, and anticipation?' },
  { term: 'scene stacking', query: 'What is scene stacking in Center Study? How does Bouvard use it to analyze the layering of scenes within scenes?' },
  { term: 'scenic event intelligence', query: 'What is scenic/event intelligence in Center Study? How does it connect the scenic and the event as modes of intelligence?' },
  { term: 'scenic linguistic undecidability', query: 'What is scenic/linguistic undecidability in Center Study? How does it relate to the limits of the declarative?' },
  { term: 'future perfectism', query: 'What is future perfectism in Center Study? How does the "will have been" tense structure originary debt and expectation?' },
  { term: 'will have been', query: 'What is the "will have been" tense in Center Study? How does future perfectism structure originary relations?' },
  { term: 'rotating dictatorship', query: 'What is rotating dictatorship in Center Study? How does Bouvard use it as a model for understanding how legitimate authority circulates?' },
  { term: 'emulation economy', query: 'What is an emulation economy in Center Study? What does "in the image" mean and how does it relate to AI and mimesis?' },
  { term: 'infiltrative inscription', query: 'What is infiltrative inscription in Center Study? How does inscription work as a scenic and technical concept?' },
  { term: 'inscripto-punctualism', query: 'What is inscripto-punctualism in Center Study? How does Bouvard use it to describe a mode of scenic inscription and cultivation?' },
  { term: 'centrifugal signifying', query: 'What is centrifugal signifying in Center Study? How does it describe signs that move away from the center?' },
  { term: 'originary fintech', query: 'What is originary FinTech in Center Study? How does Bouvard analyze financial technology through the originary scene?' },
  { term: 'post-axial age morality', query: 'What is post-axial age morality in Center Study? How does Bouvard use the axial age to periodize moral history?' },
  { term: 'the same sentence', query: 'What is "the same sentence" in Center Study? How does Bouvard use it to analyze identity, repetition, and the declarative?' },
  { term: 'the same sample', query: 'What is the same sample in Center Study? How does sampling function as a scenic and economic concept in Bouvard?' },
  { term: 'para-data', query: 'What is para-data in Center Study? How does Bouvard use it in the analysis of literature and intelligence exchange?' },
  { term: 'central intelligence', query: 'What is central intelligence in Center Study? How does Bouvard use it to describe the center as a source of intelligence and direction?' },
  { term: 'the pointman', query: 'What is the pointman in Center Study? How does Bouvard develop it as a figure of mediation between periphery and center?' },
  { term: 'pointman', query: 'What is the pointman in Center Study? How does Bouvard develop it as a figure of mediation between periphery and center?' },
  { term: 'hostage taking', query: 'What is hostage taking in Center Study? How does Bouvard analyze it as a scenic and political concept?' },
  { term: 'dual use', query: 'What is dual use in Center Study? How does it describe the ambivalent relation between technology and the center?' },
  { term: 'revivalistics', query: 'What is revivalistics in Center Study? How does Bouvard use it to analyze the revival of languages, practices, and scenes?' },
  { term: 'idiomclining', query: 'What is idiomclining in Center Study? How does Bouvard develop it as a concept for the refinement of idioms?' },
  { term: 've/ortexicality', query: 'What is ve/ortexicality in Center Study? How does Bouvard connect it to post-axial age morality and scenic orientation?' },
  { term: 'ortexicality', query: 'What is ortexicality in Center Study? How does it relate to scenic orientation and the direction of attention?' },
  { term: 'tributarianism', query: 'What is tributarianism in Center Study? How does Bouvard use it to analyze modern data and economic structures as tributaries of the center?' },
  { term: 'ergodism', query: 'What is ergodism in Center Study? How does Bouvard use the concept of ergodicity to analyze scenic repetition and work?' },
  { term: 'selving', query: 'What is selving in Center Study? How does Bouvard develop it as a scenic and reflexive concept?' },
  { term: 'infra-humaning', query: 'What is infra-humaning in Center Study? How does Bouvard use it to analyze processes that operate below or beneath the human?' },
  { term: 'learncoin', query: 'What is learncoin in Center Study? How does Bouvard develop it as an originary approach to education and credit?' },
  { term: 'tokenization of resentment', query: 'What is the tokenization of resentment in Center Study? How does tokenization formalize and circulate resentment as a sign?' },
  { term: 'affordances of god', query: 'What are the affordances of God in Center Study? How does Bouvard analyze writing and programming as engagements with divine affordances?' },
  { term: 'big scene', query: 'What is the big scene in Center Study? How does it relate to the originary scene and the problem of scale in scenic analysis?' },
  { term: 'upclining', query: 'What is upclining in Center Study? How does Katz use it in the analysis of attentionality and originary ethics?' },

  // ── Originary scene and event ─────────────────────────────────────────────
  { term: 'originary scene', query: 'What is the originary scene in Center Study? Trace it from the first moment of deferral through its consequences.' },
  { term: 'originary hypothesis', query: 'What is the originary hypothesis in Center Study? What does it claim, and why is it minimal?' },
  { term: 'originary grammar', query: 'What is originary grammar in Center Study? How does it extend from the first sign through the four linguistic forms?' },
  { term: 'originary technics', query: 'What is originary technics in Center Study? How does Katz derive technology from the imperative structure of the originary scene?' },
  { term: 'originary ethics', query: 'What is originary ethics in Center Study? How does attentionality ground moral obligation in the scene?' },
  { term: 'originary style', query: 'What is originary style in Center Study? How does Bouvard develop it as a mode of writing and signification?' },
  { term: 'aborted appropriation', query: 'What is aborted appropriation in Center Study? How does the aborted gesture become the first sign?' },
  { term: 'mimetic crisis', query: 'What is a mimetic crisis in Center Study? How does it generate the first sign and ground the originary scene?' },
  { term: 'sparagmos', query: 'What is the sparagmos in Center Study? How does the collective consumption of the central object generate the first distribution and the sacred?' },

  // ── Scenic design and technics ───────────────────────────────────────────
  { term: 'scenic design', query: 'What is scenic design in Center Study? How does it relate to technics, media, and the construction of scenes?' },
  { term: 'post-sacrificial', query: 'What does post-sacrificial mean in Center Study? How does the transition from ritual to post-sacrificial order shape modernity?' },
  { term: 'auto-immunological', query: 'What is the auto-immunological pathology in Center Study? How do institutions attack the very forms of centrality their own function requires?' },
  { term: 'auto-immunity', query: 'What is the auto-immunological pathology in Center Study? How do institutions attack the very forms of centrality their own function requires?' },

  // ── Political and juridical ──────────────────────────────────────────────
  { term: 'center-periphery', query: 'What is the center-periphery distinction in Center Study? How does it structure scenes, institutions, and attention?' },
  { term: 'big man', query: 'What is the Big Man in Center Study? How does the Big Man figure mark the transition from egalitarian to hierarchical order?' },
  { term: 'out-gifting', query: 'What is out-gifting in Center Study? How does the Big Man\'s out-gifting generate hierarchical debt and succession?' },
  { term: 'succession', query: 'What is succession in Center Study? Why is the mode of succession the most important question for any social order?' },
  { term: 'nomos', query: 'What is the nomos in Center Study? How does it relate to sovereignty, the originary distribution, and the juridical?' },
  { term: 'sovereignty', query: 'What is sovereignty in Center Study? How does it differ from liberal accounts of political authority?' },
  { term: 'juridical', query: 'What is the juridical in Center Study? How does it differ from law as a system of rules and what does it share with the ritual?' },
  { term: 'disciplinary', query: 'What is the disciplinary in Center Study? How does it relate to the juridical and the ritual as modes of scene-management?' },
  { term: 'anti-centerism', query: 'What is anti-centerism in Center Study? How does it describe the modern pathology of institutional life?' },
  { term: 'victimary', query: 'What is the victimary in Center Study? How does it derive from the logic of resentment and the originary scene?' },

  // ── Language and sign ────────────────────────────────────────────────────
  { term: 'ostensive', query: 'What is the ostensive sign in Center Study? How does it emerge from the originary scene as the first linguistic form?' },
  { term: 'imperative', query: 'What is the imperative in Center Study? How is it derived from the ostensive and what political dimension does it carry?' },
  { term: 'interrogative', query: 'What is the interrogative in Center Study? How does it function as the hinge between imperative and declarative, and what is interrogative imperativity?' },
  { term: 'declarative', query: 'What is the declarative in Center Study? How does it emerge from the impasse of the imperative and what does its priority conceal?' },
  { term: 'attentionality', query: 'What is attentionality in Center Study? How does joint attention ground both language and ethics?' },
  { term: 'attentional', query: 'What is attentionality in Center Study? How does joint attention ground both language and ethics?' },
  { term: 'infralinguistic', query: 'What is the infralinguistic in Center Study? How does it complete the linguistic turn by going below metalanguage?' },
  { term: 'metalanguage', query: 'What is the critique of metalanguage in Center Study? Why is there no neutral position outside language from which it can be described?' },
  { term: 'generative literacy', query: 'What is generative literacy in Center Study? How does it differ from representational literacy?' },

  // ── Economic and credit ──────────────────────────────────────────────────
  { term: 'tributary', query: 'What is the tributary in Center Study? How does Bouvard use it to analyze modern economic and data structures?' },
  { term: 'credit', query: 'What is credit in Center Study? How does it function as a claim on the center rather than a promise of future payment?' },
  { term: 'inscription', query: 'What is inscription in Center Study? How does Bouvard develop it as a concept for data, technics, and scenic marking?' },
  { term: 'tokenization', query: 'What is tokenization in Center Study? How does it apply originary grammar to contemporary data and economic structures?' },
  { term: 'sampling', query: 'What is sampling in Center Study? How does Bouvard develop it as a scenic and economic concept — a donation to the center?' },
  { term: 'metonymy', query: 'What is metonymy in Center Study? How does it function in the analysis of money as a means of sequencing debt?' },

  // ── Core concepts ────────────────────────────────────────────────────────
  { term: 'deferral', query: 'What is deferral in Center Study? How does it function as the founding operation of language and culture?' },
  { term: 'deferred', query: 'What is deferral in Center Study? How does it function as the founding operation of language and culture?' },
  { term: 'resentment', query: 'What is resentment in Center Study? How is it structurally generated by the center-periphery configuration?' },
  { term: 'mimesis', query: 'What is mimesis in Center Study? How does it differ from Girardian imitation and ground the originary scene?' },
  { term: 'mimetic', query: 'What is mimesis in Center Study? How does it differ from Girardian imitation and ground the originary scene?' },
  { term: 'sacred', query: 'What is the sacred in Center Study? How does it function as a binding force rather than a theological category?' },
  { term: 'sacrality', query: 'What is sacrality in Center Study? How does the sacred emerge from the originary scene and persist into secular order?' },
  { term: 'transcendence', query: 'What is transcendence in Center Study? How does it emerge minimally from the originary scene as the force that binds the sign?' },
  { term: 'scenic', query: 'What is the scenic in Center Study? How does scenic thinking differ from abstract or representational thinking?' },
  { term: 'scene', query: 'What is the scene in Center Study? How does it function as the basic unit of analysis for all human activity?' },
  { term: 'center', query: 'What is the center in Center Study? What is its originary derivation and what work does it do across the archive?' },
  { term: 'periphery', query: 'What is the periphery in Center Study? How does peripheral position generate resentment and desire for the center?' },
  { term: 'idiom', query: 'What is idiom in Center Study? How does Bouvard develop it as a concept for analyzing intelligence, practice, and scenic distinctiveness?' },
  { term: 'idiomatic', query: 'What is idiom in Center Study? How does Bouvard develop it as a concept for analyzing intelligence, practice, and scenic distinctiveness?' },
  { term: 'thirdness', query: 'What is thirdness in Center Study? How does Bouvard develop it in relation to Peirce and the three-term structure of the scene?' },
  { term: 'sign', query: 'What is the sign in Center Study? How does the originary sign differ from Saussurean or Peircean accounts?' },
  { term: 'katechon', query: 'What is the katechon in Center Study? How does it relate to deferral and to Schmitt?' },
  { term: 'scapegoating', query: 'What is scapegoating in Center Study? How does violence against the center differ from Girard’s account of the victim?' },
  { term: 'disciplinarity', query: 'What is a discipline in Center Study? How do disciplines relate to the center and to the juridical?' },
  { term: 'liberalism', query: 'How does Center Study analyze liberalism and the concealment of the decider?' },
  { term: 'charismatic', query: 'What is charisma in Center Study? How does discipline and deferral generate centrality?' },
  { term: 'charisma', query: 'What is charisma in Center Study? How does discipline and deferral generate centrality?' },
  { term: 'firstness', query: 'What is firstness in Center Study? What risk does being first carry?' },
];

// Build a fast lookup: term (lowercase) → CSTerm
export const CS_TERM_MAP = new Map<string, CSTerm>(
  CS_TERMS.map(t => [t.term.toLowerCase(), t])
);

/**
 * Maps CS term text (lowercase) to a /guide/concepts/[slug] route where a
 * dedicated concept page exists. Terms not listed here fall back to the
 * /search?q= link used in HighlightedContent.
 *
 * This is the SINGLE canonical map — src/data/guide/concepts.ts re-exports it.
 * (The two files used to hold divergent copies; keep all edits here.)
 */
export const TERM_TO_CONCEPT_SLUG: Record<string, string> = {
  // the-center
  'center': 'the-center',
  'centers': 'the-center',
  'centered': 'the-center',
  'periphery': 'the-center',
  'center-periphery': 'the-center',

  // originary-scene
  'originary scene': 'originary-scene',
  'originary hypothesis': 'originary-scene',
  'aborted appropriation': 'originary-scene',
  'sparagmos': 'sparagmos',

  // deferral
  'deferral': 'deferral',
  'defer': 'deferral',
  'deferred': 'deferral',
  'deferring': 'deferral',
  'defers': 'deferral',

  // ostensive-imperative-declarative
  'ostensive': 'ostensive-imperative-declarative',
  'imperative': 'ostensive-imperative-declarative',
  'declarative': 'ostensive-imperative-declarative',
  'interrogative': 'ostensive-imperative-declarative',
  'ostensives': 'ostensive-imperative-declarative',
  'imperatives': 'ostensive-imperative-declarative',
  'declaratives': 'ostensive-imperative-declarative',
  'originary grammar': 'originary-grammar',
  'grammar': 'originary-grammar',
  'infralinguistic': 'originary-grammar',
  'infralinguistics': 'originary-grammar',
  'generative literacy': 'originary-grammar',

  // the-sacred
  'sacred': 'the-sacred',
  'sacrality': 'the-sacred',
  'sacralities': 'the-sacred',
  'transcendence': 'the-sacred',

  // nomos / sovereignty
  'nomos': 'nomos',
  'nomic': 'nomos',
  'sovereignty': 'sovereignty',
  'sovereign': 'sovereignty',

  // succession
  'succession': 'succession',
  'successor': 'succession',
  'successors': 'succession',
  'singularized succession in perpetuity': 'succession',

  // the-juridical
  'juridical': 'the-juridical',

  // disciplinarity
  'disciplinary': 'disciplinarity',
  'disciplinarity': 'disciplinarity',
  'the discipline': 'disciplinarity',
  'disciplines': 'disciplinarity',

  // debt-and-credit
  'debt to the center': 'debt-and-credit',
  'there is no economy but only the debt to the center': 'debt-and-credit',
  'debt': 'debt-and-credit',
  'debts': 'debt-and-credit',
  'credit': 'debt-and-credit',
  'credits': 'debt-and-credit',
  'tributary': 'debt-and-credit',
  'tributarianism': 'debt-and-credit',
  'metonymy': 'debt-and-credit',

  // scenic-design
  'scenic design': 'scenic-design',
  'scenic': 'scenic-design',
  'scene': 'scenic-design',
  'big scene': 'scenic-design',
  'expectant scene': 'scenic-design',
  'scene stacking': 'scenic-design',

  // anthropomorphics
  'anthropomorphics': 'anthropomorphics',
  'metaperson': 'anthropomorphics',
  'metapersons': 'anthropomorphics',

  // resentment-victimary
  'resentment': 'resentment-victimary',
  'resentments': 'resentment-victimary',
  'victimary': 'resentment-victimary',
  'anticenterism': 'resentment-victimary',
  'anti-centerism': 'resentment-victimary',
  'tokenization of resentment': 'resentment-victimary',

  // pointman-uninsurable
  'pointman': 'pointman-uninsurable',
  'pointmen': 'pointman-uninsurable',
  'the pointman': 'pointman-uninsurable',
  'uninsurable': 'pointman-uninsurable',

  // big-man
  'big man': 'big-man',
  'big-man': 'big-man',
  'out-gifting': 'big-man',
  'rotating dictatorship': 'big-man',

  // mimesis
  'mimesis': 'mimesis',
  'mimetic': 'mimesis',
  'mimeticism': 'mimesis',
  'mimetically': 'mimesis',
  'mimetic crisis': 'mimesis',

  // desire
  'desire': 'desire',
  'desires': 'desire',

  // omnicentrism
  'omnicentrism': 'omnicentrism',
  'omnicentric': 'omnicentrism',
  'omnicentrist': 'omnicentrism',

  // the-sign
  'sign': 'the-sign',
  'signs': 'the-sign',
  'inscription': 'the-sign',
  'tokenization': 'the-sign',
  'sampling': 'the-sign',

  // attentionality
  'attentionality': 'attentionality',
  'attentional': 'attentionality',

  // ritual
  'ritual': 'ritual',
  'rituals': 'ritual',

  // idiom
  'idiom': 'idiom',
  'idioms': 'idiom',
  'idiomatic': 'idiom',
  'idiomatic intelligence': 'idiom',
  'transfer idiom': 'idiom',

  // idiomclining
  'idiomclining': 'idiomclining',
  'idiomcline': 'idiomclining',

  // katechon
  'katechon': 'katechon',
  'katechontic': 'katechon',

  // scapegoating
  'scapegoating': 'scapegoating',
  'scapegoat': 'scapegoating',
  'scapegoats': 'scapegoating',
  'scapegoated': 'scapegoating',

  // power
  'power': 'power',
  'powers': 'power',

  // money
  'money': 'money',

  // media
  'media': 'media',
  'mediation': 'media',
  'mediated': 'media',

  // technology
  'technology': 'technology',
  'technologies': 'technology',
  'technics': 'technology',

  // event
  'event': 'event',
  'events': 'event',
  'eventfulness': 'event',
  'originary event': 'event',

  // charisma
  'charisma': 'charisma',
  'charismatic': 'charisma',

  // narrative
  'narrative': 'narrative',
  'narratives': 'narrative',

  // capital
  'capital': 'capital',

  // firstness
  'firstness': 'firstness',

  // market
  'market': 'market',
  'markets': 'market',
  'the market': 'market',

  // justice
  'justice': 'justice',

  // liberalism
  'liberalism': 'liberalism',
};

// Sorted by length descending so multi-word phrases match before their components
export const CS_TERMS_SORTED = [...CS_TERMS].sort((a, b) => b.term.length - a.term.length);

// Extract top follow-up questions from a response by finding which CS terms appear
export function extractFollowUps(content: string, alreadyAsked: string = ''): string[] {
  const lower = content.toLowerCase();
  const asked = alreadyAsked.toLowerCase();
  const seen = new Set<string>();
  const hits: { term: CSTerm; count: number }[] = [];

  for (const t of CS_TERMS_SORTED) {
    const tl = t.term.toLowerCase();
    // Skip if this is what was just asked
    if (asked.includes(tl)) continue;
    const re = new RegExp('\\b' + tl.replace(/[-/[\]{}()*+?.,\\^$|#]/g, '\\$&') + '\\b', 'gi');
    const matches = lower.match(re);
    if (matches && matches.length > 0) {
      if (!seen.has(t.query)) {
        seen.add(t.query);
        hits.push({ term: t, count: matches.length });
      }
    }
  }

  // Sort by frequency — most-mentioned concepts → most relevant follow-ups
  hits.sort((a, b) => b.count - a.count);
  return hits.slice(0, 3).map(h => h.term.query);
}
