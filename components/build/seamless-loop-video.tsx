"use client";

import { useEffect, useRef, useState } from "react";

const crossfadeDuration = 720;
const crossfadeLeadTime = .82;

export function SeamlessLoopVideo({ className, src }: { className: string; src: string }) {
  const firstVideoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const players = [firstVideoRef.current, secondVideoRef.current];

    if (players.some((player) => player === null)) {
      return;
    }

    const [firstPlayer, secondPlayer] = players as [HTMLVideoElement, HTMLVideoElement];
    const videoPlayers = [firstPlayer, secondPlayer];
    let activeIndex = 0;
    let isCrossfading = false;
    let resetTimer: number | undefined;

    const playFromStart = (player: HTMLVideoElement) => {
      try {
        player.currentTime = 0;
      } catch {
        // The browser will begin from the first decoded frame once it is ready.
      }

      void player.play().catch(() => {
        // Muted inline video is normally allowed to autoplay. If it is not,
        // the first decoded frame remains as the section artwork.
      });
    };

    const crossfadeToNextPlayer = () => {
      if (isCrossfading) {
        return;
      }

      const outgoingIndex = activeIndex;
      const incomingIndex = outgoingIndex === 0 ? 1 : 0;
      const outgoingPlayer = videoPlayers[outgoingIndex];
      const incomingPlayer = videoPlayers[incomingIndex];

      isCrossfading = true;
      playFromStart(incomingPlayer);
      activeIndex = incomingIndex;
      setActiveLayer(incomingIndex);

      resetTimer = window.setTimeout(() => {
        outgoingPlayer.pause();

        try {
          outgoingPlayer.currentTime = 0;
        } catch {
          // Ignore a browser timing edge while the video is resetting.
        }

        isCrossfading = false;
      }, crossfadeDuration);
    };

    const updateLoop = () => {
      const activePlayer = videoPlayers[activeIndex];

      if (
        Number.isFinite(activePlayer.duration) &&
        activePlayer.duration - activePlayer.currentTime <= crossfadeLeadTime
      ) {
        crossfadeToNextPlayer();
      }
    };

    const startPrimaryPlayer = () => playFromStart(firstPlayer);
    const onEnded = (event: Event) => {
      if (event.currentTarget === videoPlayers[activeIndex]) {
        crossfadeToNextPlayer();
      }
    };

    if (firstPlayer.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startPrimaryPlayer();
    } else {
      firstPlayer.addEventListener("canplay", startPrimaryPlayer, { once: true });
    }

    videoPlayers.forEach((player) => {
      player.addEventListener("timeupdate", updateLoop);
      player.addEventListener("ended", onEnded);
    });

    return () => {
      if (resetTimer !== undefined) {
        window.clearTimeout(resetTimer);
      }

      firstPlayer.removeEventListener("canplay", startPrimaryPlayer);

      videoPlayers.forEach((player) => {
        player.removeEventListener("timeupdate", updateLoop);
        player.removeEventListener("ended", onEnded);
        player.pause();
      });
    };
  }, []);

  return (
    <span className={className + " build-seamless-loop-video"} aria-hidden="true">
      <video
        ref={firstVideoRef}
        className={"build-seamless-loop-video__layer" + (activeLayer === 0 ? " is-active" : "")}
        muted
        playsInline
        preload="auto"
        src={src}
        tabIndex={-1}
      />
      <video
        ref={secondVideoRef}
        className={"build-seamless-loop-video__layer" + (activeLayer === 1 ? " is-active" : "")}
        muted
        playsInline
        preload="auto"
        src={src}
        tabIndex={-1}
      />
    </span>
  );
}
