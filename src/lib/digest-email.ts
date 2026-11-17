// The weekly digest, by email — optional. It sends only when a mail provider
// key exists: RESEND_API_KEY (resend.com) and DIGEST_EMAIL_TO (where to send
// it). DIGEST_EMAIL_FROM is optional; Resend's shared sender works for mail
// to the account's own address. Without the key this is a quiet no-op and
// the digest simply waits on the console.
import type { Digest } from './analytics-digest';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const digestEmailConfigured = (): boolean =>
  !!process.env.RESEND_API_KEY && !!process.env.DIGEST_EMAIL_TO;

/** True when the provider accepted the message. Never throws. */
export async function sendDigestEmail(d: Digest): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.DIGEST_EMAIL_TO;
  if (!key || !to) return false;
  const stats = d.stats
    .map((s) => {
      const p = s.prev > 0 ? Math.round(((s.cur - s.prev) / s.prev) * 100) : null;
      return `${esc(s.label)} <b>${s.cur.toLocaleString('en-US')}</b>${p !== null ? ` (${p > 0 ? '+' : ''}${p}%)` : ''}`;
    })
    .join(' &nbsp;·&nbsp; ');
  const html =
    `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.5;color:#111;max-width:560px">` +
    `<p style="font-size:13px;color:#666;margin:0 0 12px">center.study — week to ${esc(d.week)}</p>` +
    `<p style="margin:0 0 14px">${stats}</p>` +
    `<ul style="padding-left:18px;margin:0 0 16px">${d.lines.map((l) => `<li style="margin-bottom:6px">${esc(l)}</li>`).join('')}</ul>` +
    `<p style="font-size:13px"><a href="https://center.study/analytics">Open the console →</a></p></div>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.DIGEST_EMAIL_FROM || 'center.study <onboarding@resend.dev>',
        to: [to],
        subject: `center.study — week to ${d.week}`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
