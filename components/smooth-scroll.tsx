"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Inertia / momentum scrolling for the whole site — mounted once in the
// root layout. Renders nothing; it just owns a Lenis instance (and its
// rAF loop) for the lifetime of the page. Honours reduced-motion by
// never starting.
//
// This operates on the native document scroll (no `wrapper`/`content`
// options), rather than virtualising scroll into its own transformed
// element — so `position: sticky` sections (the "IBX so far" stack) and
// scroll-driven IntersectionObservers (carousel pause-on-view) keep
// working exactly as before; Lenis is just smoothing the same
// `window.scrollY` changes, not replacing the scroll mechanism.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      // easeOutExpo — quick pickup, long glide to rest.
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      anchors: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
