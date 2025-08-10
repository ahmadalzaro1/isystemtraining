# APPLE_MINIMAL_CONSISTENCY_SPEC

Source of truth for the site’s Apple-minimal aesthetic. Behavioral logic must remain unchanged. All updates are tokens/utilities/class-only.

Typography
- Font stack: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica Neue, Arial, sans-serif
- Scale (px): h1 40/44, h2 28/32, h3 22/28, body 16/24, small 13/20
- Measure: 70ch max for long copy (use .text-measure)

Colors (light)
- --surface: hsl(0 0% 100%)
- --surface-2: hsl(210 20% 98%)
- --text-strong: hsl(222 28% 12%)
- --text-muted: hsl(222 12% 42%)
- --border: hsl(222 16% 88%)
- --accent-a: hsl(209 100% 50%)

Colors (dark)
- --surface: hsl(222 16% 10%)
- --surface-2: hsl(222 16% 14%)
- --text-strong: hsl(0 0% 100%)
- --text-muted: hsl(222 10% 70%)
- --border: hsl(222 10% 24%)
- --accent-a: hsl(209 100% 50%)

Layout
- Container: .container-page (max 1280px), padding 16px mobile / 24px desktop
- Rhythm: .section-gap (24–32px mobile, 40–64px desktop)
- Card grids: 1/2/3 cols responsive

Component Recipes
- Buttons
  - primaryMinimal: "rounded-lg px-5 py-2.5 bg-[hsl(var(--accent-a))] text-white hover:opacity-90 transition duration-ios ease-ios focus-visible:shadow-focus"
  - secondaryOutline: "rounded-lg px-5 py-2.5 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:bg-black/5 dark:hover:bg-white/5 transition duration-ios ease-ios focus-visible:shadow-focus"
- Inputs (base): "border border-[hsl(var(--border))] bg-[hsl(var(--surface))] rounded-lg focus-visible:shadow-focus"
- Cards (base): "bg-surface2 border border-[hsl(var(--border))] rounded-xl shadow-elev-1 hover:shadow-elev-2 transition-shadow duration-ios ease-ios"
- Banner pill: "inline-flex items-center gap-2 bg-surface border border-[hsl(var(--border))] rounded-pill px-3 py-1.5 shadow-elev-1 text-[hsl(var(--text-muted))]"
- Modal overlay: "fixed inset-0 bg-black/40"
- Modal panel: "bg-surface border border-[hsl(var(--border))] rounded-xl shadow-elev-2 p-6 md:p-8"
- Calendar Today: "rounded-full bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))]"
- Calendar event pill: "rounded-pill px-2 py-0.5 border border-[hsl(var(--border))] text-[12px]"

Motion
- Duration: 150–220ms (tailwind: duration-ios)
- Easing: cubic-bezier(.25,.8,.25,1) (tailwind: ease-ios)
- Reduced motion: opacity-only; avoid large translate/scale

Accessibility
- Focus ring shadow: 0 0 0 4px rgba(10,132,255,.28) (tailwind: shadow-focus)
- AA+ contrast; single H1; semantic landmarks; responsive touch targets

Implementation Constraints
- No logic/behavior changes. Only tokens/utilities/className edits.
- Do not change props or function signatures. Do not reorder DOM affecting layout/behavior.
- Respect prefers-reduced-motion; keep labels and focus-visible states.

Utilities
- .container-page, .section-gap, .text-measure, .hairline, .focus-ring available in CSS utilities.

Verification
- vite build succeeds; routes render; focus rings visible; dark mode legible.
- Overlays use bg-black/40; no backdrop-blur on overlays.
- Cards, calendar, tables, and buttons follow the above recipes.

Rollback
- All changes are class/tokens only. Revert per-file classNames if needed.