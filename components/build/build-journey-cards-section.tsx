"use client";

import { useEffect, useRef, useState } from "react";
import { buildJourneyCards } from "@/content/build/journey-cards";

type CardSlot = "active" | "previous" | "next" | "away";
// The reference has a compact, constantly moving card deck. This leaves enough
// time to take in the fuller IBX copy before the next card takes focus.
const cardCycleDuration = 9000;

function getCardSlot(index: number, activeIndex: number, total: number): CardSlot {
  const offset = (index - activeIndex + total) % total;

  if (offset === 0) return "active";
  if (offset === 1) return "next";
  if (offset === total - 1) return "previous";

  return "away";
}

export function BuildJourneyCardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const cardCount = buildJourneyCards.length;

  useEffect(() => {
    const section = sectionRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreferences = () => {
      setPrefersReducedMotion(motionQuery.matches);
    };

    updatePreferences();
    motionQuery.addEventListener("change", updatePreferences);

    if (!section || motionQuery.matches) {
      setIsVisible(true);

      return () => {
        motionQuery.removeEventListener("change", updatePreferences);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { threshold: .16 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || !isVisible) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % cardCount);
    }, cardCycleDuration);

    return () => window.clearInterval(interval);
  }, [cardCount, isPaused, isVisible, prefersReducedMotion]);

  const showPreviousCard = () => {
    setIsPaused(true);
    setActiveIndex((current) => (current + cardCount - 1) % cardCount);
  };

  const showNextCard = () => {
    setIsPaused(true);
    setActiveIndex((current) => (current + 1) % cardCount);
  };

  return (
    <section
      className={
        "build-journey" +
        (isVisible ? " is-visible" : "") +
        (prefersReducedMotion ? " prefers-reduced-motion" : "")
      }
      id="journey"
      ref={sectionRef}
      aria-labelledby="build-journey-title"
    >
      <h2 id="build-journey-title" className="sr-only">
        More ways to build with IBX
      </h2>

      <div
        className="build-journey__deck"
        aria-roledescription="carousel"
        onFocusCapture={() => setIsPaused(true)}
        onPointerDown={() => setIsPaused(true)}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setIsPaused(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "touch") setIsPaused(false);
        }}
      >
        {buildJourneyCards.map((card, index) => {
          const slot = getCardSlot(index, activeIndex, cardCount);
          const isActive = slot === "active";

          return (
            <article
              className={"build-journey__card build-journey__card--" + slot}
              key={card.id}
              aria-label={card.eyebrow + ": " + card.title}
            >
              <div className="build-journey__card-body">
                <p className="build-journey__eyebrow">{card.eyebrow}</p>
                <h3>{card.title}</h3>

                <div className="build-journey__copy">
                  {card.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {card.items ? (
                  <ul className="build-journey__list">
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}

                {card.closing ? (
                  <div className="build-journey__closing">
                    {card.closing.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </div>

              {isActive ? (
                <nav className="build-journey__controls" aria-label="Card navigation">
                  <span>
                    {String(index + 1).padStart(2, "0")} / {String(cardCount).padStart(2, "0")}
                  </span>
                  <div>
                    <button type="button" onClick={showPreviousCard} aria-label="Show previous card">
                      <span aria-hidden="true">←</span>
                    </button>
                    <button type="button" onClick={showNextCard} aria-label="Show next card">
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </nav>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
