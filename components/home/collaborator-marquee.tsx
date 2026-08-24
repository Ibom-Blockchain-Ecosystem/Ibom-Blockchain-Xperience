import Image from "next/image";

const collaboratorLogos = Array.from(
  { length: 64 },
  (_, index) => `/images/collaborators/logo-${String(index + 1).padStart(2, "0")}.png`,
);

export function CollaboratorMarquee() {
  return (
    <section className="ibx-collaborators" id="collaborators" aria-label="IBX collaborators">
      <div className="ibx-collaborators__wall" aria-label="IBX collaborators">
        <div className="ibx-collaborators__viewport">
          <div className="ibx-collaborators__track">
            {[0, 1].map((setIndex) => (
              <div className="ibx-collaborators__set" key={setIndex} aria-hidden={setIndex === 1 ? "true" : undefined}>
                {collaboratorLogos.map((logo, logoIndex) => (
                  <div className="ibx-collaborators__logo" key={`${setIndex}-${logoIndex}-${logo}`}>
                    <Image src={logo} width={220} height={90} sizes="220px" alt="" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
