---
title: Plutus
slug: plutus
short: Cardano's smart contract platform. The name covers the Plutus Core language that runs on-chain and the tooling that compiles higher-level languages down to it.
category: smart-contracts
aliases: ["Plutus Platform", "Plutus V3", "Plutus Scripts"]
mentalModel: "Plutus is the engine, not the steering wheel. Every Cardano smart contract ends up as Plutus Core, no matter which language it was written in."
related: [plutus-core, untyped-plutus-core-uplc, plinth, aiken, validator, smart-contract, plutus-cost-models, van-rossem]
sources:
  - title: "Smart contract languages (Developer Portal)"
    url: "https://developers.cardano.org/docs/smart-contracts/#what-are-the-available-smart-contract-languages"
---

Plutus is the umbrella name for smart contracts on Cardano. At its core is [Plutus Core](/glossary/plutus-core), a small functional language whose untyped form ([UPLC](/glossary/untyped-plutus-core-uplc)) is what nodes execute when they validate a transaction. When people say a DApp "runs on Plutus" they mean its [validators](/glossary/validator) are Plutus Core scripts. The runtime has grown through versions, Plutus V1 (Alonzo), V2 (Vasil) and V3 (Chang), and new builtins can also be added within a version, as the [van Rossem](/glossary/van-rossem) hard fork did for V3.

Nobody writes Plutus Core by hand. [Plinth](/glossary/plinth), formerly called Plutus Tx, is the Haskell-based toolchain maintained by Input Output that compiles a subset of Haskell to Plutus Core. [Aiken](/glossary/aiken) is the most widely used alternative, a purpose-built language with its own compiler that targets the same runtime. Other languages exist, but every one of them produces Plutus Core, so contracts written in different languages interoperate on-chain.

Execution is metered: each script pays for CPU steps and memory according to the [Plutus cost models](/glossary/plutus-cost-models), which is why the cost model is updated whenever a hard fork adds new builtins.
