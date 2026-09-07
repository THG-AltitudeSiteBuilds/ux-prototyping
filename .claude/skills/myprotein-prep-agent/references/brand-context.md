# Myprotein Brand Context — Living Notes
_Last updated by myprotein-prep-agent: not yet run_

This file is maintained by the `myprotein-prep-agent` skill and updated on every prep run —
see that skill's "Updating the persistent context file" section for the curation rules
(overwrite the live-state section, only add genuine patterns, prune before adding, keep this
under ~150 lines).

## Current live state

_No prep run yet. Once one runs, this section will hold a dated snapshot of what was observed
live on the page checked most recently — treat any entry here as stale after a few days._

## Recurring patterns across reports

_No patterns logged yet. Entries will appear here once the same issue or brand behaviour has
shown up across two or more reports._

## Notes for future prep runs

- The 2 June 2026 homepage report (`myprotein-homepage-2026-06-02.astro`) raised a "Quick Buy
  button missing the mint outer ring" finding (and related hero-CTA recommendation), based on
  an assumption that mint (`#94E5B5`) is the primary CTA signature. That assumption was
  incorrect — confirmed live design-token data shows mint is a radio/toggle selection ring,
  not a button signature. Don't resurface those specific findings without checking the
  current `myprotein-ux-review/references/design-tokens.md` first.
