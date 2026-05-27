---
title: Mithril
slug: mithril
short: A protocol that produces stake-weighted multi-signatures over Cardano blockchain state, letting other nodes trust a snapshot without re-validating the whole chain.
category: network
aliases: ["Mithril Network"]
related: [stake-pool, ouroboros]
---

A protocol that lets Cardano's stake pools collectively sign a snapshot of the blockchain state. Each pool contributes a partial signature weighted by its stake; once enough stake has signed, the combined signature is small and fast to verify. Clients can then trust the snapshot, for example to bootstrap a new node in minutes, without independently replaying every block since genesis.

Mithril is widely used to accelerate node sync, light clients, and cross-system data feeds that need a verifiable view of recent Cardano state.
