import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import SiteNav from "@/components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
    card: "summary",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        <SiteNav />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
