import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type FormKey = "waitlist" | "coming-soon";

function isFormKey(value: string | null): value is FormKey {
  return value === "waitlist" || value === "coming-soon";
}

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const { searchParams } = new URL(request.url);
  const form = searchParams.get("form");
  const token = searchParams.get("token");

  if (!isFormKey(form) || !token) {
    return NextResponse.redirect(new URL("/?confirmed=invalid", siteUrl));
  }

  const supabase = createSupabaseServerClient();

  if (form === "waitlist") {
    const { data, error } = await supabase
      .from("waitlist_entries")
      .update({ verified: true })
      .eq("verification_token", token)
      .eq("verified", false)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Verification failed for waitlist_entries:", error.message);
      return NextResponse.redirect(new URL("/ambassadors?confirmed=error", siteUrl));
    }

    // No row matched — either an already-used link or an invalid token.
    // Either way, don't reveal which, since that only helps someone probing.
    return NextResponse.redirect(new URL(`/ambassadors?confirmed=${data ? "success" : "invalid"}`, siteUrl));
  }

  const { data, error } = await supabase
    .from("continent_signups")
    .update({ verified: true })
    .eq("verification_token", token)
    .eq("verified", false)
    .select("id, continent_slug")
    .maybeSingle();

  if (error) {
    console.error("Verification failed for continent_signups:", error.message);
    return NextResponse.redirect(new URL("/tour?confirmed=error", siteUrl));
  }

  if (!data) {
    return NextResponse.redirect(new URL("/tour?confirmed=invalid", siteUrl));
  }

  return NextResponse.redirect(new URL(`/tour/coming-soon/${data.continent_slug}?confirmed=success`, siteUrl));
}
