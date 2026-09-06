---
title: Leios
slug: leios
short: An Ouroboros extension that raises Cardano throughput by letting block producers publish larger endorser blocks next to regular Praos blocks. Linear Leios is the variant headed for mainnet with the Dijkstra hard fork.
category: consensus
aliases: ["Ouroboros Leios", "Linear Leios"]
related: [ouroboros, dijkstra, pipelining, block, hydra, proof-of-stake-attacks]
sources:
  - title: "CIP-164: Ouroboros Linear Leios"
    url: "https://cips.cardano.org/cip/CIP-0164"
  - title: "What did IO deliver for Cardano in Q2 2026?"
    url: "https://www.iog.io/news/what-did-io-deliver-for-cardano-in-q2-2026"
---

Leios is the throughput extension of the Ouroboros family. Today at most one block extends the chain per slot, so capacity is bounded by what a single slot leader can fit into one block roughly every 20 seconds. Linear Leios, specified in [CIP-164](https://cips.cardano.org/cip/CIP-0164), keeps that Praos chain unchanged and lets the elected producer also publish a larger endorser block that references additional transactions. A stake-weighted committee of pools votes on the endorser block, and once the votes form a certificate its transactions become part of the ledger. This simpler design replaced the earlier research variant with separate input blocks.

The public Leios testnet, Musashi Dojo, has been running since [June 23, 2026](https://www.iog.io/news/what-did-io-deliver-for-cardano-in-q2-2026), the first time Leios ran on a real network rather than in simulation. Linear Leios is the headline feature of Phase 1 of the [Dijkstra](/glossary/dijkstra) hard fork, targeted for late 2026 and subject to on-chain governance. After the hard fork, Leios only activates once enough stake pools have registered the BLS keys used for voting, and throughput is then raised step by step through parameter changes rather than all at once.
