"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const CAMPAIGN_START = new Date("2026-09-01T00:00:00+01:00").getTime();
const CAMPAIGN_END = new Date("2027-03-31T23:59:59+01:00").getTime();
const RESERVED = 200;
const TOTAL = 1000;

function remainingTime(now: number) {
  const target = now < CAMPAIGN_START ? CAMPAIGN_START : CAMPAIGN_END;
  const difference = Math.max(0, target - now);
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

export function TangemCampaign({ requestUrl }: { requestUrl: string }) {
  const [now, setNow] = useState<number | null>(null);
  const currentTime = now ?? CAMPAIGN_START;
  const countdown = useMemo(() => remainingTime(currentTime), [currentTime]);
  const hasStarted = currentTime >= CAMPAIGN_START;
  const hasEnded = currentTime > CAMPAIGN_END;
  const soldOut = RESERVED >= TOTAL;

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="tour-tangem tour-tangem--campaign" id="tangem">
      <div className="tour-tangem__copy">
          <span className="tour-tangem__powered"><Image src="/images/sponsors/powered-by-tangem.png" width={200} height={24} alt="Powered by Tangem" /></span>
          <h2>Secure your Web3 journey.</h2>
          <p>Reserve a Tangem hardware wallet for <strong>$30</strong> and receive <strong>$5 worth of Bitcoin free</strong>. Sponsored by IBX for collection at your selected country stop.</p>

          <div className="tour-tangem__countdown" aria-label={hasStarted ? "Time remaining in campaign" : "Time until campaign begins"}>
            <span>{hasStarted ? "Offer ends in" : "Reservations open in"}</span>
            <div>
              {Object.entries(countdown).map(([label, value]) => <time key={label}><strong>{String(value).padStart(2, "0")}</strong><small>{label}</small></time>)}
            </div>
          </div>

          <a className={`tour-action tour-action--dark${soldOut || hasEnded ? " is-disabled" : ""}`} href={soldOut || hasEnded ? undefined : requestUrl} target={soldOut || hasEnded ? undefined : "_blank"} rel={soldOut || hasEnded ? undefined : "noopener noreferrer"} aria-disabled={soldOut || hasEnded}>
            {soldOut || hasEnded ? "Sold out" : "Request Tangem wallet"}
          </a>
          <small className="tour-tangem__terms">Maximum three cards per person. No payment is required now. The IBX team will contact you to confirm your reservation and collection.</small>
      </div>

        <div className="tour-tangem__card">
          <Image src="/images/sponsors/tangem-white-card.webp" fill sizes="(max-width: 900px) 90vw, 39vw" alt="Tangem hardware wallet cards" />
          <div className="tour-tangem__sale-tag" aria-label="IBX Tangem flash sale">
            <small>Tour exclusive</small>
            <strong>Flash<br />sale</strong>
            <del>$50</del>
            <span>$30</span>
            <em>+ $5 Bitcoin free</em>
          </div>
          <div className="tour-tangem__progress">
            <p><strong>{RESERVED} / {TOTAL}</strong><span>{TOTAL - RESERVED} cards remaining</span></p>
            <div><i style={{ width: `${(RESERVED / TOTAL) * 100}%` }} /></div>
          </div>
        </div>
    </section>
  );
}
