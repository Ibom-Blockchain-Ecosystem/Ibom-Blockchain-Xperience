import type { Metadata } from "next";
import "./about.css";
import { AboutPageClient } from "@/components/about/about-page-client";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About IBX — Ibom Blockchain Xperience",
  description:
    "Ibom Blockchain Xperience (IBX) is West Africa's largest blockchain movement, connecting builders, founders, protocols and communities across Africa through the Summit, Tour, Build and Community.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About IBX",
    description: metadata.description,
    url: `${siteUrl}/about`,
    isPartOf: { "@type": "WebSite", name: "Ibom Blockchain Xperience", url: siteUrl },
    about: {
      "@type": "Organization",
      name: "Ibom Blockchain Xperience",
      alternateName: "IBX",
      url: siteUrl,
      foundingDate: "2023",
      foundingLocation: "Uyo, Nigeria",
    },
  };

  return (
    <main className="about-page" id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <MainNavigation
        className="about-page__nav"
        brandHref="/"
        primaryAction={{ href: "https://form.typeform.com/to/A2YCJwL2", label: "Get involved" }}
        secondaryAction={null}
      />
      <AboutPageClient />
      <SiteFooter />
    </main>
  );
}
