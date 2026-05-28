---
title: Determinism
slug: determinism
short: The property that given the same inputs, a computation always produces the same outputs.
category: smart-contracts
aliases: [Deterministic]
related: [eutxo, smart-contract]
---

The property that a computation always produces the same result for the same inputs, regardless of where or when it runs. Cardano's eUTxO model is fully deterministic: wallets can simulate a transaction locally, compute its exact fee and outcome, and know that the on-chain execution will yield the same result. This makes failures predictable, a transaction that would succeed off-chain will succeed on-chain, and one that would fail will fail before it reaches the network, without burning fees on a surprise rejection.
