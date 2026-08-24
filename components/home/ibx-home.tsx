import Image from "next/image";
import { ecosystemProgrammes, impactStats } from "@/content/site/home";
import { EcosystemCarousel } from "@/components/home/ecosystem-carousel";
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
          <p className="ibx-event-meta">May 2027 <i /> Uyo, Nigeria</p>
          <a className="ibx-button" href={registrationUrl}>Register</a>
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
            <Image src="/images/home/ibx-so-far-panel.webp" fill sizes="(max-width: 800px) 100vw, 18vw" alt="An IBX fireside panel on the summit stage" />
            <figcaption>Ideas take the stage.</figcaption>
          </figure>

          <figure className="ibx-so-far__photo ibx-so-far__photo--speaker">
            <Image src="/images/home/ibx-so-far-speaker.webp" fill sizes="(max-width: 800px) 100vw, 18vw" alt="A speaker presenting blockchain career opportunities at IBX" />
            <figcaption>Practical Web3 learning.</figcaption>
          </figure>

          <SoFarVideo />

          <figure className="ibx-so-far__photo ibx-so-far__photo--audience">
            <Image src="/images/home/ibx-so-far-audience.webp" fill sizes="(max-width: 800px) 100vw, 34vw" alt="A large audience gathered for the Ibom Blockchain Summit" />
            <figcaption>A community built to connect.</figcaption>
          </figure>

          <figure className="ibx-so-far__photo ibx-so-far__photo--community">
            <Image src="/images/home/ibx-so-far-community.webp" fill sizes="(max-width: 800px) 100vw, 34vw" alt="IBX attendees enjoying a session together" />
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
