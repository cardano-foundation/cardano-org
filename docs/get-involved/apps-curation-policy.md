---
sidebar_position: 3
title: Apps curation policy
description: When apps are removed from the cardano.org showcase. Removal triggers, soft-hint process, quarterly review cadence, and dispute resolution.
---

## Why we curate continuously

The [/apps](/apps) page is a living list. The submission requirements in [Add your application](/docs/get-involved/add-app) gate what gets in, but apps that were live and reachable when listed can later go dark, get abandoned, pivot off Cardano, or quietly stop working. Without periodic pruning, the showcase drifts away from its purpose: helping newcomers see what is **live and functional today** on Cardano.

This page documents how maintainers decide when an existing entry is removed.

## Removal triggers

An app becomes eligible for removal when **any one** of these is met:

### 1. Domain unreachable for 7+ days

The website listed in `apps.js` returns no `2xx` response over a 7-day window. Verified by maintainer via:

```bash
curl -s -L -o /dev/null --max-time 15 -w "%{http_code}" "<website>"
```

A persistent `000` (DNS / connection failure), `404`, or `5xx` across multiple checks counts. Bot-blocking responses (`401`/`403`/`429`) do **not** count; those usually still serve real users.

### 2. Public shutdown announcement

The team has communicated end-of-life on their website, social channels (Twitter/X, Discord, etc.), or to the Cardano community. Examples: planned domain shutdown, project sunset post, "service discontinued" banner.

### 3. Pivot away from Cardano

The product no longer supports Cardano as a primary chain; for example, the team migrated to a different blockchain and Cardano support is deprecated or removed.

### 4. On-chain dormant in trackable categories

For apps in **trackable categories** (DEX, lending, marketplace, bridge, oracle, governance, identity, etc.) where on-chain activity is the meaningful usage signal: zero transactions for 3+ consecutive epochs despite having a `statsLabel` configured.

This trigger does **not** apply to non-trackable categories like `wallet`, `education`, `analytics`, or `social`; transaction count is not a meaningful signal there.

### 5. Silent for 12+ months

No visible activity from the team across **all** of: public source repository (commits), official social account (posts), website (releases, news), or community channels. A team that has been radio-silent for over a year is almost always gone, even if the website happens to still resolve.

### 6. Token-only marketing wrapper (subjective)

The site is primarily a token launch / sales / marketing page with no actual product behind it. This overlaps with the [submission requirements](/docs/get-involved/add-app#requirements) but applies retroactively if a project hollowed out after listing.

### 7. Falls below the quality and design bar (subjective)

The showcase exists to give newcomers a sense of what is possible on Cardano. Apps that present so poorly that they lower a visitor's impression of the ecosystem do not belong here, regardless of technical liveness. Maintainers may flag for removal when **multiple** of the following are observed on the listed website:

- Broken or unstyled UI on a fresh visit (overlapping elements, default browser styling, broken responsive behavior on common screen sizes)
- Pervasive content issues (typos throughout, untranslated placeholder text, lorem ipsum, dead-on-arrival empty states)
- No basic trust signals: no team or "about" information, no documentation, no working contact path, no visible product behind the landing
- A homepage that is so generic it could belong to any project on any chain, with no concrete demonstration of what the app actually does

This trigger is the most subjective and should be applied conservatively. Single rough edges (one typo, one ugly page) are not enough. The bar is: "would a first-time visitor leave with a worse impression of Cardano because of this entry?". When in doubt, document the concerns in the removal PR and let other maintainers weigh in during the 7-day objection window.

## Soft-hint before removal

For triggers **4** (on-chain dormant) and **5** (silent), maintainers should attempt to reach the team before removing:

1. **Day 0:** Open a public ping on the project's preferred channel (Twitter/X reply, Discord, GitHub issue) referencing the showcase entry and asking whether the project is still active.
2. **Day 30:** If no response and the trigger condition still holds, proceed with removal in the next quarterly review.

Triggers **1** (domain dead), **2** (announced shutdown), and **3** (pivot off Cardano) are unambiguous. No soft-hint needed.

## Quarterly review cadence

Once per quarter, a maintainer:

1. Runs the reachability check across all entries (script-based, parallel curl with realistic browser User-Agent).
2. Cross-references trackable apps against `tx-stats.json` for inactivity (≥ 3 epochs zero).
3. Spot-checks the silent-team trigger via Twitter/repo dates for any entry that hasn't been reviewed in 12+ months.
4. Drafts a removal PR listing the affected apps with the trigger that applies, deletes their `apps.js` entry plus screenshot/icon assets, and regenerates `apps-metadata.json` and `apps.llms.txt`.
5. Other maintainers have 7 days to object before merge.

The PR's commit message stays neutral (for example, `chore: remove inactive showcase entries`) without naming the projects in the subject. The body of the PR can list the entries with their trigger reason for transparency.

## Disputing a removal

Project teams who want to be re-added after a removal should reopen via the standard [Add your application](/docs/get-involved/add-app) submission flow, with the same review as any new submission. Past listing does not grant a fast-track.

## Why removals are not a judgment

A removal is not a statement that the project is "bad". It means the showcase can no longer verify that the project is **live and functional on Cardano mainnet today**. Projects that come back to life are welcome to resubmit.

## Page tier: prominent vs compact

The /apps page uses two visibility tiers, set on each entry's category via the `prominent: true | false` flag in `Categories` (see `src/data/apps.js`).

- **Prominent (top of page):** categories whose apps enable on-chain transactions. Wallet, DEX, lending, marketplace, minting, bridge, distribution, game, governance, identity, and notary all lead the **Browse apps by category** carousel.
- **Compact (lower section):** read-only utilities. Analytics, ecosystem directories, block explorers, pool tools, education, and the catch-all `other` bucket appear under **Browse tools by category**, with the same tile styling but a more subdued heading.

Tier is determined by category only; individual entries inherit. There are no per-entry overrides. Apps in compact-tier categories are **not** removal candidates and **not** lower-quality. They serve a different purpose, so they get a different position on the page.

## See also

- [Add your application](/docs/get-involved/add-app): submission criteria and process for new entries
- [Maintainer picks](/docs/get-involved/maintainer-picks): separate curation layer for the editorial shortlist within /apps
