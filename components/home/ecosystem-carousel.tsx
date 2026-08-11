"use client";

import Link from "next/link";
import { useState } from "react";
import type { EcosystemProgramme } from "@/content/site/home";

export function EcosystemCarousel({ programmes }: { programmes: EcosystemProgramme[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const programme = programmes[activeIndex];
  const [accent, ...titleWords] = programme.title.split(" ");

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + programmes.length) % programmes.length);
  };

  return (
    <div className="ibx-ecosystem-card" data-slide={activeIndex} aria-live="polite">
      <div className="ibx-ecosystem-card__count" aria-hidden="true">
        {String(activeIndex + 1).padStart(2, "0")} / {String(programmes.length).padStart(2, "0")}
      </div>
      <p className="ibx-kicker">{programme.eyebrow}</p>
      <h3><span>{accent}</span>{titleWords.length > 0 ? ` ${titleWords.join(" ")}` : ""}</h3>
      <p className="ibx-ecosystem-card__copy">{programme.description}</p>
      <Link className="ibx-button" href={programme.href}>{programme.cta}</Link>

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
