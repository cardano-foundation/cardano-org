---
title: Ouroboros
slug: ouroboros
short: The family of proof-of-stake consensus protocols that power Cardano, designed with formal security proofs against the known attack catalogue against PoS chains.
category: consensus
link: /ouroboros
mentalModel: "A continuous lottery where every wallet's staked ada is a ticket. Each slot, the protocol secretly draws a winning ticket, the holder builds the next block, and everyone else can verify after the fact that the draw was fair. The more honest stake participates, the harder it becomes for any minority to rewrite history."
related: [slot, slot-leader, vrf, kes, stake-pool, proof-of-stake, proof-of-stake-attacks]
---

The lineage of Ouroboros variants reflects different operational regimes:
- **Classic** introduced provably-secure PoS with synchronous, semi-trusted setup.
- **Praos** moved to a private leader election via VRFs, removing the need for committee coordination.
- **Genesis** added the chain-density rule so a brand-new node can join the network and pick the honest chain without external checkpoints.
- **Chronos** (research) tightens the protocol's reliance on external time sources.

See [Ouroboros](/ouroboros/) for the longer write-up.
