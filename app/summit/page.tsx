import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SummitDestinations } from "@/components/home/upcoming-events";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "IBX Summit Nigeria",
  description: "Discover the flagship Ibom Blockchain Xperience summit in Uyo, Nigeria.",
  alternates: { canonical: "/summit" },
};

export default function SummitPage() {
  return (
    <main className="summit-landing" id="main-content">
      <section className="summit-landing__hero" aria-labelledby="summit-title">
        <header className="summit-landing__nav">
          <Link className="summit-landing__brand" href="/" aria-label="Ibom Blockchain Xperience Summit home">
            <Image
              src="/brand/programmes/ibx-summit-logo.png"
              width={1800}
              height={333}
              alt="Ibom Blockchain Xperience Summit — Built for This"
              priority
            />
          </Link>

          <nav aria-label="Summit navigation">
            <Link href="/">Home</Link>
            <Link href="#about-summit">About</Link>
            <Link href="#upcoming-events">Events</Link>
            <Link href="/news">News</Link>
            <a href="mailto:partnerships@ibomblockchain.com">Contact</a>
          </nav>

          <a className="summit-landing__register" href="https://form.typeform.com/to/A2YCJwL2" target="_blank" rel="noopener noreferrer">
            Register interest ↗
          </a>

          <details className="summit-landing__mobile-menu">
            <summary aria-label="Open summit navigation">Menu</summary>
            <nav aria-label="Mobile summit navigation">
              <Link href="/">Home</Link>
              <Link href="#about-summit">About</Link>
              <Link href="#upcoming-events">Events</Link>
              <Link href="/news">News</Link>
              <a href="mailto:partnerships@ibomblockchain.com">Contact</a>
            </nav>
          </details>
        </header>

        <div className="summit-landing__lead">
          <div className="summit-landing__copy">
            <p>The flagship gathering starts here.</p>
            <h1 id="summit-title">West Africa&apos;s<br /><span>Largest Blockchain Gathering.</span></h1>
            <ul>
              <li>Two days of ideas, building and collaboration.</li>
              <li>Uyo, Nigeria · May 2027.</li>
            </ul>
            <Link className="summit-landing__cta" href="#about-summit">Explore the summit <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="summit-landing__mosaic" aria-label="Ibom Blockchain Xperience Summit identity">
            <div className="summit-landing__mosaic-claw">
              <Image src="/brand/programmes/ibx-summit-logo.png" fill sizes="(max-width: 800px) 100vw, 50vw" alt="Ibom Blockchain Xperience Summit — Built for This" priority />
            </div>
          </div>
        </div>

      </section>

      <SummitDestinations />

      <section className="summit-about" id="about-summit">
        <p>IBX Global Summit</p>
        <h2>The Global Blockchain Movement Converges</h2>
        <p>The Global Blockchain Movement connects people, ideas and opportunities shaping the future of blockchain.</p>
      </section>
      <SiteFooter />
    </main>
  );
}
