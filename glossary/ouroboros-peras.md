---
title: Ouroboros Peras
slug: ouroboros-peras
short: An Ouroboros extension that adds stake-weighted voting over recent blocks so transactions can settle in roughly two minutes instead of waiting for long confirmation depths.
category: consensus
aliases: ["Peras"]
related: [ouroboros, ouroboros-praos, dijkstra, leios, stake-pool]
sources:
  - title: "CIP-140: Ouroboros Peras"
    url: "https://cips.cardano.org/cip/CIP-0140"
  - title: "Dijkstra era overview"
    url: "https://www.iog.io/news/cardano-is-ready-to-grow"
---

Peras, specified in [CIP-140](https://cips.cardano.org/cip/CIP-0140), keeps the Praos chain and adds a voting layer: committees of stake pools vote on recent blocks, and once certification succeeds those blocks gain fast finality. The design target is settlement on the order of two minutes rather than waiting for many subsequent blocks.

It is planned for Phase 2 of the [Dijkstra](/glossary/dijkstra) hard-fork programme (an intra-era upgrade targeted for 2027, subject to on-chain governance). It complements [Linear Leios](/glossary/leios), which raises throughput; Peras improves confirmation speed for the blocks that are already produced.
