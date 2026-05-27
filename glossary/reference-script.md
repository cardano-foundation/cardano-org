---
title: reference script
slug: reference-script
short: A Plutus script attached once to a UTxO and then referenced (not re-included) by later transactions that spend script-locked outputs.
category: smart-contracts
aliases: ["Reference Scripts"]
related: [smart-contract, eutxo, vasil, reference-input]
---

A Plutus script that lives on-chain attached to a transaction output and is then referenced by name from any later transaction that spends a UTxO locked by that script. Before reference scripts (introduced in the Vasil hard fork via CIP-33), every spending transaction had to carry the full script bytecode again, inflating transaction size and fees.

With reference scripts, a popular validator is paid for once when it is first published and is then almost free to use, which is the main reason modern Cardano dApps feel lightweight per transaction.
