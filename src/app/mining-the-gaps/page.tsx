import type { Metadata } from 'next';
import Link from 'next/link';
import SceneMark from '@/components/SceneMark';

// Standalone essay by the site's editor — rendered in the standard post layout
// (chip row, serif title, byline, scene-mark rule, 65ch Lora prose) so it reads
// exactly like the archive's essays, without being part of the corpus itself.
export const metadata: Metadata = {
  title: 'Mining the Gaps',
  description:
    'There are no startup ideas, but only requests for startups. Zack Baker on sovereignty gaps, requests from the center, and founding companies as answers to unaddressed questions.',
  authors: [{ name: 'Zack Baker' }],
  alternates: { canonical: 'https://center.study/mining-the-gaps' },
  openGraph: {
    title: 'Mining the Gaps',
    description:
      'There are no startup ideas, but only requests for startups. On sovereignty gaps, requests from the center, and founding companies as answers to unaddressed questions.',
    url: 'https://center.study/mining-the-gaps',
    type: 'article',
    publishedTime: '2024-07-26',
    authors: ['Zack Baker'],
  },
};

const ARTICLE_LD = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Mining the Gaps',
  author: { '@type': 'Person', name: 'Zack Baker' },
  datePublished: '2024-07-26',
  url: 'https://center.study/mining-the-gaps',
  publisher: { '@type': 'Organization', name: 'Center Study Center', url: 'https://center.study' },
};

// Same inline-link treatment as PostContent's INLINE_LINK_CLASS.
const link =
  'text-blue-600 dark:text-blue-400 underline decoration-1 underline-offset-2 hover:decoration-2 break-words';
const strong = 'font-semibold text-gray-900 dark:text-white';
const h2 = 'font-serif text-2xl font-bold text-gray-900 dark:text-white pt-4';

const WORD_COUNT = 1260;
const READING_TIME = Math.max(1, Math.round(WORD_COUNT / 230));

export default function MiningTheGapsPage() {
  return (
    <main className="max-w-3xl w-full mx-auto px-4 pt-6 pb-24 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_LD) }}
      />
      <article>
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Essay
            </span>
            <span className="text-sm text-gray-400">Jul 26, 2024</span>
            <span className="text-sm text-gray-400">{READING_TIME} min read</span>
            <span className="text-sm text-gray-400 hidden sm:inline">
              {WORD_COUNT.toLocaleString()} words
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4">
            Mining the Gaps
          </h1>
          <p className="text-base text-gray-500 dark:text-gray-400 mb-5">By Zack Baker</p>

          <div className="flex items-center gap-3 mt-7">
            <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
            <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
          </div>
        </header>

        <div
          className="space-y-7 text-gray-800 dark:text-gray-200 max-w-[65ch] mx-auto"
          style={{
            fontFamily: 'var(--prose-font-family)',
            fontSize: 'var(--prose-font-size, 18px)',
            lineHeight: 'var(--prose-line-height, 1.85)',
          }}
        >
          <h2 className={h2}>The Origin of Startups</h2>

          <p>
            <em>There are no startup ideas, but only requests for startups.</em>
          </p>

          <p>
            Like a good sentence or turn of phrase a good startup doesn&rsquo;t pop into existence{' '}
            <em>ex nihilo</em> (although depending on where you are situated in the stack of scenes
            it can seem it does). Startups always emerge{' '}
            <a
              href="https://x.com/AbhayVenkatesh1/status/1816855855549256191"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              on/in scenes
            </a>{' '}
            and begin to spell out answers to questions that have not yet been properly addressed.
          </p>

          <p>
            The scenes always tend to be marginal ones that are easily overlooked but that offer a
            very different perspective on the social order as a whole. The questions you can see
            from these strange scenes then appear as <span className={strong}>sovereignty gaps</span>
            , cracks in the social infrastructures, that are the result of decay or growth in the
            social order that existing institutions cannot contend with. In general, the social
            order &ldquo;works&rdquo; because the most pressing requests are reliably addressed by
            existing institutions. But when new requests arise that cannot be properly answered you
            have a gap in sovereignty, and an opportunity for a startup.
          </p>

          <p>
            You can&rsquo;t found something without first finding something. The first thing a
            founder finds is a fissure, a gap, a foothold that they can step into. The founder is
            the one who first recognizes the opening, hears the &ldquo;squeaky wheel&rdquo; like a
            voice in the wilderness, and provides a tentative answer. At this early stage
            it&rsquo;s always very provisional, and nothing is guaranteed. The best companies are{' '}
            <a
              href="https://x.com/naval/status/1002103723848450049"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              rewarded
            </a>{' '}
            by the social center for not just answering that initializing question but for scaling
            their answer up.
          </p>

          <h2 className={h2}>Scaling Scenes</h2>

          <p>
            In a world of{' '}
            <a
              href="https://x.com/mwilcox/status/1054156118560108544"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              planetary computation
            </a>
            , any infrastructure that cannot scale can be dismissed. The continual articulation of a
            startup over time to address more and &ldquo;deeper&rdquo; questions in the social
            infrastructure (e.g. needing to create employee training facilities, owning their own
            data centers, forging industry standards) means that the question that initially began
            as a tiny fissure in the infrastructure was indeed a rich vein that the company is then
            able to{' '}
            <Link href="/post/data-mining-the-sentence" className={link}>
              mine
            </Link>
            .
          </p>

          <p>
            Every crack in the social order is, however remotely, connected to every other piece of
            the order. Because of that, the grand vision of any ambitious{' '}
            <a
              href="https://x.com/centerstudy_/status/1814408691795267852"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              startup
            </a>{' '}
            must implicitly be something like{' '}
            <a
              href="https://www.gsb.stanford.edu/faculty-research/case-studies/stripe-increasing-gdp-internet"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              global domination
            </a>{' '}
            or at least an interoperability with global sovereignty (central finance and
            intelligence networks). The largest markets will be discovered by finding the hidden
            requests from the center that others haven&rsquo;t noticed: sovereignty gaps that are
            hidden &ldquo;between the lines&rdquo; and that turn out to be more important than
            anyone could have imagined.
          </p>

          <p>
            Think about the way Bitcoin or Amazon &ldquo;appeared&rdquo; <em>ex nihilo</em> to an
            American consumer compared to the way the founders themselves produced an answer to an
            unanswered fissure in the social center. Both Bezos and Satoshi recognized a
            &ldquo;line go up&rdquo; phenomena (&ldquo;line go down&rdquo; phenomena can be just as
            interesting — again, which way the line is going depends on which scene you&rsquo;re
            on) and articulated a solution, and spelled out a{' '}
            <a
              href="https://x.com/rabois/status/870673635375104000"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              formula
            </a>
            , in response.
          </p>

          <p>
            Bezos saw that web usage was growing at 2300% a year in 1994. Satoshi{' '}
            <a
              href="https://x.com/BrianRoemmele/status/1610429362888921091"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              deployed Bitcoin
            </a>{' '}
            as the Great Financial Crisis of &rsquo;08 unfolded. Elon and SpaceX stepped into a
            sovereignty gap opened by the decline of the American Space Program. All of these
            startups became institutions that created new, hyper-reliable infrastructures that were
            ultimately deeply{' '}
            <a
              href="https://www.cnbc.com/2024/07/15/blackrocks-larry-fink-says-hes-a-major-believer-in-bitcoin.html"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              integrated
            </a>{' '}
            <a
              href="https://aws.amazon.com/govcloud-us/"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              back
            </a>{' '}
            <a
              href="https://en.wikipedia.org/wiki/Commercial_Orbital_Transportation_Services"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              into
            </a>{' '}
            the social order itself.
          </p>

          <blockquote className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 italic text-gray-600 dark:text-gray-400">
            Design practices that are unimaginable within existing institutions and yet irresistible
            once introduced. — Dennis Bouvard
          </blockquote>

          <h2 className={h2}>Startup Architecture</h2>

          <p>
            The best startups then are{' '}
            <span className={strong}>responses to requests from the center</span> (the social order
            itself) that the center is currently incapable of addressing. These sovereignty gaps
            manifest in the form of requests and the best founders hear those requests and are able
            to convert that signal coming through the infrastructure into a <em>command</em> (i.e.
            the founder begins issuing orders, first to themselves, and eventually to a team and a
            company) and in doing so creates an architecture.
          </p>

          <p>
            Not unlike Columbus, who sought a charter from a sovereign to embark on his endeavor to
            the Americas, a founder must find/invent their own charter from their own sovereign to
            embark on a coherent project.
          </p>

          <p>
            Properly answering a request from the center requires scaling up: recruiting team
            members and building technology. It&rsquo;s easy to be mystified by technology but the
            history of failure in deep tech and hardware is a testament to putting technical
            development before the request from the center. At the earliest stages getting the
            request right, articulating the commands, and putting together the right team, are the
            key elements to a successful startup. As{' '}
            <a
              href="https://en.wikipedia.org/wiki/John_Boyd_(military_strategist)"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              John Boyd
            </a>{' '}
            (inventor of the OODA loop) stressed: winning wars requires people, ideas, and
            hardware, in that order.
          </p>

          <p>
            The founding demand must be converted into a founding command and further articulated
            as further demands are further converted. As the team becomes fluent in its own idiom,
            it develops a new vocabulary that makes the team indispensable for answering even more
            problems and requests. All of this cultural innovation is contained in the &ldquo;dark
            matter&rdquo; of the company culture and the technological developments it produces
            tend to be downstream of that.{' '}
            <a
              href="https://en.wikipedia.org/wiki/Conway%27s_law"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              Conway&rsquo;s Law
            </a>{' '}
            and{' '}
            <a
              href="https://x.com/DavidSacks/status/1726312998682378446"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              Thiel&rsquo;s Law
            </a>{' '}
            reign alongside Boyd.
          </p>

          <p>
            A well-formed startup is like a well-formed sentence and well-formed sentences answer
            as many questions as possible when they are uttered. Data is always being generated
            from the social order and the founder who can separate the signal from the noise,
            notice a gap in the infrastructure, and properly address it so as to provide data back
            to the center, will succeed. Successful startups become monopolies by succeed-ing. They
            coherently circulate data, team members, technology, etc. within their terms and can
            &ldquo;take in&rdquo; new questions, and new anomalies, at scale. Success is successful
            succession in{' '}
            <a
              href="https://x.com/centerstudy_/status/1803061187447332894"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              perpetuity
            </a>
            .
          </p>

          <p>
            Creating early stage startups is a kind of alchemy and the embryonic startups tend to
            be both fragile and catalytic. They are a tentative &ldquo;solution&rdquo; and if the
            request / demand is not coherent and isn&rsquo;t properly translated into an answer /
            command things can fall apart.
          </p>

          <h2 className={h2}>Getting Started</h2>

          <p>
            So, listen for the demand from the center and convert it into a command to your team.
            The technology will follow as an articulation of this demand-command translation
            project and the startup will become increasingly configured to produce more precise
            responses to more precise demands. The center demands things and the highest agency{' '}
            <a
              href="https://x.com/centerstudy_/status/1811410440460681639"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              startup cultures
            </a>{' '}
            will be the ones that most reliably convert those demands into commands and products
            for distribution.
          </p>

          <p>
            To find a &ldquo;startup idea&rdquo; go hunting for a{' '}
            <span className={strong}>request from the center</span> — a gap in sovereignty that can
            be mined. Think about setting up a mining operation on the social order itself. Google
            mined sovereignty gaps in the web, SpaceX mined sovereignty gaps in the space industry,
            and Anduril mined sovereignty gaps in defense.
          </p>

          <p>
            Find the cracks in the infrastructure, look for the gaps in sovereignty, and keep an
            eye out for simmering crises at all scales. Requests from the center are not unlike the
            voice of God: they can and do come from anywhere. Maybe you&rsquo;re hearing it right
            now. Remember,{' '}
            <a
              href="https://x.com/zackabaker/status/1659602965731373056"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              there is no economy but only the debt to the center
            </a>
            . One of the most productive ways to think these days is in terms of search terms. So
            one search term might be &ldquo;technical debt&rdquo; or &ldquo;social debt&rdquo; in
            the infrastructure that others have yet to notice. Search amidst the housing crisis,
            climate crisis, pension crisis, or fertility crisis, for debts that are going
            &ldquo;unaddressed&rdquo; to varying degrees. The richest veins, and the most valuable
            mines (and memes), have not yet been set up and have yet to be named. Name them. Find
            the debts, mine the gaps, and create the infrastructures that redeem them.
          </p>
        </div>
      </article>

      <div className="max-w-[65ch] mx-auto">
        <div className="flex items-center gap-3 mt-12">
          <SceneMark size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
          <div className="flex-1 border-t border-gray-100 dark:border-gray-800" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Mining the Gaps is the working vocabulary for{' '}
          <Link href="/invite" className={link}>
            Writing Companies into Existence
          </Link>
          , the Fall 2026 Center Study Research and Design seminar. For source material, see{' '}
          <Link href="/companies" className={link}>
            On Companies
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
