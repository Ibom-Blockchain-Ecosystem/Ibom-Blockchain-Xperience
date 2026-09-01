"use client";

import { useEffect, useState } from "react";

function remainingTime(target: number, now: number) {
  const difference = Math.max(0, target - now);
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function Countdown({
  target,
  label,
  className,
}: {
  // Epoch milliseconds (Date.getTime()) for the moment being counted down to.
  target: number;
  label: string;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const time = remainingTime(target, now ?? target);

  return (
    <div className={className} aria-label={label}>
      {Object.entries(time).map(([unit, value]) => (
        <time key={unit}>
          <strong>{String(value).padStart(2, "0")}</strong>
          <small>{unit}</small>
        </time>
      ))}
    </div>
  );
}
