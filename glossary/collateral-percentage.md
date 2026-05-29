---
title: Collateral Percentage
slug: collateral-percentage
short: The protocol parameter that sets how much collateral must be put up relative to a Plutus transaction's fee, currently 150 (i.e. 150% of the fee) on mainnet.
category: smart-contracts
level: advanced
aliases: ["collateralPercentage"]
mentalModel: "A safety margin set as a percentage of the transaction's fee (150% on mainnet, so collateral is at least 1.5x the fee). If validation fails, the network keeps the full collateral, which is deliberately larger than the wasted phase-2 work cost, so failed scripts always over-pay for it."
related: [collateral, smart-contract, plutus-core]
---

When a wallet submits a Plutus transaction, it must attach collateral worth at least `collateralPercentage / 100` times the transaction's fee. On a successful run, the collateral is untouched; on a phase-2 validation failure, the protocol consumes the full collateral instead of the regular fee, paying for the wasted node work.
