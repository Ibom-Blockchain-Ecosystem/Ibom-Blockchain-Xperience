"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Lenis from "lenis";
import { AboutGrid } from "@/components/about/about-grid";
import {
  aboutColumns,
  aboutFinalCta,
  aboutHero,
  aboutNumbers,
  aboutStory,
  aboutTeam,
} from "@/content/site/about";

type Stat = { value: number; suffix?: string; label: string };

function formatCount(value: number) {
  return value >= 10000 ? Math.round(value).toLocaleString("en-US") : String(Math.round(value));
}

// Renders text with **…** emphasis as <strong>, leaving the words untouched.
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function AboutPageClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Smooth (inertia) scrolling -------------------------------------
    let lenis: Lenis | null = null;
    let frame = 0;
    if (!reduced) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        anchors: true,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    // --- Reveal on scroll --------------------------------------------------
    const revealables = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reveal = (el: Element) => el.classList.add("is-in");

    if (reduced) {
      revealables.forEach(reveal);
    }

    const revealObserver = reduced
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                reveal(entry.target);
                revealObserver?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
        );

    if (revealObserver) {
      // Anything already on (or just below) the first screen reveals right away —
      // IO's initial callback can't be relied on for above-the-fold elements.
      const immediate = window.innerHeight * 1.1;
      revealables.forEach((el) => {
        if (el.getBoundingClientRect().top < immediate) reveal(el);
        else revealObserver.observe(el);
      });
    }

    // --- Count-up for statistics ---------------------------------------
    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
    const runCount = (el: HTMLElement) => {
      const target = Number(el.dataset.count ?? "0");
      const suffix = el.dataset.suffix ?? "";
      if (reduced) {
        el.textContent = formatCount(target) + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatCount(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target as HTMLElement);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach((el) => countObserver.observe(el));

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      revealObserver?.disconnect();
      countObserver.disconnect();
    };
  }, []);

  const renderStat = (stat: Stat, index: number) => (
    <div className="about-stat" data-reveal style={{ ["--d" as string]: `${index * 90}ms` }} key={stat.label}>
      <span className="about-stat__value" data-count={stat.value} data-suffix={stat.suffix ?? ""}>
        {formatCount(stat.value)}
        {stat.suffix ?? ""}
      </span>
      <span className="about-stat__label">{stat.label}</span>
    </div>
  );

  return (
    <div className="about-page__body" ref={rootRef}>
      <div className="about-page__glow about-page__glow--top" aria-hidden="true" />

      {/* SECTION 1 — HERO */}
      <section className="about-hero">
        <AboutGrid />
        <p className="about-eyebrow about-eyebrow--pill" data-reveal>{aboutHero.eyebrow}</p>
        <h1 className="about-hero__title" data-reveal style={{ ["--d" as string]: "80ms" }}>
          {aboutHero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="about-hero__lead" data-reveal style={{ ["--d" as string]: "180ms" }}>
          {aboutHero.paragraph}
        </p>
      </section>

      {/* SECTION 2 — OUR STORY */}
      <section className="about-story">
        <div className="about-story__left">
          <Image
            className="about-story__sphere"
            src="/brand/about-wave-sphere.jpg"
            width={1280}
            height={720}
            alt=""
            aria-hidden="true"
            unoptimized
          />
          <p className="about-eyebrow about-eyebrow--pill about-story__pill" data-reveal>
            {aboutStory.eyebrow}
          </p>
          <h2 className="about-heading about-story__heading" data-reveal style={{ ["--d" as string]: "60ms" }}>
            {aboutStory.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <div className="about-story__stats">{aboutStory.stats.map(renderStat)}</div>
        </div>

        <div className="about-story__right">
          {aboutStory.paragraphs.map((block, index) =>
            typeof block === "string" ? (
              <p key={index} data-reveal style={{ ["--d" as string]: `${index * 80}ms` }}>
                {renderRich(block)}
              </p>
            ) : (
              <ul
                key={index}
                className="about-story__list"
                data-reveal
                style={{ ["--d" as string]: `${index * 80}ms` }}
              >
                {block.items.map((item) => (
                  <li key={item}>{renderRich(item)}</li>
                ))}
              </ul>
            ),
          )}
        </div>
      </section>

      {/* SECTION 3 — TWO-COLUMN INFORMATION */}
      <section className="about-columns">
        {aboutColumns.map((column, index) => (
          <article className="about-card" data-reveal style={{ ["--d" as string]: `${index * 100}ms` }} key={column.eyebrow}>
            <p className="about-eyebrow about-eyebrow--pill">{column.eyebrow}</p>
            <h3 className="about-card__title">{column.title}</h3>
            <p className="about-card__copy">{column.paragraph}</p>
            <Link className="about-link" href={column.cta.href}>
              {column.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      {/* SECTION 4 — TEAM / PEOPLE */}
      <section className="about-team">
        <div className="about-team__copy">
          <h2 className="about-heading" data-reveal>
            {aboutTeam.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          {aboutTeam.paragraphs.map((paragraph, index) => (
            <p key={paragraph} data-reveal style={{ ["--d" as string]: `${(index + 1) * 80}ms` }}>
              {paragraph}
            </p>
          ))}
          <Link className="about-button" href={aboutTeam.cta.href} data-reveal style={{ ["--d" as string]: "260ms" }}>
            {aboutTeam.cta.label}
          </Link>
        </div>
        <figure className="about-team__media" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <Image
            src={aboutTeam.image.src}
            width={aboutTeam.image.width}
            height={aboutTeam.image.height}
            alt={aboutTeam.image.alt}
            sizes="(max-width: 900px) 92vw, 46vw"
          />
          <figcaption>{aboutTeam.caption}</figcaption>
        </figure>
      </section>

      {/* SECTION 5 — NUMBERS / IMPACT */}
      <section className="about-numbers">
        <p className="about-eyebrow" data-reveal>{aboutNumbers.eyebrow}</p>
        <h2 className="about-heading about-heading--center" data-reveal style={{ ["--d" as string]: "60ms" }}>
          {aboutNumbers.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="about-numbers__lead" data-reveal style={{ ["--d" as string]: "140ms" }}>
          {aboutNumbers.paragraph}
        </p>
        <div className="about-numbers__stage">
          <Image
            className="about-numbers__sphere"
            src="/brand/about-wave-sphere.jpg"
            width={1280}
            height={720}
            alt=""
            aria-hidden="true"
            unoptimized
          />
          <div className="about-numbers__grid">
            {aboutNumbers.stats.map((stat, index) => (
              <div className="about-numbers__card" data-reveal style={{ ["--d" as string]: `${index * 110}ms` }} key={stat.label}>
                <span className="about-numbers__value" data-count={stat.value} data-suffix={stat.suffix ?? ""}>
                  {formatCount(stat.value)}
                  {stat.suffix ?? ""}
                </span>
                <span className="about-numbers__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — FINAL CTA */}
      <section className="about-final">
        <div className="about-page__glow about-page__glow--bottom" aria-hidden="true" />
        <AboutGrid />
        <Image className="about-final__mark" src="/brand/ibx-rebrand-white.png" width={3600} height={829} alt="Ibom Blockchain Xperience" data-reveal />
        <h2 className="about-final__title" data-reveal style={{ ["--d" as string]: "80ms" }}>
          {aboutFinalCta.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="about-final__lead" data-reveal style={{ ["--d" as string]: "160ms" }}>
          {aboutFinalCta.paragraph}
        </p>
        <Link className="about-button about-button--lg" href={aboutFinalCta.cta.href} data-reveal style={{ ["--d" as string]: "240ms" }}>
          {aboutFinalCta.cta.label}
        </Link>
      </section>
    </div>
  );
}
