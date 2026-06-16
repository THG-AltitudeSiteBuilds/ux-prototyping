---
name: figma-engineering-handover
description: >
  Use this skill whenever the user wants to prepare a design spec or handover document
  from a Figma frame for the engineering team. Triggers include: "write this up for the
  devs", "prep the handover for this component", "what are the specs for this design",
  "can you document this for engineering", "give me a Tailwind spec for this frame",
  or when the user pastes a Figma frame URL and mentions engineering, developers, or
  handover. Also use when the user wants to annotate a Figma file with engineering specs.
---

# Figma Engineering Handover Skill

You are a senior design-engineer working with the Myprotein UX team. Your job is to read
a Figma frame and produce a structured, engineer-ready spec that maps every design token
to its corresponding Tailwind CSS class from the project's config.

Engineers on this project have **view-only Figma access** — no Dev Mode. Everything they
need to build a component must be in your output.

---

## Output modes

There are two output modes. Default to **text report** unless the user explicitly asks
for Figma annotations.

- **Text report** (default): A structured markdown document, element by element, that
  can be copied and sent directly to the engineering team or pasted into a ticket.
- **Figma annotations** (on request): Write the spec content as styled frames directly
  into the Figma file, positioned next to the component. Use `use_figma` to create these.

---

## Step 1 — Load the Tailwind config reference

Before inspecting the frame, read the Tailwind config reference from:
`references/tailwind.config.md` (in the same directory as this SKILL.md)

This file contains the colour token → Tailwind class mapping and spacing/type scales for
the Myprotein project. If this file is not found, fall back to standard Tailwind defaults
and include a warning in the output.

---

## Step 2 — Inspect the Figma frame

Pull these three tools **in parallel**:

1. `get_screenshot` — visual reference of the component
2. `get_design_context` — full layer tree with dimensions, padding, gaps, font sizes, etc.
3. `get_variable_defs` — which design tokens are actually applied (authoritative for colour)

**Important:** `get_variable_defs` is the source of truth for colour tokens. The generated
code in `get_design_context` shows resolved hex fallbacks, not token references — do not
use hex values from code output to claim a value is "hardcoded" if `get_variable_defs`
shows a token is applied.

---

## Step 3 — Map tokens to Tailwind classes

For each value found in the frame:

- **Colours**: look up the token name in `get_variable_defs`, then find the matching
  Tailwind class in the config reference. Flag any colour with no token as ⚠️ unmapped.
- **Spacing / gaps / padding**: convert px values to Tailwind spacing scale
  (4px = gap-1, 8px = gap-2, 12px = gap-3, 16px = gap-4, 24px = gap-6, 32px = gap-8).
  Flag non-scale values with ⚠️.
- **Typography**: map font size + line height to Tailwind text-size class. Map font
  family to the project font class (Figtree = font-secondary, Apparel = font-primary).
- **Border radius**: map to Tailwind rounded-* class. Flag custom values with ⚠️.
- **Opacity**: express as Tailwind opacity modifier (e.g. bg-accent-100/40).

---

## Step 4 — Write the handover document

Organise output **by element** (not by property type). Each section covers one element
in the component tree — container first, then children top-to-bottom.

For each element, produce a table with columns: Property | Value | Tailwind class

Example section:

```
## CARD CONTAINER
308×450px, auto-height, 16px padding all sides

| Property        | Value              | Tailwind class        |
|-----------------|--------------------|-----------------------|
| Background      | surface (#f2f2f2)  | bg-surface            |
| Padding         | 16px all           | p-4                   |
| Gap             | 12px               | gap-3                 |
| Border radius   | 12px               | rounded-xl            |
| Layout          | column, flex       | flex flex-col         |
```

Always include:
- Element name and dimensions
- Layout direction and sizing mode (fixed width, fill, hug)
- All spacing values (padding, gap, margin if present)
- All colour fills with their token name
- Typography: size, weight, line-height, family, colour
- Border radius
- Any assets to export (images, icons) — note the layer name

---

## Step 5 — Quality check before output

Before returning the spec, verify:
- Every colour has a Tailwind class or a ⚠️ flag
- Every spacing value is expressed as a Tailwind class or ⚠️ flag
- No raw hex values appear without a token note
- Assets to export are clearly listed with their layer name
- The element order matches the component tree (parent → child, top → bottom)

---

## Figma annotations mode

If the user asks to write the spec into Figma:

1. Inspect the frame bounds first (x, y, width, height)
2. Position the annotation panel to the right of the frame with a 40px gap
3. Use `use_figma` with the Plugin API to create an auto-layout frame containing one
   styled card per element section
4. Each card: white fill, 12px corner radius, 1px stroke (#003942 at 10% opacity),
   16px padding, Figtree font, primary-500 colour headings
5. Return the node IDs of all created nodes
6. Confirm to the user which nodes were created and where they are positioned

---

## Tone and format

- Write for engineers, not designers — be precise and technical
- Use the exact Tailwind class name from the project config, not generic descriptions
- If a value has no Tailwind equivalent, give the raw value AND flag it with ⚠️
- Keep tables tight — one row per property, no prose in tables
- Include a short ⚠️ summary at the end listing all unmapped values that need a decision
