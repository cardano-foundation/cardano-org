---
title: Plinth
slug: plinth
short: The high-level Haskell-embedded language Cardano developers use to write on-chain validators that compile to Plutus Core.
category: smart-contracts
aliases: ["Plutus Tx"]
related: [plutus-core, haskell, smart-contract, aiken]
---

A subset of Haskell used to write Plutus smart contracts. Plinth (formerly called Plutus Tx) is Input Output's recommended toolchain for Cardano on-chain development. Developers write validators in Haskell with the restrictions Plinth enforces, then the compiler turns the result into Plutus Core for the on-chain runtime.

Plinth lives alongside alternatives like Aiken, which targets the same Plutus Core runtime but offers a different language and developer experience.
