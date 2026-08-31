import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { verifyTurnstileToken } from "@/lib/forms/verify-turnstile";
import { sendTeamNotification } from "@/lib/email/resend";

const partnerSchema = z.object({
  orgName: z.string().trim().min(1, "Enter your organisation's name").max(200),
  contactName: z.string().trim().min(1, "Enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  partnershipType: z.string().trim().min(1, "Choose a partnership type").max(100),
  message: z.string().trim().min(1, "Tell us a bit about the partnership").max(5000),
  company: z.string().max(0).optional(), // honeypot
  turnstileToken: z.string().optional(),
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

  const { orgName, contactName, email, partnershipType, message } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("partner_applications").insert({
    org_name: orgName,
    contact_name: contactName,
    email,
    partnership_type: partnershipType,
    message,
  });

  if (error) {
    console.error("partner_applications insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end — please try again." },
      { status: 500 },
    );
  }

  await sendTeamNotification({
    subject: `New partner application: ${orgName}`,
    lines: [
      ["Organisation", orgName],
      ["Contact", contactName],
      ["Email", email],
      ["Type", partnershipType],
      ["Message", message],
    ],
  });

  return NextResponse.json({ ok: true });
}
