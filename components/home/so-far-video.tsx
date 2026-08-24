"use client";

import { useRef, useState } from "react";

export function SoFarVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = async () => {
    await videoRef.current?.play();
    setIsPlaying(true);
  };

  return (
    <div className="ibx-so-far__video">
      <video
        ref={videoRef}
        controls={isPlaying}
        playsInline
        preload="metadata"
        poster="/images/home/ibx-so-far-1.jpg"
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src="/videos/ibx27-hero.mp4" type="video/mp4" />
      </video>
      {!isPlaying && (
        <button type="button" onClick={playVideo} aria-label="Play the IBX So Far video">
          <span aria-hidden="true">▶</span>
        </button>
      )}
      <span className="ibx-so-far__video-label">IBX so far · See how it Went</span>
    </div>
  );
}
