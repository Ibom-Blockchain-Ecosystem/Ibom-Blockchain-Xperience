"use client";

import { useEffect, useState } from "react";

const CYCLE_MS = 30 * 86_400_000; // 30 days

// A perpetual loop, not a countdown to a real date — there isn't a
// confirmed one yet (see the caption below the rings). Phase is derived
// from absolute epoch time (not page-load time), so every visitor sees
// the same position in the cycle at the same real moment, and it just
// keeps counting down and resetting to 30 days on its own.
function remainingTime(now: number) {
  const elapsed = now % CYCLE_MS;
  const difference = CYCLE_MS - elapsed;
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

// Ring "fullness" is purely decorative — days doesn't have a natural
// cycle length the way hours/minutes/seconds do, so 30 is just a round
// reference, not a claim about how long the wait actually is.
const RING_MAX = { days: 30, hours: 24, minutes: 60, seconds: 60 } as const;

// Same orange family at decreasing weight per ring — reads as one brand
// palette, not a rainbow of arbitrary colours.
const RING_COLOR = { days: "#f94902", hours: "#e05a1c", minutes: "#c96832", seconds: "#b17048" } as const;

function Ring({ value, unit, label }: { value: number; unit: keyof typeof RING_MAX; label: string }) {
  const size = 60;
  const stroke = 4.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / RING_MAX[unit]);
  const offset = circumference * (1 - progress);

  return (
    <div className="ibx-ring-countdown__unit">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={RING_COLOR[unit]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <strong className="ibx-ring-countdown__value">{String(value).padStart(2, "0")}</strong>
      <span className="ibx-ring-countdown__label">{label}</span>
    </div>
  );
}

export function RingCountdown({ label, caption }: { label: string; caption: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // `now ?? 0` (not `Date.now()`) deliberately — a live clock read here
  // would differ between the server's render and the client's first
  // render before `useEffect` runs, causing a hydration mismatch. `0` is
  // a fixed, deterministic fallback (renders as a full 30-day ring on
  // both sides); the real time takes over the moment it mounts.
  const time = remainingTime(now ?? 0);

  return (
    <div className="ibx-ring-countdown" aria-label={label}>
      <div className="ibx-ring-countdown__rings">
        <Ring value={time.days} unit="days" label="days" />
        <Ring value={time.hours} unit="hours" label="hrs" />
        <Ring value={time.minutes} unit="minutes" label="mins" />
        <Ring value={time.seconds} unit="seconds" label="secs" />
      </div>
      <p className="ibx-ring-countdown__caption">{caption}</p>
    </div>
  );
}
