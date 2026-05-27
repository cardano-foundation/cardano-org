---
title: datum
slug: datum
short: A piece of data attached to a UTxO that a smart contract can read when deciding whether the UTxO can be spent.
category: smart-contracts
aliases: [Datums, Inline Datum]
related: [redeemer, eutxo, smart-contract]
---

A piece of data attached to a transaction output in Cardano's eUTxO model. The datum acts like state that travels with the output: a smart contract sees it whenever someone tries to spend the output and decides, based on its contents plus the redeemer, whether to allow the spend.

Inline datums (introduced with the Vasil hard fork) store the data directly on the output; earlier outputs stored only a hash of the datum, with the full data supplied later by the spending transaction.
