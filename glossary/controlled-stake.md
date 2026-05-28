---
title: Controlled Stake
slug: controlled-stake
short: The total ada associated with a stake pool, combining operator pledge and all delegations.
category: consensus
aliases: ["Pool Stake"]
related: [live-stake, stake-pool, pledge, pool-saturation]
---

The total ada associated with a stake pool: the operator's own pledge plus every delegator's ada. Controlled stake is what the protocol uses to weight a pool's chance of producing blocks in a given epoch, proportional to the pool's share of total controlled stake across the network.

A pool's controlled stake is compared against the saturation threshold (set by the `k` parameter) to decide whether additional delegation will keep earning full rewards.
