# Tailwind Config Reference — Myprotein Project

This file is the source of truth for mapping Figma design tokens to Tailwind CSS classes.
Used by the `figma-engineering-handover` skill.

---

## Colour tokens

Colours in the Tailwind config are defined as OKLCH CSS variables (not hex). The hex values
below are the resolved equivalents for reference. Always use the Tailwind class name, not hex.

| Token / Figma variable    | Hex approx  | Tailwind class          |
|---------------------------|-------------|-------------------------|
| surface                   | #f2f2f2     | bg-surface              |
| primary-500               | #003942     | bg-primary-500 / text-primary-500 |
| primary-400               | #004f5c     | bg-primary-400 / text-primary-400 |
| primary-300               | #006678     | bg-primary-300          |
| accent-100                | #94e5b5     | bg-accent-100           |
| accent-200                | #ff5b5a     | bg-accent-200           |
| white / on-primary        | #ffffff     | bg-white / text-white   |
| neutral-100               | #f5f5f5     | bg-neutral-100          |
| neutral-200               | #e5e5e5     | bg-neutral-200          |

### Opacity modifiers
Express as Tailwind opacity modifier on the class: e.g. `bg-accent-100/40` for accent-100 at 40% opacity.

### Unmapped colours (no token — flag with ⚠️)
- #DD592B (orange/coral — appears in `.search` CSS only, no design token)
- rgba(255,164,163,0.4) (pink — used for "Was" price pill, no design token)

---

## Typography

### Font families
| Figma font  | CSS family  | Tailwind class   |
|-------------|-------------|------------------|
| Figtree     | Figtree     | font-secondary   |
| Apparel     | Apparel     | font-primary     |

### Font sizes
| px  | Tailwind class  | Line height |
|-----|-----------------|-------------|
| 12  | text-xs         | 16px        |
| 14  | text-sm         | 16px        |
| 16  | text-base       | 24px        |
| 18  | text-lg         | 28px        |
| 20  | text-xl         | 28px        |
| 24  | text-2xl        | 32px        |
| 30  | text-3xl        | 36px        |

### Font weights
| Weight | Tailwind class  |
|--------|-----------------|
| 400    | font-normal     |
| 500    | font-medium     |
| 600    | font-semibold   |
| 700    | font-bold       |

---

## Spacing scale

Tailwind default spacing (1 unit = 4px):

| px  | Tailwind class |
|-----|----------------|
| 4   | 1 (p-1, gap-1, m-1, etc.) |
| 8   | 2              |
| 12  | 3              |
| 16  | 4              |
| 20  | 5              |
| 24  | 6              |
| 28  | 7              |
| 32  | 8              |
| 40  | 10             |
| 48  | 12             |
| 64  | 16             |

Non-scale values have no standard class — use arbitrary value syntax: `p-[18px]` and flag with ⚠️.

---

## Border radius

| px    | Tailwind class  |
|-------|-----------------|
| 4     | rounded         |
| 6     | rounded-md      |
| 8     | rounded-lg      |
| 12    | rounded-xl      |
| 16    | rounded-2xl     |
| 24    | rounded-3xl     |
| 9999  | rounded-full    |

32px has no standard class → use `rounded-[32px]` and flag with ⚠️.

---

## Notes

- This config was captured June 2026. If the engineering team updates tailwind.config.js
  or themes/index.js, this reference file should be updated to match.
- The config uses `import themes from './src/themes/index.js'` — colour OKLCH values are
  defined in themes/index.js, not hardcoded in tailwind.config.js.
