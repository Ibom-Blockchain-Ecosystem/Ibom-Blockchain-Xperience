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

export function MainNavigation({
  buildHref = "/build",
  brandHref = "/",
  className,
  primaryAction = { href: "#register", label: "Register" },
  secondaryAction = { href: "/tour/nigeria#partners", label: "Partner with us" },
  brand = defaultBrand,
}: MainNavigationProps) {
  const links = [
    { href: "/summit", label: "Summit" },
    { href: "/tour", label: "Tour" },
    { href: buildHref, label: "Build" },
    { href: "#community", label: "Community" },
  ];

  return (
    <header className={`ibx-nav${className ? ` ${className}` : ""}`}>
      <Link className="ibx-nav__brand" href={brandHref} aria-label="Ibom Blockchain Xperience home">
        <Image src={brand.src} width={brand.width} height={brand.height} alt={brand.alt} priority />
      </Link>

      <nav className="ibx-nav__links" aria-label="Primary navigation">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>

      <div className="ibx-nav__actions">
        {secondaryAction && <Link className="ibx-button ibx-button--small ibx-button--outline" href={secondaryAction.href}>{secondaryAction.label}</Link>}
        <Link className="ibx-button ibx-button--small" href={primaryAction.href}>{primaryAction.label}</Link>
      </div>

      <details className="ibx-mobile-menu">
        <summary aria-label="Open navigation">Menu</summary>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          {secondaryAction && <Link href={secondaryAction.href}>{secondaryAction.label}</Link>}
          <Link href={primaryAction.href}>{primaryAction.label}</Link>
        </nav>
      </details>
    </header>
  );
}
