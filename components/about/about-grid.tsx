"use client";

import { useEffect, useState } from "react";

// Interactive backdrop grid: a full-bleed layer of cells aligned to the visible
// line grid. Each cell lights up in IBX orange on hover and fades back slowly.
export function AboutGrid() {
  const [layout, setLayout] = useState({ size: 72, count: 0 });

  useEffect(() => {
    const measure = () => {
      const size = Math.max(48, Math.min(92, window.innerWidth * 0.06));
      const cols = Math.ceil(window.innerWidth / size) + 1;
      const rows = Math.ceil(window.innerHeight / size) + 6;
      setLayout({ size, count: cols * rows });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div
      className="about-grid"
      aria-hidden="true"
      style={{ ["--cell" as string]: `${layout.size}px` }}
    >
      {Array.from({ length: layout.count }, (_, index) => (
        <i key={index} />
      ))}
    </div>
  );
}
