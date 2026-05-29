---
title: Nothing-at-Stake
slug: nothing-at-stake
short: The risk that proof-of-stake validators sign every competing fork at once because doing so costs them nothing.
category: consensus
level: advanced
aliases: ["Nothing at Stake"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, ouroboros, grinding-attack]
---

In a proof-of-stake protocol, signing a block requires no energy spend, so a rational validator could theoretically extend every fork in parallel rather than just the honest one. That would prevent the chain from converging and enable double-spending.

Ouroboros Praos runs a private VRF leader lottery each slot, so a slot may have zero, one, or several eligible leaders, and treats equivocation (one leader signing two different blocks for the same slot) as a provable, attributable offence. Because every block is cryptographically tied to its elected slot leader by a VRF proof and a signature, signing competing forks is detectable rather than free.
