"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { tourStops } from "@/data/stops";
import { comingSoonContinents } from "@/data/continents";

const continents = ["Asia", "Europe", "Africa", "North America", "South America"];

type TourExperienceProps = {
  initialScreen?: "landing" | "tour";
  initialCountry?: string;
};

export function TourExperience({ initialScreen = "landing", initialCountry }: TourExperienceProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<"landing" | "tour">(initialScreen);
  const [continentIndex, setContinentIndex] = useState(2);
  const [stopIndex, setStopIndex] = useState(() => {
    const requestedIndex = tourStops.findIndex((item) => item.slug === initialCountry);
    return requestedIndex >= 0 ? requestedIndex : 0;
  });
  const wheelLock = useRef(false);
  const touchStart = useRef(0);
  const idleTimer = useRef<number | null>(null);
  const resumeTimer = useRef<number | null>(null);
  const stop = tourStops[stopIndex];

  const cycleContinent = (direction: number) => {
    setContinentIndex((value) => (value + direction + continents.length) % continents.length);
  };

  const cycleStop = (direction: number) => {
    setStopIndex((value) => (value + direction + tourStops.length) % tourStops.length);
  };

  const enterContinent = useCallback((continent: string) => {
    if (continent === "Africa") {
      setScreen("tour");
      return;
    }
    const destination = comingSoonContinents.find((item) => item.name === continent);
    if (destination) router.push(`/tour/coming-soon/${destination.slug}`);
  }, [router]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (screen === "landing") {
        if (event.key === "ArrowDown") cycleContinent(1);
        if (event.key === "ArrowUp") cycleContinent(-1);
        if (event.key === "Enter") enterContinent(continents[continentIndex]);
      } else {
        if (["ArrowRight", "ArrowDown"].includes(event.key)) cycleStop(1);
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) cycleStop(-1);
        if (event.key === "Escape") setScreen("landing");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [continentIndex, enterContinent, screen]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const clearRotation = () => {
      if (idleTimer.current) window.clearInterval(idleTimer.current);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      idleTimer.current = null;
      resumeTimer.current = null;
    };
    const startRotation = () => {
      clearRotation();
      const advance = screen === "landing" ? () => cycleContinent(1) : () => cycleStop(1);
      const interval = screen === "landing" ? 4200 : 6500;
      idleTimer.current = window.setInterval(advance, interval);
    };
    const restartAfterIdle = () => {
      clearRotation();
      resumeTimer.current = window.setTimeout(startRotation, 5000);
    };
    startRotation();
    window.addEventListener("pointerdown", restartAfterIdle);
    window.addEventListener("touchstart", restartAfterIdle, { passive: true });
    window.addEventListener("wheel", restartAfterIdle, { passive: true });
    window.addEventListener("keydown", restartAfterIdle);
    return () => {
      clearRotation();
      window.removeEventListener("pointerdown", restartAfterIdle);
      window.removeEventListener("touchstart", restartAfterIdle);
      window.removeEventListener("wheel", restartAfterIdle);
      window.removeEventListener("keydown", restartAfterIdle);
    };
  }, [screen]);

  const handleWheel = (delta: number) => {
    if (wheelLock.current || Math.abs(delta) < 12) return;
    wheelLock.current = true;
    if (screen === "landing") cycleContinent(delta > 0 ? 1 : -1);
    else cycleStop(delta > 0 ? 1 : -1);
    window.setTimeout(() => { wheelLock.current = false; }, 560);
  };

  return (
    <main
      id="main-content"
      className="experience-shell"
      onWheel={(event) => handleWheel(event.deltaY)}
      onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientY; }}
      onTouchEnd={(event) => {
        const delta = touchStart.current - event.changedTouches[0].clientY;
        if (Math.abs(delta) > 45) handleWheel(delta);
      }}
    >
      {screen === "landing" ? (
        <section className="landing-screen" aria-labelledby="landing-heading">
          <GridLines />
          <Image className="world-map" src="/images/world-map.jpg" width={735} height={519} alt="" priority />
          <SiteHeader onCountries={() => setScreen("tour")} />
          <h1 id="landing-heading" className="sr-only">Choose a continent to explore the IBX Tour</h1>
          <div className="continent-wheel" role="listbox" aria-label="Choose a continent">
            <p>The IBX movement across borders</p>
            <div className="wheel-items">
              {continents.map((continent, index) => {
                const offset = index - continentIndex;
                const distance = Math.abs(offset);
                return (
                  <button
                    key={continent}
                    type="button"
                    role="option"
                    aria-selected={index === continentIndex}
                    tabIndex={index === continentIndex ? 0 : -1}
                    style={{
                      "--wheel-y": `${offset * 82}px`,
                      "--wheel-x": `${Math.min(distance * distance * 18, 74)}px`,
                      "--wheel-scale": Math.max(.68, 1 - distance * .12),
                      "--wheel-opacity": Math.max(.12, 1 - distance * .29),
                      "--wheel-rotate": `${offset * -7}deg`,
                    } as CSSProperties}
                    onClick={() => index === continentIndex ? enterContinent(continent) : setContinentIndex(index)}
                  >
                    {continent}
                  </button>
                );
              })}
            </div>
            <span className="wheel-caption">{continents[continentIndex]} <i /> Scroll to explore</span>
          </div>
          <footer className="landing-footer-next">
            <span className="landing-powered"><Image src="/images/sponsors/powered-by-tangem.png" width={200} height={24} alt="Powered by Tangem" /></span>
            <span>Adoption <i /> Connection <i /> Expansion</span>
            <button type="button" onClick={() => enterContinent(continents[continentIndex])}>{continents[continentIndex] === "Africa" ? "Enter Africa ↗" : `View ${continents[continentIndex]} ↗`}</button>
          </footer>
        </section>
      ) : (
        <section id="tour" className="tour-screen" aria-label={`${stop.country} tour stop`}>
          <Image key={stop.image} className="tour-hero" src={stop.image} fill sizes="100vw" alt={`${stop.country} — IBX Tour`} priority />
          <div className="tour-overlay" />
          <GridLines dark />
          <SiteHeader dark onCountries={() => setScreen("landing")} />
          <div className="language-block">
            <span>Local welcome</span>
            <strong>{stop.welcome}</strong>
            <small>{stop.languageLabel}</small>
          </div>
          <div className="tour-copy">
            <span>{stop.country} · {stop.region}</span>
            <h2>{stop.city}</h2>
            <p>{stop.intro}</p>
            <button type="button" onClick={() => router.push(`/tour/${stop.slug}`)}>
              <span className="tour-copy__arrow" aria-hidden="true">→</span>
              <strong>Explore {stop.country}</strong>
            </button>
          </div>
          <div className="tour-progress">
            <span><strong>{String(stopIndex + 1).padStart(2, "0")}</strong> / {String(tourStops.length).padStart(2, "0")}</span>
            <div><button onClick={() => cycleStop(-1)} aria-label="Previous country">←</button><button onClick={() => cycleStop(1)} aria-label="Next country">→</button></div>
          </div>
          <div className="country-tabs" role="tablist" aria-label="Tour countries">
            {tourStops.map((item, index) => <button key={item.slug} role="tab" aria-selected={index === stopIndex} onClick={() => setStopIndex(index)}>{item.country}</button>)}
          </div>
        </section>
      )}
    </main>
  );
}

function GridLines({ dark = false }: { dark?: boolean }) {
  return <div className={`grid-overlay ${dark ? "grid-overlay-dark" : ""}`} aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div>;
}
