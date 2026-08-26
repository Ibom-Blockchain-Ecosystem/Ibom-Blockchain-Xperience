"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { SpeakerQuote } from "@/content/site/home";

// The quote card images already have the quote, name and title lettered
// into them, so this is a pure image slider — no text overlay of our own.
export function SpeakerQuotes({ quotes }: { quotes: SpeakerQuote[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || quotes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % quotes.length);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, quotes.length]);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + quotes.length) % quotes.length);
  };

  return (
    <div
      className="ibx-so-far__quote-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      {quotes.map((item, index) => (
        <Image
          key={item.image}
          className={`ibx-so-far__quote-slider-image${index === activeIndex ? " is-active" : ""}`}
          src={item.image}
          fill
          sizes="(max-width: 800px) 100vw, 18vw"
          alt={`“${item.quote}” — ${item.name}, ${item.title}`}
          aria-hidden={index === activeIndex ? undefined : "true"}
          priority={index === 0}
        />
      ))}

      <div className="ibx-so-far__quote-slider-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous speaker quote">←</button>
        <div className="ibx-so-far__quote-slider-dots" aria-label="Choose a speaker quote">
          {quotes.map((item, index) => (
            <button
              type="button"
              key={item.name}
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`Show quote from ${item.name}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next speaker quote">→</button>
      </div>
    </div>
  );
}
