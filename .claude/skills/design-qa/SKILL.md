---
name: design-qa
description: Use this skill whenever the user wants to compare a Figma design to a live engineer implementation, check if a build matches the design, do a design QA, visual diff, or verify that interactive elements (buttons, links, forms, nav) work correctly on a built page. Trigger phrases include: "QA this", "does this match the design?", "compare figma to the build", "visual diff", "design review", "check the engineer output", "does the build match?", "review the implementation against Figma", or any time the user provides both a Figma URL and a live/staging URL and wants a comparison. Always use this skill even if the user phrases it casually, e.g. "can you check if the dev got this right" or "does the live page look like the Figma?".
---

# Design QA Skill

You are a precise design QA reviewer. Compare a Figma design frame against a live/staging implementation, identify every visual and functional discrepancy, and produce a clear, actionable report.

## What you need

- **Figma frame URL** — figma.com link with `node-id`
- **Live URL** — the engineer's implementation

Ask if either is missing.

---

## Step 1: Capture the Figma design

Use `get_screenshot` on the Figma URL. **Read `original_width` from the response** — this is the frame's true canvas width and determines your live page viewport.

Also call `get_design_context` for spacing/padding values, typography, and colour tokens.

---

## Step 2: Set the correct viewport — MOBILE FIRST

Match the live page viewport to `original_width` exactly:
- ≤ 430px → use **390px**
- ≤ 768px → use that width
- > 768px → use **1440px**

Never default to desktop for a mobile frame. Padding errors, layout breaks, and scroll container issues are only visible at the correct viewport.

---

## Step 3: Capture the live page

1. Navigate to the live URL at the correct viewport width
2. Wait for full load (resolve skeleton states, lazy images)
3. Take a full-page screenshot

---

## Step 4: Extract live values — run these scripts before comparing

Before doing any visual comparison, run the following JS snippets in the browser to capture actual live values. Cross-reference each against `get_design_context` from Figma. Document every delta.

### 4a — Font sizes

Target the key text elements — headings, body copy, labels, CTAs, prices, tags. Use `data-testid`, semantic tags, or descriptive class names to scope selectors.

```javascript
// Capture font sizes for key elements
const targets = {
  'H1 / page title':        'h1',
  'H2 / section heading':   'h2',
  'H3 / card heading':      'h3',
  'Body copy':               'p',
  'CTA button':              'button[class*="cta"], a[class*="btn"]',
  'Price':                   '[class*="price"]',
  'Label / tag':             '[class*="label"], [class*="tag"], [class*="badge"]',
  'Nav item':                'nav a',
};

Object.entries(targets).forEach(([label, selector]) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const s = getComputedStyle(el);
  console.log(`${label}: font-size=${s.fontSize}, font-weight=${s.fontWeight}, line-height=${s.lineHeight}, letter-spacing=${s.letterSpacing}`);
});
```

**Compare each value to `get_design_context`.** Flag anything where the computed size diverges from the Figma spec by more than 1px. Weight mismatches (e.g. 400 vs 600) are **Medium–High**; size mismatches ≥ 2px are **High**.

> ⚠️ Do NOT use `getComputedStyle` for `font-weight` alone — it resolves variable fonts incorrectly. Instead read the raw stylesheet rule:
```javascript
// Raw font-weight from stylesheet (more reliable than computed)
Array.from(document.styleSheets).flatMap(s => { try { return Array.from(s.cssRules) } catch { return [] } })
  .filter(r => r.selectorText?.includes('YOUR_SELECTOR'))
  .forEach(r => console.log(r.selectorText, r.style.fontWeight));
```

---

### 4b — Border radius

Capture border radius on cards, buttons, inputs, chips, image containers, and any other rounded elements.

```javascript
const roundedTargets = {
  'Card':            '[class*="card"], [class*="Card"]',
  'Primary button':  'button[class*="primary"], button[class*="cta"], a[class*="btn"]',
  'Secondary button':'button[class*="secondary"]',
  'Input':           'input[type="text"], input[type="email"], input[type="search"]',
  'Chip / tag':      '[class*="chip"], [class*="tag"], [class*="badge"], [class*="pill"]',
  'Image container': '[class*="image"] img, [class*="hero"] img, [class*="product"] img',
  'Modal / drawer':  '[role="dialog"], [class*="modal"], [class*="drawer"]',
};

Object.entries(roundedTargets).forEach(([label, selector]) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const s = getComputedStyle(el);
  console.log(`${label}: border-radius=${s.borderRadius}`);
});
```

**Compare each to Figma.** Even a 4px vs 8px difference reads as visually inconsistent at close inspection — **Medium** severity. Fully rounded (`9999px`) vs slightly rounded (`8px`) on a CTA is **High**.

---

### 4c — Spacing, padding, and gaps

Do NOT rely on visual estimation. Always extract values with JS.

```javascript
const spacingTargets = {
  'Page horizontal padding':  'main, [class*="container"], [class*="wrapper"]',
  'Section vertical padding':  'section, [class*="section"]',
  'Card inner padding':        '[class*="card"], [class*="Card"]',
  'Button padding':            'button[class*="cta"], button[class*="primary"], a[class*="btn"]',
  'Grid / flex gap':           '[class*="grid"], [class*="flex"], [class*="row"]',
  'Stack gap':                 '[class*="stack"], [class*="list"], ul, ol',
};

Object.entries(spacingTargets).forEach(([label, selector]) => {
  const el = document.querySelector(selector);
  if (!el) return;
  const s = getComputedStyle(el);
  console.log(`${label}: padding=${s.padding}, gap=${s.gap}, margin=${s.margin}`);
});
```

**Specific checks:**
- Mobile horizontal padding: Figma commonly specifies 16px or 20px. If live shows 24px+, content width is noticeably narrower — **High** on mobile.
- Grid/flex gap: a 16px gap vs 24px gap in a card grid is clearly visible — **Medium**.
- Button padding: affects perceived size and click target — **Medium**.
- Check responsive breakpoint widths — `max-[390px]` on a 393px viewport never triggers; `max-[430px]` would. Flag if padding only applies at a breakpoint that doesn't match the device.

#### Horizontal scroll containers *(specific check)*
- Any scrollable row of tabs, chips, or cards must be checked for **full-bleed vs contained** layout
- In the Figma, look for elements **deliberately clipped at the screen edge** — a tab label cut off by the frame edge signals scroll-reveal intent
- On live, check whether the container has side margins (`mx-4`, `mx-6`, etc.) preventing it reaching screen edges
- Verify `overflow-x-auto` containers can actually overflow — if all items fit within the padded width, scroll never triggers and the feature is broken

---

## Step 5: Visual comparison

Work through every category. For each issue: state *where*, *what the Figma shows*, *what the live shows*. Use the extracted values from Step 4 as your source of truth — do not eyeball sizes.

### Layout & structure
- Proportions, component positions, missing/extra sections

### Typography
- Cross-reference Step 4a results against `get_design_context`
- Font family (fallback fonts?), size, weight, line height, colour, letter spacing, text transform
- Text content (wrong copy is a bug)

### Spacing, padding, and gaps
- Cross-reference Step 4c results against `get_design_context`
- Flag all padding/gap deltas ≥ 4px at mobile, ≥ 8px at desktop

### Border radius
- Cross-reference Step 4b results against Figma spec
- Flag any element where rounding category differs (none / slight / medium / pill)

### Colour & visual style
- Background colours, button colours, hover states
- Border colours, widths, shadows, gradients, overlays
- Image presence and content

### Content type of data elements
- Verify the *type* of information shown in stat/icon rows matches the spec — not just that values render
- Example: benefit icons ("Low fat", "40+ Flavours") vs nutrition macros ("2.7g Carbs", "1.8g Fats") communicate entirely different things — wrong type is **High** severity

---

## Step 6: Interaction testing — verify OUTCOMES, not just clicks

For every interactive element, confirm the expected DOM change happened after the click. A click that registers but changes nothing is a Fail.

### How to verify outcomes

```javascript
// Tab/filter active state moved
document.querySelector('[aria-selected="true"], .is-active, [aria-pressed="true"]')?.textContent

// Content updated
document.querySelector('[data-expanded="true"], [aria-expanded="true"]')?.textContent?.substring(0, 60)

// Card count changed (for filters)
document.querySelectorAll('.card, [class*="flavour"] h3').length

// Value updated
document.querySelector('[data-price], [class*="price"]')?.textContent
```

A tab passes only when ALL three are true:
1. Clicked tab gains active state
2. Previously active tab loses active state
3. Content area updates to reflect the new selection

### What to test

- **Product type / category tabs** — content, images, price all update
- **Filter tabs (e.g. All / Best Sellers / Natural)** — card grid filters; active state moves; card count changes
- **Dropdowns / selectors** — open, show options, update selected value
- **Accordions** — expand/collapse, `aria-expanded` toggles, content transitions
- **Image galleries** — thumbnails update main image; prev/next arrows advance slides
- **Subscription toggles** — price updates
- **Buttons (ATC, CTA)** — trigger expected action
- **Anchor links (`href="#section"`)** — mark as "verify manually" — extension-controlled browsers do not reliably trigger native anchor scroll behaviour, so automated click tests will give false negatives. Confirm with the user instead.

---

## Step 7: Write the QA report

```
Design QA Report
Page / Frame: [name] Figma source: [URL] Live URL: [URL] Figma frame width: [e.g. 393px mobile] Viewport tested: [e.g. 390px — matches Figma frame] Date: [today]
```

### Visual discrepancies table

| # | Location | Design spec | Live implementation | Severity |
|---|----------|-------------|---------------------|----------|

Severity:
- **High** — visible, brand-impacting, breaks layout or user flow
- **Medium** — noticeable on inspection, affects polish or conversion
- **Low** — subtle, minor

### Interaction test results table

| # | Element | Expected | Actual | Status |
|---|---------|----------|--------|--------|

Use ✅ Pass / ❌ Fail / ⚠️ Verify manually

### Summary

```
Visual discrepancies: X (High: N, Medium: N, Low: N) Interaction tests: X passed, X failed, X to verify manually
Overall status: 🟢 Approved / 🟡 Approved with minor fixes / 🔴 Needs rework
Top priorities:

1. [most critical]
2. [second]
```

---

## QA principles

- **Match viewport to Figma frame.** Check `original_width` every time. Never assume desktop.
- **Always extract values with JS — never eyeball.** Font size, border radius, padding, and gap values must be captured with `getComputedStyle` scripts before any comparison. Visual estimation introduces error; extracted values are the source of truth.
- **Font-weight: read from stylesheet, not computed styles.** `getComputedStyle` resolves variable fonts to a numeric value that can mask incorrect weight. Parse `document.styleSheets` for the raw rule value.
- **Border radius is a first-class check.** Every rounded element (cards, buttons, inputs, chips, image containers) must be compared to the Figma spec. Rounding category mismatches (none / subtle / medium / pill) are always visible.
- **Padding at mobile is high-impact.** On a 393px frame, 40px vs 16px padding removes 48px of content width. Always extract and compare.
- **Responsive breakpoints affect padding — verify the breakpoint actually fires.** `max-[390px]` on a 393px frame never triggers. Check the breakpoint value matches the viewport.
- **Clicks require outcome verification.** Use JS to confirm DOM changes — not just that the cursor landed near an element.
- **Horizontal scroll containers are full-bleed by design.** A clipped element in the Figma is intentional. Margins that prevent full-bleed are a bug.
- **Check the type of data shown, not just that data renders.** Benefit icons vs nutrition macros look similar but communicate completely different things.
- **Anchor links need manual verification.** `element.click()` and even computer-tool clicks on `href="#section"` links do not reliably trigger native browser anchor scroll in extension-controlled tabs — always ask the user to confirm these work.
- **Be specific about failures.** "Tab doesn't work" → "Clicking '+Collagen': no active state change, no content update, `aria-pressed` stays false."
- **Note additions not in spec** (extra badges, new tabs) — may be intentional. Flag but don't fail.
- **Stale design data** — price/review count differences are usually dynamic content. Flag as Low.
