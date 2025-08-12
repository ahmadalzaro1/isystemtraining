import React from "react";

interface WorkshopsSectionV2Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Presentational wrapper for the Workshops / Upcoming Dates section.
// Keeps existing IDs, classes, and structure so data logic remains unchanged.
export function WorkshopsSectionV2({
  title = "Upcoming dates",
  subtitle,
  children,
}: WorkshopsSectionV2Props) {
  return (
    <section id="workshops" className="section-gap container-page" aria-labelledby="workshops-heading">
      <h2
        id="workshops-heading"
        className="text-[28px] leading-[32px] mb-4 text-[hsl(var(--text-strong))]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-[hsl(var(--text-muted))] mb-3">{subtitle}</p>
      ) : null}
      <div className="card p-0 overflow-hidden min-w-0">{children}</div>
    </section>
  );
}
