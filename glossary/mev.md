---
title: Maximal Extractable Value (MEV)
slug: mev
short: Value that block producers can capture by reordering, inserting, or excluding transactions within the blocks they mint.
category: general
level: advanced
aliases: ["MEV", "maximal extractable value", "miner extractable value"]
related: [utxo, eutxo, transaction-fee]
sources:
  - title: "Essential Cardano: Concurrency and all that (smart contracts and the EUTXO model)"
    url: "https://www.essentialcardano.io/article/concurrency-and-all-that-cardano-smart-contracts-and-the-eutxo-model"
  - title: "Cardano Developer Portal: The Extended UTXO Model"
    url: "https://developers.cardano.org/docs/developers/curriculum/fundamentals/core-concepts/eutxo/"
---

Cardano has no open gas-bidding fee market like account-based chains, so classic priority-gas auctions are absent. Some MEV still exists: the protocol does not enforce any transaction order within a block, and the stock node fills blocks in mempool arrival order, so back-running (adding your own transaction after one you see in the mempool) needs no modification to the node, and full reordering would require a modified block producer. What keeps MEV limited is that a transaction's inputs and outputs are fixed when it is built: a reordered transaction cannot be made to execute at a worse price, it either goes through as written or fails.
