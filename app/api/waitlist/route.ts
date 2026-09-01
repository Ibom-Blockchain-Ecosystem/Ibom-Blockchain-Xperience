import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { sendTeamNotification, sendVerificationEmail } from "@/lib/email/resend";

const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  role: z.string().trim().min(1, "Choose the option closest to you").max(100),
  country: z.string().trim().min(1, "Tell us which country you're applying from").max(100),
  motivation: z.string().trim().max(2000).optional(),
  company: z.string().max(0).optional(), // honeypot
});

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Request blocked." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`waitlist:${ip}`, { windowMs: 60_000, max: 3 })) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = waitlistSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, role, country, motivation } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("waitlist_entries")
    .insert({ name, email, role, country, motivation: motivation || null })
    .select("verification_token")
    .single();

  if (error) {
    // 23505 = unique_violation — this email is already on the waitlist.
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: false, error: "This email is already on the waitlist." },
        { status: 409 },
      );
    }
    console.error("waitlist_entries insert failed:", error.message);
    return NextResponse.json(
      { ok: false, error: "Something went wrong on our end — please try again." },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const confirmUrl = `${siteUrl}/api/verify?form=waitlist&token=${data.verification_token}`;

  await Promise.all([
    sendVerificationEmail({ to: email, confirmUrl, formLabel: "IBX Ambassador Programme waitlist" }),
    sendTeamNotification({
      subject: "New Ambassador Programme waitlist signup",
      lines: [
        ["Name", name],
        ["Email", email],
        ["Role", role],
        ["Country", country],
        ...(motivation ? ([["Motivation", motivation]] as [string, string][]) : []),
      ],
    }),
  ]);

  return NextResponse.json({ ok: true });
}
