"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

// A small, generic crossfading slideshow for a single grid tile — same
// pause-on-hover/focus and reduced-motion handling as the other home
// carousels, just without any text overlay of its own.
export function PhotoSlideshow({ images, sizes }: { images: Slide[]; sizes: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, images.length]);

  return (
    <div
      className="ibx-photo-slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          className={`ibx-photo-slideshow__image${index === activeIndex ? " is-active" : ""}`}
          src={image.src}
          fill
          sizes={sizes}
          alt={index === activeIndex ? image.alt : ""}
          aria-hidden={index === activeIndex ? undefined : "true"}
          priority={index === 0}
        />
      ))}

      {images.length > 1 && (
        <div className="ibx-photo-slideshow__dots" aria-label="Choose a photo">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.src}
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
