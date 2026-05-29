---
title: Minimum Pool Cost
slug: min-pool-cost
short: The protocol parameter that sets the floor on the fixed cost a stake pool can declare per epoch, currently 170 ada on mainnet.
category: consensus
level: intermediate
aliases: ["minPoolCost", "Min Pool Cost"]
mentalModel: "A floor under pool operating fees. No pool can advertise a lower fixed cost, even if it would otherwise out-compete others on price; the floor keeps low-cost pools from siphoning all delegation without covering real operating expenses."
related: [stake-pool, pool-saturation, rewards, k-parameter]
---

The parameter is part of Cardano's reward sharing scheme. Before delegator rewards are computed, the pool's declared fixed cost (capped below by `minPoolCost`) and margin are deducted from the gross pool reward; what remains is split pro-rata across delegators.

`minPoolCost` is an economic-group protocol parameter. It is changed through a protocol-parameter governance action ratified by the Constitutional Committee and DReps; stake pool operators do not vote on it, because it is not one of the [security-relevant parameters](/glossary/voting-thresholds) that require an additional SPO vote.
