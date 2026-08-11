import Image from "next/image";
import Link from "next/link";

type SiteFooterProps = {
  nextCountry?: { href: string; label: string };
};

export function SiteFooter({ nextCountry }: SiteFooterProps) {
  const newsletterUrl = process.env.NEXT_PUBLIC_NEWSLETTER_FORM_URL;

  return (
    <footer className="site-footer">
      <section className="site-footer__newsletter" aria-labelledby="newsletter-title">
        <div>
          <span>Stay connected to the movement</span>
          <h2 id="newsletter-title">News from across the IBX ecosystem.</h2>
        </div>
        <form action={newsletterUrl} method="post">
          <label htmlFor="newsletter-email">Your email address</label>
          <div>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              required
              disabled={!newsletterUrl}
            />
            <button type="submit" disabled={!newsletterUrl}>Subscribe ↗</button>
          </div>
          <small>{newsletterUrl ? "Tour updates, ecosystem stories and IBX27 announcements. No noise." : "Newsletter subscriptions will open soon."}</small>
        </form>
      </section>

      <div className="site-footer__main">
        <div className="site-footer__identity">
          <Image src="/brand/ibx-tour-white.png" width={3000} height={820} alt="IBX Tour — Building for Generations" />
          <p>Education. Innovation. Community.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">IBX home</Link>
          <Link href="/tour">Explore the tour</Link>
          <Link href="/#about">About IBX</Link>
          <Link href="/#partners">Partners</Link>
          <a href="https://form.typeform.com/to/A2YCJwL2" target="_blank" rel="noopener noreferrer">Register interest ↗</a>
        </nav>
        {nextCountry && <Link className="site-footer__next" href={nextCountry.href}>Next country <strong>{nextCountry.label}</strong> →</Link>}
      </div>

      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} Ibom Blockchain Xperience</span>
        <span>Building for Generations</span>
      </div>
    </footer>
  );
}
