---
title: Collateral Percentage
slug: collateral-percentage
short: The protocol parameter that sets how much extra ada must be put up as collateral relative to the estimated cost of a Plutus transaction, currently 150 (i.e. 150%) on mainnet.
category: smart-contracts
level: advanced
aliases: ["collateralPercentage"]
mentalModel: "A safety margin above the script's expected cost. If validation fails, the network keeps the full collateral, which is deliberately larger than the script execution itself would have cost so the wasted work is always over-paid for."
related: [collateral, smart-contract, plutus-core]
---

When a wallet submits a Plutus transaction, it must attach collateral worth at least `collateralPercentage / 100` times the transaction's expected execution fee. On a successful run, the collateral is untouched; on a phase-2 validation failure, the protocol consumes the full collateral instead of the regular fee, paying for the wasted node work.
