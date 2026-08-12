import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <Image src="/images/tour/cote-divoire.webp" fill sizes="100vw" alt="" priority />
      <div className="not-found__shade" />
      <Link className="not-found__brand" href="/" aria-label="IBX Tour home">
        <Image src="/brand/ibx-tour-white.png" width={2724} height={731} alt="IBX Tour — Building for Generations" />
      </Link>
      <div className="not-found__content">
        <span>Something new is being built</span>
        <strong aria-hidden="true">SOON</strong>
        <h1>We are currently updating this page.</h1>
        <p>Fresh stories, programme information and opportunities from across the IBX ecosystem are on the way. In the meantime, continue exploring the Tour and its country stops.</p>
        <div className="not-found__actions">
          <Link href="/tour">Explore the tour →</Link>
          <Link href="/tour?view=countries">View countries</Link>
        </div>
      </div>
    </main>
  );
}
