import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ibomblockchain.com"),
  title: { default: "IBX27 — Building for Generations", template: "%s | Ibom Blockchain Xperience" },
  description: "Ibom Blockchain Xperience connects builders, founders, communities and global ecosystems to accelerate blockchain adoption and innovation across Africa.",
  applicationName: "Ibom Blockchain Xperience",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
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

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#010101" };

const themeScript = `
  try {
    var savedTheme = localStorage.getItem("ibx-theme");
    document.documentElement.dataset.theme = savedTheme === "light" ? "light" : "dark";
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
