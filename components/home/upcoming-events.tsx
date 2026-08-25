import Image from "next/image";

export function ComingUpNext() {
  return (
    <section className="summit-upcoming summit-upcoming--signal-only" aria-labelledby="coming-up-next-title">
      <div className="summit-upcoming__signal">
        <div className="summit-upcoming__tape" aria-hidden="true">
          <span>IBX · COMING UP NEXT · IBX SUMMIT · COMING UP NEXT · IBX · COMING UP NEXT</span>
        </div>

        <div className="summit-upcoming__lockup">
          <p>Coming up next</p>
          <div className="summit-upcoming__logo">
            <Image src="/brand/programmes/ibx-summit-logo.png" width={1800} height={333} alt="Ibom Blockchain Xperience Summit — Built for This" />
          </div>
          <h2 id="coming-up-next-title">Nigeria <span>·</span> London <span>·</span> Dubai</h2>
          <p>Three destinations. One African blockchain movement.</p>
        </div>

        <div className="summit-upcoming__tape summit-upcoming__tape--lower" aria-hidden="true">
          <span>IBX SUMMIT · NIGERIA · LONDON · DUBAI · COMING SOON · IBX SUMMIT · NIGERIA</span>
        </div>
      </div>
    </section>
  );
}

export function SummitDestinations() {
  return (
    <section className="summit-destinations" id="upcoming-events" aria-labelledby="summit-destinations-title">
      <h2 className="summit-destinations__title" id="summit-destinations-title">Next Stop</h2>

      <div className="summit-upcoming summit-upcoming--destinations-only">
        <div className="summit-upcoming__grid">
          <article className="summit-event-card">
            <div className="summit-event-card__image summit-event-card__image--logo">
              <Image src="/brand/summit/ibx-summit-new-york.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit New York logo" />
            </div>
            <p>New York</p>
            <h3>IBX New York</h3>
            <div><span>Date · Coming soon</span><span>Venue · Coming soon</span></div>
            <span className="summit-event-card__status">Registration coming soon</span>
          </article>

          <article className="summit-event-card">
            <div className="summit-event-card__image summit-event-card__image--logo">
              <Image src="/brand/summit/ibx-summit-london.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit London logo" />
            </div>
            <p>United Kingdom</p>
            <h3>IBX London</h3>
            <div><span>Date · Coming soon</span><span>Venue · Coming soon</span></div>
            <span className="summit-event-card__status">Updates coming soon</span>
          </article>

          <article className="summit-event-card">
            <div className="summit-event-card__image summit-event-card__image--logo">
              <Image src="/brand/summit/ibx-summit-dubai.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit Dubai logo" />
            </div>
            <p>United Arab Emirates</p>
            <h3>IBX Dubai</h3>
            <div><span>Date · Coming soon</span><span>Venue · Coming soon</span></div>
            <span className="summit-event-card__status">Updates coming soon</span>
          </article>
        </div>
      </div>
    </section>
  );
}
