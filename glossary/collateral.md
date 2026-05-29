---
title: Collateral
slug: collateral
short: An ada amount a wallet locks aside when submitting a Plutus transaction, forfeited only if the script's on-chain validation fails.
category: smart-contracts
aliases: ["Collateral Input"]
mentalModel: "A small deposit you put on the table when you ask the network to run code on your behalf. If the code runs successfully, you get the deposit back. If it fails the heavy on-chain check, the network keeps the deposit as payment for the wasted work."
related: [smart-contract, plutus-core, eutxo, collateral-percentage]
---

An ada amount a wallet pledges when submitting a transaction that runs a Plutus script. Cardano splits script execution into two phases: a cheap phase-1 check (the transaction is well-formed, balanced, properly witnessed) that every node performs, and an expensive phase-2 check (the script actually runs and returns true or false).

If phase-1 passes but phase-2 fails, the wallet's collateral is taken instead of the normal transaction fee. This lets the network charge for the wasted phase-2 work without requiring every node to fully replay failed validations, keeping the eUTxO model's predictable-fee property intact.
