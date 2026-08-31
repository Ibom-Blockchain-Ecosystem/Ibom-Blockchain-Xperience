import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Ibom Blockchain Xperience collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Our full privacy policy is being finalised before publishing. If you have a question about how your data is handled in the meantime, reach out directly and the team will respond."
      action={{ href: "/contact", label: "Contact us" }}
    />
  );
}
