import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTourStop, tourStops } from "@/data/stops";
import { SiteHeader } from "@/components/site-header";
import { TangemCampaign } from "@/components/tangem-campaign";
import { SiteFooter } from "@/components/site-footer";

type PageProps = { params: Promise<{ slug: string }> };

const activities = [
  { eyebrow: "Community & campus", title: "Blockchain community meetups", copy: "Open conversations that connect builders, students and local technology communities.", image: "/images/tour/activities/community-meetup.webp" },
  { eyebrow: "Developers & builders", title: "Web3 education campaigns", copy: "Practical sessions where participants exchange knowledge and learn by doing.", image: "/images/tour/activities/builder-session.webp" },
  { eyebrow: "Founders & startups", title: "Innovation conversations", copy: "Focused discussions connecting founders, ecosystem leaders and emerging ideas.", image: "/images/tour/activities/founder-meeting.webp" },
  { eyebrow: "Ecosystem networking", title: "Community roundtables", copy: "Small-group conversations designed to turn shared challenges into collaboration.", image: "/images/tour/activities/ecosystem-roundtable.webp" },
  { eyebrow: "Market outreach", title: "Local voices, lasting trust", copy: "Meeting people where they work and making the IBX mission locally relevant.", image: "/images/tour/activities/market-portrait.webp" },
  { eyebrow: "Grassroots adoption", title: "Blockchain in the marketplace", copy: "Introducing practical digital transactions through direct market engagement.", image: "/images/tour/activities/market-adoption.webp" },
  { eyebrow: "Community wellbeing", title: "Care beyond technology", copy: "Supporting community-centred activations that create immediate, human value.", image: "/images/tour/activities/health-registration.webp" },
  { eyebrow: "Community wellbeing", title: "Accessible health checks", copy: "Bringing basic wellbeing support into busy local community spaces.", image: "/images/tour/activities/health-screening.webp" },
  { eyebrow: "Volunteer network", title: "People powering the movement", copy: "Local volunteers working together to deliver thoughtful community experiences.", image: "/images/tour/activities/volunteer-outreach.webp" },
] as const;

export function generateStaticParams() {
  return tourStops.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const stop = getTourStop(slug);
  if (!stop) return {};
  const title = `${stop.country} Blockchain Tour`;
  return {
    title,
    description: stop.description,
    alternates: { canonical: `/tour/${stop.slug}` },
    openGraph: { title: `${title} | IBX Tour`, description: stop.description, images: [{ url: stop.image, width: 3840, height: 2160, alt: `${stop.country} IBX Tour` }] },
    twitter: { card: "summary_large_image", title, description: stop.description, images: [stop.image] },
  };
}

export default async function TourStopPage({ params }: PageProps) {
  const { slug } = await params;
  const stop = getTourStop(slug);
  if (!stop) notFound();
  const currentIndex = tourStops.findIndex((item) => item.slug === stop.slug);
  const nextStop = tourStops[(currentIndex + 1) % tourStops.length];
  const registrationUrl = "https://form.typeform.com/to/A2YCJwL2";
  const tangemRequestUrl = "https://form.typeform.com/to/dhflQMsn";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `IBX Tour — ${stop.country}`,
    description: stop.description,
    primaryImageOfPage: { "@type": "ImageObject", contentUrl: stop.image },
    about: { "@type": "Country", name: stop.country },
    publisher: { "@type": "Organization", name: "Ibom Blockchain Xperience", url: "https://ibomblockchain.com" },
  };

  return (
    <main className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="detail-hero">
        <Image src={stop.image} fill sizes="100vw" alt={`${stop.country} landscape`} priority />
        <div className="detail-shade" />
        <div className="detail-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>
        <SiteHeader dark />
        <Link className="detail-back" href={`/tour?view=countries&country=${stop.slug}`}>← Back to countries</Link>
        <div className="detail-heading">
          <span>{stop.region} · IBX Tour</span>
          <h1>{stop.country}</h1>
          <p>{stop.welcome}</p>
        </div>
      </section>

      <section className="detail-facts" aria-label={`${stop.country} tour facts`}>
        <article><span>Tour date</span><strong>Date to be confirmed</strong></article>
        <article><span>Primary city</span><strong>{stop.city}</strong></article>
        <article><span>Experience</span><strong>Workshops + activations</strong></article>
        <article><span>Registration</span><a href={registrationUrl} target="_blank" rel="noopener noreferrer">Register interest ↗</a></article>
      </section>

      <section className={`editorial-intro${stop.cityImages ? " editorial-intro--collage" : stop.visualTheme ? ` country-story country-story--${stop.visualTheme}` : stop.featuredCities ? " editorial-intro--city-feature" : ""}`}>
        {stop.cityImages ? (
          <div className="country-strips" aria-label={`Cities and landmarks across ${stop.country}`}>
            {[...stop.cityImages, stop.cityImages[0]].map((image, index) => (
              <figure className={`country-strips__panel country-strips__panel--${index + 1}`} key={`${image}-${index}`}>
                <Image src={image} fill sizes="20vw" alt={`${stop.country} city and landmark ${index + 1}`} />
                <i aria-hidden="true" />
                <strong>{stop.country.toUpperCase().charAt(index)}</strong>
                <span>{index === 1 || index === 4 ? "Cape Coast" : "Accra"}</span>
              </figure>
            ))}
            <div className="country-strips__label"><span>Beyond Accra</span><p>A country-wide blockchain experience.</p></div>
          </div>
        ) : stop.visualTheme ? (
          <div className="country-story__canvas">
            <div className="country-story__outline" aria-hidden="true">{stop.country}</div>
            <div className="country-story__media" aria-hidden="true">
              <figure className="country-story__image country-story__image--main"><Image src={stop.image} fill sizes="(max-width: 800px) 100vw, 62vw" alt="" /></figure>
              <figure className="country-story__image country-story__image--support"><Image src={stop.storyImages?.[0] ?? stop.alternateImage ?? stop.image} fill sizes="(max-width: 800px) 60vw, 24vw" alt="" /></figure>
              <figure className="country-story__image country-story__image--detail"><Image src={stop.storyImages?.[1] ?? stop.image} fill sizes="(max-width: 800px) 60vw, 22vw" alt="" /></figure>
              <i className="country-story__shape" />
            </div>
            <div className="country-story__copy">
              <span>{stop.visualTheme === "bilingual" ? "Bienvenue · Welcome" : `Beyond ${stop.city}`}</span>
              <h2>{stop.featureHeadline}</h2>
              <p>{stop.description}</p>
            </div>
            <div className="country-story__cities" aria-label={`${stop.country} featured cities`}>
              {stop.featuredCities?.map((city, index) => <span key={city}><i>{String(index + 1).padStart(2, "0")}</i>{city}</span>)}
            </div>
          </div>
        ) : (
          <>
            {!stop.featuredCities && <div className="editorial-letter" aria-hidden="true">{stop.country.charAt(0)}</div>}
            {stop.featuredCities ? (
              <div className="editorial-feature">
                <div className="editorial-image"><Image src={stop.alternateImage ?? stop.image} fill sizes="(max-width: 768px) 100vw, 38vw" alt={`${stop.country} culture, cities and landmarks`} /></div>
                <div className="editorial-feature__cities" aria-label={`${stop.country} featured cities`}>
                  {stop.featuredCities.map((city, index) => <span key={city}><i>{String(index + 1).padStart(2, "0")}</i>{city}</span>)}
                </div>
              </div>
            ) : (
              <div className="editorial-image"><Image src={stop.alternateImage ?? stop.image} fill sizes="(max-width: 768px) 100vw, 44vw" alt={`${stop.country} IBX tour setting`} /></div>
            )}
            <div className="editorial-copy">
              <span>Beyond {stop.city}</span>
              <h2>A country-wide blockchain experience.</h2>
              <p>{stop.description}</p>
              <p>{stop.culturalNote}</p>
            </div>
          </>
        )}
      </section>

      <section className="country-programme" id="programme">
        <div className="country-section-heading">
          <div><span>What is happening here</span><h2>The country programme</h2></div>
          <a className="tour-action" href={registrationUrl} target="_blank" rel="noopener noreferrer">Register interest</a>
        </div>
        <div className="country-programme__grid">
          <article><strong>01</strong><h3>Workshops</h3><p>Practical blockchain learning, demonstrations and useful digital skills.</p></article>
          <article><strong>02</strong><h3>Community meetups</h3><p>Builders, founders, students and enthusiasts sharing knowledge.</p></article>
          <article><strong>03</strong><h3>Market activations</h3><p>Real-world adoption, public education and local engagement.</p></article>
        </div>
      </section>

      <section className="tour-activities">
        <div className="country-section-heading country-section-heading--dark">
          <div><span>How the tour moves</span><h2>IBX in every community</h2></div>
          <p>A connected programme bringing education, innovation and opportunity directly to local ecosystems.</p>
        </div>
        <div className="tour-activities__viewport" aria-label="IBX community programmes">
          <div className="tour-activities__track">
            {[0, 1].map((setIndex) => (
              <div className="tour-activities__set" key={setIndex} aria-hidden={setIndex === 1 ? "true" : undefined}>
                {activities.map((activity) => (
                  <article key={`${setIndex}-${activity.title}`}>
                    <div><Image src={activity.image} fill sizes="(max-width: 800px) 86vw, 430px" alt="" /></div>
                    <section><span>{activity.eyebrow}</span><h3>{activity.title}</h3><p>{activity.copy}</p></section>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="country-gallery">
        <div className="country-section-heading"><div><span>The experience in pictures</span><h2>People, places & moments</h2></div></div>
        <div className="country-gallery__grid">
          {[stop.image, stop.alternateImage ?? "/images/home/ibx-so-far-audience.webp", "/images/home/ibx-so-far-speaker.webp", "/images/home/ibx-so-far-community.webp", "/images/home/ibx-so-far-panel.webp"].map((image, index) => (
            <figure key={`${image}-${index}`}><Image src={image} fill sizes="(max-width: 800px) 100vw, 33vw" alt={`${stop.country} tour experience ${index + 1}`} /></figure>
          ))}
        </div>
      </section>

      <section className="country-people">
        <div><span>Local ecosystem</span><h2>Meet the people building the stop.</h2><p>Country leads, facilitators and community partners will be announced when the local programme is confirmed.</p></div>
        <div className="country-people__grid">
          <article><span>Country lead</span><strong>To be announced</strong></article>
          <article><span>Facilitator</span><strong>To be announced</strong></article>
          <article><span>Community partner</span><strong>To be announced</strong></article>
        </div>
      </section>

      <section className="country-partners" id="partners">
        <span>Powered together</span><h2>Tour partners</h2>
        <div className="country-partners__viewport">
          <div className="country-partners__track">
            {[0, 1].map((setIndex) => (
              <div className="country-partners__set" key={setIndex} aria-hidden={setIndex === 1 ? "true" : undefined}>
                <article><Image src="/images/partners/bitcoin-com.png" width={320} height={67} alt={setIndex === 0 ? "Bitcoin.com" : ""} /></article>
                <article><Image src="/images/partners/tour-partner-wordmark.png" width={320} height={74} alt={setIndex === 0 ? "Tangem" : ""} /></article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TangemCampaign requestUrl={tangemRequestUrl} />

      <section className="country-final-cta">
        <div><span>IBX27 Tour · {stop.country}</span><h2>Be part of this stop.</h2></div>
        <a className="tour-action" href={registrationUrl} target="_blank" rel="noopener noreferrer">Register interest ↗</a>
      </section>

      <SiteFooter nextCountry={{ href: `/tour/${nextStop.slug}`, label: nextStop.country }} />
    </main>
  );
}
