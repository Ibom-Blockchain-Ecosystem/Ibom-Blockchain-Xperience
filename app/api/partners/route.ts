import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { verifyTurnstileToken } from "@/lib/forms/verify-turnstile";
import { PARTNERSHIPS_NOTIFY_EMAIL, sendTeamNotification } from "@/lib/email/resend";
import { describeInsertError } from "@/lib/forms/insert-error";

const PROGRAMME_OPTIONS = ["summit", "tour", "build"] as const;

const partnerSchema = z.object({
  orgName: z.string().trim().min(1, "Enter your organisation's name").max(200),
  contactName: z.string().trim().min(1, "Enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  partnershipType: z.string().trim().min(1, "Choose a partnership type").max(100),
  programmes: z.array(z.enum(PROGRAMME_OPTIONS)).min(1, "Choose at least one campaign"),
  message: z.string().trim().min(1, "Tell us a bit about the partnership").max(5000),
  company: z.string().max(0).optional(), // honeypot
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
  if (!checkRateLimit(`partners:${ip}`, { windowMs: 60_000, max: 3 })) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = partnerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

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

  const { orgName, contactName, email, partnershipType, programmes, message } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("partner_applications").insert({
    org_name: orgName,
    contact_name: contactName,
    email,
    partnership_type: partnershipType,
    programmes,
    message,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: describeInsertError("partner_applications", error) },
      { status: 500 },
    );
  }

  const programmeLabels: Record<(typeof PROGRAMME_OPTIONS)[number], string> = {
    summit: "Summit",
    tour: "Tour",
    build: "Build",
  };

  await sendTeamNotification({
    to: PARTNERSHIPS_NOTIFY_EMAIL,
    subject: `New partner application: ${orgName}`,
    lines: [
      ["Organisation", orgName],
      ["Contact", contactName],
      ["Email", email],
      ["Type", partnershipType],
      ["Campaigns", programmes.map((programme) => programmeLabels[programme]).join(", ")],
      ["Message", message],
    ],
  });

  return NextResponse.json({ ok: true });
}
