import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "About IBX",
  description: "The story, mission and people behind the Ibom Blockchain Xperience.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      eyebrow="The story so far"
      title="About IBX"
      description="Our full history, mission, leadership and impact story is being put together — covering how Ibom Blockchain Xperience started, the MoovTeam Africa team behind it, and what we've built across the continent so far."
      action={{ href: "/", label: "Back to home" }}
    />
  );
}
