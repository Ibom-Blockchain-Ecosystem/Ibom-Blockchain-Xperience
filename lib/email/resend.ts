import { Resend } from "resend";

// Each form notifies whichever real mailbox actually owns that business —
// verified against the team's live mailbox list rather than assumed.
// Partnerships and Contact share one inbox (its display name is "Ibom
// Blockchain Xperience" — it's the de facto general inbox despite the
// address); Ambassador and the Tour "coming soon" signups each have
// their own dedicated, already-active mailbox.
export const PARTNERSHIPS_NOTIFY_EMAIL = process.env.PARTNERSHIPS_NOTIFY_EMAIL ?? "partnerships@ibomblockchain.com";
export const AMBASSADOR_NOTIFY_EMAIL = process.env.AMBASSADOR_NOTIFY_EMAIL ?? "ambassador@ibomblockchain.com";
export const TOUR_NOTIFY_EMAIL = process.env.TOUR_NOTIFY_EMAIL ?? "tour@ibomblockchain.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null; // Email is optional infrastructure — a missing key shouldn't break a form submission.
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "IBX <onboarding@resend.dev>";
}

// Email clients fetch images over the open internet — they can't reach a
// local file or go through Next's image pipeline, so this has to be a
// real, public URL. Using the black logo deliberately: almost every
// email client renders on a white background by default, and the white
// logo would be invisible on it.
function getLogoUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  return `${siteUrl}/brand/ibx-rebrand-black.png`;
}

function wrapEmail(bodyHtml: string) {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
      <div style="padding: 28px 0 22px; text-align: center; border-bottom: 3px solid #f94902;">
        <img src="${getLogoUrl()}" alt="Ibom Blockchain Xperience" width="170" style="display: inline-block; height: auto; max-width: 170px;" />
      </div>
      <div style="padding: 32px 28px; color: #17140f; font-size: 15px; line-height: 1.6;">
        ${bodyHtml}
      </div>
      <div style="padding: 20px 28px; border-top: 1px solid #ece6db; color: #948a7d; font-size: 12px; text-align: center;">
        Ibom Blockchain Xperience &middot; West Africa's largest blockchain movement<br />
        <a href="https://www.ibomblockchain.com" style="color: #948a7d;">ibomblockchain.com</a>
      </div>
    </div>
  `;
}

// Tells the IBX team a new submission arrived — sent for all four forms,
// each to whichever inbox actually owns that kind of enquiry (see the
// `to` values exported above).
export async function sendTeamNotification({ to, subject, lines }: { to: string; subject: string; lines: [string, string][] }) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping team notification email:", subject);
    return;
  }

  const rows = lines
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 10px 14px; background: #f6f3ee; color: #948a7d; font-size: 11px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; white-space: nowrap; vertical-align: top; border-bottom: 1px solid #ece6db;">${escapeHtml(label)}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #ece6db;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  const html = wrapEmail(`
    <p style="margin: 0 0 6px; color: #d1470c; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">New submission</p>
    <h1 style="margin: 0 0 20px; font-size: 20px; line-height: 1.3;">${escapeHtml(subject)}</h1>
    <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
      ${rows}
    </table>
    <p style="margin: 24px 0 0; color: #6e6459; font-size: 13px;">This came in through the form on ibomblockchain.com — no action needed here beyond following up with them directly.</p>
  `);

  const text = `New submission: ${subject}\n\n${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nThis came in through the form on ibomblockchain.com.`;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject,
    html,
    text,
  });

  if (error) console.error("Team notification email failed:", error.message);
}

// Sent to the visitor themselves for the two signup forms (waitlist,
// coming-soon), asking them to confirm they own the email they typed in.
export async function sendVerificationEmail({ to, confirmUrl, formLabel }: { to: string; confirmUrl: string; formLabel: string }) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping verification email to:", to);
    return;
  }

  const html = wrapEmail(`
    <p style="margin: 0 0 6px; color: #d1470c; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;">One more step</p>
    <h1 style="margin: 0 0 16px; font-size: 22px; line-height: 1.3;">Confirm your email</h1>
    <p>Thanks for signing up for the <strong>${escapeHtml(formLabel)}</strong> — we're glad to have you.</p>
    <p>We just need to confirm this is really your inbox before we add you to the list. Click below and you're done:</p>
    <p style="margin: 28px 0; text-align: center;">
      <a href="${confirmUrl}" style="display: inline-block; padding: 14px 32px; background: #f94902; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px;">Confirm my email</a>
    </p>
    <p style="color: #948a7d; font-size: 12.5px;">If the button doesn't work, copy this link into your browser:<br /><a href="${confirmUrl}" style="color: #d1470c; word-break: break-all;">${confirmUrl}</a></p>
    <p style="margin-top: 24px; color: #6e6459; font-size: 13px;">If you didn't sign up for this, you can safely ignore this email — no account has been created, and nothing further will happen.</p>
  `);

  const text = `Confirm your email\n\nThanks for signing up for the ${formLabel} — we're glad to have you.\n\nConfirm this is your inbox to complete your signup:\n${confirmUrl}\n\nIf you didn't sign up for this, you can safely ignore this email — nothing further will happen.`;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: `Confirm your email — ${formLabel}`,
    html,
    text,
  });

  if (error) console.error("Verification email failed:", error.message);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
