---
title: Amaru
slug: amaru
short: A Rust implementation of the Cardano node, maintained by PRAGMA as an alternative to the canonical Haskell node. It runs as a relay on mainnet today, block production is the next milestone.
category: network
related: [haskell, ouroboros, stake-pool, mithril, dijkstra]
sources:
  - title: "Amaru releases on GitHub"
    url: "https://github.com/pragma-org/amaru/releases"
  - title: "Hard Fork Working Group minutes, August 11, 2026"
    url: "https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/11th-august-2026"
---

A Cardano node implementation written in Rust. Amaru aims to be a fully compatible alternative to the canonical Haskell node, re-implementing the full node (networking, ledger rules, and consensus), so it gives the network client diversity at the node level, analogous to how Ethereum benefits from running multiple independent clients.

The project is maintained by [PRAGMA](https://pragma.builders/), an association of Cardano ecosystem companies including the Cardano Foundation, Blink Labs, dcSpark, Sundae Labs and TxPipe. Amaru runs as a relay on mainnet today: it bootstraps from a [Mithril](/glossary/mithril) snapshot, validates blocks, follows the chain tip and ships [weekly beta releases](https://github.com/pragma-org/amaru/releases). Block production on mainnet is the next milestone, which the team [expects to be ready for in November 2026](https://cardanoupgrades.docs.intersectmbo.org/general/hard-fork-working-group-meeting-minutes/11th-august-2026), followed by support for the [Dijkstra](/glossary/dijkstra) era.
