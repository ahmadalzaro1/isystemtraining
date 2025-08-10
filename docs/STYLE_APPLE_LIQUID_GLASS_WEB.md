# Apple-style Liquid Glass (Web) — Light-only

Material
- Matte-first. Translucency is optional via .glass-allow-blur and only for chrome (nav/sheets/cards/hero CTAs).
- Hairline borders, subtle inset highlight, calm elevation (elev-1/elev-2).

Typography
- H1 40/44, H2 28/32, H3 22/28, Body 16/24, Small 13/20; font stack: system sans.

Motion
- 150–220ms, easing cubic-bezier(.25,.8,.25,1); honor prefers-reduced-motion.

Tokens (light)
- --surface, --surface-2, --text-strong, --text-muted, --border, --accent-a

Utilities
- .glass (matte), .glass-allow-blur (optional), .glass-pressable, .focus-ring

Buttons (variants)
- primaryMinimal, secondaryOutline, glassPrimary, glassSecondary (additive; keep defaults).

Recipes
- Cards/Calendar: bg-surface or surface2, border-[hsl(var(--border))], hairline dividers, text tokens.
- Today/event pills: rounded-full; Today bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))].
- Overlays: bg-black/40 for modals; no backdrop-blur on long text surfaces.

Accessibility
- Visible focus ring via .focus-ring; maintain ≥ AA contrast on text and controls.
