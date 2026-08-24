import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = { dark?: boolean; onCountries?: () => void; partnerHref?: string };

export function SiteHeader({ dark = false, onCountries, partnerHref = "/tour/nigeria#partners" }: SiteHeaderProps) {
  const tangemUrl = process.env.NEXT_PUBLIC_TANGEM_AFFILIATE_URL ?? "#tangem";
  const joinMovementUrl = "https://form.typeform.com/to/A2YCJwL2";
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
        <a className="tangem-link" href={tangemUrl} target={tangemUrl.startsWith("http") ? "_blank" : undefined} rel={tangemUrl.startsWith("http") ? "sponsored noopener noreferrer" : undefined}>Get Tangem Wallet ↗</a>
        {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
        <Link href="/#about">About</Link>
        <Link href={partnerHref}>Partners</Link>
      </nav>
      <a className="join-link" href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗</a>
      <details className="tour-mobile-menu">
        <summary aria-label="Open navigation menu">Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href={tangemUrl} target={tangemUrl.startsWith("http") ? "_blank" : undefined} rel={tangemUrl.startsWith("http") ? "sponsored noopener noreferrer" : undefined}>Get Tangem Wallet ↗</a>
          {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
          <Link href="/#about">About</Link>
          <Link href={partnerHref}>Partners</Link>
          <a href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗</a>
        </nav>
      </details>
    </header>
  );
}
