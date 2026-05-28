---
title: Pool Saturation
slug: pool-saturation
short: The threshold past which extra delegation to a stake pool stops increasing rewards; a built-in incentive to spread stake across many pools rather than concentrate it in a few.
category: consensus
mentalModel: "A bucket with a marked fill line. Once stake reaches the line, any extra poured in spills over: the pool still receives delegation but rewards-per-ada drop, nudging delegators toward emptier buckets."
related: [stake-pool, delegation, rewards, k-parameter]
---

The saturation point is derived from the `k` parameter (`total stake / k`). Raising `k` lowers the saturation point per pool and pushes for broader decentralization; lowering `k` allows fewer, larger pools.
