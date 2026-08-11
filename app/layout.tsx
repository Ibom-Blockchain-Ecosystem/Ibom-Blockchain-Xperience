import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "./globals.css";

const squareBlock = localFont({
  src: "../public/fonts/square-block.ttf",
  variable: "--font-square-block",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tour.ibomblockchain.com"),
  title: { default: "IBX27 — Building for Generations", template: "%s | Ibom Blockchain Xperience" },
  description: "Ibom Blockchain Xperience connects builders, founders, communities and global ecosystems to accelerate blockchain adoption and innovation across Africa.",
  applicationName: "Ibom Blockchain Xperience",
  keywords: ["IBX27", "Ibom Blockchain Xperience", "African Web3", "blockchain Africa", "IBX Tour", "IBX Summit"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Ibom Blockchain Xperience",
    title: "IBX27 — Building for Generations",
    description: "West Africa's largest blockchain movement, connecting builders and communities across the continent.",
    images: [{ url: "/images/tour/cote-divoire.webp", width: 3840, height: 2160, alt: "IBX Tour across Africa" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IBX27 — Building for Generations",
    description: "West Africa's largest blockchain movement, connecting builders and communities across the continent.",
    images: ["/images/tour/cote-divoire.webp"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#080808" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={squareBlock.variable}>
      <body>{children}</body>
    </html>
  );
}
