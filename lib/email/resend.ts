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

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
}

// Email clients fetch images over the open internet — they can't reach a
// local file or go through Next's image pipeline, so this has to be a
// real, public URL. The header now paints its own dark background
// rather than relying on the client's (usually white) default, so the
// white wordmark is the right one here — unlike the old white-background
// header, which needed the black version to stay visible.
function getLogoUrl() {
  return `${getSiteUrl()}/brand/ibx-rebrand-white.png`;
}

// Table-based layout and plain inline styles throughout — no flexbox,
// grid or box-shadow relied on for anything structural, since Outlook's
// renderer (still Word's, not a browser engine) drops all three. Visual
// flourishes that degrade gracefully (the button's shadow, the card's
// border) are fine; layout itself never depends on them.
function wrapEmail(bodyHtml: string) {
  return `
    <div style="background: #f4efe6; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; border-collapse: separate;">
        <tr>
          <td style="background: #11101f; border-radius: 16px 16px 0 0; padding: 36px 32px; text-align: center;">
            <img src="${getLogoUrl()}" alt="Ibom Blockchain Xperience" width="180" style="display: inline-block; height: auto; max-width: 180px;" />
          </td>
        </tr>
        <tr>
          <td style="background: #ffffff; padding: 40px 36px; color: #17140f; font-size: 15px; line-height: 1.65; border-left: 1px solid #e9e2d4; border-right: 1px solid #e9e2d4;">
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="background: #ffffff; border-radius: 0 0 16px 16px; border: 1px solid #e9e2d4; border-top: 1px solid #ece6db; padding: 22px 36px; color: #948a7d; font-size: 12px; line-height: 1.6; text-align: center;">
            Ibom Blockchain Xperience &middot; West Africa's largest blockchain movement<br />
            <a href="${getSiteUrl()}" style="color: #d1470c; text-decoration: none;">ibomblockchain.com</a>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function pillButton(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px auto;">
      <tr>
        <td style="border-radius: 999px; background: #f94902; box-shadow: 0 8px 20px rgba(249,73,2,.32);">
          <a href="${href}" style="display: inline-block; padding: 15px 36px; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; letter-spacing: .01em; border-radius: 999px;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>
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
          <td style="padding: 12px 16px; background: #f6f3ee; color: #948a7d; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; vertical-align: top; border-bottom: 1px solid #ece6db;">${escapeHtml(label)}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #ece6db; color: #17140f;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join("");

  const html = wrapEmail(`
    <p style="margin: 0 0 8px; color: #d1470c; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;">New submission</p>
    <h1 style="margin: 0 0 24px; font-size: 22px; font-weight: 700; line-height: 1.3; color: #11101f;">${escapeHtml(subject)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #ece6db;">
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

// Sent to the visitor themselves for the signup forms (waitlist,
// coming-soon, Tour registration), asking them to confirm they own the
// email they typed in. `telegramUrl`, when passed, adds a "stay
// updated" CTA below the confirm button — opt-in per call rather than
// shown everywhere, since not every form has asked for it.
export async function sendVerificationEmail({
  to,
  confirmUrl,
  formLabel,
  telegramUrl,
}: {
  to: string;
  confirmUrl: string;
  formLabel: string;
  telegramUrl?: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping verification email to:", to);
    return;
  }

  const telegramHtml = telegramUrl
    ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 28px;">
      <tr>
        <td style="padding: 22px 24px; border-radius: 12px; background: #f6f3ee; border: 1px solid #ece6db;">
          <p style="margin: 0 0 10px; font-weight: 700; color: #11101f; font-size: 15px;">Stay updated in the meantime</p>
          <p style="margin: 0 0 16px; color: #6e6459; font-size: 13px; line-height: 1.6;">Join our Telegram channel for announcements, schedule updates and everything else happening before the Tour reaches you.</p>
          <a href="${telegramUrl}" style="display: inline-block; padding: 11px 22px; border: 1.5px solid #f94902; color: #d1470c; text-decoration: none; border-radius: 999px; font-weight: 700; font-size: 13px;">Join our Telegram ↗</a>
        </td>
      </tr>
    </table>`
    : "";

  const html = wrapEmail(`
    <p style="margin: 0 0 8px; color: #d1470c; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;">One more step</p>
    <h1 style="margin: 0 0 18px; font-size: 26px; font-weight: 700; line-height: 1.25; color: #11101f;">Confirm your email</h1>
    <p style="margin: 0 0 14px;">Thanks for signing up for the <strong>${escapeHtml(formLabel)}</strong> — we're glad to have you.</p>
    <p style="margin: 0;">We just need to confirm this is really your inbox before we add you to the list. Click below and you're done:</p>
    <div style="text-align: center;">${pillButton(confirmUrl, "Confirm my email")}</div>
    <p style="margin: 0; color: #948a7d; font-size: 12.5px; line-height: 1.6;">If the button doesn't work, copy this link into your browser:<br /><a href="${confirmUrl}" style="color: #d1470c; word-break: break-all;">${confirmUrl}</a></p>
    ${telegramHtml}
    <p style="margin: 24px 0 0; color: #6e6459; font-size: 13px;">If you didn't sign up for this, you can safely ignore this email — no account has been created, and nothing further will happen.</p>
  `);

  const text = `Confirm your email\n\nThanks for signing up for the ${formLabel} — we're glad to have you.\n\nConfirm this is your inbox to complete your signup:\n${confirmUrl}\n${
    telegramUrl ? `\nStay updated in the meantime — join our Telegram channel:\n${telegramUrl}\n` : ""
  }\nIf you didn't sign up for this, you can safely ignore this email — nothing further will happen.`;

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
