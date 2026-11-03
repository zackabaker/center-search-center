import type { Metadata } from 'next';
import Link from 'next/link';
import SceneMark from '@/components/SceneMark';

// Shareable seminar invitation — deliberately unlisted: not in the sitemap,
// meta-noindex (same treatment as /study; a robots.txt disallow line would
// only advertise the URL). Share scrapers still unfurl the OG card.
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
    n: 1,
    date: '15 November',
    readings: [
      { title: 'Data Exchange', year: '2023', href: '/post/data-exchange' },
      { title: 'Learncoin', year: '2024', href: '/post/learncoin' },
    ],
  },
  {
    n: 2,
    date: '22 November',
    readings: [
      { title: 'Thirdness', year: '2023', href: '/post/thirdness' },
      { title: 'Nomos/Class Action', year: '2024', href: '/post/nomos-class-action' },
    ],
  },
];

function RsvpButton() {
  return (
    <a
      href={RSVP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-mono uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
    >
      RSVP
    </a>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-10">
      <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
      <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
    </div>
  );
}

const h2 = 'text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4';
const p = 'text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed';

export default function InvitePage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
      <Link
        href="/"
        className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        ← Home
      </Link>

      <header className="mt-6 mb-10">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Center Study Research and Design · Fall 2026
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white">
          Writing Companies into Existence
        </h1>
        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
          A reading and writing group in two sessions, on Zoom —{' '}
          <span className="text-gray-900 dark:text-white font-medium">15 &amp; 22 November 2026</span>.
        </p>
        <div className="mt-6">
          <RsvpButton />
        </div>
      </header>

      <Divider />

      <section>
        <h2 className={h2}>Introduction</h2>
        <blockquote className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 mb-6">
          <p className="text-[15px] italic text-gray-600 dark:text-gray-400 leading-relaxed">
            Center Study and Anthropomorphics are two sides of the same coin and have a kind of
            Möbius-strip character, or a relationship like that between the duck and the rabbit in
            the drawing that drew Wittgenstein&rsquo;s attention. If you do &ldquo;enough&rdquo;
            Center Study you&rsquo;ll find yourself anthropomorphizing, and vice versa.
          </p>
          <footer className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            — Dennis Bouvard,{' '}
            <a
              href="https://dennisbouvard.substack.com/p/anthropomorphics"
              className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
            >
              &ldquo;Anthropomorphics&rdquo;
            </a>
          </footer>
        </blockquote>
        <p className={p}>
          This reading and writing group will oscillate between Center Study and Anthropomorphics:
          between research and design, between reading and writing, between discovery and creation,
          between hypothesis and practice. The group itself should become a tentative model for the
          kind of thinking, products, projects, and writing that Center Study and Anthropomorphics
          can generate.
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

      <Divider />

      <section>
        <h2 className={h2}>Preparation</h2>
        <p className={p}>
          We will be working with the vocabulary of{' '}
          <a
            href="https://app.notion.com/p/Mining-the-Gaps-99110453eed540bb94af6e88274be7c8?pvs=25"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            Mining the Gaps
          </a>
          , which is required reading before the first session. Participants are also expected to be
          familiar with Dennis Bouvard&rsquo;s{' '}
          <a
            href="https://amazon.com/dp/0648690571"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            Anthropomorphics: An Originary Grammar of the Center
          </a>{' '}
          and with the{' '}
          <Link
            href="/browse/substack"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            Substack archive
          </Link>{' '}
          at the Center Study Center.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className={h2}>Schedule of Readings</h2>
        <div className="space-y-6">
          {SESSIONS.map((s) => (
            <div key={s.n} className="flex gap-5">
              <div className="flex-shrink-0 w-24">
                <p className="text-xs font-mono uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Session {s.n}
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">{s.date}</p>
              </div>
              <ul className="space-y-1.5">
                {s.readings.map((r) => (
                  <li key={r.href} className="text-[15px] leading-relaxed">
                    <Link
                      href={r.href}
                      className="text-gray-900 dark:text-white underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:decoration-gray-500"
                    >
                      {r.title}
                    </Link>{' '}
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      Bouvard ({r.year})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section>
        <h2 className={h2}>The Proposal</h2>
        <blockquote className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 mb-6">
          <p className="text-[15px] italic text-gray-600 dark:text-gray-400 leading-relaxed">
            [T]hey must first be located in companies adjunct to the government (central
            intelligence) which are in the business of converting assets into data, i.e., mapping
            out the existing credit system for the sake of simulation and prediction. There&rsquo;s
            nothing more important, and really nothing else than, imagining and building such
            companies.
          </p>
          <footer className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            — Dennis Bouvard,{' '}
            <Link
              href="/post/credit-and-succession"
              className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
            >
              &ldquo;Credit and Succession&rdquo;
            </Link>
          </footer>
        </blockquote>
        <p className={p}>
          Participants will propose companies that draw on specialized databases, search engines and
          AIs. The point is to make company creation a habit: if you identify a social
          &ldquo;problem,&rdquo; or desideratum, your observation only gains credit if a company can
          be built to address it. It shifts discourse completely away from &ldquo;rights&rdquo; and
          building &ldquo;coalitions&rdquo; to petition governments, etc. It changes political
          language. If someone says, &ldquo;but what do we do about the NGOs&rdquo; — OK, what kind
          of company could neutralize the NGOs (perhaps through lawsuits, perhaps through exposure
          of funding links and donors, etc.)? And then there would be companies generating new ideas
          for companies, maybe for prospective investors.
        </p>
        <p className={`${p} mt-4`}>
          For source material, see{' '}
          <Link
            href="/companies"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            On Companies
          </Link>
          : 850 passages on companies drawn from 284 Center Study texts, sorted by theme, including
          data security, monopoly, and starting companies.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className={h2}>A Note on Vocabulary</h2>
        <p className={p}>
          Center Study is full of new vocabulary and idioms that will be unfamiliar at first. When
          you meet one, consult the{' '}
          <Link
            href="/concepts/glossary"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            Center Study glossary
          </Link>{' '}
          or use the{' '}
          <Link
            href="/search"
            className="underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-white"
          >
            search
          </Link>{' '}
          at center.study.
        </p>
      </section>

      <Divider />

      <section className="mb-4">
        <h2 className={h2}>RSVP</h2>
        <p className={`${p} mb-6`}>If you are able to accept this invitation, please complete the form.</p>
        <RsvpButton />
      </section>
    </main>
  );
}
