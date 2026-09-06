---
title: Hydra
slug: hydra
short: "Cardano's Layer 2 protocol built on state channels (Hydra Heads) for fast, low-cost transactions off the main chain. Production-ready since version 1.0 in October 2025."
category: network
mentalModel: "Cardano's express lane. A small group takes their slice of state off the main highway, exchanges thousands of transactions among themselves, then merges the settled result back onto mainnet."
related: [layer-2, hydra-head, mithril, eutxo, leios]
sources:
  - title: "Hydra 1.0.0 release"
    url: "https://github.com/cardano-scaling/hydra/releases/tag/1.0.0"
  - title: "Scaling Cardano applications with Hydra"
    url: "https://cardano.org/news/2025-10-27-scaling-cardano-applications-with-hydra/"
---

Hydra is the Layer 2 protocol of Cardano, developed by Input Output. A small group of participants locks funds on mainnet and opens a [Hydra Head](/glossary/hydra-head), an off-chain ledger that uses the same [EUTXO](/glossary/eutxo) rules and the same smart contracts as the main chain. Inside the Head, transactions confirm in well under a second and cost next to nothing. When the group is done, the Head closes and only the final state is written back to mainnet, so the chain records the opening and the settlement rather than every individual transaction.

Hydra reached [version 1.0 in October 2025](https://github.com/cardano-scaling/hydra/releases/tag/1.0.0), the point at which the team committed to supporting the implementation in production, and has continued with 2.x releases since. It suits use cases with a known set of participants and many small transactions, such as payments, gaming and auctions. Hydra scales applications sideways, while [Leios](/glossary/leios) raises the throughput of the main chain itself.
