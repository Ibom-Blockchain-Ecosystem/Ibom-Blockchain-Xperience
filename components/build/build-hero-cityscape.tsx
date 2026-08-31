"use client";

import { useEffect, useRef, useState } from "react";

const INITIAL_REVEAL_DELAY = 1250;
const FINAL_FRAME_DELAY = 2550;
const skylineSlices = Array.from({ length: 8 }, (_, index) => index + 1);

export function BuildHeroCityscape() {
  const cityscapeRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const cityscape = cityscapeRef.current;
    if (!cityscape) return;

    let revealTimer: number | undefined;
    let completeTimer: number | undefined;
    let hasActivated = false;

    const activate = () => {
      if (hasActivated) return;
      hasActivated = true;

      const startAnimation = () => {
        setIsRevealed(true);
        completeTimer = window.setTimeout(() => setIsComplete(true), FINAL_FRAME_DELAY);
      };

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      revealTimer = window.setTimeout(startAnimation, prefersReducedMotion ? 0 : INITIAL_REVEAL_DELAY);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      activate();
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;

          activate();
          observer.disconnect();
        },
        { threshold: 0.2 },
      );

      observer.observe(cityscape);

      return () => {
        observer.disconnect();
        if (revealTimer) window.clearTimeout(revealTimer);
        if (completeTimer) window.clearTimeout(completeTimer);
      };
    }

    return () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      if (completeTimer) window.clearTimeout(completeTimer);
    };
  }, []);

  const className = [
    "build-hero__cityscape",
    isRevealed && "is-revealed",
    isComplete && "is-complete",
  ].filter(Boolean).join(" ");

  return (
    <div ref={cityscapeRef} className={className} aria-hidden="true">
      <span className="build-hero__cityscape-final" />
      <span className="build-hero__cityscape-sun" />
      {skylineSlices.map((slice) => (
        <span className={`build-hero__cityscape-slice build-hero__cityscape-slice--${slice}`} key={slice} />
      ))}
    </div>
  );
}
