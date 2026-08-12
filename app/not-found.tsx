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
        <span>Lost between stops</span>
        <strong aria-hidden="true">404</strong>
        <h1>This route is not on the tour.</h1>
        <p>Return to the country display and continue exploring the IBX movement across borders.</p>
        <Link href="/tour">Back to the tour →</Link>
      </div>
    </main>
  );
}
