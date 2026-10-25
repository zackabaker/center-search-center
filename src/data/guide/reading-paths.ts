export interface PathPost {
  slug: string;
  title: string;
  source: string;
}

export interface ReadingPath {
  slug: string;
  title: string;
  posts: PathPost[];
  opensOnto: string[]; // slugs of other paths this opens onto
}

export const READING_PATHS: ReadingPath[] = [
  {
    slug: 'lectures',
    title: 'The Five Lectures',
    posts: [
      { slug: 'origin', title: 'Lecture 1: Origin', source: 'Lecture' },
      { slug: 'mimetic', title: 'Lecture 2: Mimetic', source: 'Lecture' },
      { slug: 'deferral-of-violence', title: 'Lecture 3: Deferral of Violence', source: 'Lecture' },
      { slug: 'the-center', title: 'Lecture 4: The Center', source: 'Lecture' },
      { slug: 'the-sign-pdf', title: 'Lecture 5: The Sign', source: 'Lecture' },
    ],
    opensOnto: ['foundation', 'political', 'language-and-grammar'],
  },

  {
    slug: 'foundation',
    title: 'The Foundation',
    posts: [
      { slug: 'origin', title: 'Lecture 1: Origin', source: 'Lecture' },
      { slug: 'center-and-centrality', title: 'Center and Centrality', source: 'GABlog' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language (Introduction)', source: 'Book' },
      { slug: 'talk-of-the-center-adam-katz', title: 'Talk of the Center', source: 'PDF' },
      { slug: 'originary-hypothesis-as-mobius-strip', title: 'Originary Hypothesis as Möbius Strip', source: 'Substack' },
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', source: 'PDF' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics: An Originary Grammar of the Center', source: 'Book' },
    ],
    opensOnto: ['political', 'juridical', 'language-and-grammar'],
  },

  {
    slug: 'sacred-and-social',
    title: 'The Sacred and the Social',
    posts: [
      { slug: 'mimetic', title: 'Lecture 2: Mimetic', source: 'Lecture' },
      { slug: 'deferral-of-violence', title: 'Lecture 3: Deferral of Violence', source: 'Lecture' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', source: 'PDF' },
      { slug: 'media-as-ritual', title: 'Media as Ritual', source: 'Substack' },
      { slug: 'discipline-and-debt', title: 'Discipline and Debt', source: 'GABlog' },
      { slug: 'mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', source: 'PDF' },
    ],
    opensOnto: ['foundation', 'political', 'technology-and-scenic-design'],
  },

  {
    slug: 'political',
    title: 'Power, Order, and Succession',
    posts: [
      { slug: 'the-center', title: 'Lecture 4: The Center', source: 'Lecture' },
      { slug: 'the-anthropoetics-of-power', title: 'The Anthropoetics of Power', source: 'PDF' },
      { slug: 'nemesis-jouvenelian-liberal-model', title: 'Nemesis: The Jouvenelian vs. the Liberal Model', source: 'PDF' },
      { slug: 'event-origin-center', title: 'Event, Origin, Center', source: 'PDF' },
      { slug: 'sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', source: 'GABlog' },
      { slug: 'singularized-succession-in-perpetuity', title: 'Singularized Succession in Perpetuity', source: 'Substack' },
      { slug: 'successful-succession', title: 'Successful Succession', source: 'GABlog' },
    ],
    opensOnto: ['juridical', 'debt-credit-economic', 'technology-and-scenic-design'],
  },

  {
    slug: 'juridical',
    title: 'Law and Judgment',
    posts: [
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics (sections on debt and the juridical)', source: 'Book' },
      { slug: 'sovereignty-nomos-and-parrhesia', title: 'Sovereignty, Nomos and Parrhesia', source: 'GABlog' },
      { slug: 'on-the-juridical-disciplinary-line', title: 'On the Juridical/Disciplinary Line', source: 'Substack' },
      { slug: 'tethering-and-toggling-ritual-juridical-and-disciplinary', title: 'Tethering and Toggling: Ritual, Juridical, and Disciplinary', source: 'Substack' },
      { slug: 'there-is-no-economy-pdf', title: 'There Is No Economy', source: 'PDF' },
    ],
    opensOnto: ['political', 'debt-credit-economic'],
  },

  {
    slug: 'debt-credit-economic',
    title: 'Debt, Credit, and the Economic',
    posts: [
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics (debt to the center)', source: 'Book' },
      { slug: 'discipline-and-debt', title: 'Discipline and Debt', source: 'GABlog' },
      { slug: 'debits-and-credits', title: 'Debits and Credits', source: 'Substack' },
      { slug: 'there-is-no-economy-pdf', title: 'There Is No Economy', source: 'PDF' },
      { slug: 'originary-debt-credit-succession', title: 'Originary Debt, Credit, Succession', source: 'Substack' },
      { slug: 'data-as-currency-and-the-debt-to-the-center', title: 'Data as Currency and the Debt to the Center', source: 'Substack' },
      { slug: 'debts-and-deferences-gablog', title: 'Debts and Deferences', source: 'GABlog' },
    ],
    opensOnto: ['juridical', 'technology-and-scenic-design'],
  },

  {
    slug: 'language-and-grammar',
    title: 'Language and the Sign',
    posts: [
      { slug: 'the-sign-pdf', title: 'Lecture 5: The Sign', source: 'Lecture' },
      { slug: 'the-origin-of-language', title: 'The Origin of Language', source: 'Book' },
      { slug: 'linguistic-turn-generative-literacy', title: 'The Linguistic Turn and Generative Literacy', source: 'PDF' },
      { slug: 'back-to-grammar', title: 'Back to Grammar', source: 'Substack' },
      { slug: 'media-technology-and-originary-grammar', title: 'Media, Technology and Originary Grammar', source: 'Substack' },
      { slug: 'attentionality-originary-ethics', title: 'Attentionality and Originary Ethics', source: 'PDF' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics (Talk of the Center section)', source: 'Book' },
    ],
    opensOnto: ['foundation', 'technology-and-scenic-design', 'self-referential'],
  },

  {
    slug: 'technology-and-scenic-design',
    title: 'AI, Technology, and Scenic Design',
    posts: [
      { slug: 'the-center', title: 'Lecture 4: The Center', source: 'Lecture' },
      { slug: 'originary-technics', title: 'Originary Technics', source: 'PDF' },
      { slug: 'intelligence-and-technics', title: 'Intelligence and Technics', source: 'Substack' },
      { slug: 'media-as-ritual', title: 'Media as Ritual', source: 'Substack' },
      { slug: 'the-grammar-of-technology-substack', title: 'The Grammar of Technology', source: 'Substack' },
      { slug: 'being-like-data-the-central-intelligence', title: 'Being Like Data; the Central Intelligence', source: 'Substack' },
      { slug: 'mimesis-center-auto-immunology', title: 'Mimesis, the Center and Auto-Immunology', source: 'PDF' },
      { slug: 'scenic-design-practices', title: 'Scenic Design Practices', source: 'GABlog' },
    ],
    opensOnto: ['political', 'foundation', 'self-referential'],
  },

  {
    slug: 'self-referential',
    title: 'What Center Study Is',
    posts: [
      { slug: 'generative-anthropology-one-big-discipline', title: 'Center Study as One Big Discipline', source: 'PDF' },
      { slug: 'the-transdisciplinarity-of-the-hypothesis', title: 'The Transdisciplinarity of the Hypothesis', source: 'Substack' },
      { slug: 'introduction-to-disciplinarity', title: 'Introduction to Disciplinarity', source: 'PDF' },
      { slug: 'the-prospects-of-the-hypothesis', title: 'The Prospects of the Hypothesis', source: 'Substack' },
      { slug: 'talk-of-the-center-adam-katz', title: 'Talk of the Center', source: 'PDF' },
      { slug: 'anthropomorphics-book', title: 'Anthropomorphics (entire)', source: 'Book' },
    ],
    opensOnto: ['foundation'],
  },
  // Placed LAST deliberately: NextInPath threads by first match, so existing
  // paths keep their claim on shared posts (gateways 03/04); the /start leak
  // posts (the-discourse, gateways 01/02) are in no other path and thread here.
  {
    slug: 'start-here',
    title: 'Start Here',
    posts: [
      { slug: 'the-discourse-of-the-center', title: 'The Discourse of the Center', source: 'GABlog' },
      { slug: 'anthropomorphics-origin-and-hypothesis', title: 'Origin and Hypothesis', source: 'Anthropomorphics' },
      { slug: 'anthropomorphics-the-use-of-a-center', title: 'The Use of a Center', source: 'Anthropomorphics' },
      { slug: 'the-prospects-of-the-hypothesis', title: 'The Prospects of the Hypothesis', source: 'Substack' },
      { slug: 'there-is-no-economy-pdf', title: 'There Is No Economy but Only the Debt to the Center', source: 'Anthropoetics' },
    ],
    opensOnto: ['lectures', 'foundation'],
  },
];

export function getPathBySlug(slug: string): ReadingPath | undefined {
  return READING_PATHS.find((p) => p.slug === slug);
}
