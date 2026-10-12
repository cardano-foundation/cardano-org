---
title: Native Script
slug: native-script
short: Cardano's built-in multisig and time-lock scripting language, evaluated by the ledger without Plutus, commonly used for simple spending conditions and minting policies.
category: smart-contracts
aliases: ["Native Scripts", "Multisig Script", "Simple Script"]
related: [smart-contract, plutus, native-token, policy-id, validator]
sources:
  - title: "Native scripts (Developer Portal)"
    url: "https://developers.cardano.org/docs/native-tokens/minting/#native-scripts"
---

Native scripts are the ledger's original scripting language: nested `all`, `any`, `n_of_k`, key-hash, and time-lock constructors. They do not need a Plutus cost model and are enough for many multisig treasuries and minting policies. More expressive DApp logic uses [Plutus](/glossary/plutus) validators instead. A policy id for a [native token](/glossary/native-token) can be the hash of either a native script or a Plutus script.
