import Link from "next/link";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

type ComingSoonPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  // Defaults to a link back home — pass a more specific destination when
  // there's somewhere more useful to send people in the meantime (e.g.
  // the Ambassador waitlist, or the live Summit page).
  action?: { href: string; label: string };
};

export function ComingSoonPage({ eyebrow, title, description, action }: ComingSoonPageProps) {
  const { href, label } = action ?? { href: "/", label: "Back to home" };
  const isExternal = href.startsWith("http");

  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <MainNavigation />

      <section className="contact-page coming-soon-page">
        <div className="contact-page__intro">
          <p className="ibx-kicker">{eyebrow}</p>
          <span className="coming-soon-page__badge"><span aria-hidden="true">▣</span> Coming soon</span>
          <h1>{title}</h1>
          <p>{description}</p>
          {isExternal ? (
            <a className="ibx-button" href={href} target="_blank" rel="noopener noreferrer">
              {label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <Link className="ibx-button" href={href}>{label}</Link>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
