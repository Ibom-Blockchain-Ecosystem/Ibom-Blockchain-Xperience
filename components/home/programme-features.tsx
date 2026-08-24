"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    eyebrow: "IBX Build experience",
    title: "Enter the Den of Rogues",
    description: "An intensive build experience for developers, designers and founders ready to turn ambitious Web3 ideas into working products through collaboration, mentorship and a final showcase.",
    cta: "Enter the Den",
    href: "#footer-newsletter",
    image: "/brand/programmes/den-of-rogues-logo.png",
    imageAlt: "Den of Rogues — Kill That Bull",
    type: "rogues",
  },
  {
    eyebrow: "Represent the movement",
    title: "IBX Ambassador Programme",
    description: "A regional leadership programme for students, founders and technology community builders ready to represent IBX, organise local activations and connect their ecosystems to the wider movement.",
    cta: "Join the waitlist",
    href: "#footer-newsletter",
    image: "/images/tour/activities/community-meetup.webp",
    imageAlt: "The IBX community gathered for a local programme",
    type: "ambassadors",
  },
] as const;

export function ProgrammeFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const active = features[activeIndex];

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActiveIndex((current) => (current + 1) % features.length), 6000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused]);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + features.length) % features.length);
  };

  return (
    <section className="ibx-programmes" id="build" aria-label="IBX programmes">
      <span id="ambassadors" className="ibx-programme-anchor" aria-hidden="true" />
      <div
        className="ibx-programme-showcase"
        data-programme={active.type}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
        }}
      >
        <div key={`left-${active.title}`} className="ibx-programme-preview ibx-programme-preview--left" aria-hidden="true">
          <Image src={features[(activeIndex + 1) % features.length].image} alt="" fill sizes="34vw" />
          <strong>{features[(activeIndex + 1) % features.length].title}</strong>
        </div>
        <div key={`right-${active.title}`} className="ibx-programme-preview ibx-programme-preview--right" aria-hidden="true">
          <Image src={features[(activeIndex + 1) % features.length].image} alt="" fill sizes="34vw" />
          <strong>{features[(activeIndex + 1) % features.length].title}</strong>
        </div>

        <article key={active.title} className="ibx-programme-focus" aria-live="polite">
          <div className="ibx-programme-focus__visual">
            <Image
              src={active.image}
              width={active.type === "rogues" ? 1000 : 1800}
              height={active.type === "rogues" ? 1216 : 2400}
              sizes="(max-width: 800px) 82vw, 38vw"
              alt={active.imageAlt}
            />
          </div>
          <div className="ibx-programme-focus__copy">
            <p className="ibx-programme__eyebrow">{active.eyebrow}</p>
            <h2>{active.title}</h2>
            <p>{active.description}</p>
            <a className="ibx-programme__button" href={active.href}>{active.cta}</a>
          </div>
        </article>

        <span className="ibx-float-star ibx-float-star--premium ibx-float-star--one" aria-hidden="true">
          <Image src="/images/home/orange-glossy-star.png" alt="" fill sizes="64px" />
        </span>
        <span className="ibx-float-star ibx-float-star--premium ibx-float-star--two" aria-hidden="true">
          <Image src="/images/home/orange-glossy-star.png" alt="" fill sizes="82px" />
        </span>
        <span className="ibx-float-star ibx-float-star--premium ibx-float-star--three" aria-hidden="true">
          <Image src="/images/home/orange-glossy-star.png" alt="" fill sizes="48px" />
        </span>

        <div className="ibx-programme-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous programme">←</button>
          <div>
            {features.map((feature, index) => (
              <button type="button" key={feature.title} className={index === activeIndex ? "is-active" : ""} aria-label={`Show ${feature.title}`} aria-current={index === activeIndex ? "true" : undefined} onClick={() => setActiveIndex(index)} />
            ))}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Next programme">→</button>
        </div>
      </div>
    </section>
  );
}
