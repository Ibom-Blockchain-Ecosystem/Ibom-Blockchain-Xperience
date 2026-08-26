import Image from "next/image";
import { ecosystemProgrammes, impactStats, speakerQuotes } from "@/content/site/home";
import { EcosystemCarousel } from "@/components/home/ecosystem-carousel";
import { PhotoSlideshow } from "@/components/home/photo-slideshow";
import { SpeakerQuotes } from "@/components/home/speaker-quotes";
import { SoFarVideo } from "@/components/home/so-far-video";
import { HappeningNow } from "@/components/home/happening-now";
import { ComingUpNext } from "@/components/home/upcoming-events";
import { CollaboratorMarquee } from "@/components/home/collaborator-marquee";
import { ProgrammeFeatures } from "@/components/home/programme-features";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export function IbxHome() {
  const registrationUrl = process.env.NEXT_PUBLIC_REGISTRATION_URL ?? "#register";

  return (
    <main className="ibx-home ibx-home--stage-one" id="main-content">
      <section className="ibx-hero ibx-event-hero" id="register" aria-labelledby="ibx-hero-title">
        <Image
          className="ibx-hero__image"
          src="/images/home/ibx27-hero-poster.webp"
          fill
          sizes="100vw"
          alt="A packed African Web3 conference with speakers on the IBX stage"
          priority
        />
        <video
          className="ibx-hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/home/ibx27-hero-poster.webp"
          aria-hidden="true"
        >
          <source src="/videos/ibx27-hero.mp4" type="video/mp4" />
        </video>
        <div className="ibx-hero__shade" />
        <MainNavigation />

        <div className="ibx-hero__content">
          <p className="ibx-announcement"><span aria-hidden="true">▣</span> IBX27 registration</p>
          <h1 id="ibx-hero-title">
            <span>The Global</span>
            <span>blockchain movement</span>
          </h1>
          <a className="ibx-button" href={registrationUrl}>Explore</a>
        </div>

        <div className="ibx-kpi-strip" aria-label="IBX impact statistics">
          <p className="sr-only">Impact figures are pending final KPI approval.</p>
          <div className="ibx-kpi-strip__track">
            {[0, 1].map((copy) => (
              <div className="ibx-kpi-strip__group" aria-hidden={copy === 1} key={copy}>
                {impactStats.map((stat) => (
                  <p key={`${copy}-${stat.label}`}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ibx-ecosystem" id="summit" aria-label="Explore the IBX ecosystem">
        <EcosystemCarousel programmes={ecosystemProgrammes} />
      </section>

      <section className="ibx-so-far" aria-labelledby="ibx-so-far-title">
        <h2 className="sr-only" id="ibx-so-far-title">IBX so far</h2>
        <div className="ibx-so-far__simple-grid">
          <figure className="ibx-so-far__photo ibx-so-far__photo--panel">
            <PhotoSlideshow
              sizes="(max-width: 800px) 100vw, 18vw"
              images={[
                { src: "/images/home/ibx-so-far-panel-enhanced.webp", alt: "An IBX fireside panel on the summit stage" },
                { src: "/images/home/ibx-so-far-stage-2-enhanced.jpg", alt: "The Ibom Blockchain Summit main stage with the audience watching two large screens" },
              ]}
            />
            <figcaption>Ideas take the stage.</figcaption>
          </figure>

          <div className="ibx-so-far__photo ibx-so-far__photo--speaker ibx-so-far__photo--quotes">
            <SpeakerQuotes quotes={speakerQuotes} />
          </div>

          <SoFarVideo />

          <figure className="ibx-so-far__photo ibx-so-far__photo--audience">
            <PhotoSlideshow
              sizes="(max-width: 800px) 100vw, 34vw"
              images={[
                { src: "/images/home/ibx-so-far-audience-enhanced.webp", alt: "A large audience gathered for the Ibom Blockchain Summit" },
                { src: "/images/home/ibx-so-far-balcony-enhanced.jpg", alt: "A two-level venue packed with attendees at the Ibom Blockchain Summit" },
              ]}
            />
            <figcaption>A community built to connect.</figcaption>
          </figure>

          <figure className="ibx-so-far__photo ibx-so-far__photo--community">
            <PhotoSlideshow
              sizes="(max-width: 800px) 100vw, 34vw"
              images={[
                { src: "/images/home/ibx-so-far-stage-2-enhanced.jpg", alt: "The Ibom Blockchain Summit main stage with the audience watching two large screens" },
                { src: "/images/home/ibx-so-far-sax-enhanced.jpg", alt: "A musician performing on stage at the Ibom Blockchain Summit" },
              ]}
            />
            <figcaption>Builders, founders and future leaders.</figcaption>
          </figure>
        </div>
      </section>

      <HappeningNow />
      <ComingUpNext />
      <CollaboratorMarquee />
      <ProgrammeFeatures />
      <SiteFooter />
    </main>
  );
}
