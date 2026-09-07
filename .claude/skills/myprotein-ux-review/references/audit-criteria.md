# Audit Criteria — Detailed Checklist

Use this alongside `page-types.md` (what the page should achieve) and `design-tokens.md`
(exact visual ground truth). This file is the "what to actually check" checklist for Steps 3
and 4 of the review. Work through the categories relevant to the page in front of you — not
every category applies to every page type.

For each item, ask: *would this realistically cause a user to hesitate, get confused, or
abandon?* If the honest answer is no, don't raise it as a finding — see the "Don't nitpick"
rule in the main skill file.

---

## Above the fold

- Is it obvious within 2-3 seconds what this page is about and what the user can do here?
- Is the primary action for this page type (browse, add to basket, checkout, search)
  reachable without scrolling?
- Is there a single clear focal point, or are multiple elements competing for attention
  (banner + carousel + popup all at once)?
- Does anything auto-play, auto-rotate, or shift layout in a way that could cause
  mis-clicks or make the user lose their place?

**Severity guide:** missing/unclear primary CTA above the fold on a conversion-critical page
type (PDP, checkout) → High. Competing visual elements causing mild distraction → Low–Medium.

---

## Navigation

- Can a user reach any major category within 1-2 clicks from any page?
- Is search visible and does it behave predictably (visible input, not hidden behind an
  icon-only affordance that's easy to miss)?
- Does the nav communicate current location (active state, breadcrumbs) where relevant?
- On mobile: does the hamburger/menu open reliably, and can the user close it and get back
  to where they were?

**Severity guide:** broken or missing navigation path to a core category → High. Minor
active-state inconsistency → Low.

---

## Product / content presentation

- Are product images high enough quality to judge the product, and do they show the actual
  product (not just lifestyle shots) somewhere in the gallery?
- Is pricing displayed clearly, with any discount/original price relationship unambiguous
  (not just a lower number with no context)?
- Are trust signals (star rating, review count, "bestseller" or similar badges) visible
  without extra interaction?
- Is stock/availability status clear before the user commits to a variant choice?
- For listing pages: is it clear at a glance what differentiates similar products (flavour,
  size, format)?

**Severity guide:** missing or ambiguous price → High. Missing secondary product images or
weak trust signals → Medium.

---

## CTA buttons

- Is the primary CTA visually distinct from secondary actions (not just by colour alone —
  check size, position, and hierarchy too)?
- Is the button label specific and action-oriented ("Add to Basket", "Shop Impact Whey")
  rather than generic ("Click Here", "Submit")?
- Does the button meet contrast requirements against its background (see Accessibility
  section)?
- Does the button look clickable — sufficient size, clear boundary, appropriate cursor/hover
  state on desktop?
- Is there ever more than one CTA competing for the primary action in the same visual area?

**Severity guide:** low-contrast or unclear primary CTA on PDP/checkout → High. Generic
label on a secondary CTA → Low.

---

## Friction points

Look specifically for anything that introduces a **surprise** — cost, step, or requirement
the user didn't expect:

- Delivery costs or thresholds not mentioned until late in the journey
- Forced account creation with no visible guest option
- Extra steps that don't add value (e.g. re-entering information already provided)
- Options presented with unclear consequences (e.g. subscription vs one-off with unclear
  savings or commitment terms)
- Any point where the user's forward progress could stall without a clear next action

**Severity guide:** any first-appearance-at-checkout cost → High, always. Redundant steps
that cost time but not money or clarity → Medium.

---

## Forms and interactive elements

- Do form fields have visible, persistent labels (not just placeholder text that disappears
  on focus)?
- Do input types match the expected data (email keyboard for email, numeric for card/phone
  on mobile)?
- Is validation inline and specific ("Enter a valid postcode") rather than generic or only
  shown after full submission?
- Do dropdowns, accordions, and toggles reflect their state clearly (expanded/collapsed,
  selected/unselected) both visually and — where checkable — via ARIA state?
- Does submitting a form preserve entered data if there's an error, rather than clearing the
  form?

**Severity guide:** data loss on validation error → High. Placeholder-as-label pattern →
Medium (also an accessibility issue — see below).

---

## Copy

Reminder: copy observations are collected separately and never raised as `FindingCard`
tickets — see the Copy Notes handling in the main skill file. Still worth systematically
checking:

- Is the headline benefit-led or just a brand/vibe statement?
- Are CTAs specific to the action and product, or generic?
- Is tone consistent across the page (not switching between casual and formal)?
- Is there any copy that reads as filler/placeholder rather than doing real work toward
  answering a hesitant buyer's question?

---

## Images & media

- Do images load at a resolution appropriate to their display size (not visibly blurry or
  over-compressed)?
- Do carousels/galleries give the user control (pause, manual advance) rather than forcing
  a pace?
- Is there a sensible fallback/placeholder if an image fails to load, rather than a broken
  image icon?

**Severity guide:** broken image on a product user is trying to evaluate → High. Suboptimal
image compression → Low.

---

## Trust & social proof

- Are ratings/review counts visible where a user is making a purchase decision (PLP cards,
  PDP)?
- Are policy signals (returns, delivery, secure payment) visible near the point where a user
  would need reassurance (checkout, add-to-basket), not just in the footer?
- Do badges/claims (e.g. "bestseller", "40+ flavours") look consistent with the actual
  product data shown?

**Severity guide:** missing trust signal near checkout/payment → Medium–High depending on
how far into the funnel. Inconsistent badge claim → Low–Medium.
