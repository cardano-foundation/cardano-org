---
title: Plutus Cost Models
slug: plutus-cost-models
short: The protocol parameter that holds the per-operation CPU and memory cost tables Plutus scripts are billed against; updated through ordinary protocol parameter governance actions.
category: smart-contracts
level: advanced
aliases: ["costModels", "Cost Models"]
mentalModel: "A rulebook that puts a price tag on every Plutus VM operation. Smart contract execution fees come from summing the cost of every step a script actually ran, not from a flat per-call rate."
related: [plutus-core, smart-contract, collateral, untyped-plutus-core-uplc]
---

Each Plutus language version (Plutus V1, V2, V3) has its own cost model. When a new Plutus version ships, its cost model is added through a protocol parameter update so wallets and nodes can price scripts written against it deterministically.

Because fees are derived from the executed cost of each operation, wallets can compute the exact fee of a transaction off-chain before submitting it; the on-chain charge will match.
