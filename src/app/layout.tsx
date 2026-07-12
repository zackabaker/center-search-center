import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";
import SiteNav from "@/components/SiteNav";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Lora: elegant serif designed for screen reading — used for all long-form prose.
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Without this, OG/twitter image URLs resolve against localhost in
  // some environments (next build warns about exactly this).
  metadataBase: new URL("https://center.study"),
  title: {
    default: "Center Study Center",
    template: "%s | Center Study Center",
  },
  description:
    "The Adam Katz (Dennis Bouvard) archive — Center Study writings on originary thinking, the center, deferral, and sovereignty, with Eric Gans's Chronicles and Anthropoetics as reference. 1,900+ texts, full-text search.",
  keywords: [
    "Adam Katz",
    "Dennis Bouvard",
    "Center Study",
    "Eric Gans",
    "Generative Anthropology",
    "originary hypothesis",
    "originary scene",
    "Anthropomorphics",
    "deferral",
    "the center",
    "originary grammar",
    "GABlog",
  ],
  authors: [{ name: "Adam Katz" }, { name: "Dennis Bouvard" }],
  openGraph: {
    title: "Center Study Center",
    description:
      "The Adam Katz (Dennis Bouvard) archive — originary thinking, the center, deferral, sovereignty; with Eric Gans's Chronicles as reference.",
    type: "website",
    url: "https://center.study",
    siteName: "Center Study Center",
  },
  twitter: {
    card: "summary_large_image",
    title: "Center Study Center",
    description:
      "The Adam Katz / Dennis Bouvard archive. 1,900+ texts (with Gans reference material), full-text search, AI Q&A.",
  },
  // Search Console + Bing Webmaster verification. Set the tokens as Vercel env
  // vars (GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION) — no code change needed.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : {},
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Initialise dark mode AND reading mode (sepia/night) before first paint
            to avoid flash — mirrors ReadingControls.applyMode. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var de=document.documentElement;var rm=localStorage.getItem('csc-reading-mode');if(rm==='sepia'||rm==='night'){de.setAttribute('data-reading-mode',rm);if(rm==='night')de.classList.add('dark');}else if(localStorage.getItem('csc-dark-mode')==='true'){de.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {/* RSS feed autodiscovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Center Study Center"
          href="https://center.study/feed.xml"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#111111] text-gray-900 dark:text-[#e8e8e8] pb-16 sm:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gray-900 focus:text-white dark:focus:bg-white dark:focus:text-gray-900 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <SiteNav />
        <div id="main-content" className="contents">
          {children}
        </div>
        <footer className="block border-t border-gray-100 dark:border-gray-800 mt-auto print:hidden">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <a
              href="https://center.study"
              className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors font-medium flex-shrink-0"
            >
              Center Study Center
            </a>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/intro"   className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Introduction</Link>
              <Link href="/guide"   className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Guide</Link>
              <Link href="/browse"  className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Archive</Link>
              <Link href="/concepts?view=glossary" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Glossary</Link>
              <Link href="/generative-anthropology" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Generative Anthropology</Link>
              <Link href="/about"   className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">About</Link>
              <Link href="/faq"     className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">FAQ</Link>
              <Link href="/ask"     className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Ask AI</Link>
              <Link href="/answers" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Answers</Link>
              <Link href="/new" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">New</Link>
              <Link href="/trending" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Trending</Link>
              <Link href="/download" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Download</Link>
              <Link href="/verify" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Verify a Quote</Link>
              <span className="text-gray-200 dark:text-gray-800">·</span>
              <a
                href="https://dennisbouvard.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 dark:text-gray-600 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Substack ↗
              </a>
              <a
                href="https://x.com/centerstudy_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                X ↗
              </a>
              <a
                href="/feed.xml"
                className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                title="RSS feed"
              >
                RSS
              </a>
            </div>
          </div>
          {/* Collections row — the per-source hubs and authors, site-wide (the
              homepage is a front door, not a portal; link equity lives here).
              Katz collections first; the Gans reference tier labeled after. */}
          <div className="max-w-5xl mx-auto px-4 pb-3 -mt-1 flex items-center gap-x-4 gap-y-1 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-300 dark:text-gray-700">Collections</span>
            {[
              { href: '/browse/substack',  label: 'Substack' },
              { href: '/browse/gablog',    label: 'GABlog' },
              { href: '/browse/book',      label: 'Anthropomorphics' },
              { href: '/browse/pdf',       label: 'Essays & Articles' },
              { href: '/browse/threads',   label: 'Threads & Q&A' },
              { href: '/lectures',         label: 'Lectures' },
              { href: '/author/katz',      label: 'Adam Katz' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-[11px] text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                {label}
              </Link>
            ))}
            <span className="text-[11px] font-mono uppercase tracking-widest text-gray-300 dark:text-gray-700 ml-2">Reference</span>
            {[
              { href: '/browse/chronicle', label: 'Chronicles' },
              { href: '/browse/ap',        label: 'Anthropoetics' },
              { href: '/author/gans',      label: 'Eric Gans' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-[11px] text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </footer>
        <MobileNav />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
