---
title: Stake Majority Attack
slug: stake-majority-attack
short: An attack where a single party controlling more than half of the staked ada can rewrite recent history, censor transactions, or double-spend.
category: consensus
level: advanced
aliases: ["51% Attack", "Stake Takeover"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, ouroboros, pool-saturation, k-parameter]
---

The proof-of-stake analogue of the 51% attack from proof-of-work. With more than half of the active stake under one operator's control, that party can outproduce the honest network, refuse to include specific transactions, or produce a competing chain that overtakes the canonical one.

Ouroboros's security proofs assume an honest stake majority, so the protocol breaks once an attacker crosses that threshold. Cardano's mitigation is structural: ada is held by hundreds of thousands of accounts and delegated across thousands of stake pools, and protocol parameters discourage concentration: the saturation parameter (`k`) caps the rewards any single pool earns past its saturation point, nudging delegators toward less-saturated pools, while the pledge-influence factor (`a0`) makes it costly for one operator to spread stake across many low-pledge pools. Together these make acquiring majority control of the active stake economically and operationally infeasible.
