import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";
import PrintLightMode from "@/components/PrintLightMode";
import ConvertTracker from "@/components/ConvertTracker";
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
        <footer className="block border-t border-gray-100 dark:border-gray-800 mt-auto print:hidden">
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <a
              href="https://center.study"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium flex-shrink-0"
            >
              Center Study Center
            </a>
            {/* Deliberately spare (owner direction, 2026-10): the nav carries
                the site's doors; the footer carries only identity, About, and
                the follow links. */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/about"   className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">About</Link>
              <a
                href="https://dennisbouvard.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                New essays — Substack ↗
              </a>
              <a
                href="https://x.com/centerstudy_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                X ↗
              </a>
              <a
                href="/feed.xml"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="RSS feed"
              >
                RSS
              </a>
            </div>
          </div>
        </footer>
        <MobileNav />
        <CommandPalette />
        <PrintLightMode />
        <ConvertTracker />
        <Analytics />
      </body>
    </html>
  );
}
