---
title: live stake
slug: live-stake
short: The total ada currently delegated to a stake pool right now, before any epoch boundary snapshot.
category: consensus
related: [controlled-stake, stake-pool, delegation, epoch]
---

The total ada actively delegated to a stake pool at this moment. Live stake changes continuously as delegators move their stake around. It is not directly what the protocol uses to award blocks: at each epoch boundary the protocol takes a snapshot, and that frozen snapshot — not the live value — drives block production for the upcoming epoch.

Live stake is the number most wallets and pool explorers display in real time.
