import type { Metadata } from 'next';
import Link from 'next/link';
import SceneMark from '@/components/SceneMark';

// Shareable seminar invitation — deliberately unlisted: not in the sitemap,
// meta-noindex (same treatment as /study; a robots.txt disallow line would
// only advertise the URL). Share scrapers still unfurl the OG card.
//
// Design: formal engraved-invitation register — framed card, centered crest
// (the site's scene mark), letterspaced small caps, Lora display, hairline
// double rules. Monochrome on purpose; the restraint is the formality.
export const metadata: Metadata = {
  title: 'Writing Companies into Existence',
  description:
    'Center Study Research and Design seminar, Fall 2026. Two sessions on Zoom, 15 & 22 November — reading between Center Study and Anthropomorphics, culminating in a proposal for a new company.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://center.study/invite' },
  openGraph: {
    title: 'Writing Companies into Existence',
    description:
      'Center Study Research and Design seminar, Fall 2026. Two sessions on Zoom, 15 & 22 November.',
    url: 'https://center.study/invite',
    type: 'website',
  },
};

const RSVP_URL = 'https://tally.so/r/gba7l1';

const SESSIONS = [
  {
    n: 'I',
    date: 'Sunday, 15 November',
    readings: [
      { title: 'Data Exchange', year: '2023', href: '/post/data-exchange' },
      { title: 'Learncoin', year: '2024', href: '/post/learncoin' },
    ],
  },
  {
    n: 'II',
    date: 'Sunday, 22 November',
    readings: [
      { title: 'Thirdness', year: '2023', href: '/post/thirdness' },
      { title: 'Nomos/Class Action', year: '2024', href: '/post/nomos-class-action' },
    ],
  },
];

const link =
  'underline decoration-gray-300 dark:decoration-gray-600 underline-offset-[3px] hover:decoration-gray-600 dark:hover:decoration-gray-300 transition-colors';
const p = 'text-[15px] text-gray-700 dark:text-gray-300 leading-[1.85]';

function RsvpButton() {
  return (
    <a
      href={RSVP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-10 py-3 border border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[13px] font-mono uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 dark:hover:bg-gray-950 dark:hover:text-white transition-colors"
    >
      RSVP
    </a>
  );
}

// Centered small-caps section heading flanked by hairline rules.
function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6" role="heading" aria-level={2}>
      <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
      <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
    </div>
  );
}

function Epigraph({ children, source }: { children: React.ReactNode; source: React.ReactNode }) {
  return (
    <blockquote className="my-6 text-center px-2 sm:px-8">
      <p className="font-serif text-[15px] sm:text-base italic text-gray-600 dark:text-gray-400 leading-[1.9]">
        {children}
      </p>
      <footer className="text-xs font-mono uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500 mt-4">
        {source}
      </footer>
    </blockquote>
  );
}

export default function InvitePage() {
  return (
    <main className="max-w-2xl w-full mx-auto px-4 py-8 sm:py-14">
      {/* Framed card: double hairline border, engraved-invitation register */}
      <div className="border border-gray-300 dark:border-gray-700 p-[5px]">
        <div className="border border-gray-200 dark:border-gray-800 px-5 py-12 sm:px-14 sm:py-16">
          {/* ── Crest ── */}
          <div className="flex flex-col items-center text-center">
            <SceneMark size={30} className="text-gray-900 dark:text-white" />
            <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mt-7">
              Center Study
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mt-1.5">
              Research &amp; Design
            </p>

            <div className="w-10 border-t border-gray-300 dark:border-gray-700 my-8" />

            <p className="font-serif italic text-[15px] text-gray-500 dark:text-gray-400">
              You are invited to a seminar in two sessions
            </p>

            <h1 className="font-serif text-[2rem] sm:text-[2.6rem] font-bold leading-[1.15] text-gray-900 dark:text-white mt-5 text-balance">
              Writing Companies
              <br />
              into Existence
            </h1>

            <div className="w-10 border-t border-gray-300 dark:border-gray-700 my-8" />

            <p className="text-[13px] font-mono uppercase tracking-[0.22em] text-gray-700 dark:text-gray-300 leading-loose">
              Sundays, 15 &amp; 22 November 2026
              <br />
              <span className="text-gray-400 dark:text-gray-500">over Zoom · Fall 2026</span>
            </p>

            <div className="mt-9">
              <RsvpButton />
            </div>
          </div>

          {/* ── Introduction ── */}
          <section className="mt-16">
            <SectionHead>Introduction</SectionHead>
            <Epigraph
              source={
                <>
                  Dennis Bouvard ·{' '}
                  <a href="https://dennisbouvard.substack.com/p/anthropomorphics" className={link}>
                    Anthropomorphics
                  </a>
                </>
              }
            >
              Center Study and Anthropomorphics are two sides of the same coin and have a kind of
              Möbius-strip character, or a relationship like that between the duck and the rabbit in
              the drawing that drew Wittgenstein&rsquo;s attention. If you do &ldquo;enough&rdquo;
              Center Study you&rsquo;ll find yourself anthropomorphizing, and vice versa.
            </Epigraph>
            <p className={p}>
              This reading and writing group will oscillate between Center Study and
              Anthropomorphics: between research and design, between reading and writing, between
              discovery and creation, between hypothesis and practice. The group itself should
              become a tentative model for the kind of thinking, products, projects, and writing
              that Center Study and Anthropomorphics can generate.
            </p>
            <p className={`${p} mt-4`}>
              The group is meant as a model of practice: an attempt to forge a new disciplinary
              space grounded in the idioms of Center Study, with a specific skew toward the creation
              and maintenance of sovereign companies — companies that will ultimately become clients
              of a single sovereign data-security monopoly.
            </p>
            <p className={`${p} mt-4`}>
              The seminar culminates in a writing project: each participant proposes at least one
              new company. Each is a sovereign company, one that addresses an &ldquo;issue&rdquo; in
              the social order and in doing so mends, fortifies, and profitably maintains
              sovereignty.
            </p>
          </section>

          {/* ── Preparation ── */}
          <section className="mt-14">
            <SectionHead>Preparation</SectionHead>
            <p className={p}>
              We will be working with the vocabulary of{' '}
              <a
                href="https://app.notion.com/p/Mining-the-Gaps-99110453eed540bb94af6e88274be7c8?pvs=25"
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Mining the Gaps
              </a>
              , which is required reading before the first session. Participants are also expected
              to be familiar with Dennis Bouvard&rsquo;s{' '}
              <a href="https://amazon.com/dp/0648690571" className={link}>
                Anthropomorphics: An Originary Grammar of the Center
              </a>{' '}
              and with the{' '}
              <Link href="/browse/substack" className={link}>
                Substack archive
              </Link>{' '}
              at the Center Study Center.
            </p>
          </section>

          {/* ── Programme ── */}
          <section className="mt-14">
            <SectionHead>Schedule of Readings</SectionHead>
            <div className="space-y-8 text-center">
              {SESSIONS.map((s) => (
                <div key={s.n}>
                  <p className="font-serif text-lg text-gray-900 dark:text-white">
                    Session {s.n}
                    <span className="text-gray-400 dark:text-gray-500"> · </span>
                    <span className="italic">{s.date}</span>
                  </p>
                  <ul className="mt-2.5 space-y-1">
                    {s.readings.map((r) => (
                      <li key={r.href} className="text-[15px] leading-relaxed">
                        <Link href={r.href} className={`text-gray-900 dark:text-white ${link}`}>
                          {r.title}
                        </Link>{' '}
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          Bouvard, {r.year}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ── The Proposal ── */}
          <section className="mt-14">
            <SectionHead>The Proposal</SectionHead>
            <Epigraph
              source={
                <>
                  Dennis Bouvard ·{' '}
                  <Link href="/post/credit-and-succession" className={link}>
                    Credit and Succession
                  </Link>
                </>
              }
            >
              [T]hey must first be located in companies adjunct to the government (central
              intelligence) which are in the business of converting assets into data, i.e., mapping
              out the existing credit system for the sake of simulation and prediction.
              There&rsquo;s nothing more important, and really nothing else than, imagining and
              building such companies.
            </Epigraph>
            <p className={p}>
              Participants will propose companies that draw on specialized databases, search engines
              and AIs. The point is to make company creation a habit: if you identify a social
              &ldquo;problem,&rdquo; or desideratum, your observation only gains credit if a company
              can be built to address it. It shifts discourse completely away from
              &ldquo;rights&rdquo; and building &ldquo;coalitions&rdquo; to petition governments,
              etc. It changes political language. If someone says, &ldquo;but what do we do about
              the NGOs&rdquo; — OK, what kind of company could neutralize the NGOs (perhaps through
              lawsuits, perhaps through exposure of funding links and donors, etc.)? And then there
              would be companies generating new ideas for companies, maybe for prospective
              investors.
            </p>
            <p className={`${p} mt-4`}>
              For source material, see{' '}
              <Link href="/companies" className={link}>
                On Companies
              </Link>
              : 850 passages on companies drawn from 284 Center Study texts, sorted by theme,
              including data security, monopoly, and starting companies.
            </p>
          </section>

          {/* ── Vocabulary ── */}
          <section className="mt-14">
            <SectionHead>A Note on Vocabulary</SectionHead>
            <p className={p}>
              Center Study is full of new vocabulary and idioms that will be unfamiliar at first.
              When you meet one, consult the{' '}
              <Link href="/concepts/glossary" className={link}>
                Center Study glossary
              </Link>{' '}
              or use the{' '}
              <Link href="/search" className={link}>
                search
              </Link>{' '}
              at center.study.
            </p>
          </section>

          {/* ── RSVP ── */}
          <section className="mt-16 text-center">
            <div className="flex justify-center mb-8">
              <SceneMark size={16} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="font-serif italic text-[15px] text-gray-600 dark:text-gray-400 mb-7">
              If you are able to accept this invitation,
              <br className="sm:hidden" /> kindly complete the form.
            </p>
            <RsvpButton />
          </section>
        </div>
      </div>

      <p className="text-center mt-6">
        <Link
          href="/"
          className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Center Study Center
        </Link>
      </p>
    </main>
  );
}
