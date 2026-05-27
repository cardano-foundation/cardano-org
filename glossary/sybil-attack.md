---
title: Sybil attack
slug: sybil-attack
short: An attack in which one entity creates many fake identities to gain disproportionate influence over a network.
category: consensus
mentalModel: "Trying to swing an election by registering hundreds of fake voters. On Cardano it doesn't work: each vote (block, delegation, governance action) is weighted by real ada, not by how many identities you can spin up."
related: [proof-of-stake, ouroboros, eclipse]
---

An attack where a single actor creates many fake identities — nodes, accounts, votes — in an attempt to gain disproportionate control of a distributed system.

Cardano's stake-weighted consensus mitigates Sybil attacks by tying influence to ada, not to identity counts. Producing blocks, delegating stake, and voting on governance all scale with how much ada an actor controls, so creating ten thousand empty wallets gives the attacker no more power than creating one.
