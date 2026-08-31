import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing use of the Ibom Blockchain Xperience website and events.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ComingSoonPage
      eyebrow="Legal"
      title="Terms of Use"
      description="Our full terms of use are being finalised before publishing. If you have a question in the meantime, reach out directly and the team will respond."
      action={{ href: "/contact", label: "Contact us" }}
    />
  );
}
