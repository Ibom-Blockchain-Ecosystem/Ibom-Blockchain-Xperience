import Link from "next/link";
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
        <Link className="build-final-cta__button" href={actionHref}>
          {actionLabel}
        </Link>
      </div>

      <div className="build-final-cta__band build-final-cta__band--bottom" aria-hidden="true" />
    </section>
  );
}
