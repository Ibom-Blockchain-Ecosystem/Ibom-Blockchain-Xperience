import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { verifyTurnstileToken } from "@/lib/forms/verify-turnstile";
import { PARTNERSHIPS_NOTIFY_EMAIL, sendTeamNotification } from "@/lib/email/resend";
import { describeInsertError } from "@/lib/forms/insert-error";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  subject: z.string().trim().min(1, "Enter a subject").max(200),
  message: z.string().trim().min(1, "Enter a message").max(5000),
  // Honeypot: real visitors never see or fill this field (hidden via CSS).
  // A bot that fills in every field it finds trips this, and we silently
  // pretend the submission succeeded rather than tipping it off.
  company: z.string().max(0).optional(),
  // `.nullish()`, not `.optional()` — the widget's React state starts as
  // `null` (not `undefined`) until a token arrives, and with Turnstile
  // unconfigured it never does, so the client sends literal `null` here.
  // `.optional()` only accepts a string or a missing field, not `null`,
  // so every submission was failing validation regardless of form input.
  turnstileToken: z.string().nullish(),
});

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Request blocked." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`contact:${ip}`, { windowMs: 60_000, max: 3 })) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  // Honeypot tripped — report success without touching the database.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const isHuman = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!isHuman) {
    return NextResponse.json(
      { ok: false, error: "Couldn't verify you're not a bot — please try again." },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("contact_messages").insert({ name, email, subject, message });

  if (error) {
    return NextResponse.json(
      { ok: false, error: describeInsertError("contact_messages", error) },
      { status: 500 },
    );
  }

  await sendTeamNotification({
    to: PARTNERSHIPS_NOTIFY_EMAIL,
    subject: `New contact message: ${subject}`,
    lines: [["Name", name], ["Email", email], ["Message", message]],
  });

  return NextResponse.json({ ok: true });
}
