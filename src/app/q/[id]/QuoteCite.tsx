'use client';

import { useState } from 'react';
import { citationAuthor, citationVenue, citationDate, bibtexKey } from '@/lib/citation';

// Copy affordances for the canonical quote page — /verify tells scholars to
// cite these URLs, so the page must complete the workflow: quote + citation
// in one click, BibTeX in another.
export default function QuoteCite({
  text,
  author,
  sourceTitle,
  source,
  date,
  id,
}: {
  text: string;
  author: string;
  sourceTitle: string;
  source: string;
  date: string | null;
  id: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const a = citationAuthor(author);
  const { year, full } = citationDate(date);
  const url = `https://center.study/q/${id}`;

  const doCopy = async (key: string, payload: string) => {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  const quoteWithCitation = `“${text}”\n— ${author}, “${sourceTitle},” ${citationVenue(source)}, ${full}. ${url}`;
  const bibtex = `@misc{${bibtexKey(a.key, year, id)},\n  author       = {${a.full}},\n  title        = {{Quotation from “${sourceTitle}”}},\n  year         = {${year}},\n  howpublished = {\\url{${url}}},\n  note         = {${citationVenue(source)}; verbatim-verified, Center Study Corpus v1.0}\n}`;

  const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors';

  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={() => doCopy('cite', quoteWithCitation)} className={btn}>
        {copied === 'cite' ? <span className="text-green-600 dark:text-green-400">Copied</span> : 'Copy quote + citation'}
      </button>
      <button onClick={() => doCopy('bibtex', bibtex)} className={btn}>
        {copied === 'bibtex' ? <span className="text-green-600 dark:text-green-400">Copied</span> : 'BibTeX'}
      </button>
    </span>
  );
}
