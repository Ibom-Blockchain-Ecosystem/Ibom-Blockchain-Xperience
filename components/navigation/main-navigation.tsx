import Image from "next/image";
import Link from "next/link";

// "Build" is an in-page anchor that only exists on the homepage —
// `/#build` (leading slash) always resolves there first regardless of
// which page this nav is rendered on, unlike a bare `#build` which
// would look for that id on the *current* page.
// "Community" has no on-site section of its own — it points straight at
// the same Telegram group as the IBX Community card on the homepage
// ecosystem carousel (see `ecosystemProgrammes` in content/site/home.ts).
const links = [
  { href: "/summit", label: "Summit" },
  { href: "/tour", label: "Tour" },
  { href: "/#build", label: "Build" },
  { href: "https://t.me/+tTYyl_SQzwFmY2I0", label: "Community" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return <Link href={href}>{label}</Link>;
}

export function MainNavigation() {
  return (
    <header className="ibx-nav">
      <Link className="ibx-nav__brand" href="/" aria-label="Ibom Blockchain Xperience home">
        <Image src="/brand/ibx-rebrand-white.png" width={3600} height={829} alt="Ibom Blockchain Xperience" priority />
      </Link>

      <nav className="ibx-nav__links" aria-label="Primary navigation">
        {links.map((link) => <NavLink key={link.href} {...link} />)}
      </nav>

      <div className="ibx-nav__actions">
        <Link className="ibx-button ibx-button--small ibx-button--outline" href="/partners">Partner with us</Link>
        <Link className="ibx-button ibx-button--small" href="/register">Register</Link>
      </div>

      <details className="ibx-mobile-menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <NavLink key={link.href} {...link} />)}
          <Link href="/partners">Partner with us</Link>
          <Link href="/register">Register</Link>
        </nav>
      </details>
    </header>
  );
}
