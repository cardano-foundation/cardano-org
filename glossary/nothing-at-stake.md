---
title: Nothing-at-Stake
slug: nothing-at-stake
short: The risk that proof-of-stake validators sign every competing fork at once because doing so costs them nothing.
category: consensus
aliases: ["Nothing at Stake"]
link: /research
related: [proof-of-stake, ouroboros, grinding-attack]
---

In a proof-of-stake protocol, signing a block requires no energy spend, so a rational validator could theoretically extend every fork in parallel rather than just the honest one. That would prevent the chain from converging and enable double-spending.

Ouroboros sidesteps the problem by electing exactly one slot leader per slot via VRF and treating equivocation (signing two blocks at the same slot height) as an attributable offence. Key-evolving signatures make any retroactive multi-forking detectable after the fact.
