import type { Metadata } from "next";
import { ConfirmationBanner } from "@/components/forms/confirmation-banner";
import { TourRegisterForm } from "@/components/forms/tour-register-form";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";
import { tourCountryOptions } from "@/data/stops";

export const metadata: Metadata = {
  title: "Register for the Tour",
  description: "Register for the IBX Tour stop coming to your country and city, and get updates as the schedule is confirmed.",
  alternates: { canonical: "/tour/register" },
};

type PageProps = { searchParams: Promise<{ confirmed?: string; country?: string }> };

export default async function TourRegisterPage({ searchParams }: PageProps) {
  const { confirmed, country } = await searchParams;
  // Accept either a country name or its slug (links from the country
  // pages pass the slug) so both `?country=nigeria` and
  // `?country=Nigeria` preselect the right option.
  const initialCountry = tourCountryOptions.find(
    (option) => option.slug === country || option.country === country,
  )?.country;

  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <MainNavigation />

      <section className="contact-page">
        <div className="contact-page__intro">
          <p className="ibx-kicker">IBX Tour</p>
          <h1>Register for the Tour</h1>
          <p>
            Tell us which country and city&apos;s tour stop you want updates on, and we&apos;ll email you
            as the schedule, venue and programme are confirmed — plus a link to our Telegram
            channel so you never miss an announcement.
          </p>
        </div>

        <ConfirmationBanner status={confirmed} />
        <TourRegisterForm initialCountry={initialCountry} />
      </section>

      <SiteFooter />
    </main>
  );
}
