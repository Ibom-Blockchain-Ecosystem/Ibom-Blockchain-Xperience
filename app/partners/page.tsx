import type { Metadata } from "next";
import { PartnerApplicationForm } from "@/components/forms/partner-application-form";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Become a Partner",
  description: "Partner with Ibom Blockchain Xperience — sponsorship, technology, media and logistics partnerships across the IBX ecosystem.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <MainNavigation />

      <section className="contact-page">
        <div className="contact-page__intro">
          <p className="ibx-kicker">Work with IBX</p>
          <h1>Become a Partner</h1>
          <p>
            IBX partners with sponsors, technology providers, media and logistics organisations to
            deliver the Summit and Tour across West Africa. Tell us a bit about your organisation
            and how you’d like to work together, and the partnerships team will follow up.
          </p>
        </div>

        <PartnerApplicationForm />
      </section>

      <SiteFooter />
    </main>
  );
}
