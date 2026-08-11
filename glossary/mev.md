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

Cardano has no open gas-bidding fee market like account-based chains, so classic priority-gas auctions are absent. Some MEV still exists because stake pools order the transactions in the blocks they produce and can capture arbitrage or liquidation opportunities by reordering or inserting transactions. The extended UTxO concurrency model and more deterministic ordering keep MEV more limited than on account-based chains, but it is not eliminated.
