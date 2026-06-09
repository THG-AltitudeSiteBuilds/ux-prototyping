# CLAUDE.md — ux-prototyping repo context

This file gives Claude Code the context it needs to work in this repo without asking
repeated setup questions.

---

## What this repo is

A static site built with **Astro** that hosts UX research outputs for the Myprotein design
team — competitor analysis reports, UX review outputs, and agent guides. It is deployed on
Vercel at `https://5d38e669.thgaltitude.com`.

This is not the Myprotein production site. It is a prototyping and research tool used by
the UX team to store and share structured outputs from Claude-powered agent workflows.

---

## Tech stack

- **Framework:** Astro (static output, no SSR)
- **Styling:** Plain CSS via `<style>` blocks in `.astro` files — no Tailwind, no CSS modules
- **Components:** `.astro` components in `src/components/`
- **Pages:** `.astro` pages in `src/pages/`
- **Assets:** `src/assets/` — images referenced via static imports in frontmatter
- **Deployment:** Vercel (auto-deploys on push to `main`)

---

## Key layout components

- `ReportLayout.astro` — wraps all report and agent guide pages. Import as
  `import ReportLayout from '@/components/ReportLayout.astro'`
- `OpportunityCard.astro` — used in competitor analysis reports to render a single
  opportunity finding. Accepts `title`, `competitor`, `viewport`, `categories`,
  `opportunityId` props, and named slots: `what`, `why`, `opportunity`

---

## CSS design tokens (CSS custom properties)

These variables are defined in the global stylesheet and are available in every `.astro` file:

```css
--color-primary: #003942         /* Myprotein teal-dark — headings, CTAs */
--color-mint: #8ca5a9            /* Myprotein mint — accents */
--color-text-heading: #003942
--color-text-body: #5d5a56
--color-bg-card: #ffffff
--color-bg-muted: #fbf7f4        /* Warm off-white */
--card-border: 1px solid rgba(0, 57, 66, 0.1)
--card-shadow: 0 4px 16px rgba(0, 57, 66, 0.08)
--radius-card: 12px
--radius-chip: 9999px
```

---

## Page structure

```
src/
  pages/
    index.astro                        — site home
    reports/
      competitors/
        index.astro                    — competitor reports listing (manual reports array)
        [slug].astro                   — individual competitor analysis report
    agents/
      competitor-analysis.astro        — agent guide page
  components/
    ReportLayout.astro
    OpportunityCard.astro
  assets/
    reports/
      competitors/
        [report-slug]/                 — screenshots for that report
```

---

## How competitor analysis reports work

Each report is a single `.astro` file named `[page-type-slug]-competitor-analysis-[YYYY-MM-DD].astro`
and placed in `src/pages/reports/competitors/`.

After creating the file, **also add an entry to the manual `reports` array** in
`src/pages/reports/competitors/index.astro`. The array controls the reports listing page.
Without this step the report exists as a page but won't appear in the index.

```js
{
  title: 'Product Listing Page — Huel, TPW, Optimum Nutrition, Healf, Bulk, Naked Nutrition',
  competitor: 'Huel · TPW · ON · Healf · Bulk · Naked Nutrition',
  pageType: 'Product Listing Page',
  date: '2026-06-09',
  slug: 'plp-competitor-analysis-2026-06-09',
  opportunityCount: 14,
},
```

---

## Browsing competitor pages (important)

`mcp__Claude_in_Chrome__navigate` is **blocked on most external domains**. Use this pattern
instead:

1. Open the URL with `mcp__Control_Chrome__open_url`
2. Wait 2–3 seconds for the page to render
3. Read the content via AppleScript:

```bash
osascript << 'EOF'
tell application "Google Chrome"
  set windowList to every window
  repeat with w in windowList
    set tabList to every tab of w
    set tabIndex to 1
    repeat with t in tabList
      if URL of t contains "competitor-domain.com" then
        set active tab index of w to tabIndex
        set index of w to 1
        return execute t javascript "document.body.innerText.slice(0,8000)"
      end if
      set tabIndex to tabIndex + 1
    end repeat
  end repeat
end tell
EOF
```

**One-time Chrome requirement:** View → Developer → Allow JavaScript from Apple Events
must be ticked. The user does this once; Chrome remembers it.

---

## Git and deployment

- Branch: `main`
- Remote: `https://github.com/THG-AltitudeSiteBuilds/ux-prototyping.git`
- Push to `main` triggers an automatic Vercel deploy (usually under 2 minutes)
- The user pushes via GitHub Desktop or `git push` — do not attempt SSH push

---

## Skills

Agent skills live in:
`~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/.../skills/`

Active skills in this project:
- `competitor-analysis` — runs competitor vs Myprotein page comparisons
- `myprotein-ux-review` — structured UX review of a Myprotein page
- `myprotein-prep-agent` — pre-analysis prep: summarise brand context before a deep review
- `design-qa` — design QA checklist against the Myprotein design system
