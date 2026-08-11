import Image from "next/image";
import { ecosystemProgrammes, impactStats } from "@/content/site/home";
import { EcosystemCarousel } from "@/components/home/ecosystem-carousel";
import { SoFarVideo } from "@/components/home/so-far-video";
import { HappeningNow } from "@/components/home/happening-now";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { SiteFooter } from "@/components/site-footer";

export function IbxHome() {
  const registrationUrl = process.env.NEXT_PUBLIC_REGISTRATION_URL ?? "#register";

  return (
    <main className="ibx-home ibx-home--stage-one">
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
            <span>West Africa&apos;s largest</span>
            <span>blockchain movement</span>
          </h1>
          <p className="ibx-event-meta">May 2027 <i /> Uyo, Nigeria</p>
          <a className="ibx-button" href={registrationUrl}>Register</a>
        </div>

        <div className="ibx-kpi-strip" aria-label="IBX impact statistics">
          <p className="sr-only">Impact figures are pending final KPI approval.</p>
          <div>
            {impactStats.map((stat) => (
              <p key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="ibx-ecosystem" id="summit" aria-label="Explore the IBX ecosystem">
        <EcosystemCarousel programmes={ecosystemProgrammes} />
      </section>

      <section className="ibx-so-far" aria-labelledby="ibx-so-far-title">
        <div className="ibx-so-far__grid">
          <SoFarVideo />

          <figure className="ibx-so-far__photo ibx-so-far__photo--portrait">
            <Image src="/images/home/ibx-so-far-panel.webp" fill sizes="(max-width: 800px) 100vw, 18vw" alt="An IBX fireside panel on the summit stage" />
          </figure>

          <blockquote className="ibx-so-far__quote">
            <span aria-hidden="true">“</span>
            <p>Building an inclusive blockchain future for Africa.</p>
            <footer>IBX community</footer>
          </blockquote>

          <div className="ibx-so-far__copy">
            <p className="ibx-kicker">The journey so far</p>
            <h2 id="ibx-so-far-title"><span>More than a summit.</span> A movement built for generations.</h2>
            <p>Since 2024, IBX has brought builders, founders, students, protocols and communities together to advance blockchain education, collaboration and real-world adoption across West Africa.</p>
            <a className="ibx-button" href="#register">Join the movement</a>
          </div>

          <figure className="ibx-so-far__photo ibx-so-far__photo--wide">
            <Image src="/images/home/ibx-so-far-audience.webp" fill sizes="(max-width: 800px) 100vw, 34vw" alt="A large audience gathered for the Ibom Blockchain Summit" />
          </figure>

          <figure className="ibx-so-far__photo ibx-so-far__photo--speaker">
            <Image src="/images/home/ibx-so-far-speaker.webp" fill sizes="(max-width: 800px) 100vw, 25vw" alt="A speaker presenting blockchain career opportunities at IBX" />
          </figure>

          <figure className="ibx-so-far__photo ibx-so-far__photo--small">
            <Image src="/images/home/ibx-so-far-community.webp" fill sizes="(max-width: 800px) 100vw, 18vw" alt="IBX attendees enjoying a session together" />
          </figure>

          <div className="ibx-so-far__statement">
            <Image src="/brand/ibx-primary-white.png" width={3001} height={756} alt="Ibom Blockchain Xperience" />
            <p>Education. Innovation. Community.</p>
          </div>
        </div>
      </section>

      <HappeningNow />
      <SiteFooter />
    </main>
  );
}
