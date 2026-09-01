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
          <h2 id="coming-up-next-title">Uyo <span>·</span> London <span>·</span> Thailand <span>·</span> New York</h2>
          <p>Four continents. One blockchain movement.</p>
        </div>

        <div className="summit-upcoming__tape summit-upcoming__tape--lower" aria-hidden="true">
          <span>IBX SUMMIT · NIGERIA · LONDON · THAILAND · UYO · COMING SOON · IBX SUMMIT · NIGERIA</span>
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
            <div className="summit-event-card__image">
              <Image src="/brand/summit/Tour-City-London.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit London logo" />
            </div>
            <p>United Kingdom</p>
            <h3>IBX London</h3>
            <div><span>Date ·To be Annouced</span><span>Venue · To be Annouced</span></div>
            <span className="summit-event-card__status">Updates coming soon</span>
          </article>

          <article className="summit-event-card">
            <div className="summit-event-card__image">
              <Image src="/brand/summit/Tour-City-Thailand.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit Thailand logo" />
            </div>
            <p>Thailand</p>
            <h3>IBX Thailand</h3>
            <div><span>Date ·To be Annouced</span><span>Venue · To be Annouced</span></div>
            <span className="summit-event-card__status">Updates coming soon</span>
          </article>

          <article className="summit-event-card">
            <div className="summit-event-card__image">
              <Image src="/brand/summit/Tour-City-New-York.png" fill sizes="(max-width: 700px) 100vw, 28vw" alt="Ibom Blockchain Xperience Summit New York logo" />
            </div>
            <p>United States</p>
            <h3>IBX New York</h3>
            <div><span>Date ·To be Annouced</span><span>Venue · To be Annouced</span></div>
            <span className="summit-event-card__status">Updates coming soon</span>
          </article>
        </div>
      </div>
    </section>
  );
}
