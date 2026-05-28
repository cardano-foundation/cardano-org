---
title: k parameter
slug: k-parameter
short: The protocol parameter that sets the target number of saturated stake pools for healthy decentralization.
category: consensus
level: advanced
aliases: [k, "Desired Pool Count"]
related: [pool-saturation, stake-pool, delegation, a0]
---

A network parameter that defines the target number of saturated stake pools. The protocol uses `k` to compute the saturation threshold (`total stake / k`); once a pool crosses that threshold, additional delegation yields diminishing returns, nudging delegators toward smaller pools.

Raising `k` distributes stake across more pools and improves decentralization; lowering it concentrates stake in fewer, larger pools.
