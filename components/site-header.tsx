import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = { dark?: boolean; onCountries?: () => void; partnerHref?: string };

export function SiteHeader({ dark = false, onCountries, partnerHref = "/tour/nigeria#partners" }: SiteHeaderProps) {
  const tangemUrl = process.env.NEXT_PUBLIC_TANGEM_AFFILIATE_URL;
  // Without the affiliate URL configured there's nowhere real to send
  // people — say so plainly instead of leaving a `#tangem` link that
  // silently does nothing when clicked.
  const tangemConfigured = !!tangemUrl;
  const joinMovementUrl = "https://form.typeform.com/to/A2YCJwL2";

  const tangemLink = (
    <a
      className={`tangem-link${tangemConfigured ? "" : " is-disabled"}`}
      href={tangemConfigured ? tangemUrl : undefined}
      target={tangemConfigured ? "_blank" : undefined}
      rel={tangemConfigured ? "sponsored noopener noreferrer" : undefined}
      aria-disabled={!tangemConfigured}
    >
      {tangemConfigured ? "Get Tangem Wallet ↗" : "Tangem Wallet · Coming soon"}
      {tangemConfigured && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );

  return (
    <header className={`site-header ${dark ? "site-header-dark" : ""}`}>
      <Link href="/" className="brand" aria-label="IBX Tour home">
        {dark ? (
          <Image src="/brand/ibx-tour-rebrand-white.png" width={3600} height={766} alt="IBX Tour — Building for Generations" priority />
        ) : (
          <>
            <Image className="brand__logo brand__logo--light" src="/brand/ibx-tour-rebrand-black.png" width={3600} height={702} alt="IBX Tour — Building for Generations" priority />
            <Image className="brand__logo brand__logo--dark" src="/brand/ibx-tour-rebrand-white.png" width={3600} height={766} alt="" aria-hidden="true" priority />
          </>
        )}
      </Link>
      <nav aria-label="Primary navigation">
        {tangemLink}
        {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
        <Link href="/about">About</Link>
        <Link href={partnerHref}>Partners</Link>
      </nav>
      <a className="join-link" href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗<span className="sr-only"> (opens in a new tab)</span></a>
      <details className="tour-mobile-menu">
        <summary aria-label="Open navigation menu">Menu</summary>
        <nav aria-label="Mobile navigation">
          {tangemLink}
          {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
          <Link href="/about">About</Link>
          <Link href={partnerHref}>Partners</Link>
          <a href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </nav>
      </details>
    </header>
  );
}
