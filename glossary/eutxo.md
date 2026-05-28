---
title: eUTXO
slug: eutxo
short: Cardano's extension of the UTXO accounting model; each output can carry datum and script logic, so smart contracts express rules without the shared mutable state used by account-based chains.
category: general
aliases: [eUTxO, Extended UTxO]
mentalModel: "Like a UTxO that can carry a small contract: the rules about how the note is allowed to be spent travel with the note itself, so anyone can predict the outcome before submitting the transaction."
related: [utxo, smart-contract, native-token, datum, redeemer, reference-input, reference-script, collateral]
---

Because validation depends only on the inputs being spent and not on global state, fees and outcomes are deterministic: a transaction either succeeds offline before submission or it fails predictably on-chain.
