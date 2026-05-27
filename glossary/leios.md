---
title: Leios
slug: leios
short: A proposed Ouroboros upgrade that aims to dramatically raise Cardano throughput by decoupling transaction diffusion from leader-driven block production.
category: consensus
aliases: ["Ouroboros Leios"]
related: [ouroboros, pipelining, block, pos-attacks]
---

A scaling proposal for the Ouroboros consensus family currently in research and prototyping. Where today's Ouroboros pipelines block production through a single elected leader per slot, Leios introduces parallel "input blocks" and "endorsement blocks" so the network can pre-validate and rank transactions independently of the slot-leader bottleneck.

The expected payoff is significantly higher transactions per second without weakening Ouroboros's security guarantees. Leios is not deployed on mainnet today; timelines depend on the research roadmap, formal proofs, and a future hard fork.
