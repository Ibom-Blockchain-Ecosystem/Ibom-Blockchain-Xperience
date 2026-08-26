import type { Metadata } from "next";
import { IbxHome } from "@/components/home/ibx-home";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Ibom Blockchain Xperience (IBX) — West Africa's Largest Blockchain Movement",
  description: "Ibom Blockchain Xperience is West Africa's largest blockchain movement, bringing builders, founders, protocols and communities together in Uyo, Nigeria.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "IBX27 — Building for Generations",
    description: "West Africa's largest blockchain movement returns to Uyo, Nigeria in May 2027.",
    images: [{ url: "/images/home/ibx27-hero-poster.webp", alt: "Ibom Blockchain Xperience" }],
  },
};

export default function HomePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com";
  const organisationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Ibom Blockchain Xperience",
    alternateName: ["IBX", "Ibom Blockchain Summit"],
    url: siteUrl,
    logo: `${siteUrl}/brand/ibx-rebrand-black.png`,
    description: "West Africa's largest blockchain movement, connecting builders, founders, protocols and communities across Africa.",
    sameAs: [
      "https://x.com/IbomBlockchain",
      "https://www.instagram.com/ibomblockchainxperience/",
      "https://web.facebook.com/Ibomblockchainxperience",
      "https://www.linkedin.com/company/ibom-blockchain-summit/",
    ],
  };
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Ibom Blockchain Xperience",
    alternateName: "IBX",
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} />
      <IbxHome />
    </>
  );
}
