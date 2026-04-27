---
sidebar_position: 9
title: Maintainer picks
description: How apps are selected for the Maintainer picks section on /apps. Selection criteria, proposal process, quarterly review, and conflict of interest rules.
---

## What Maintainer picks are

The **Maintainer picks** section on [/apps](/apps) is a curated shortlist of applications that page maintainers consider strong starting points for new users. It is a subjective curation by the people who maintain this page — not an institutional endorsement by the Cardano Foundation, IOG, or Emurgo.

Picks are visible at the top of `/apps` and are the first thing a newcomer sees. The bar for inclusion is therefore higher than for the broader showcase.

## Selection criteria

A pick must meet all four:

1. **Category fit.** The app represents a primary user intent (Wallet, DEX, Lending, NFT marketplace, Governance, Explorer, etc.). To keep the section diverse, there is a soft cap of one to two picks per category.
2. **Actively maintained.** Public release, commit activity, social activity, or equivalent signal within the last 12 months. Abandoned-looking projects are removed even if they were good once.
3. **Activity threshold.** For trackable categories (DEX, Lending, Marketplace, Minting, Governance, etc.), the app should be in the top 10 of its category on the [transaction leaderboard](/apps/leaderboard). Non-trackable categories (Educational, Analytics, Explorer, Pool tools) are exempt — judge them on quality alone.
4. **Quality signal.** Either beginner friendly (clear onboarding, low jargon, working defaults) or best in class (most feature-complete, most reliable, most contributed-to). This criterion is subjective and requires a one-line written justification on the proposal.

## Proposing a new pick

1. Open a GitHub issue titled `Maintainer pick proposal: [App Name]`.
2. State which category the app fits into, and which criterion above carries it (especially criterion 4 — write the one-liner).
3. If the category cap (one to two picks) is already full, name which existing pick should be replaced and why.
4. Wait for one other maintainer to second the proposal.
5. If no maintainer raises a blocking objection within **7 days**, the pick is merged into `apps.js` (`favorite` tag set on the entry).

## Removing a pick

A pick can be removed at any time if it clearly fails one of the criteria — for example, a security incident, an apparent abandonment, or a sustained collapse on the leaderboard. Open an issue with the reason; the same 7-day window applies.

Routine removals also happen as part of the quarterly review.

## Quarterly review

Every three months, one maintainer runs a ~30 minute review:

- Diff the current Maintainer picks against the current top 10 per category on the leaderboard.
- Flag stale picks (no activity, dropped out of category top 10, abandoned).
- Surface new candidates (apps that have moved into category top 10 since the last review).
- Open a single summary issue with the proposed adds and removes. Comment window is 7 days, then merge.

## Conflict of interest

Maintainers who contribute to or are employed by a project recuse themselves from voting on that project. They can still answer factual questions about it.

Cardano Foundation employment alone does not disqualify a maintainer from voting on independent projects.

## Why this exists

A flat directory of 120+ apps does not help a newcomer choose. Without curation, ordering falls back to either alphabetical (arbitrary) or transaction volume (which over-rewards a few categories). Maintainer picks gives the page a small, opinionated shortlist that newcomers can trust as a sane starting point — while the rest of `/apps` and the leaderboard remain available for everyone who wants the full picture.

The mechanism is intentionally lightweight: a small group of maintainers, written criteria, public proposals, short comment windows. No committees, no voting weights, no scoring rubrics. If that proves insufficient, the process can be tightened later.
