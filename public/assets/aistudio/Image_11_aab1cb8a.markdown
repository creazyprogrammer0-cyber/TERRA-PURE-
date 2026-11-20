---
name: Terra Pure
colors:
  surface: '#faf9f6'
  surface-dim: '#dadad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#eeeeea'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ed'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#97472e'
  on-secondary: '#ffffff'
  secondary-container: '#fe997a'
  on-secondary-container: '#772f18'
  tertiary: '#002d1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#00452e'
  on-tertiary-container: '#75b393'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3a0a00'
  on-secondary-fixed-variant: '#793019'
  tertiary-fixed: '#b1f0ce'
  tertiary-fixed-dim: '#95d4b3'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#0e5138'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an aesthetic that marries editorial organic luxury with technical agro-processing precision. Built for an enterprise-to-consumer audience that demands absolute ingredient transparency and sustainable origin verification, the interface balances raw botanical heritage with modern industrial clarity.

The visual direction draws from high-end agricultural journalism and precise supply chain manifests:
- **Heritage Craftsmanship:** Editorial serif titles convey agrarian provenance, artisan quality, and lineage.
- **Processing Precision:** Monospaced data tags, structural hairline dividers, and stark tabular layouts provide certified laboratory and export-grade transparency.
- **Tactile Restraint:** Generous breathing room, subtle warmth in backgrounds, and soft ambient light eliminate corporate coldness while maintaining executive credibility.

## Colors

The palette is derived directly from soil, harvest canopy, and fired earth. The primary default mode is light, rooted in an unbleached botanical substrate.

- **Primary (`#1B4332` - Deep Forest):** Anchor tone for high-emphasis actions, active states, key structural blocks, and brand insignia.
- **Secondary (`#C86D51` - Raw Terracotta):** Warm chromatic counterpoint used for callouts, micro-highlights, batch certifications, and seasonal alerts.
- **Tertiary / Success (`#2D6A4F` - Verified Canopy):** Applied to traceability badges, organic standards compliance, and positive harvest yield metrics.
- **Dark Soil (`#161A17`):** The foundational anchor for deep UI contrasts, industrial footers, and maximum-contrast structural framing.
- **Canvas & Surface Architecture:**
  - Base canvas uses `#F9F8F4` (Warm Alabaster).
  - Elevated cards and inspection panels use `#FFFFFF`.
  - Hairline framing and visual segmentation rely strictly on `#E2DFD7`.
- **Text Tiers:**
  - Primary text: `#1E201E` (Soil Charcoal) maintains deep contrast without clinical black harshness.
  - Secondary text: `#525B54` (Muted Sage) provides accessible optical hierarchy for metadata, batch numbers, and specifications.

## Typography

The type system creates an intentional juxtaposition between classical agricultural lineage and laboratory-grade operational purity.

- **Headings (Playfair Display):** Conveys organic craft, artisanal processing pedigree, and editorial authority. Used with tight negative tracking to maintain modern polish.
- **Interface & Technical Data (Plus Jakarta Sans):** Selected for its geometric structure, wide open apertures, and exceptional tabular legibility across harvest yields, bulk metric weights, and laboratory spec sheets.
- **Labels & Spec Badges:** Formatted with uppercase transforms, medium/semibold weights, and slight optical tracking to enhance legibility at small sizes.

## Layout & Spacing

The layout model is governed by a 12-column responsive fluid grid designed for broad catalog viewports and detailed logistics dashboards.

- **Breakpoints & Layout:**
  - **Desktop (1200px+):** 12 columns, 3rem margins, 1.5rem gutters. Max content container is capped at 1360px for editorial reading balance.
  - **Tablet (768px - 1199px):** 8 columns, 2rem margins, 1.25rem gutters.
  - **Mobile (<768px):** 4 columns, 1.25rem margins, 1rem gutters. Grid collapses into singular vertical streams with horizontal snap reels for certification badges.
- **Vertical Cadence:** Space tokens scale on a baseline 4px/8px modular rhythm, allowing ample negative space around editorial photographs while keeping data displays compact and scannable.

## Elevation & Depth

To reflect agro-industrial honesty, the system completely avoids deep artificial drop shadows and glossy skeuomorphic depth. Visual hierarchy is established through surface stacking and crisp hairline boundaries:

- **Low-Contrast Hairline Framing:** The primary boundary mechanism across all surfaces is a 1px solid border (`#E2DFD7`).
- **Surface Layering:** Depth is conveyed by contrasting pure white `#FFFFFF` component planes against the natural `#F9F8F4` oat canvas.
- **Ambient Shadow (Interactive Focus Only):** Floating menus and active popovers employ an extremely subtle, ground-tinted shadow: `0 8px 24px -4px rgba(22, 26, 23, 0.05), 0 2px 6px -1px rgba(22, 26, 23, 0.03)`.

## Shapes

The geometry reflects agricultural discipline paired with natural organic friendliness:

- **Containers & Cards:** Strictly defined at `12px` (`0.75rem`) border radius, balancing precision edges with a warm tactile profile.
- **Buttons & Interactive Elements:** Fixed at `8px` (`0.5rem`) corner rounding to evoke architectural stability.
- **Badges, Tags, and Status Metrics:** Pill-shaped (`9999px`) to immediately separate regulatory metadata from structured interaction components.

## Components

### Buttons
- **Primary:** Filled with `#1B4332`, text in `#FFFFFF`, corner radius `8px`. Padding: `0.75rem 1.5rem`. Hover state transitions background smoothly to `#161A17`.
- **Secondary / Technical:** Outlined with 1px `#E2DFD7`, background `#FFFFFF`, text `#1E201E`. Hover introduces a warm shift to `#F9F8F4` and border color `#1B4332`.
- **Accent (Terracotta):** Filled with `#C86D51`, text `#FFFFFF`. Reserved for commerce conversion triggers, sample requests, and instant origin downloads.

### Chips & Badges
- **Regulatory Pill Badges:** Full-pill geometry (`rounded-full`), padding `0.25rem 0.75rem`.
- **Organic / Origin Verified:** Subtle `#2D6A4F` tint background (8% opacity), border 1px solid `#2D6A4F`, text `#2D6A4F`, accompanied by a small circular botanical indicator.
- **Batch Code Chips:** Background `#F9F8F4`, border 1px solid `#E2DFD7`, text `#525B54`, displayed in `label-sm` font for industrial provenance tracking.

### Cards & Packaging Surfaces
- Constructed with a pure `#FFFFFF` background, a 1px solid `#E2DFD7` perimeter border, and a corner radius of `12px`.
- Padding defaults to `space-lg` (`1.5rem`).
- Header dividers within cards use hairline rules (`1px solid #E2DFD7`) to cleanly segregate narrative descriptions from technical moisture, purity, and grade specs.

### Input Fields & Selectors
- Background: `#FFFFFF`, 1px border `#E2DFD7`, radius `8px`, height 44px, horizontal padding `1rem`.
- Font: `body-md` in `#1E201E`.
- Focus State: 1px continuous outline in `#1B4332` with an ambient ring: `0 0 0 3px rgba(27, 67, 50, 0.12)`.
- Helper Text & Labelling: Floating or top-stacked labels rendered in `label-md` using `#525B54`.

### Checkboxes & Radio Controls
- Base: 18px x 18px, border 1.5px solid `#E2DFD7`, radius 4px (checkboxes) or 50% (radios).
- Active Checked State: `#1B4332` fill with crisp white vector markings.

### Traceability Spec Lists
- Technical data pairs (e.g., Lot Number, Moisture Content, Processing Date) are structured with alternating hairline rows (`#E2DFD7`), setting secondary labels on the left (`#525B54`) against bold tabular values on the right (`#1E201E`).