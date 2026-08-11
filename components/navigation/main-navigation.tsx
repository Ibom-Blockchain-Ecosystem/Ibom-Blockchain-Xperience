import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "#summit", label: "Summit" },
  { href: "/tour", label: "Tour" },
  { href: "#build", label: "Build" },
  { href: "#ambassadors", label: "Ambassadors" },
  { href: "#partners", label: "Partners" },
];

export function MainNavigation() {
  return (
    <header className="ibx-nav">
      <Link className="ibx-nav__brand" href="/" aria-label="Ibom Blockchain Xperience home">
        <Image src="/brand/ibx-primary-white.png" width={3001} height={756} alt="Ibom Blockchain Xperience" priority />
      </Link>

      <nav className="ibx-nav__links" aria-label="Primary navigation">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>

      <div className="ibx-nav__actions">
        <Link className="ibx-button ibx-button--small ibx-button--outline" href="#partners">Partner with us</Link>
        <Link className="ibx-button ibx-button--small" href="#register">Register</Link>
      </div>

      <details className="ibx-mobile-menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          <Link href="#register">Register</Link>
        </nav>
      </details>
    </header>
  );
}
