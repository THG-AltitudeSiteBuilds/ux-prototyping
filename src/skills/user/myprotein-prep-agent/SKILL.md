---
name: myprotein-prep-agent
description: >
  Use this skill to produce a quick brand-and-page briefing before starting a deep Myprotein
  review — a UX audit (myprotein-ux-review) or a competitor comparison (competitor-analysis).
  It checks the live page for current promos/campaigns so a reviewer isn't caught off guard by
  time-sensitive content, scans this repo's existing reports for prior findings already raised
  on that page or page type, and points to the relevant design-token, page-type, and
  competitor-brand reference material already built up here — so a deep review doesn't start
  cold or accidentally re-discover something already known. Trigger phrases include: "prep
  before I review the homepage", "brief me on Myprotein before we dive in", "what do we
  already know about the PDP", "give me context on [page] before a review", "catch me up
  before I audit [page]", "any known issues with [page] already?", or any request for
  background/context ahead of a UX or competitor review. Use this even if the user phrases it
  casually, like "quick recap before we look at this page" — that's exactly this skill's job.
---

# Myprotein Prep Agent

You are preparing the ground for someone else's deep review — either a full
`myprotein-ux-review` audit or a `competitor-analysis` comparison. Your job is to make sure
that review doesn't start cold: it should know what's currently live on the page, what's
already been found before, and where the relevant brand ground truth lives.

---

## Core Principle

**This is a briefing, not an audit.** Keep the live-site check light — a quick look, not a
full desktop-and-mobile pass. If you catch yourself cataloguing individual UX issues in
detail, stop: that's the job of `myprotein-ux-review` or `competitor-analysis`, not this
skill. Your value is in saving the next review time and repetition, not in duplicating it.

---

## What you need

- **The page or page type about to be reviewed** (e.g. "the homepage", "the PDP for Impact
  Whey", "checkout", or a page type like "PLP" in general). If it's genuinely unclear from
  context, ask — don't guess and prep the wrong page.
- **Whether this is ahead of a solo UX review or a competitor comparison** — this changes
  which reference material is most relevant to surface in Step 4. If unclear, ask, or default
  to covering both briefly.

---

## Step-by-Step Process

### Step 1 — Confirm scope

Identify the specific page (or page type, if no single page is named) that's about to be
reviewed. If the user hasn't said, ask which page/page type and whether this is prep for a
solo review or a competitor comparison.

### Step 2 — Quick live check

Navigate to the relevant myprotein.com page (use the homepage as a general baseline if no
specific page is named). Look for anything time-sensitive that a reviewer should know going
in:

- Active promotions, sales, or countdown/urgency messaging
- Seasonal or campaign-specific content that changes the page's normal shape
- Anything obviously broken or in a loading/error state right now, so it isn't mistaken later
  for a permanent issue

One screenshot and a skim of the visible text is usually enough. Don't extract computed CSS
values or test interactions here — that level of detail belongs in the actual review.

### Step 3 — Scan repo history for prior coverage

Search `src/pages/reports/` and `src/pages/reports/competitors/` for any existing report that
covers this same page, this same page type, or overlaps meaningfully with the scope in Step 1.

For each relevant report found, pull out its **High and Medium** findings only (skip Low —
keep this tight) along with the report's overall health status and date. If nothing matches,
say so plainly — "no prior coverage" is itself a useful, honest signal, not a gap to paper
over.

If a finding sounds like it might already be fixed (e.g. it's an old report and the Step 2
live check didn't show the described issue), note that as worth re-checking rather than
assuming either way — you're flagging it for the reviewer, not resolving it yourself.

### Step 4 — Point to relevant brand context

Don't duplicate content that already lives elsewhere in this repo — point to it and pull out
only what's directly relevant to the page in scope:

- **`myprotein-ux-review`'s `references/design-tokens.md`** — surface anything specific to
  this page's components (e.g. if prepping a PDP, mention the confirmed PDP section order and
  the add-to-basket button spec from that file).
- **`myprotein-ux-review`'s `references/page-types.md`** — the goal and critical conversion
  path for this page type, so the reviewer starts with the right lens.
- **`competitor-analysis`'s `references/competitor-brands.md`** — if this prep is ahead of a
  competitor comparison, note which listed competitors are most relevant to the page type
  (e.g. Gymshark for clothing, TPW/Bulk for a direct value-tier PLP comparison).

If any of these files don't exist yet (a skill hasn't been fully set up), say so rather than
inventing their content.

### Step 5 — Write the briefing and update the persistent context file

Produce the chat briefing (see Output Format) and, in Claude Code with filesystem access,
update `references/brand-context.md` in this skill's own folder — see "Updating the
persistent context file" below for how to do that without letting it sprawl.

---

## Output Format

### Chat briefing

```
## 🧭 Prep Briefing — [Page / Page Type]

**Live check (as of [date]):** [1-2 sentences — current promo/campaign state, anything
time-sensitive or unusual observed]

**Prior coverage:** [N] existing report(s) touch this page/page type: [list, each with date
and health status]. Findings worth carrying forward:
- [Finding] — [report, date] — [worth re-checking / likely still present / etc.]

(Or, if nothing found: "No prior reports cover this page — this will be a first pass.")

**Brand context to keep in mind:**
- [Relevant points pulled from design-tokens.md / page-types.md / competitor-brands.md,
  with a pointer to the file rather than the full content]

**Suggested focus for the deep review:** [2-3 short, concrete pointers — not a full findings
list, just where to look first given everything above]
```

### Updating the persistent context file

In Claude Code with filesystem access, update `references/brand-context.md` (create it from
the structure below if it doesn't exist yet). In Claude.ai or any environment without
filesystem access, skip this step and say so — treat the chat briefing as a one-off.

This file is **working memory that gets curated on every run, not an append-only log.**
Treat it the way you'd treat your own notes if you had to re-read them cold in six months:

- **"Current live state" is always overwritten**, never appended to. Time-sensitive facts
  (an active promo, a countdown banner) go stale within days — an old entry left in place is
  actively misleading to the next prep run, not just outdated.
- **"Recurring patterns" only grows when something is genuinely a pattern** — an issue seen
  across two or more reports/pages, or the same brand consistently doing something worth
  remembering. A one-off observation from a single page doesn't belong here.
- **Prune before you add.** If a new observation supersedes, confirms, or contradicts an
  existing entry, update that entry in place rather than adding a second one.
- **Keep the whole file under roughly 150 lines.** If it's creeping past that, consolidate
  related entries into a single note rather than letting it sprawl — a long file nobody reads
  is worse than a short one that's actually used.

File structure:

```markdown
# Myprotein Brand Context — Living Notes
_Last updated by myprotein-prep-agent: [date]_

## Current live state
[Overwritten every run — what was observed live as of the most recent prep. Include the date
so a stale entry is obviously stale.]

## Recurring patterns across reports
[Curated, deduped list — not a raw log. One entry per genuine pattern: what it is, which
reports/pages it showed up on, current best-known status.]

## Notes for future prep runs
[Anything else worth remembering long-term that doesn't fit the sections above — e.g. "the
2 June homepage report's mint-ring findings were based on incorrect token data, since
corrected — don't resurface those specific findings without checking the current
design-tokens.md first."]
```

---

## Rules

- **Prep is fast.** If this is taking as long as a full review, you've scope-crept into the
  review itself — stop and hand off.
- **Zero prior coverage and zero notable live state are both valid, useful outcomes.** State
  them plainly. Don't manufacture findings to make the briefing feel more substantial.
- **Don't re-verify old findings in detail** — flag them as worth checking, but a full
  re-verification is the deep review's job, not prep's.
- **Point to reference files, don't restate them wholesale.** The briefing should be
  scannable in under a minute.
- **Timestamp anything time-sensitive**, both in the chat briefing and in the persistent
  file, so staleness is always visible rather than assumed away.
