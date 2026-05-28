---
title: Plutus Core
slug: plutus-core
short: Cardano's on-chain smart-contract runtime. Higher-level languages (Plinth, Aiken) compile down to Plutus Core for execution.
category: smart-contracts
level: advanced
related: [untyped-plutus-core-uplc, plinth, aiken, smart-contract]
---

The runtime that actually executes smart contracts on Cardano. Plutus Core is an umbrella for two related languages: Untyped Plutus Core (UPLC), which is what runs on-chain, and Typed Plutus Core (TPLC), an intermediate form used by compilers. Higher-level languages like [Plinth](/glossary/plinth) and [Aiken](/glossary/aiken) compile down to Plutus Core.

The runtime has evolved through three versions tied to hard-fork upgrades: **Plutus V1** (Alonzo) brought general smart contracts; **Plutus V2** (Vasil) added inline datums and reference inputs/scripts; **Plutus V3** (Chang) added the script purposes needed for CIP-1694 governance (voting, proposing). See [smart contract languages](https://developers.cardano.org/docs/smart-contracts/#what-are-the-available-smart-contract-languages) on the Developer Portal.
