import Image from "next/image";
import { buildOpportunitiesContent } from "@/content/build/opportunities";

export function BuildOpportunitiesSection() {
  const { status, supporterLabel, supporterName, title } = buildOpportunitiesContent;

  return (
    <section
      className="build-opportunities"
      id="opportunities"
      aria-labelledby="build-opportunities-title"
    >
      <div className="build-opportunities__canvas">
        <Image
          className="build-opportunities__background"
          src="/brand/build-opportunities-card-background.jpg"
          width={1028}
          height={1280}
          sizes="(max-width: 760px) calc(100vw - 24px), 80svh"
          alt=""
          unoptimized
        />

        <header className="build-opportunities__heading">
          <h2 id="build-opportunities-title">{title}</h2>
          <p className="build-opportunities__status">{status}</p>
        </header>

        <p className="build-opportunities__card-copy">{supporterLabel}</p>
        <p className="build-opportunities__closing">{supporterName}</p>
      </div>
    </section>
  );
}
