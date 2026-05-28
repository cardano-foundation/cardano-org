---
title: Mithril
slug: mithril
short: A stake-based threshold multi-signature protocol that lets Cardano nodes trust a blockchain snapshot without re-validating the whole chain.
category: network
aliases: ["Mithril Network", "STM"]
related: [stake-pool, ouroboros]
---

A stake-based threshold multi-signature (STM) protocol developed by Input Output. Cardano's stake pools collectively sign snapshots of the blockchain state; each pool contributes a partial signature weighted by its stake, and once enough stake has signed, the combined signature is small and fast to verify. Clients can then trust the snapshot, for example to bootstrap a new node in minutes, without independently replaying every block since genesis.

Mithril is used to accelerate node sync, light clients, and cross-system data feeds that need a verifiable view of recent Cardano state.
