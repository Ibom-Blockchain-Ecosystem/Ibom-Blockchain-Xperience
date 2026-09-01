"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { buildPathways, type BuildPathwayIcon } from "@/content/build/pathways";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
const pathwayRevealStart = .04;
const pathwayRevealEnd = .96;
const pathwayRevealDuration = .15;
const scrambleAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const pathwayIconAssets: Record<BuildPathwayIcon, {
  src: string;
  width: number;
  height: number;
}> = {
  play: {
    src: "/brand/build-pathway-play-icon.jpg",
    width: 720,
    height: 720,
  },
};

function getScrambledTitle(title: string, progress: number, rowIndex: number) {
  const characters = Array.from(title);
  const revealProgress = clamp((progress - .06) / .68);
  const resolvedCharacters = Math.floor(revealProgress * characters.length);
  const scrambleTick = Math.floor(progress * 54);

  return characters
    .map((character, characterIndex) => {
      if (character === " " || characterIndex < resolvedCharacters) {
        return character;
      }

      const alphabetIndex = (
        scrambleTick * 7 + rowIndex * 13 + characterIndex * 11
      ) % scrambleAlphabet.length;

      return scrambleAlphabet[alphabetIndex];
    })
    .join("");
}

function PathwayIcon({ icon }: { icon: BuildPathwayIcon }) {
  const asset = pathwayIconAssets[icon];

  return (
    <span className={"build-pathways__icon build-pathways__icon--" + icon} aria-hidden="true">
      <Image
        src={asset.src}
        width={asset.width}
        height={asset.height}
        alt=""
        sizes="64px"
        unoptimized
      />
    </span>
  );
}

export function BuildPathwaysSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isScrollDriven, setIsScrollDriven] = useState(false);
  const [scrambledTitles, setScrambledTitles] = useState(() =>
    buildPathways.map((pathway) => pathway.title),
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrame: number | null = null;

    const updateProgress = () => {
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-section.getBoundingClientRect().top / scrollDistance);
      const pathwayRevealStep = buildPathways.length > 1
        ? (pathwayRevealEnd - pathwayRevealStart - pathwayRevealDuration) /
          (buildPathways.length - 1)
        : 0;
      const nextTitles = buildPathways.map((pathway, index) => {
        const start = pathwayRevealStart + index * pathwayRevealStep;
        const rowProgress = clamp((progress - start) / pathwayRevealDuration);

        section.style.setProperty(`--build-pathways-row-${index}`, rowProgress.toFixed(4));

        return getScrambledTitle(pathway.title, rowProgress, index);
      });

      section.style.setProperty("--build-pathways-progress", progress.toFixed(4));
      setScrambledTitles((currentTitles) => {
        const hasChanged = nextTitles.some((title, index) => title !== currentTitles[index]);
        return hasChanged ? nextTitles : currentTitles;
      });
    };

    const requestProgressUpdate = () => {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = null;
        updateProgress();
      });
    };

    setIsScrollDriven(true);
    updateProgress();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);

      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return (
    <section
      className={"build-pathways" + (isScrollDriven ? " is-scroll-driven" : "")}
      id="pathways"
      ref={sectionRef}
      aria-labelledby="build-pathways-title"
    >
      <div className="build-pathways__stage">
        <h2 id="build-pathways-title" className="sr-only">IBX Build pathways</h2>
        <ol className="build-pathways__list">
          {buildPathways.map((pathway, index) => (
            <li
              className="build-pathways__item"
              key={pathway.title}
              style={{
                "--build-pathways-item-progress": `var(--build-pathways-row-${index})`,
              } as CSSProperties}
            >
              <PathwayIcon icon={pathway.icon} />
              <h3 aria-label={pathway.title}>
                <span
                  className="build-pathways__title-value"
                  aria-hidden="true"
                >
                  {scrambledTitles[index] ?? pathway.title}
                </span>
              </h3>
              <p>
                {pathway.lead ? <strong>{pathway.lead}</strong> : null}
                <span>{pathway.description}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
