import Image from "next/image";
import Link from "next/link";

type NavigationAction = {
  href: string;
  label: string;
};

type NavigationBrand = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type MainNavigationProps = {
  buildHref?: string;
  brandHref?: string;
  className?: string;
  primaryAction?: NavigationAction;
  secondaryAction?: NavigationAction | null;
  brand?: NavigationBrand;
};

const defaultBrand: NavigationBrand = {
  src: "/brand/ibx-rebrand-white.png",
  width: 3600,
  height: 829,
  alt: "Ibom Blockchain Xperience",
};

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

export function MainNavigation({
  buildHref = "/build",
  brandHref = "/",
  className,
  primaryAction = { href: "/register", label: "Register" },
  secondaryAction = { href: "/partners", label: "Partner with us" },
  brand = defaultBrand,
}: MainNavigationProps) {
  // "Community" has no on-site section of its own — it points straight at
  // the same Telegram group as the IBX Community card on the homepage
  // ecosystem carousel (see `ecosystemProgrammes` in content/site/home.ts).
  const links = [
    { href: "/summit", label: "Summit" },
    { href: "/tour", label: "Tour" },
    { href: buildHref, label: "Build" },
    { href: "https://t.me/+tTYyl_SQzwFmY2I0", label: "Community" },
  ];

  return (
    <header className={`ibx-nav${className ? ` ${className}` : ""}`}>
      <Link className="ibx-nav__brand" href={brandHref} aria-label="Ibom Blockchain Xperience home">
        <Image src={brand.src} width={brand.width} height={brand.height} alt={brand.alt} priority />
      </Link>

      <nav className="ibx-nav__links" aria-label="Primary navigation">
        {links.map((link) => <NavLink key={link.href} {...link} />)}
      </nav>

      <div className="ibx-nav__actions">
        {secondaryAction && <Link className="ibx-button ibx-button--small ibx-button--outline" href={secondaryAction.href}>{secondaryAction.label}</Link>}
        <Link className="ibx-button ibx-button--small" href={primaryAction.href}>{primaryAction.label}</Link>
      </div>

      <details className="ibx-mobile-menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <NavLink key={link.href} {...link} />)}
          {secondaryAction && <Link href={secondaryAction.href}>{secondaryAction.label}</Link>}
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </nav>
      </details>
    </header>
  );
}
