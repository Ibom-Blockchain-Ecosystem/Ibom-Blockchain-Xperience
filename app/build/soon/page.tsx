import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IBX Build — Coming Soon",
  description:
    "IBX Build applications and programme details are being updated. Explore IBX Build in the meantime.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/build/soon" },
};

export default function BuildSoonPage() {
  return (
    <main className="not-found not-found--build">
      <div className="not-found__grid" aria-hidden="true" />
      <div className="not-found__glow" aria-hidden="true" />

      <Link className="not-found__brand" href="/build" aria-label="IBX Build home">
        <Image src="/brand/ibx-build-white.png" width={3320} height={372} alt="IBX Build" priority />
      </Link>

      <div className="not-found__content">
        <span>Something new is being built</span>
        <strong aria-hidden="true">SOON</strong>
        <h1>We are currently updating this page.</h1>
        <p>
          Applications and programme details for IBX Build are on the way. In the meantime,
          keep exploring what IBX Build is about.
        </p>
        <div className="not-found__actions">
          <Link href="/build">Explore IBX Build →</Link>
        </div>
      </div>
    </main>
  );
}
