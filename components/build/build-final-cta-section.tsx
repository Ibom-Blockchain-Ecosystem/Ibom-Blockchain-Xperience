import { buildFinalCtaContent } from "@/content/build/final-cta";

export function BuildFinalCtaSection() {
  const { actionHref, actionLabel, subtitle, title } = buildFinalCtaContent;

  return (
    <section className="build-final-cta" id="apply" aria-labelledby="build-final-cta-title">
      {/* Two shallow code strips with a black gap between them for the copy.
          The code artwork is a centred background so its scale is tuned in CSS. */}
      <div className="build-final-cta__band build-final-cta__band--top" aria-hidden="true" />

      <div className="build-final-cta__gap">
        <h2 id="build-final-cta-title">{title}</h2>
        <p className="build-final-cta__subtitle">{subtitle}</p>
        <a
          className="build-final-cta__button"
          href={actionHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {actionLabel}
        </a>
      </div>

      <div className="build-final-cta__band build-final-cta__band--bottom" aria-hidden="true" />
    </section>
  );
}
