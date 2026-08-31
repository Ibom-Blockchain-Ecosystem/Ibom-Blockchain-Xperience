"use client";

import { useEffect, useRef } from "react";
import { buildCommunityContent } from "@/content/build/community";

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

const easeInOut = (value: number) => value * value * (3 - 2 * value);

function BuildCommunityScene() {
  return (
    <div className="build-community__scene" aria-hidden="true">
      {/* The untouched source guarantees the exact opening frame. The aligned
          transparent layers take over only when the scroll animation begins. */}
      <span className="build-community__scene-layer build-community__scene-background" />
      <span className="build-community__scene-layer build-community__scene-hand build-community__scene-hand--left" />
      <span className="build-community__scene-layer build-community__scene-hand build-community__scene-hand--right" />
      <span className="build-community__scene-layer build-community__scene-code build-community__scene-code--left" />
      <span className="build-community__scene-layer build-community__scene-code build-community__scene-code--slash" />
      <span className="build-community__scene-layer build-community__scene-code build-community__scene-code--right" />
      <span className="build-community__scene-layer build-community__scene-source" />
    </div>
  );
}

export function BuildCommunitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let measurementFrame: number | null = null;
    let motionFrame: number | null = null;
    let previousMotionTimestamp: number | null = null;
    let targetProgress = 0;
    let renderedProgress = 0;
    let hasRenderedInitialFrame = false;

    const renderProgress = (progress: number) => {
      const stageWidth = stageRef.current?.clientWidth ?? window.innerWidth;
      const isCompact = window.innerWidth <= 680;

      const sourceFade = easeInOut(clamp((progress - .04) / .20));
      const handProgress = easeInOut(clamp((progress - .12) / .48));
      const handOpacity = 1 - easeInOut(clamp((progress - .38) / .24));
      const codeProgress = easeInOut(clamp((progress - .28) / .42));
      const codeExitProgress = easeInOut(clamp((progress - .62) / .25));
      const codeOpacity = 1 - easeInOut(clamp((progress - .72) / .15));
      const backgroundOpacity = 1 - easeInOut(clamp((progress - .64) / .24));
      const copyProgress = easeInOut(clamp((progress - .80) / .20));
      const handDistance = stageWidth * (isCompact ? .22 : .34);
      const codeDistance = stageWidth * (isCompact ? .14 : .20);
      const codeExitDistance = stageWidth * (isCompact ? .24 : .38);

      section.style.setProperty("--build-community-source-opacity", (1 - sourceFade).toFixed(4));
      section.style.setProperty("--build-community-hand-opacity", handOpacity.toFixed(4));
      section.style.setProperty("--build-community-left-hand-x", (-handDistance * handProgress).toFixed(2) + "px");
      section.style.setProperty("--build-community-right-hand-x", (handDistance * handProgress).toFixed(2) + "px");
      section.style.setProperty("--build-community-left-hand-rotation", (-3 * handProgress).toFixed(2) + "deg");
      section.style.setProperty("--build-community-right-hand-rotation", (3 * handProgress).toFixed(2) + "deg");
      section.style.setProperty("--build-community-background-opacity", backgroundOpacity.toFixed(4));
      section.style.setProperty("--build-community-code-opacity", codeOpacity.toFixed(4));
      section.style.setProperty("--build-community-left-code-x", (-(codeDistance * codeProgress + codeExitDistance * codeExitProgress)).toFixed(2) + "px");
      section.style.setProperty("--build-community-right-code-x", (codeDistance * codeProgress + codeExitDistance * codeExitProgress).toFixed(2) + "px");
      section.style.setProperty("--build-community-slash-rotation", (-15 * codeProgress).toFixed(2) + "deg");
      section.style.setProperty("--build-community-code-scale", (1 + codeProgress * .04).toFixed(4));
      section.style.setProperty("--build-community-copy-opacity", copyProgress.toFixed(4));
      section.style.setProperty("--build-community-copy-y", (24 * (1 - copyProgress)).toFixed(2) + "px");
      section.style.setProperty("--build-community-copy-scale", (.94 + copyProgress * .06).toFixed(4));
      section.style.setProperty("--build-community-copy-blur", ((1 - copyProgress) * 5).toFixed(2) + "px");
    };

    const animateToTarget = (timestamp: number) => {
      const difference = targetProgress - renderedProgress;

      if (Math.abs(difference) < .0005) {
        renderedProgress = targetProgress;
        renderProgress(renderedProgress);
        motionFrame = null;
        previousMotionTimestamp = null;
        return;
      }

      const elapsed = previousMotionTimestamp === null
        ? 1000 / 60
        : Math.min(timestamp - previousMotionTimestamp, 50);
      const damping = 1 - Math.exp(-9 * (elapsed / 1000));

      // A frame-rate independent catch-up gives wheel, trackpad, and touch
      // scrolling a restrained, cinematic inertia in either direction.
      renderedProgress += difference * damping;
      renderProgress(renderedProgress);
      previousMotionTimestamp = timestamp;
      motionFrame = window.requestAnimationFrame(animateToTarget);
    };

    const beginMotion = () => {
      if (motionFrame !== null) {
        return;
      }

      previousMotionTimestamp = null;
      motionFrame = window.requestAnimationFrame(animateToTarget);
    };

    const measureTargetProgress = () => {
      measurementFrame = null;
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      targetProgress = clamp(-section.getBoundingClientRect().top / scrollDistance);

      if (!hasRenderedInitialFrame) {
        renderedProgress = targetProgress;
        renderProgress(renderedProgress);
        hasRenderedInitialFrame = true;
        return;
      }

      beginMotion();
    };

    const requestProgressUpdate = () => {
      if (measurementFrame !== null) {
        return;
      }

      measurementFrame = window.requestAnimationFrame(measureTargetProgress);
    };

    measureTargetProgress();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);

      if (measurementFrame !== null) {
        window.cancelAnimationFrame(measurementFrame);
      }

      if (motionFrame !== null) {
        window.cancelAnimationFrame(motionFrame);
      }
    };
  }, []);

  return (
    <section
      className="build-community"
      id="community"
      ref={sectionRef}
      aria-labelledby="build-community-title"
    >
      <div className="build-community__stage" ref={stageRef}>
        <BuildCommunityScene />

        <div className="build-community__copy">
          <h2 id="build-community-title">{buildCommunityContent.title}</h2>
          <p>{buildCommunityContent.description}</p>
        </div>
      </div>
    </section>
  );
}
