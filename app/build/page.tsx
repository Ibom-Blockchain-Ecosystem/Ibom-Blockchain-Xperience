import type { Metadata } from "next";
import { BuildCommunitySection } from "@/components/build/build-community-section";
import { BuildFinalCtaSection } from "@/components/build/build-final-cta-section";
import { BuildHero } from "@/components/build/build-hero";
import { BuildHeroNavigation } from "@/components/build/build-hero-navigation";
import { BuildJourneyCardsSection } from "@/components/build/build-journey-cards-section";
import { BuildOpportunitiesSection } from "@/components/build/build-opportunities-section";
import { BuildPathwaysSection } from "@/components/build/build-pathways-section";
import { BuildSmoothScroll } from "@/components/build/build-smooth-scroll";
import { BuildTimelineSection } from "@/components/build/build-timeline-section";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "IBX Build",
  description:
    "IBX Build is a year-round builder, accelerator and product ecosystem for founders and developers creating useful blockchain products.",
  alternates: { canonical: "/build" },
};

export default function BuildPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "IBX Build",
    description: metadata.description,
    url: siteUrl + "/build",
    isPartOf: {
      "@type": "WebSite",
      name: "Ibom Blockchain Xperience",
      url: siteUrl,
    },
  };

  return (
    <main className="build-page" id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <BuildSmoothScroll />
      <BuildHeroNavigation />
      <BuildHero />
      <BuildCommunitySection />
      <BuildPathwaysSection />
      <BuildTimelineSection />
      <BuildOpportunitiesSection />
      <BuildJourneyCardsSection />
      <BuildFinalCtaSection />
      <SiteFooter />
    </main>
  );
}
