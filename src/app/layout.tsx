import type { Metadata } from "next";
import { Archivo, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";
import PrintLightMode from "@/components/PrintLightMode";
import ConvertTracker from "@/components/ConvertTracker";
import ActivityTracker from "@/components/ActivityTracker";
import SiteNav from "@/components/SiteNav";
import AccountSync from "@/components/AccountSync";
import { Analytics } from "@vercel/analytics/next";

// Interface face. Archivo is a grotesque in the family of the Avalon deck's
// Helvetica caps — the site and the slides share one identity.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Real monospace, for code only (the font-mono utility maps to Archivo —
// see globals.css).
const geistMono = Geist_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

// Source Serif 4: every title and all reading text. Low stroke contrast, so
// titles stay clean at display sizes; optical sizing keeps 13px captions crisp.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
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
      className={`${archivo.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Initialise the ONE theme model (normal|sepia|night) before first
            paint — mirrors src/lib/theme.ts applyTheme: .dark is DERIVED
            (night ⇔ dark), never independent, so a half-dark state cannot
            survive a reload. Legacy csc-dark-mode=true migrates to night. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var de=document.documentElement;var rm=localStorage.getItem('csc-reading-mode');if(rm!=='sepia'&&rm!=='night'){rm=localStorage.getItem('csc-dark-mode')==='true'?'night':'normal';}if(rm==='sepia'||rm==='night'){de.setAttribute('data-reading-mode',rm);}de.classList.toggle('dark',rm==='night');localStorage.setItem('csc-reading-mode',rm);localStorage.setItem('csc-dark-mode',String(rm==='night'));}catch(e){}})();`,
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
      {/* Ground colors come from the theme vars so all THREE modes (normal /
          sepia / night) color the whole page, not just post prose. */}
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] pb-16 sm:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gray-900 focus:text-white dark:focus:bg-white dark:focus:text-gray-900 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <SiteNav />
        <div id="main-content" tabIndex={-1} className="contents">
          {children}
        </div>
        <footer className="block border-t-2 border-gray-900 dark:border-gray-200 mt-auto print:hidden">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <a
              href="https://center.study"
              className="font-serif text-base font-semibold text-gray-900 dark:text-white hover:opacity-70 transition-opacity flex-shrink-0"
            >
              Center Study Center
            </a>
            {/* Deliberately spare (owner direction, 2026-10): the nav carries
                the site's doors; the footer carries only identity, About, and
                the follow links. */}
            <div className="flex items-center gap-x-5 gap-y-1 flex-wrap">
              <Link href="/idioms"  className="text-sm py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Idiom archive</Link>
              <Link href="/about"   className="text-sm py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
              <a
                href="https://dennisbouvard.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                New essays — Substack
              </a>
              <a
                href="https://x.com/centerstudy_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                X
              </a>
            </div>
          </div>
        </footer>
        <MobileNav />
        <CommandPalette />
        <PrintLightMode />
        <ConvertTracker />
        <ActivityTracker />
        <AccountSync />
        <Analytics />
      </body>
    </html>
  );
}
