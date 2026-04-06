import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "Searchable archive of the complete Center Study corpus — Bouvard/Katz's Substack and blog, Gans's Anthropomorphics, and key PDFs. 700+ texts on originary thinking.",
  keywords: [
    "Center Study",
    "Eric Gans",
    "Bouvard/Katz",
    "originary hypothesis",
    "originary scene",
    "Anthropomorphics",
    "deferral",
  ],
  openGraph: {
    title: "Center Study Center",
    description:
      "Searchable archive of 700+ texts in the Center Study tradition",
    type: "website",
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
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-[#111111] text-gray-900 dark:text-[#e8e8e8]">
        {children}
      </body>
    </html>
  );
}
