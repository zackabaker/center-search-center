import type { Metadata } from 'next';
import Link from 'next/link';

// Shareable seminar invitation — deliberately unlisted: not in the sitemap,
// meta-noindex (same treatment as /study; a robots.txt disallow line would
// only advertise the URL). Share scrapers still unfurl the OG card.
//
// Design: a faithful web rendering of the LaTeX syllabus PDF (served at
// /writing-companies-into-existence.pdf) — centered article header, numbered
// sections, schedule table, bracketed citations, numbered references. Serif
// throughout; the document IS the design.
export const metadata: Metadata = {
  title: 'Writing Companies into Existence',
  description:
    'Center Study Research and Design Syllabus, Fall 2026. Two sessions on Zoom, 15 & 22 November — reading between Center Study and Anthropomorphics, culminating in a proposal for a new company.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://center.study/invite' },
  openGraph: {
    title: 'Writing Companies into Existence',
    description:
      'Center Study Research and Design Syllabus, Fall 2026. Two sessions on Zoom, 15 & 22 November.',
    url: 'https://center.study/invite',
    type: 'website',
  },
};

const RSVP_URL = 'https://tally.so/r/gba7l1';

// Numbered references, exactly as in the PDF.
const REFERENCES: { n: number; body: React.ReactNode }[] = [
  {
    n: 1,
    body: (
      <>
        D. Bouvard. &ldquo;Anthropomorphics.&rdquo; Substack.{' '}
        <a href="https://dennisbouvard.substack.com/p/anthropomorphics" className="ref-link">
          dennisbouvard.substack.com/p/anthropomorphics
        </a>
      </>
    ),
  },
  {
    n: 2,
    body: (
      <>
        <em>Mining the Gaps</em>. Notion.{' '}
        <a
          href="https://app.notion.com/p/Mining-the-Gaps-99110453eed540bb94af6e88274be7c8?pvs=25"
          className="ref-link"
        >
          app.notion.com/p/Mining-the-Gaps
        </a>
      </>
    ),
  },
  {
    n: 3,
    body: (
      <>
        D. Bouvard. <em>Anthropomorphics: An Originary Grammar of the Center</em>. 2020.{' '}
        <a href="https://amazon.com/dp/0648690571" className="ref-link">
          amazon.com/dp/0648690571
        </a>
      </>
    ),
  },
  {
    n: 4,
    body: (
      <>
        Center Study Center. Substack archive.{' '}
        <Link href="/browse/substack" className="ref-link">
          center.study/browse/substack
        </Link>
      </>
    ),
  },
  {
    n: 5,
    body: (
      <>
        D. Bouvard. &ldquo;Credit and Succession.&rdquo; Center Study Center, 31 August 2025.{' '}
        <Link href="/post/credit-and-succession" className="ref-link">
          center.study/post/credit-and-succession
        </Link>
      </>
    ),
  },
  {
    n: 6,
    body: (
      <>
        D. Bouvard. &ldquo;Data Exchange.&rdquo; Center Study Center, 23 September 2023.{' '}
        <Link href="/post/data-exchange" className="ref-link">
          center.study/post/data-exchange
        </Link>
      </>
    ),
  },
  {
    n: 7,
    body: (
      <>
        D. Bouvard. &ldquo;Learncoin.&rdquo; Center Study Center, 21 March 2024.{' '}
        <Link href="/post/learncoin" className="ref-link">
          center.study/post/learncoin
        </Link>
      </>
    ),
  },
  {
    n: 8,
    body: (
      <>
        D. Bouvard. &ldquo;Thirdness.&rdquo; Center Study Center, 2 December 2023.{' '}
        <Link href="/post/thirdness" className="ref-link">
          center.study/post/thirdness
        </Link>
      </>
    ),
  },
  {
    n: 9,
    body: (
      <>
        D. Bouvard. &ldquo;Nomos/Class Action.&rdquo; Center Study Center, 12 September 2024.{' '}
        <Link href="/post/nomos-class-action" className="ref-link">
          center.study/post/nomos-class-action
        </Link>
      </>
    ),
  },
  {
    n: 10,
    body: (
      <>
        Center Study Center. <em>On Companies</em>.{' '}
        <Link href="/companies" className="ref-link">
          center.study/companies
        </Link>
      </>
    ),
  },
  {
    n: 11,
    body: (
      <>
        Center Study Center. Glossary.{' '}
        <Link href="/concepts/glossary" className="ref-link">
          center.study/concepts/glossary
        </Link>
      </>
    ),
  },
];

// Bracketed in-text citation, linked to its entry in the references list.
function Ref({ n }: { n: number }) {
  return (
    <a href={`#ref-${n}`} className="no-underline text-gray-500 dark:text-gray-400">
      &nbsp;[{n}]
    </a>
  );
}

function SectionHead({ n, children }: { n?: number; children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-[1.35rem] font-bold text-gray-900 dark:text-white mt-10 mb-4">
      {n !== undefined && <span className="mr-3">{n}</span>}
      {children}
    </h2>
  );
}

const p =
  'font-serif text-[16.5px] text-gray-800 dark:text-gray-200 leading-[1.75] mt-4 [hyphens:auto] sm:text-justify';

export default function InvitePage() {
  return (
    <main className="max-w-2xl w-full mx-auto px-5 py-10 sm:py-16">
      {/* Inline style for reference links: serif, quiet underline, wraps long URLs */}
      <style>{`.ref-link { text-decoration: underline; text-decoration-color: rgb(209 213 219); text-underline-offset: 3px; overflow-wrap: anywhere; } .dark .ref-link { text-decoration-color: rgb(75 85 99); } .ref-link:hover { text-decoration-color: currentColor; }`}</style>

      {/* ── Article header, as in the PDF ── */}
      <header className="text-center">
        <h1 className="font-serif text-[1.9rem] sm:text-[2.3rem] font-bold leading-tight text-gray-900 dark:text-white text-balance">
          Writing Companies into Existence
        </h1>
        <p className="font-serif text-[17px] text-gray-700 dark:text-gray-300 mt-4">
          Center Study Research and Design Syllabus, Fall 2026
        </p>
        <p className="font-serif text-[16px] text-gray-600 dark:text-gray-400 mt-2">
          Two sessions on Zoom · 15 &amp; 22 November 2026
        </p>
      </header>

      <hr className="border-gray-200 dark:border-gray-800 mt-8" />

      {/* ── 1 Introduction ── */}
      <section>
        <SectionHead n={1}>Introduction</SectionHead>
        <blockquote className="font-serif text-[15.5px] italic text-gray-700 dark:text-gray-300 leading-[1.7] mx-6 sm:mx-10 my-5">
          Center Study and Anthropomorphics are two sides of the same coin and have a kind of
          Möbius-strip character, or a relationship like that between the duck and the rabbit in the
          drawing that drew Wittgenstein&rsquo;s attention. If you do &ldquo;enough&rdquo; Center
          Study you&rsquo;ll find yourself anthropomorphizing, and vice versa.
          <footer className="not-italic text-[14.5px] text-gray-500 dark:text-gray-400 mt-2">
            Dennis Bouvard, &ldquo;Anthropomorphics&rdquo;
            <Ref n={1} />
          </footer>
        </blockquote>
        <p className={p}>
          This reading and writing group will oscillate between Center Study and Anthropomorphics:
          between research and design, between reading and writing, between discovery and creation,
          between hypothesis and practice. The group itself should become a tentative model for the
          kind of thinking, products, projects, and writing that Center Study and Anthropomorphics
          can generate.
        </p>
        <p className={p}>
          The group is meant as a model of practice: an attempt to forge a new disciplinary space
          grounded in the idioms of Center Study, with a specific skew toward the creation and
          maintenance of sovereign companies, that is, companies that will ultimately become clients
          of a single sovereign data-security monopoly.
        </p>
        <p className={p}>
          The seminar culminates in a writing project: each participant proposes at least one new
          company. Each is a sovereign company, one that addresses an &ldquo;issue&rdquo; in the
          social order and in doing so mends, fortifies, and profitably maintains sovereignty.
        </p>
      </section>

      {/* ── 2 Preparation ── */}
      <section>
        <SectionHead n={2}>Preparation</SectionHead>
        <p className={p}>
          We will be working with the vocabulary of <em>Mining the Gaps</em>
          <Ref n={2} />, which is required reading before the first session. Participants are also
          expected to be familiar with Dennis Bouvard&rsquo;s{' '}
          <em>Anthropomorphics: An Originary Grammar of the Center</em>
          <Ref n={3} /> and with the Substack archive at the Center Study Center
          <Ref n={4} />.
        </p>
      </section>

      {/* ── 3 Schedule of Readings ── */}
      <section>
        <SectionHead n={3}>Schedule of Readings</SectionHead>
        <div className="overflow-x-auto mt-5">
        <table className="w-full min-w-[480px] font-serif text-[15.5px] text-gray-800 dark:text-gray-200 border-collapse">
          <thead>
            <tr className="border-y border-gray-300 dark:border-gray-700">
              <th className="text-left font-bold py-2 pr-3">Session</th>
              <th className="text-left font-bold py-2 pr-3">Date</th>
              <th className="text-left font-bold py-2 pr-3">Reading</th>
              <th className="text-left font-bold py-2">Author</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2.5 pr-3 align-top" rowSpan={2}>
                1
              </td>
              <td className="py-2.5 pr-3 align-top" rowSpan={2}>
                15 November
              </td>
              <td className="py-2.5 pr-3">
                <Link href="/post/data-exchange" className="ref-link">
                  Data Exchange
                </Link>
                <Ref n={6} />
              </td>
              <td className="py-2.5 whitespace-nowrap">Bouvard (2023)</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <td className="pb-2.5 pr-3">
                <Link href="/post/learncoin" className="ref-link">
                  Learncoin
                </Link>
                <Ref n={7} />
              </td>
              <td className="pb-2.5 whitespace-nowrap">Bouvard (2024)</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-3 align-top" rowSpan={2}>
                2
              </td>
              <td className="py-2.5 pr-3 align-top" rowSpan={2}>
                22 November
              </td>
              <td className="py-2.5 pr-3">
                <Link href="/post/thirdness" className="ref-link">
                  Thirdness
                </Link>
                <Ref n={8} />
              </td>
              <td className="py-2.5 whitespace-nowrap">Bouvard (2023)</td>
            </tr>
            <tr className="border-b border-gray-300 dark:border-gray-700">
              <td className="pb-2.5 pr-3">
                <Link href="/post/nomos-class-action" className="ref-link">
                  Nomos/Class Action
                </Link>
                <Ref n={9} />
              </td>
              <td className="pb-2.5 whitespace-nowrap">Bouvard (2024)</td>
            </tr>
          </tbody>
        </table>
        </div>
      </section>

      {/* ── 4 The Proposal ── */}
      <section>
        <SectionHead n={4}>The Proposal</SectionHead>
        <blockquote className="font-serif text-[15.5px] italic text-gray-700 dark:text-gray-300 leading-[1.7] mx-6 sm:mx-10 my-5">
          [T]hey must first be located in companies adjunct to the government (central intelligence)
          which are in the business of converting assets into data, i.e., mapping out the existing
          credit system for the sake of simulation and prediction. There&rsquo;s nothing more
          important, and really nothing else than, imagining and building such companies.
          <footer className="not-italic text-[14.5px] text-gray-500 dark:text-gray-400 mt-2">
            Dennis Bouvard, &ldquo;Credit and Succession&rdquo;
            <Ref n={5} />
          </footer>
        </blockquote>
        <p className={p}>
          Participants will propose companies that draw on specialized databases, search engines and
          AIs. The point is to make company creation a habit: if you identify a social
          &ldquo;problem,&rdquo; or desideratum, your observation only gains credit if a company can
          be built to address it. It shifts discourse completely away from &ldquo;rights&rdquo; and
          building &ldquo;coalitions&rdquo; to petition governments, etc. It changes political
          language. If someone says, &ldquo;but what do we do about the NGOs&rdquo;—Ok, what kind of
          company could neutralize the NGOs (perhaps through lawsuits, perhaps through exposure of
          funding links and donors, etc.)? And then there would be companies generating new ideas
          for companies, maybe for prospective investors.
        </p>
        <p className={p}>
          For source material, see <em>On Companies</em>
          <Ref n={10} />: 850 passages on companies drawn from 284 Center Study texts, sorted by
          theme, including data security, monopoly, and starting companies.
        </p>
      </section>

      {/* ── A Note on Vocabulary ── */}
      <section>
        <SectionHead>A Note on Vocabulary</SectionHead>
        <p className={p}>
          Center Study is full of new vocabulary and idioms that will be unfamiliar at first. When
          you meet one, consult the Center Study glossary
          <Ref n={11} /> or use the search at center.study.
        </p>
      </section>

      {/* ── RSVP ── */}
      <section>
        <SectionHead>RSVP</SectionHead>
        <p className={p}>
          If you are able to accept this invitation, please complete the form at{' '}
          <a href={RSVP_URL} target="_blank" rel="noopener noreferrer" className="ref-link">
            tally.so/r/gba7l1
          </a>
          .
        </p>
      </section>

      {/* ── References ── */}
      <section>
        <SectionHead>References</SectionHead>
        <ol className="mt-4 space-y-2">
          {REFERENCES.map((r) => (
            <li
              key={r.n}
              id={`ref-${r.n}`}
              className="font-serif text-[14.5px] text-gray-700 dark:text-gray-300 leading-[1.6] flex gap-2 scroll-mt-20"
            >
              <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">[{r.n}]</span>
              <span>{r.body}</span>
            </li>
          ))}
        </ol>
      </section>

      <hr className="border-gray-200 dark:border-gray-800 mt-12" />

      <p className="text-center mt-6 font-serif text-[14px] text-gray-500 dark:text-gray-400">
        <a href="/writing-companies-into-existence.pdf" className="ref-link">
          PDF version
        </a>
        <span className="mx-3 text-gray-300 dark:text-gray-600">·</span>
        <Link href="/" className="ref-link">
          Center Study Center
        </Link>
      </p>
    </main>
  );
}
