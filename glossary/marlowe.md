---
title: Marlowe
slug: marlowe
short: A domain-specific language for writing financial smart contracts on Cardano in a constrained, auditable form.
category: smart-contracts
related: [smart-contract, plutus-core, aiken]
---

A Cardano-native language for financial smart contracts developed by Input Output. Marlowe restricts itself to a small set of constructs (pay, deposit, choice, observation, timeout) so the resulting contracts are easy to reason about, audit, and even read by people without programming background.

Marlowe contracts compile to Plutus Core for on-chain execution, so they inherit Cardano's eUTxO guarantees while staying within a deliberately narrow domain.
