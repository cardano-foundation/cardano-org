---
title: reference input
slug: reference-input
short: An input a transaction reads without consuming, letting a smart contract look at on-chain state without locking it out of other transactions.
category: smart-contracts
aliases: ["Reference Inputs"]
related: [smart-contract, eutxo, oracle, datum, vasil, reference-script]
---

A transaction input that is observed but not spent. Reference inputs let a Plutus validator look at the current state of another UTxO (an oracle's latest price, a registry entry, a DAO configuration) and use it during validation, without taking that UTxO out of circulation for other concurrent transactions.

Introduced alongside reference scripts in the Vasil hard fork via CIP-31, reference inputs are how Cardano dApps share live on-chain state at scale without serialising every read.
