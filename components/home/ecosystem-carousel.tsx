"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { EcosystemProgramme } from "@/content/site/home";

const programmeImages = [
  "/images/home/ibx-so-far-audience.webp",
  "/images/tour/activities/community-meetup.webp",
  "/images/tour/activities/builder-session.webp",
  "/images/home/ibx-so-far-community.webp",
] as const;

export function EcosystemCarousel({ programmes }: { programmes: EcosystemProgramme[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const programme = programmes[activeIndex];
  const previewProgramme = programmes[(activeIndex + 1) % programmes.length];
  const [accent, ...titleWords] = programme.title.split(" ");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || programmes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % programmes.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, programmes.length]);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + programmes.length) % programmes.length);
  };

  return (
    <div
      className="ibx-ecosystem-stage"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div key={`left-${programme.title}`} className="ibx-ecosystem-preview ibx-ecosystem-preview--left" aria-hidden="true"><Image src={programmeImages[(activeIndex + 1) % programmeImages.length]} alt="" fill sizes="33vw" /><strong>{previewProgramme.title}</strong></div>
      <div key={`right-${programme.title}`} className="ibx-ecosystem-preview ibx-ecosystem-preview--right" aria-hidden="true"><Image src={programmeImages[(activeIndex + 1) % programmeImages.length]} alt="" fill sizes="33vw" /><strong>{previewProgramme.title}</strong></div>
      <span className="ibx-float-star ibx-float-star--ecosystem-one" aria-hidden="true">
        <Image src="/images/home/orange-glossy-star.png" alt="" fill sizes="72px" />
      </span>
      <span className="ibx-float-star ibx-float-star--ecosystem-two" aria-hidden="true">
        <Image src="/images/home/orange-glossy-star.png" alt="" fill sizes="88px" />
      </span>

      <div key={programme.title} className="ibx-ecosystem-card" data-slide={activeIndex} aria-live="polite">
        <div className="ibx-ecosystem-card__visual">
          <Image src={programmeImages[activeIndex % programmeImages.length]} alt={`${programme.title} experience`} fill sizes="(max-width: 800px) 90vw, 40vw" priority={activeIndex === 0} />
        </div>
        <div className="ibx-ecosystem-card__content">
          <div className="ibx-ecosystem-card__count" aria-hidden="true">
            {String(activeIndex + 1).padStart(2, "0")} / {String(programmes.length).padStart(2, "0")}
          </div>
          <p className="ibx-kicker">{programme.eyebrow}</p>
          <h3><span>{accent}</span>{titleWords.length > 0 ? ` ${titleWords.join(" ")}` : ""}</h3>
          <p className="ibx-ecosystem-card__copy">{programme.description}</p>
          <Link className="ibx-button" href={programme.href}>{programme.cta}</Link>
        </div>
      </div>

      <div className="ibx-carousel-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous programme">←</button>
        <div className="ibx-carousel-dots" aria-label="Choose an IBX programme">
          {programmes.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next programme">→</button>
      </div>
    </div>
  );
}
