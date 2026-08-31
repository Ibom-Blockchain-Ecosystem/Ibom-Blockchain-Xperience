"use client";

import { useEffect, useState } from "react";
import { buildTimelineContent } from "@/content/build/timeline";

const timelineStepDuration = 1900;

export function BuildTimelineSection() {
  const { application, milestones, subtitle, title } = buildTimelineContent;
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isMotionEnabled, setIsMotionEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setIsMotionEnabled(!reducedMotion.matches);

    updateMotionPreference();
    reducedMotion.addEventListener("change", updateMotionPreference);

    return () => reducedMotion.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!isMotionEnabled) {
      setActiveMilestone(0);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveMilestone((current) => (current + 1) % milestones.length);
    }, timelineStepDuration);

    return () => window.clearInterval(interval);
  }, [isMotionEnabled, milestones.length]);

  return (
    <section
      className="build-timeline"
      id="timeline"
      aria-labelledby="build-timeline-title"
    >
      <span className="build-timeline__chevron" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/brand/build-pathway-hash-loop.mp4"
          tabIndex={-1}
        />
      </span>

      <div className="build-timeline__content">
        <header className="build-timeline__intro">
          <h2 id="build-timeline-title">{title}</h2>
          <p>{subtitle}</p>
          <a
            className="build-timeline__action"
            href={application.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {application.label}
          </a>
        </header>

        <ol
          className={"build-timeline__milestones" + (isMotionEnabled ? " is-animated" : "")}
          data-active-step={activeMilestone}
          aria-label="IBX Build timeline"
        >
          {milestones.map((milestone, index) => {
            const isActive = isMotionEnabled
              ? index === activeMilestone
              : "active" in milestone && milestone.active;

            return (
              <li
                aria-current={isActive ? "step" : undefined}
                className={isActive ? "is-active" : undefined}
                key={milestone.date}
              >
                <strong>{milestone.date}</strong>
                <span>{milestone.label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <span className="build-timeline__pillars" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src="/brand/build-pathway-hash-loop.mp4"
          tabIndex={-1}
        />
      </span>
    </section>
  );
}
