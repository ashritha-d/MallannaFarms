import type { ReactNode } from "react";

export function Section({
  children,
  className = "",
  tone = "cream",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "cream" | "white" | "forest";
  id?: string;
}) {
  const toneClass =
    tone === "white" ? "bg-white" : tone === "forest" ? "bg-forest-800 text-cream-50" : "bg-cream-50";
  return (
    <section id={id} className={`py-14 sm:py-20 ${toneClass} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  titleSize = "text-3xl sm:text-4xl",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  /** Override the title's responsive text-size classes (default text-3xl sm:text-4xl) — e.g. for a long heading that needs to fit on one mobile line. */
  titleSize?: string;
}) {
  return (
    <div className={`mb-10 max-w-2xl sm:mb-14 ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <span className={`section-eyebrow ${light ? "text-gold-300" : ""}`}>
          <span className="h-px w-8 bg-current opacity-60" />
          {eyebrow}
        </span>
      )}
      <h2 className={`mt-3 font-semibold ${titleSize} ${light ? "text-cream-50" : "text-forest-900"}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-cream-100/85" : "text-forest-700"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
