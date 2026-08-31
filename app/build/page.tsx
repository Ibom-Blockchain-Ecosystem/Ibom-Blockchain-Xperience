import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "IBX Build",
  description: "A year-round builder, accelerator and product ecosystem from Ibom Blockchain Xperience.",
  alternates: { canonical: "/build" },
};

export default function BuildPage() {
  return (
    <ComingSoonPage
      eyebrow="From idea to infrastructure"
      title="IBX Build"
      description="The dedicated IBX Build page — hackathons, startup support, innovation challenges and mentorship in one place — is on its way. Den of Rogues, our flagship build experience, is already live on the homepage."
      action={{ href: "/#build", label: "See what's live now" }}
    />
  );
}
