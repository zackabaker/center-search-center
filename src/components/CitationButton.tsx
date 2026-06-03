'use client';
import { useState } from 'react';

interface CitationProps {
  title: string;
  date: string | null;
  source: string;
  url?: string;
  slug: string;
}

function formatDate(dateStr: string | null): { year: string; full: string } {
  if (!dateStr) return { year: 'n.d.', full: 'n.d.' };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { year: dateStr, full: dateStr };
  const year = d.getFullYear().toString();
  const full = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return { year, full };
}

function sourceLabel(source: string): string {
  const labels: Record<string, string> = {
    substack: 'Center Study Center',
    gablog: 'Center Study Blog',
    book: 'Anthropomorphics',
    pdf: 'Anthropoetics',
    reddit: 'Reddit',
  };
  return labels[source] || source;
}

export default function CitationButton({ title, date, source, url, slug }: CitationProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const { year, full: fullDate } = formatDate(date);
  const siteUrl = `https://center.study/post/${slug}`;
  const externalUrl = url || siteUrl;
  const publisher = sourceLabel(source);

  // Katz and Bouvard are the same author using two pen names:
  // "Adam Katz" on the blog; "Dennis Bouvard" on Substack/PDFs.
  const authorFull  = source === 'substack' ? 'Bouvard, Dennis' : 'Katz, Adam';
  const authorShort = source === 'substack' ? 'Bouvard, D.' : 'Katz, A.';

  const citations = {
    Chicago: `${authorFull}. "${title}." ${publisher}, ${fullDate}. ${externalUrl}.`,
    MLA: `${authorFull}. "${title}." ${publisher}, ${fullDate}, ${externalUrl}.`,
    APA: `${authorShort} (${year}). ${title}. ${publisher}. ${externalUrl}`,
    BibTeX: `@misc{${authorFull.split(',')[0].toLowerCase()}${year}_${slug.replace(/^(gablog|substack|pdf|book|reddit|twitter)-/, '').slice(0, 20).replace(/-/g, '_')},\n  author       = {${authorFull}},\n  title        = {{${title}}},\n  year         = {${year}},\n  howpublished = {\\url{${externalUrl}}},\n  note         = {${publisher}}\n}`,
    Permalink: siteUrl,
  };

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors print:hidden"
        title="Generate citation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Cite
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">Cite this post</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {(Object.entries(citations) as [string, string][]).map(([style, text]) => (
                <div key={style}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{style}</span>
                    <button
                      onClick={() => copy(style, text)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        copied === style
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {copied === style ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono leading-relaxed break-all">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
