---
title: Leios
slug: leios
short: A proposed Ouroboros upgrade that aims to dramatically raise Cardano throughput by decoupling transaction diffusion from leader-driven block production.
category: consensus
aliases: ["Ouroboros Leios"]
related: [ouroboros, pipelining, block, proof-of-stake-attacks]
---

A scaling proposal for the Ouroboros consensus family currently in research and prototyping. Where today's Ouroboros serializes block production around a per-slot, stake-weighted leader lottery (at most one block extends the chain per slot), Leios introduces parallel "input blocks" that carry transactions and "endorsement blocks" that bundle and certify them, with lower-frequency "ranking blocks" establishing the final transaction order. This lets the network pre-validate and diffuse transactions independently of the slot-leader bottleneck.

The expected payoff is significantly higher transactions per second without weakening Ouroboros's security guarantees. Leios is not deployed on mainnet today; timelines depend on the research roadmap, formal proofs, and a future hard fork.
