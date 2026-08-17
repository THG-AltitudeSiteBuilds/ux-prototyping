# Myprotein Design Tokens — Ground Truth Reference

Source: MyProtein AI Design System v1.0.0, last updated 2026-07-20. Extracted primarily from
live production Figma files (June/July 2026), with the typography scale cross-validated
against a secondary "Master DBG" source known to be partially outdated on button styles and
one font.

**This file is a work in progress.** Most values below are `confirmed-live`. A few are
`confirmed in source, specific usage not yet observed` — treat those as directionally correct
but don't fail a page purely on a token whose usage context is still unconfirmed. One
component (`flavourComparisonCard`) is confirmed from the live site but not yet traced back to
Figma. Use judgement: if something you observe live looks intentional and consistent, don't
manufacture a finding just because this file hasn't caught up yet — note it as a design
consistency observation instead of a hard flag.

---

## Colour

| Token | Hex / value | Usage |
|---|---|---|
| `brand.primary.base` | `#003942` | Primary text on light backgrounds, filled button backgrounds, outlined button borders |
| `brand.primary.darker` | `#002227` | Confirmed in source; specific usage not yet observed |
| `brand.secondary.lightest` | `#F8F7F4` | Confirmed in source; specific usage not yet observed |
| `accent.mint` | `#94E5B5` | 2px selection ring on radio/selected states (e.g. subscription toggle radio) |
| `accent.mintLight` | `#BEF6D5` | Savings/promo badges (e.g. "40+ Flavours", "Save £3.77", variation-selector badges) |
| `accent.burntOrange` | `#DD592B` | Active/selected state indicator (e.g. active nav pill underline) |
| `system.white` | `#FFFFFF` | Backgrounds, text on dark/filled surfaces |
| `system.greyLighter` | `#F2F2F2` | Page/section backgrounds, unselected states, borders |
| `system.success` | `#007831` | Success/confirmation messaging, selected radio border |
| `alpha.black10` | `rgba(13,13,13,0.1)` | Shadow layer (soft) |
| `alpha.black30` | `rgba(13,13,13,0.3)` | Shadow layer (contact) |

**Known correction:** earlier guidance for this skill claimed the primary "Add to basket"
button carries a mint (`#94E5B5`) outer ring as a brand signature. The live-verified
`addToBasketButton` spec below shows no mint ring — its border is `2px solid #FFFFFF` with a
`2px #003942` outline offset outside that. Mint is confirmed only as a **selection ring on
radio/toggle states** (e.g. the Single Purchase / Subscription radio). Don't flag a missing
mint ring on the Add to Basket button — flag it if the *radio selection ring* on toggles is
missing or wrong instead.

---

## Typography

**Font family:** Figtree (confirmed live). If DevTools shows a fallback font, that's a bug.

**Weights:** regular 400, medium 500, semiBold 600, bold 700.

**Type scale** — two breakpoints. `bodyText` and `small` are confirmed live at both
breakpoints; the rest come from the secondary source and haven't been individually
cross-checked, so treat size mismatches on those styles as lower-confidence findings.

| Style | Mobile (<600px) | Desktop (>600px) |
|---|---|---|
| xLarge2 | 48px / 52px line-height / -1 tracking | 60px / 64px / 1.1 tracking |
| xLarge1 | 32px / 36px / -0.7 | 41px / 48px / -0.7 |
| large2 | 28px / 32px / -0.5 | 32px / 40px / -0.5 |
| large1 | 25px / 32px / -0.5 | 25px / 32px / -0.5 |
| medium1 | 20px / 28px / 0 | 20px / 28px / 0 |
| bodyText *(confirmed live)* | 16px / 24px / 0.2 | 16px / 24px / 0.2 |
| small *(confirmed live)* | 14px / 20px / 0.2 | 14px / 20px / 0.2 |
| xSmall | 13px / 20px / 0.3 | 13px / 20px / 0.3 |

Flag any computed font size that doesn't match one of these values, any non-Figtree computed
font family, title-case headings, American spellings, or emoji in UI copy.

---

## Spacing

8pt-based scale, observed consistently across live components: **4, 8, 16, 24, 32, 40px.**

Flag padding/margin/gap values outside this set on product cards, buttons, and section gaps.

---

## Radius

Fully rounded / pill shapes are a deliberate, consistent brand signature across buttons, tabs,
and icon buttons — not a one-off style.

| Token | Value | Observed on |
|---|---|---|
| `sm` | 4px | — |
| (component-specific) | 8px | variation selector, selection badges, radio tab, accordion-adjacent chips |
| `lg` | 32px | primary buttons, card, add-to-basket button |
| (component-specific) | 56px | nav pill |
| `pill` | 9999px | button (shared), all pill/fully-rounded elements |

Flag any card, button, or chip whose computed border-radius doesn't match one of: 4, 8, 32,
56, 9999px.

---

## Elevation

| Token | Value | Usage |
|---|---|---|
| `shadow4` | `0px 0px 2px rgba(13,13,13,0.3), 0px 2px 4px rgba(13,13,13,0.1)` | Default card/element elevation |
| `shadow8` | `0px 0px 2px rgba(13,13,13,0.3), 0px 4px 8px rgba(13,13,13,0.1)` | Raised/hover elevation |

---

## Component specs

### Button (shared)
Radius `9999px` (pill), uppercase text, bold, `14px`/`16px` line-height, `42px` height.
- **Outlined** (secondary action, e.g. "Shop Now"): white background, `2px solid #003942`
  border, `#003942` text.
- **Filled** (primary action, e.g. "Shop Bestsellers"): `#003942` background, `1px solid
  #FFFFFF` border, white text.

### Add to Basket button (PDP primary conversion CTA — distinct from the standard button)
`#003942` background, `2px solid #FFFFFF` border with a `2px #003942` outline offset outside
that, `32px` radius, `52px` height, white text, `14px` semiBold, `8px` gap between icon and
label. Duplicates as a **fixed bottom sticky bar** with flavour/price context once the inline
button scrolls out of view — flag if this sticky behaviour is missing on mobile.

### Nav pill
`rgba(255,255,255,0.8)` background, `1px solid #F2F2F2` border, `56px` radius, `48px` height.
Active indicator: `#DD592B` (burnt orange) 4px-radius bar beneath the active label.

### Card
White background, `32px` radius, `16px` padding, `shadow4` elevation, `8px` gap.

### Variation selector (size/flavour picker on PDP)
Shows thumbnail + current selection label + badge (e.g. flavour count, "Best Value"); opens a
bottom drawer on tap. `1px solid #F2F2F2` border (2px on bottom edge), `8px` radius, `5px 9px`
padding, `8px` gap. Thumbnail `56px` square, `8px` radius. Label `14px` medium `#003942`.
Badge: `#BEF6D5` background, `8px` radius, `11px` bold, `#003942` text.

### Selection drawer
Bottom sheet triggered by tapping a variation selector; lists options as a scrollable stack of
variation-selector rows. Close button `32px`, top right.

### Radio tab (Single Purchase / Subscription toggle)
Shared: `8px` radius, `9px` padding, `8px` gap.
- **Selected:** white background, `1px solid #007831` border, mint (`#94E5B5`) radio ring,
  `#007830` radio fill.
- **Unselected:** `#F2F2F2` background and border, white radio ring and fill.
- Price label `14px` semiBold `#003942`. Savings badge: `#BEF6D5` background, `8px` radius,
  `11px` semiBold.

### Accordion (Nutrition / Ingredients / Suggested Use / FAQs on PDP)
`64px` row height, `18px` semiBold header, `32px` chevron icon.

### Flavour comparison card ("Explore more flavours" PDP module)
*Confirmed from live site, not yet cross-checked against Figma — treat as live-confirmed but
undocumented in source.* Image, social-proof badge (dark filled pill, e.g. "Most Reordered"),
title, 1-2 sentence description, dot-scale attribute ratings (Sweetness / Creaminess /
Richness, filled vs unfilled dots out of 5), and a CTA that's a filled disabled button when
selected or a text link when unselected.

---

## PDP page structure (for Step 2 page-type context)

Observed section order on the "NEW PDP" Figma frame, mobile web — use this as the expected
shape of a product detail page when assessing what's missing or out of order:

1. Sticky header (logo, nav, search, account, basket)
2. Promo strip
3. Breadcrumbs
4. Image gallery/carousel
5. Product title + rating summary + trust badges
6. Flavour pill tabs (e.g. Original / +Collagen / Milkshake)
7. Key benefit icons row (protein content, sugar, flavour count, quality)
8. Price + wishlist button
9. Size + Flavour variation selectors
10. Single Purchase / Subscription radio tab
11. Add to basket button + delivery USP + payment methods
12. "Why [Product]" pillars
13. Flavour finder / scroll module
14. Ingredient highlights
15. Frequently bought together bundle
16. Nutritional accordion
17. Brand credentials block
18. Recommended products carousel
19. Footer

This covers PDP only — `references/page-types.md` still needs equivalent structure/goal
definitions for other page types (homepage, PLP, basket, checkout, etc.).

---

## What to always flag (quick reference)

| Issue | Severity |
|---|---|
| Add to Basket button missing sticky bottom-bar behaviour on mobile scroll | High |
| Radio/toggle selected state missing the mint (`#94E5B5`) selection ring | Medium |
| Computed font family isn't Figtree (fallback font showing) | High |
| Body text/small text size off the confirmed-live values (16px / 14px) | High |
| Any other type-scale size off by ≥2px | Medium |
| Border radius category mismatch (e.g. pill button rendering with a small radius) | High on primary CTA, Medium elsewhere |
| Spacing/padding value outside 4/8/16/24/32/40px | Medium |
| Hardcoded hex not in the colour table above, used on a brand-visible element | Medium |
| Mint (`#94E5B5`) or mint-light (`#BEF6D5`) used outside its defined purpose | Low–Medium |
| Burnt orange (`#DD592B`) used on anything other than an active nav indicator | Low |
| Card missing `shadow4`/`shadow8` elevation where other cards on the page have it | Low |
