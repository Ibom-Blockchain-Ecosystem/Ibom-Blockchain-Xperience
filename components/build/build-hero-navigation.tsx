"use client";

import { useEffect, useState } from "react";
import { buildHeroContent } from "@/content/build/hero";
import { MainNavigation } from "@/components/navigation/main-navigation";

export function BuildHeroNavigation() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 6);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <MainNavigation
      className={`build-page__nav${hasScrolled ? " is-scrolled" : ""}`}
      buildHref="/build"
      brandHref="#build"
      primaryAction={{ href: "/build", label: buildHeroContent.primaryAction }}
      secondaryAction={null}
      brand={{
        src: "/brand/ibx-build-white.png",
        width: 3320,
        height: 372,
        alt: "Ibom Blockchain Xperience Build",
      }}
    />
  );
}
