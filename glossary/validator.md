---
title: Validator
slug: validator
short: The on-chain script that decides whether a transaction may spend a UTXO, mint a token or perform another scripted action. On Cardano, a smart contract is a validator.
category: smart-contracts
aliases: ["Validator Script", "Spending Script", "Script Validator"]
mentalModel: "A bouncer at the door of a locked box. The box holds the funds, the bouncer holds the rulebook, and every transaction that wants to open the box has to present a redeemer the bouncer accepts."
related: [smart-contract, plutus, plutus-core, datum, redeemer, eutxo, policy-id, collateral]
---

On Cardano's [EUTXO](/glossary/eutxo) model, smart contract logic lives in validators. A validator is a pure function that receives the [datum](/glossary/datum) stored with the output, the [redeemer](/glossary/redeemer) supplied by the spending transaction and the full transaction context, and answers true or false. If any validator in a transaction says no, the whole transaction is rejected and only the [collateral](/glossary/collateral) is charged.

The same mechanism covers more than spending. A validator can guard minting and burning under a [policy ID](/glossary/policy-id), stake certificates, reward withdrawals and, since Plutus V3, governance votes and proposals. Which purpose applies is part of the context the script sees.

Developers write validators in [Plinth](/glossary/plinth) or [Aiken](/glossary/aiken), which compile to [Plutus Core](/glossary/plutus-core) for execution. The hash of the compiled script becomes the script address or policy ID, so funds sent there can only move when the validator agrees. Simpler conditions such as multi-signature or time locks can also be expressed as native scripts, which need no Plutus at all.
