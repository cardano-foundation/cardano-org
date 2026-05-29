---
title: Reference Script
slug: reference-script
short: A Plutus script attached once to a UTxO and then referenced (not re-included) by later transactions that need it, whether to spend a script-locked output, run a minting policy, or validate a withdrawal or certificate.
category: smart-contracts
aliases: ["Reference Scripts"]
related: [smart-contract, eutxo, vasil, reference-input]
---

A Plutus script that lives on-chain attached to a transaction output, which any later transaction can use by pointing to that output instead of carrying the script's bytecode itself; the ledger resolves it by script hash. Before reference scripts (introduced in the Vasil hard fork via CIP-33), every transaction that used a script had to carry the full bytecode again, inflating transaction size and fees.

With reference scripts, a popular validator is published once and then costs far less to reuse than re-including its full bytecode each time. Each use still pays a small fee proportional to the script's size (the `minFeeRefScriptCostPerByte` parameter, 15 lovelace per byte on mainnet), so it is cheap rather than free. This is a big reason modern Cardano dApps feel lightweight per transaction.
