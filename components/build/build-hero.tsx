import Link from "next/link";
import { buildHeroContent } from "@/content/build/hero";
import { BuildHeroCityscape } from "@/components/build/build-hero-cityscape";
import { BuildHeroTypingHeadline } from "@/components/build/build-hero-typing-headline";

export function BuildHero() {
  return (
    <section className="build-hero" id="build" aria-labelledby="build-hero-title">
      <BuildHeroCityscape />
      <div className="build-hero__ambient" aria-hidden="true" />
      <div className="build-hero__grid" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
      </div>

      <div className="build-hero__content">
        <BuildHeroTypingHeadline phrases={buildHeroContent.headlinePhrases} />

        <div className="build-hero__actions" id="register">
          <p className="build-hero__description">
            {buildHeroContent.descriptionLines.map((line) => (
              <span className="build-hero__description-line" key={line}>
                {line}
              </span>
            ))}
          </p>
          <div className="build-hero__action-row">
            <Link className="build-hero__button build-hero__button--primary" href="/build/soon">
              {buildHeroContent.registrationAction}
            </Link>
            <a className="build-hero__button build-hero__button--secondary" href="#community">
              {buildHeroContent.secondaryAction}
            </a>
          </div>
        </div>
      </div>

      <div className="build-hero__loader" aria-hidden="true">
        <div className="build-hero__loader-status">
          <span>IBX</span>
          <span className="build-hero__loader-percentage">
            <i>0%</i>
            <i>25%</i>
            <i>50%</i>
            <i>75%</i>
            <i>100%</i>
          </span>
        </div>
        <div className="build-hero__loader-track"><i /></div>
      </div>
    </section>
  );
}
