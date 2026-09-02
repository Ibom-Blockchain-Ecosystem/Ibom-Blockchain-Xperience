import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";
import { isTrustedOrigin } from "@/lib/forms/request-origin";
import { TOUR_NOTIFY_EMAIL, sendTeamNotification, sendVerificationEmail } from "@/lib/email/resend";
import { describeInsertError } from "@/lib/forms/insert-error";

const comingSoonSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(320),
  continent: z.string().trim().min(1).max(100),
  continentSlug: z.string().trim().min(1).max(100),
  company: z.string().max(0).optional(), // honeypot
});

export async function POST(request: Request) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Request blocked." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`coming-soon:${ip}`, { windowMs: 60_000, max: 5 })) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions — please wait a minute and try again." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = comingSoonSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { email, continent, continentSlug } = parsed.data;
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("continent_signups")
    .insert({ email, continent, continent_slug: continentSlug })
    .select("verification_token")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: false, error: `You're already signed up for updates on ${continent}.` },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { ok: false, error: describeInsertError("continent_signups", error) },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const confirmUrl = `${siteUrl}/api/verify?form=coming-soon&token=${data.verification_token}`;

  await Promise.all([
    sendVerificationEmail({ to: email, confirmUrl, formLabel: `IBX Tour ${continent} updates` }),
    sendTeamNotification({
      to: TOUR_NOTIFY_EMAIL,
      subject: `New "coming soon" signup — ${continent}`,
      lines: [["Email", email], ["Continent", continent]],
    }),
  ]);

  return NextResponse.json({ ok: true });
}
