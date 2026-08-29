import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Ibom Blockchain Xperience team — general, media and partnership enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <MainNavigation />

      <section className="contact-page">
        <div className="contact-page__intro">
          <p className="ibx-kicker">Get in touch</p>
          <h1>Contact IBX</h1>
          <p>
            Media enquiries, speaking requests, general questions — send a message and the IBX team
            will get back to you. For partnership and sponsorship enquiries specifically,{" "}
            <a href="mailto:partnerships@ibomblockchain.com">email partnerships@ibomblockchain.com</a>{" "}
            directly.
          </p>
        </div>

        <ContactForm />
      </section>

      <SiteFooter />
    </main>
  );
}
