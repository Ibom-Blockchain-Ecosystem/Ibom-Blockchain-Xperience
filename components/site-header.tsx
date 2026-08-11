import Image from "next/image";
import Link from "next/link";

type SiteHeaderProps = { dark?: boolean; onCountries?: () => void };

export function SiteHeader({ dark = false, onCountries }: SiteHeaderProps) {
  const tangemUrl = process.env.NEXT_PUBLIC_TANGEM_AFFILIATE_URL ?? "#tangem";
  const joinMovementUrl = "https://form.typeform.com/to/A2YCJwL2";
  return (
    <header className={`site-header ${dark ? "site-header-dark" : ""}`}>
      <Link href="/" className="brand" aria-label="IBX Tour home">
        <Image src={dark ? "/brand/ibx-tour-white.png" : "/brand/ibx-tour-black.png"} width={3000} height={820} alt="IBX Tour — Building for Generations" priority />
      </Link>
      <nav aria-label="Primary navigation">
        <a className="tangem-link" href={tangemUrl} target={tangemUrl.startsWith("http") ? "_blank" : undefined} rel={tangemUrl.startsWith("http") ? "sponsored noopener noreferrer" : undefined}>Get Tangem Wallet ↗</a>
        {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
        <Link href="/#about">About</Link>
        <Link href="/#partners">Partners</Link>
      </nav>
      <a className="join-link" href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗</a>
      <details className="tour-mobile-menu">
        <summary aria-label="Open navigation menu">Menu</summary>
        <nav aria-label="Mobile navigation">
          <a href={tangemUrl} target={tangemUrl.startsWith("http") ? "_blank" : undefined} rel={tangemUrl.startsWith("http") ? "sponsored noopener noreferrer" : undefined}>Get Tangem Wallet ↗</a>
          {onCountries ? <button type="button" onClick={onCountries}>Countries</button> : <Link href="/tour">Countries</Link>}
          <Link href="/#about">About</Link>
          <Link href="/#partners">Partners</Link>
          <a href={joinMovementUrl} target="_blank" rel="noopener noreferrer">Join the movement ↗</a>
        </nav>
      </details>
    </header>
  );
}
