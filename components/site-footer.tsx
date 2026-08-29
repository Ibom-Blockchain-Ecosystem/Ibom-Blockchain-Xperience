import Image from "next/image";
import Link from "next/link";

type SiteFooterProps = {
  nextCountry?: { href: string; label: string };
};

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/ibom-blockchain-summit/" },
  { label: "Facebook", href: "https://web.facebook.com/Ibomblockchainxperience" },
  { label: "Instagram", href: "https://www.instagram.com/ibomblockchainxperience/" },
  { label: "X / Twitter", href: "https://x.com/IbomBlockchain" },
];

export function SiteFooter({ nextCountry }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link className="site-footer__brand-logo" href="/" aria-label="Ibom Blockchain Xperience home">
          <Image src="/brand/ibx-rebrand-white.png" width={320} height={74} alt="Ibom Blockchain Xperience" />
        </Link>

        <div className="site-footer__columns">
          <nav className="site-footer__column" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            <Link href="/#about">About IBX</Link>
            <Link href="/speakers">Speakers</Link>
            <Link href="/schedule">Schedule</Link>
            <Link href="/summit">Summit</Link>
            <Link href="/tour">Tour</Link>
          </nav>

          <nav className="site-footer__column" aria-labelledby="footer-useful">
            <h2 id="footer-useful">Useful links</h2>
            <Link href="/partners">Become a partner</Link>
            <Link href="/#collaborators">IBX collaborators</Link>
            <Link href="/build">IBX Build</Link>
            <Link href="/ambassadors">Ambassadors</Link>
            <Link href="/news">News</Link>
          </nav>

          <nav className="site-footer__column" aria-labelledby="footer-event">
            <h2 id="footer-event">Event</h2>
            <Link href="/summit">IBX Summit Nigeria</Link>
            <Link href="/tour">IBX Tour</Link>
            <Link href="/den-of-rogues">Den of Rogues</Link>
            <a href="https://form.typeform.com/to/A2YCJwL2" target="_blank" rel="noopener noreferrer">Register interest<span className="sr-only"> (opens in a new tab)</span></a>
            {nextCountry && <Link href={nextCountry.href}>Next: {nextCountry.label}</Link>}
          </nav>

          <nav className="site-footer__column" aria-labelledby="footer-social">
            <h2 id="footer-social">Social links</h2>
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label}<span className="sr-only"> (opens in a new tab)</span></a>
            ))}
          </nav>

          <section className="site-footer__column site-footer__contact" aria-labelledby="footer-contact">
            <h2 id="footer-contact">Contact</h2>
            <Link href="/contact"><span aria-hidden="true">✉</span>Send a message</Link>
            <a href="mailto:partnerships@ibomblockchain.com">partnerships@ibomblockchain.com</a>
          </section>
        </div>

        <div className="site-footer__legal">
          <p>© {new Date().getFullYear()} Ibom Blockchain Xperience. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
