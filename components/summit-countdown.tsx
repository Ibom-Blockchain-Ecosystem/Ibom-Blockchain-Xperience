import { Countdown } from "@/components/countdown";

// TODO: placeholder target — swap for the real Summit date the moment
// it's confirmed. Getting this wrong on a live public event page is
// worse than leaving the countdown out, so this is deliberately an
// obvious placeholder (30 days out) rather than a guess dressed up as
// a real date.
const COUNTDOWN_TARGET = new Date("2026-09-30T00:00:00+01:00").getTime();

export function SummitCountdown() {
  return (
    <Countdown
      target={COUNTDOWN_TARGET}
      label="Time until the Summit"
      className="summit-landing__countdown"
    />
  );
}
