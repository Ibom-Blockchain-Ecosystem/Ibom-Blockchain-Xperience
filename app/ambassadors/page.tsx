import type { Metadata } from "next";
import { ConfirmationBanner } from "@/components/forms/confirmation-banner";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Ambassador Programme",
  description: "Join the waitlist for the IBX Ambassador Programme — a leadership and community-building initiative across Africa's blockchain ecosystem.",
  alternates: { canonical: "/ambassadors" },
};

type PageProps = { searchParams: Promise<{ confirmed?: string }> };

export default async function AmbassadorsPage({ searchParams }: PageProps) {
  const { confirmed } = await searchParams;

  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <MainNavigation />

      <section className="contact-page">
        <div className="contact-page__intro">
          <p className="ibx-kicker">Represent the movement</p>
          <h1>IBX Ambassador Programme</h1>
          <p>
            A regional leadership programme for students, founders and technology community builders
            ready to represent IBX, organise local activations and connect their ecosystems to the
            wider movement. Join the waitlist below and we’ll reach out as it opens in your region.
          </p>
        </div>

        <ConfirmationBanner status={confirmed} />
        <WaitlistForm />
      </section>

      <SiteFooter />
    </main>
  );
}
