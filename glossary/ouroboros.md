---
title: Ouroboros
slug: ouroboros
short: The family of proof-of-stake consensus protocols that power Cardano, designed with formal security proofs against the known attack catalogue against PoS chains. Mainnet runs Ouroboros Praos today.
category: consensus
link: /ouroboros
mentalModel: "A continuous lottery where every wallet's staked ada is a ticket. Each slot, the protocol secretly draws a winning ticket, the holder builds the next block, and everyone else can verify after the fact that the draw was fair. The more honest stake participates, the harder it becomes for any minority to rewrite history."
related: [slot, slot-leader, vrf, kes, stake-pool, proof-of-stake, proof-of-stake-attacks, leios, dijkstra]
sources:
  - title: "cardano-node mainnet configuration (ConsensusMode)"
    url: "https://github.com/IntersectMBO/cardano-node/blob/master/configuration/cardano/mainnet-config.yaml"
  - title: "CIP-140: Ouroboros Peras"
    url: "https://cips.cardano.org/cip/CIP-0140"
  - title: "CIP-164: Ouroboros Linear Leios"
    url: "https://cips.cardano.org/cip/CIP-0164"
---

The lineage of Ouroboros variants reflects different operational regimes:
- **Classic** introduced provably-secure PoS with synchronous, semi-trusted setup.
- **Praos** moved to a private leader election via VRFs, removing the need for committee coordination. This is the protocol Cardano mainnet runs today.
- **Genesis** adds a chain-density rule so a brand-new node can join the network and pick the honest chain without external checkpoints. It is implemented in the node and is the default on the Preview and Preprod testnets, but on [mainnet it is opt-in](https://github.com/IntersectMBO/cardano-node/blob/master/configuration/cardano/mainnet-config.yaml) and Praos remains the running consensus.
- **Chronos** (research) tightens the protocol's reliance on external time sources.

Two extensions are on the way with the [Dijkstra](/glossary/dijkstra) era. [Peras](https://cips.cardano.org/cip/CIP-0140) adds a voting layer in which stake pool committees vote on recent blocks, so transactions settle in roughly two minutes instead of waiting for many confirmations, and is planned for the second Dijkstra phase in 2027. [Leios](/glossary/leios) raises throughput by adding larger endorser blocks next to the Praos chain, runs on a public testnet since June 2026 and is the headline feature of the first Dijkstra phase targeted for late 2026.

See [Ouroboros](/ouroboros/) for the longer write-up.
