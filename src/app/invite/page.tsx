import type { Metadata } from 'next';
import Link from 'next/link';
import SceneMark from '@/components/SceneMark';

// Shareable seminar invitation — deliberately unlisted: not in the sitemap,
// meta-noindex (same treatment as /study; a robots.txt disallow line would
// only advertise the URL). Share scrapers still unfurl the OG card.
//
// Design: a formal masthead (crest, small caps, Lora display, date block)
// inside one hairline frame, then plainly readable left-set sections. The
// formality lives in the masthead and the restraint; the body stays a
// comfortable reading column on every screen.
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
const p = 'text-[15px] text-gray-700 dark:text-gray-300 leading-[1.8]';
const h2 = 'text-[11px] font-mono uppercase tracking-[0.28em] text-gray-400 dark:text-gray-500 mb-4';

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

function Epigraph({ children, source }: { children: React.ReactNode; source: React.ReactNode }) {
  return (
    <blockquote className="border-l border-gray-200 dark:border-gray-700 pl-5 mb-6">
      <p className="font-serif text-[15px] italic text-gray-600 dark:text-gray-400 leading-[1.85]">
        {children}
      </p>
      <footer className="text-xs font-mono uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mt-3">
        {source}
      </footer>
    </blockquote>
  );
}

export default function InvitePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-8 sm:py-14">
      <div className="border border-gray-300 dark:border-gray-700 px-5 py-12 sm:px-16 sm:py-16">
        {/* ── Masthead ── */}
        <header className="text-center">
          <div className="flex justify-center">
            <SceneMark size={28} className="text-gray-900 dark:text-white" />
          </div>
          <p className="text-[11px] font-mono uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 mt-6">
            Center Study Research &amp; Design
          </p>
          <p className="font-serif italic text-[15px] text-gray-500 dark:text-gray-400 mt-8">
            You are invited to a seminar in two sessions
          </p>
          <h1 className="font-serif text-3xl sm:text-[2.75rem] font-bold leading-tight text-gray-900 dark:text-white mt-4 text-balance">
            Writing Companies into Existence
          </h1>
          <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-gray-700 dark:text-gray-300 mt-6">
            Sundays, 15 &amp; 22 November 2026
          </p>
          <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mt-1.5">
            over Zoom · Fall 2026
          </p>
          <div className="mt-8">
            <RsvpButton />
          </div>
          <div className="flex items-center gap-3 mt-12">
            <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
            <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
          </div>
        </header>

        {/* ── Introduction ── */}
        <section className="mt-10">
          <h2 className={h2}>Introduction</h2>
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
            This reading and writing group will oscillate between Center Study and Anthropomorphics:
            between research and design, between reading and writing, between discovery and
            creation, between hypothesis and practice. The group itself should become a tentative
            model for the kind of thinking, products, projects, and writing that Center Study and
            Anthropomorphics can generate.
          </p>
          <p className={`${p} mt-4`}>
            The group is meant as a model of practice: an attempt to forge a new disciplinary space
            grounded in the idioms of Center Study, with a specific skew toward the creation and
            maintenance of sovereign companies — companies that will ultimately become clients of a
            single sovereign data-security monopoly.
          </p>
          <p className={`${p} mt-4`}>
            The seminar culminates in a writing project: each participant proposes at least one new
            company. Each is a sovereign company, one that addresses an &ldquo;issue&rdquo; in the
            social order and in doing so mends, fortifies, and profitably maintains sovereignty.
          </p>
        </section>

        {/* ── Preparation ── */}
        <section className="mt-10">
          <h2 className={h2}>Preparation</h2>
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
            , which is required reading before the first session. Participants are also expected to
            be familiar with Dennis Bouvard&rsquo;s{' '}
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
        <section className="mt-10">
          <h2 className={h2}>Schedule of Readings</h2>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-10">
            {SESSIONS.map((s) => (
              <div key={s.n} className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <p className="font-serif text-lg text-gray-900 dark:text-white">
                  Session {s.n}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 italic font-serif">
                  {s.date}
                </p>
                <ul className="mt-3 space-y-1.5">
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
        <section className="mt-10">
          <h2 className={h2}>The Proposal</h2>
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
            out the existing credit system for the sake of simulation and prediction. There&rsquo;s
            nothing more important, and really nothing else than, imagining and building such
            companies.
          </Epigraph>
          <p className={p}>
            Participants will propose companies that draw on specialized databases, search engines
            and AIs. The point is to make company creation a habit: if you identify a social
            &ldquo;problem,&rdquo; or desideratum, your observation only gains credit if a company
            can be built to address it. It shifts discourse completely away from
            &ldquo;rights&rdquo; and building &ldquo;coalitions&rdquo; to petition governments, etc.
            It changes political language. If someone says, &ldquo;but what do we do about the
            NGOs&rdquo; — OK, what kind of company could neutralize the NGOs (perhaps through
            lawsuits, perhaps through exposure of funding links and donors, etc.)? And then there
            would be companies generating new ideas for companies, maybe for prospective investors.
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
        <section className="mt-10">
          <h2 className={h2}>A Note on Vocabulary</h2>
          <p className={p}>
            Center Study is full of new vocabulary and idioms that will be unfamiliar at first. When
            you meet one, consult the{' '}
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
        <section className="mt-12 text-center border-t border-gray-100 dark:border-gray-800 pt-10">
          <p className="font-serif italic text-[15px] text-gray-600 dark:text-gray-400 mb-6">
            If you are able to accept this invitation, kindly complete the form.
          </p>
          <RsvpButton />
        </section>
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
