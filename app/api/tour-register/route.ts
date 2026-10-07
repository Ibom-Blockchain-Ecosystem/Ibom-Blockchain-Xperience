import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { TOUR_NOTIFY_EMAIL, sendTeamNotification, sendVerificationEmail } from "@/lib/email/resend";
import { describeInsertError } from "@/lib/forms/insert-error";

// Same Telegram group linked from the homepage's IBX Community card and
// the main nav's "Community" link (content/site/home.ts,
// main-navigation.tsx) — kept as a literal here too, matching how those
// already do it rather than introducing a new shared constant for one
// more call site.
const TELEGRAM_URL = "https://t.me/+tTYyl_SQzwFmY2I0";

const tourRegisterSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(200),
  email: z.string().trim().email("Enter a valid email address").max(320),
  country: z.string().trim().min(1, "Choose a country").max(100),
  city: z.string().trim().min(1, "Choose a city").max(100),
  company: z.string().max(0).optional(), // honeypot
});

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Request blocked." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`tour-register:${ip}`, { windowMs: 60_000, max: 5 })) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = tourRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, country, city } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tour_registrations")
    .insert({ name, email, country, city })
    .select("verification_token")
    .single();

  if (error) {
    // 23505 = unique_violation — already registered for this country.
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: false, error: `You're already registered for the ${country} tour stop.` },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { ok: false, error: describeInsertError("tour_registrations", error) },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const confirmUrl = `${siteUrl}/api/verify?form=tour-register&token=${data.verification_token}`;

  await Promise.all([
    sendVerificationEmail({
      to: email,
      confirmUrl,
      formLabel: `IBX Tour — ${city}, ${country}`,
      telegramUrl: TELEGRAM_URL,
    }),
    sendTeamNotification({
      to: TOUR_NOTIFY_EMAIL,
      subject: `New Tour registration — ${city}, ${country}`,
      lines: [
        ["Name", name],
        ["Email", email],
        ["Country", country],
        ["City", city],
      ],
    }),
  ]);

  return NextResponse.json({ ok: true });
}
