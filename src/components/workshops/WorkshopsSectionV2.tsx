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
    <section 
      id="workshops" 
      data-qa="workshops-section" 
      className="section-gap-lg container-page bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface))/0.3] px-8 py-16" 
      aria-labelledby="workshops-heading"
      style={{ 
        padding: '64px 32px !important',
        gap: '24px !important',
        minHeight: 'auto !important'
      }}
    >
      <h2
        id="workshops-heading"
        className="text-3xl leading-[36px] mb-12 text-[hsl(var(--text-strong))]"
        style={{ marginBottom: '48px !important' }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-[hsl(var(--text-muted))] mb-10" style={{ marginBottom: '40px !important' }}>{subtitle}</p>
      ) : null}
      <div 
        className="card p-0 overflow-hidden min-w-0 shadow-lg"
        style={{ minHeight: 'auto !important' }}
      >
        {children}
      </div>
    </section>
  );
}
