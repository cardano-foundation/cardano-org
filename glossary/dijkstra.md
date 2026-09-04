---
title: Dijkstra
slug: dijkstra
short: The next Cardano ledger era and hard fork, named after Edsger Dijkstra. Its first phase, targeted for late 2026, brings Linear Leios and nested transactions, a second phase adds Peras.
category: network
link: /hardforks
aliases: ["Dijkstra Era", "Dijkstra Hard Fork", "Protocol Version 12"]
related: [hard-fork, leios, ouroboros, conway-era, van-rossem, amaru, hard-fork-initiation]
sources:
  - title: "Cardano is ready to grow. Leios is how it gets there. (IOG)"
    url: "https://www.iog.io/news/cardano-is-ready-to-grow"
  - title: "Hard Fork Working Group minutes, August 11, 2026"
    url: "https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/11th-august-2026"
  - title: "Cardano outlines two-phase Dijkstra upgrade for 2026 and 2027"
    url: "https://cryptobriefing.com/cardano-dijkstra-upgrade-q4-2026/"
---

The ledger era that follows [Conway](/glossary/conway-era), named after the Dutch computer scientist Edsger Dijkstra. Where Conway was about governance, Dijkstra is about scaling: it changes how blocks are produced and how quickly transactions settle. Because it opens a new era, every node, wallet and indexer has to support the new block and transaction formats before the hard fork can be enacted.

The rollout is split in two phases. Phase 1 raises the protocol version to 12, activates [Linear Leios](/glossary/leios) for higher throughput and introduces nested transactions (CIP-118), which let one transaction cover fees or collateral for others. The [Hard Fork Working Group](https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/11th-august-2026) targets code completion for this phase in late 2026. Phase 2 is an intra-era hard fork planned for 2027 that switches on Ouroboros Peras (CIP-140) for settlement in roughly two minutes.

Both dates are engineering targets. Like van Rossem before it, Dijkstra only happens once a [hard fork initiation action](/glossary/hard-fork-initiation) is ratified by DReps, stake pool operators and the Constitutional Committee, and Leios itself only switches on after enough stake pools have registered the BLS keys it uses for voting.
