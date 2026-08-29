import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoonForm } from "@/components/forms/coming-soon-form";
import { ConfirmationBanner } from "@/components/forms/confirmation-banner";
import { comingSoonContinents, getComingSoonContinent } from "@/data/continents";

type PageProps = { params: Promise<{ continent: string }>; searchParams: Promise<{ confirmed?: string }> };

export function generateStaticParams() {
  return comingSoonContinents.map(({ slug }) => ({ continent: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { continent } = await params;
  const item = getComingSoonContinent(continent);
  if (!item) return {};
  return {
    title: `${item.name} Tour — Coming Soon`,
    description: `The Ibom Blockchain Xperience Tour is coming to ${item.name}. Register for future updates.`,
    alternates: { canonical: `/tour/coming-soon/${item.slug}` },
    openGraph: { title: `IBX Tour ${item.name} — Coming Soon`, description: item.description, images: [item.image] },
    twitter: { card: "summary_large_image", title: `IBX Tour ${item.name} — Coming Soon`, description: item.description, images: [item.image] },
  };
}

export default async function ContinentComingSoonPage({ params, searchParams }: PageProps) {
  const { continent } = await params;
  const { confirmed } = await searchParams;
  const item = getComingSoonContinent(continent);
  if (!item) notFound();
  const activeIndex = comingSoonContinents.findIndex(({ slug }) => slug === item.slug);

  return (
    <main className={`continent-soon continent-soon--${item.slug}`}>
      <Image className="continent-soon__image" src={item.image} fill sizes="100vw" alt={`${item.name} destination landscape`} priority />
      <div className="continent-soon__shade" />
      <div className="continent-soon__colour" />
      <div className="continent-soon__grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>

      <header className="continent-soon__nav">
        <Link href="/tour" aria-label="IBX Tour continents"><Image src="/brand/ibx-tour-rebrand-white.png" width={3600} height={766} alt="IBX Tour — Building for Generations" priority /></Link>
        <nav aria-label="Tour navigation"><Link href="/tour">Countries</Link><Link href="/#about">About the tour</Link><Link href="/#partners">Partners</Link></nav>
        <Link className="continent-soon__return" href="/tour">← Return to continents</Link>
      </header>

      <aside className="continent-soon__preview" aria-hidden="true">
        <div><Image src={item.image} fill sizes="180px" alt="" /></div>
        <p>{item.name}</p><small>Future destination · {String(activeIndex + 1).padStart(2, "0")}</small>
      </aside>

      <section className="continent-soon__content">
        <p className="continent-soon__eyebrow"><i /> IBX Tour · {item.name}</p>
        <h1><span>Coming</span> Soon</h1>
        <div>
          <p>New destinations. New communities. One borderless blockchain movement. {item.description}</p>
          <ConfirmationBanner status={confirmed} />
          <ComingSoonForm continent={item.name} continentSlug={item.slug} />
        </div>
      </section>

      <footer className="continent-soon__footer">
        <nav aria-label="Coming soon continents">
          {comingSoonContinents.map((entry) => <Link key={entry.slug} className={entry.slug === item.slug ? "is-active" : ""} aria-current={entry.slug === item.slug ? "page" : undefined} href={`/tour/coming-soon/${entry.slug}`}>{entry.name}</Link>)}
        </nav>
        <p><strong>{String(activeIndex + 1).padStart(2, "0")}</strong> / {String(comingSoonContinents.length).padStart(2, "0")}</p>
      </footer>
    </main>
  );
}
