import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "Den of Rogues",
  description: "An intensive IBX Build experience for developers, designers and founders.",
  alternates: { canonical: "/den-of-rogues" },
};

export default function DenOfRoguesPage() {
  return (
    <ComingSoonPage
      eyebrow="IBX Build experience"
      title="Den of Rogues"
      description="Full details on the Den of Rogues build experience — an intensive sprint turning ambitious Web3 ideas into working products through collaboration, mentorship and a final showcase — are coming soon."
      action={{ href: "/#build", label: "See the countdown" }}
    />
  );
}
