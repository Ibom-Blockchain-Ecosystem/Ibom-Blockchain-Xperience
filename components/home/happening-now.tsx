"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const destinations = [
  { country: "Nigeria", city: "Abuja", image: "/images/tour/nigeria.webp" },
  { country: "Cameroon", city: "Yaoundé", image: "/images/tour/cameroon.webp" },
  { country: "Benin Republic", city: "Cotonou", image: "/images/tour/benin.webp" },
  { country: "Togo", city: "Lomé", image: "/images/tour/togo.webp" },
  { country: "Côte d’Ivoire", city: "Abidjan", image: "/images/tour/cote-divoire.webp" },
  { country: "Ghana", city: "Accra", image: "/images/tour/ghana.avif" },
] as const;

export function HappeningNow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const destination = destinations[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, []);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + destinations.length) % destinations.length);
  };

  return (
    <section className="ibx-happening" aria-labelledby="ibx-happening-title">
      <div className="ibx-happening__slides" aria-live="polite">
        {destinations.map((item, index) => (
          <Image
            key={item.country}
            className={`ibx-happening__image${index === activeIndex ? " is-active" : ""}`}
            src={item.image}
            fill
            sizes="100vw"
            alt={index === activeIndex ? `${item.city}, ${item.country}, an IBX27 Tour destination` : ""}
            priority={index === 0}
          />
        ))}
      </div>
      <div className="ibx-happening__shade" />

      <div className="ibx-happening__location">
        <span>IBX27 Tour destination</span>
        <strong>{destination.city}, {destination.country}</strong>
      </div>

      <div className="ibx-happening__controls" aria-label="Choose a tour destination">
        <button type="button" onClick={() => move(-1)} aria-label="Previous destination">←</button>
        <div>
          {destinations.map((item, index) => (
            <button
              type="button"
              key={item.country}
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show ${item.city}, ${item.country}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next destination">→</button>
      </div>

      <article className="ibx-newspaper">
        <header>
          <Image src="/brand/ibx-tour-rebrand-black.png" width={3600} height={829} alt="Ibom Blockchain Xperience" />
          <span>Tour edition · 2027</span>
        </header>
        <div className="ibx-newspaper__rule" />
        <p className="ibx-newspaper__eyebrow"><i /> Live tour update</p>
        <h2 id="ibx-happening-title">Happening <span>now</span></h2>
        <h3>The IBX27 Tour is moving across West Africa.</h3>
        <p className="ibx-newspaper__copy">Practical blockchain education, workshops, community sessions and new opportunities delivered directly to local ecosystems.</p>
        <footer>
          <Link className="ibx-button" href="/tour">Follow the tour</Link>
          <span>Building for generations</span>
        </footer>
      </article>
    </section>
  );
}
