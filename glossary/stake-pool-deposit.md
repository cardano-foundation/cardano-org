---
title: Stake Pool Deposit
slug: stake-pool-deposit
short: The refundable amount of ada locked when registering a new stake pool, currently 500 ada on mainnet; returned in full when the pool retires.
category: consensus
level: intermediate
aliases: ["stakePoolDeposit"]
mentalModel: "A refundable bond a pool operator posts to enter the network. The deposit discourages registering pools to never actually run them, but it is returned in full on a clean retirement."
related: [stake-pool, pledge, k-parameter]
---

The deposit is distinct from a pool's [pledge](/glossary/pledge): the deposit is a one-time bond paid to the protocol when the pool registers, while the pledge is an operator's ongoing stake commitment that influences reward calculation through the `a0` parameter.
