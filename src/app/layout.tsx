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
    default: "Center Search Center",
    template: "%s | Center Search Center",
  },
  description:
    "Searchable archive of Dennis Bouvard's Center Study Center (Substack), GABlog, and Anthropomorphics. Full-text search across 700+ posts on Generative Anthropology.",
  keywords: [
    "Generative Anthropology",
    "Eric Gans",
    "Dennis Bouvard",
    "Center Study Center",
    "originary hypothesis",
    "GABlog",
    "Anthropomorphics",
  ],
  openGraph: {
    title: "Center Search Center",
    description:
      "Searchable archive of 700+ posts on Generative Anthropology",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
