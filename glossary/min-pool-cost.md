---
title: Minimum Pool Cost
slug: min-pool-cost
short: The protocol parameter that sets the floor on the fixed cost a stake pool can declare per epoch, currently 170 ada on mainnet.
category: consensus
level: intermediate
aliases: ["minPoolCost", "Min Pool Cost"]
mentalModel: "A floor under pool operating fees. No pool can advertise a lower fixed cost, even if it would otherwise out-compete others on price. The floor keeps low-cost pools from siphoning all delegation without covering real operating expenses."
related: [stake-pool, pool-saturation, rewards, k-parameter, voting-thresholds]
sources:
  - title: "Lowering minPoolCost and completing smart contract capacity increases"
    url: "https://cardano.org/news/2026-08-03-lowering-minpoolcost/"
  - title: "Governance action: Reduce minPoolCost to 75 ada and increase Plutus memory limits"
    url: "https://proposalexaminer.cardanofoundation.org/proposals/gov_action14dr5yg75pchr2sz42djtuflpvx5qnsek29qg7s7cft8lzrqt5vrqqtqntpk"
---

The parameter is part of Cardano's reward sharing scheme. Before delegator rewards are computed, the pool's declared fixed cost (capped below by `minPoolCost`) and margin are deducted from the gross pool reward, and what remains is split pro-rata across delegators.

`minPoolCost` is an economic-group protocol parameter. On its own it is changed through a protocol-parameter governance action ratified by the Constitutional Committee and DReps without a stake pool vote, because it is not one of the [security-relevant parameters](/glossary/voting-thresholds). If it is bundled with a security-relevant parameter in one action, stake pool operators vote on the whole action.

The floor was 340 ada from the Shelley launch until October 2023, when it was halved to 170 ada, the value still in force. A further cut to 75 ada, bundled with an increase of the Plutus memory limits, [expired on September 1, 2026](https://proposalexaminer.cardanofoundation.org/proposals/gov_action14dr5yg75pchr2sz42djtuflpvx5qnsek29qg7s7cft8lzrqt5vrqqtqntpk) with DRep and committee support but only 34.5 percent of stake pool stake in favor.
