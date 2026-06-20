import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import MobileNav from "@/components/MobileNav";
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
    "Complete searchable archive of Adam Katz and Dennis Bouvard's Center Study writings — 700+ texts on originary thinking, the center, deferral, sovereignty, and the human sciences.",
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
      "Complete searchable archive of Adam Katz and Dennis Bouvard's Center Study writings — originary thinking, the center, deferral, sovereignty.",
    type: "website",
    url: "https://center.study",
    siteName: "Center Study Center",
  },
  twitter: {
    card: "summary_large_image",
    title: "Center Study Center",
    description:
      "Complete archive of Adam Katz / Dennis Bouvard's Center Study writings. 700+ texts, full-text search, AI Q&A.",
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
        {/* Initialise dark mode before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('csc-dark-mode')==='true'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
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
        <footer className="hidden sm:block border-t border-gray-100 dark:border-gray-800 mt-auto print:hidden">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <a
              href="https://center.study"
              className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors font-medium flex-shrink-0"
            >
              Center Study Center
            </a>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/intro"   className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Start</Link>
              <Link href="/guide"   className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Guide</Link>
              <Link href="/browse"  className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Archive</Link>
              <Link href="/concepts?view=glossary" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Glossary</Link>
              <Link href="/guide/map" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Concept Map</Link>
              <Link href="/ask"     className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Ask AI</Link>
              <Link href="/download" className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Download</Link>
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
        </footer>
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
