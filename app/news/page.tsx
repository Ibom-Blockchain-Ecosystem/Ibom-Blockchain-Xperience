import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements, recaps and updates from Ibom Blockchain Xperience.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <ComingSoonPage
      eyebrow="Newsroom"
      title="News"
      description="A home for IBX announcements, event recaps and press coverage is being built. In the meantime, follow the movement on our social channels for the latest updates."
      action={{ href: "/", label: "Back to home" }}
    />
  );
}
