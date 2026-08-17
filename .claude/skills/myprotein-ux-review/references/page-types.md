# Myprotein Page Types — Goals & Critical Conversion Paths

Use this to identify what a page is *supposed* to achieve before auditing it. The same issue
(e.g. a busy layout) can be a High severity finding on one page type and a non-issue on
another — always weigh findings against the page's actual job.

If a page doesn't cleanly match one of these types (e.g. a brand story/content page, a
subscription landing page), use judgement: identify the closest analogue below, state which
one you're borrowing criteria from, and note where the page's actual purpose diverges.

---

## Homepage

**Primary goal:** Orient a mixed-intent visitor (new and returning, browsing and
ready-to-buy) and route them into a category, bestseller, or campaign fast.

**Critical conversion path:** Land → understand what Myprotein sells and why it's credible →
find a relevant entry point (category tile, bestseller, search, promo) → click through.

**Must-haves:**
- Clear value proposition above the fold — not just brand/lifestyle imagery
- Obvious, low-friction entry points into top categories and bestsellers
- Search prominent and functional
- Trust signals visible early (ratings, reviews count, "UK's #1" positioning, delivery/returns)
- Current promo/offer clearly stated, not buried

**Common friction points to watch for:** hero carousels that bury the value prop behind
rotating slides; too many competing CTAs above the fold; promo banners that don't say what
the actual discount/offer is; category navigation that requires more than one decision to
reach a product.

---

## Category / Product Listing Page (PLP)

**Primary goal:** Let a visitor with a category-level intent (e.g. "whey protein",
"men's clothing") narrow down to a product fast and with confidence.

**Critical conversion path:** Land on category → scan/filter/sort → compare a shortlist →
click into a PDP or quick-buy.

**Must-haves:**
- Filters and sort that are visible, usable, and actually change the result set
- Product cards with enough info to compare without clicking in (price, rating, key
  variant/flavour indicator, promo badge)
- Clear indication of best-sellers or "recommended" if that's a stated sort option
- Pagination or infinite scroll that doesn't lose the user's place
- Quick-add/quick-buy affordance where offered, and it must actually work (see
  `design-tokens.md` for expected drawer/modal behaviour)

**Common friction points to watch for:** filters that reset on navigation; sort order that
silently doesn't apply; product cards missing price or showing a price range with no
clarification; grid density making cards feel cramped on mobile; "quick buy" that requires
too many extra steps to actually be quick.

---

## Product Detail Page (PDP)

**Primary goal:** Convert a visitor who has already shown product-level intent into an
add-to-basket.

**Critical conversion path:** Land → confirm this is the right product (image, title,
rating) → resolve any decision (flavour, size, subscription vs one-off) → add to basket →
see confirmation → proceed to checkout or continue shopping.

This is the most structurally defined page type — see the confirmed section order in
`design-tokens.md` under "PDP page structure" and use it directly to check whether a section
is missing, out of order, or duplicated.

**Must-haves:**
- Product identity and price legible without scrolling
- Variant/flavour/size selection is unambiguous — the user should always know what they're
  about to add to basket
- Add to basket CTA is prominent and becomes sticky once scrolled out of view (see
  `design-tokens.md` component spec)
- Nutritional/ingredient information available but not blocking the path to purchase
- Reviews and trust signals visible without excessive scrolling

**Common friction points to watch for:** variant selector that doesn't make clear what's
currently selected; subscription vs one-off pricing that's confusing about savings; sticky
add-to-basket bar missing or covering content; accordion sections that default open and push
the CTA far down the page; flavour/size out-of-stock states that aren't communicated until
after the user tries to add to basket.

---

## Basket

**Primary goal:** Confirm the order is correct and remove any reason to abandon before
checkout.

**Critical conversion path:** Review items/quantities/prices → resolve promo codes or
upsells → proceed to checkout with confidence.

**Must-haves:**
- Line items with clear product, variant, quantity, and price
- Easy quantity/removal controls that update totals immediately and visibly
- Delivery cost/threshold clearly stated (e.g. "free delivery over £X" with progress shown)
- Promo code entry that gives clear success/failure feedback
- A single, unambiguous "Checkout" CTA

**Common friction points to watch for:** quantity changes that don't visibly update the
total; upsell/cross-sell modules that push the checkout CTA below the fold; delivery cost
that only appears at checkout (surprise cost — always High severity); promo code field with
no validation feedback.

---

## Checkout

**Primary goal:** Get a user who has already committed to buy through payment with zero
unnecessary friction. This is the highest-stakes page type — abandonment here is the most
costly.

**Critical conversion path:** Enter/confirm delivery details → select delivery method →
enter payment → place order.

**Must-haves:**
- Guest checkout available and not buried behind a forced account creation
- Progress/steps clearly indicated so the user knows how much is left
- Form fields with clear labels, sensible input types (e.g. numeric keyboard for card
  number on mobile), and inline validation with specific error messages
- Order summary visible/accessible throughout, not just at the start
- Payment method options clear, with trust signals (secure checkout badges) near the
  payment form specifically, not just in the footer

**Common friction points to watch for:** any unexpected cost appearing for the first time at
this stage — always High severity; forced account creation; vague error messages ("Please
check this field") instead of specific ones; losing entered data on a validation error;
autofill fighting with custom-styled inputs.

---

## Search Results

**Primary goal:** Get a user who typed a specific query to a relevant product as fast as
possible — treat this like a high-intent PLP.

**Critical conversion path:** Type query → see relevant, ranked results → click through.

**Must-haves:**
- Result relevance — the top results should obviously match query intent
- A clear "no results" or "did you mean" state for typos/misses, never a blank page
- Same product-card and filter expectations as a standard PLP

**Common friction points to watch for:** irrelevant top results; search suggestions that
don't match what's typed; no results state that dead-ends the user instead of offering
alternatives or a route back to browsing.

---

## Quick Buy / Quick Add Modal

**Primary goal:** Let a user add to basket from a listing page without a full PDP visit,
without losing them if they actually need PDP-level detail.

**Critical conversion path:** Trigger modal from PLP/homepage → confirm variant → add to
basket → return to browsing (basket updates without full navigation).

**Must-haves:**
- Modal opens fast and clearly shows which product it's for
- Variant/flavour selection available if the product has variants — don't let a quick-buy
  silently add the wrong variant
- Clear path to the full PDP if the user needs more detail
- Closing the modal doesn't lose the user's place on the underlying page

**Common friction points to watch for:** quick-buy that skips variant selection entirely
when the product has meaningful variants (High — risks wrong-item purchase); modal that
traps focus incorrectly or can't be dismissed easily; basket count/total not updating after
a quick-buy add.

---

## Content / Landing Hub (e.g. clothing hub, campaign pages)

**Primary goal:** Usually a hybrid of homepage (orientation, brand storytelling) and PLP
(route into products) for a specific theme or campaign.

**Critical conversion path:** Land → understand the theme/offer → route into a relevant
sub-category or product.

**Must-haves:** apply homepage criteria for the top of the page (value prop, credibility)
and PLP criteria once the page starts listing products. State explicitly in your review
which parts you're treating as which.

**Common friction points to watch for:** heavy editorial/lifestyle content with no clear
route to purchase; theme messaging that doesn't match what's actually in the linked
category.
