---
title: active slot coefficient
slug: active-slot-coefficient
short: The protocol parameter that controls the probability a slot is assigned an elected block-producer. On mainnet it is currently 0.05.
category: consensus
aliases: ["f parameter", "f"]
related: [slot, block, ouroboros, k-parameter]
---

A protocol parameter, written `f`, that sets the average fraction of slots in which a stake-pool wins the leader election and is allowed to produce a block. Cardano mainnet currently runs with `f = 0.05`, which combined with one-second slots works out to about one block every 20 seconds on average.

Tuning `f` is a trade-off: a higher value gives more blocks per minute but increases the chance of short forks when two pools happen to win the same slot; a lower value reduces fork risk but slows block production.
