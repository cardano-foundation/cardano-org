---
title: Stake Snapshot
slug: stake-snapshot
short: A frozen capture of every account's delegation taken at an epoch boundary; what the protocol actually uses to elect block leaders and pay rewards.
category: consensus
aliases: ["Snapshot", "Stake Distribution Snapshot"]
related: [epoch, delegation, rewards, live-stake, controlled-stake]
---

A frozen record of every wallet's stake and which pool it is delegating to, taken at an epoch boundary. The protocol does not use the live delegation set, which changes every block, but the snapshot, which is stable for the whole epoch it covers.

Cardano keeps three snapshots in flight at any time: the **Mark** (just taken at the start of the current epoch), the **Set** (one epoch old, will drive the next epoch's block production), and the **Go** (two epochs old, currently driving block production and reward calculation). This three-epoch pipeline is the structural reason a freshly delegated stake takes about two full epochs before it starts earning rewards.
