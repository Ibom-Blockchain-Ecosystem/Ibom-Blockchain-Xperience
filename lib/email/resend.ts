import { Resend } from "resend";

const TEAM_NOTIFY_EMAIL = process.env.PARTNERSHIPS_NOTIFY_EMAIL ?? "partnerships@ibomblockchain.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null; // Email is optional infrastructure — a missing key shouldn't break a form submission.
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL ?? "IBX <onboarding@resend.dev>";
}

// Tells the IBX team a new submission arrived — sent for all four forms.
export async function sendTeamNotification({ subject, lines }: { subject: string; lines: [string, string][] }) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping team notification email:", subject);
    return;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #17140f;">
      <h2 style="margin: 0 0 16px;">${subject}</h2>
      ${lines.map(([label, value]) => `<p style="margin: 0 0 8px;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("")}
    </div>
  `;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to: TEAM_NOTIFY_EMAIL,
    subject,
    html,
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

  const html = `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #17140f; max-width: 480px;">
      <p>Thanks for signing up for the ${escapeHtml(formLabel)}.</p>
      <p>Confirm this is your email address to complete your signup:</p>
      <p style="margin: 24px 0;">
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background: #f94902; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700;">Confirm my email</a>
      </p>
      <p style="color: #6e6459; font-size: 13px;">If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  const { error } = await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: `Confirm your email — ${formLabel}`,
    html,
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
