---
title: DRep Activity Period
slug: drep-activity-period
short: The protocol parameter that sets how many epochs a DRep can go without casting any vote before they are marked inactive and their delegated voting power stops counting until they vote again.
category: governance
level: intermediate
aliases: ["dRepActivity"]
mentalModel: "A use-it-or-lose-it timer on every DRep's authority. A DRep who never shows up loses their delegators' voice automatically; a single vote refreshes the clock."
related: [drep, governance-action, cip-1694, voting-thresholds]
---

The mechanism protects governance from being deadlocked by inactive DReps holding large delegations. When a DRep is marked inactive, ada delegated to them is excluded from the denominator used to compute DRep voting thresholds, so the active electorate's threshold remains achievable.

Activity is restored the moment the DRep casts any vote, including an abstention.
