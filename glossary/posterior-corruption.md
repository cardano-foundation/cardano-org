---
title: Posterior Corruption
slug: posterior-corruption
short: An attack where the adversary buys or steals signing keys from people who held large stake in the past but no longer do.
category: consensus
level: advanced
aliases: ["Past-Majority Attack", "Posterior Attack"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, long-range-attack, bribery-attack, kes]
---

Once a stakeholder has moved on (sold their ada, lost interest, or simply stopped running their wallet), their old signing keys lose value to them. A posterior corruption attack collects those dormant keys cheaply and uses them to forge an alternate history in which those past stakeholders re-cast blocks they never actually produced.

Cardano blocks the attack with key-evolving signatures: once a slot passes, a stake pool's signing key updates and the previous key state is erased. An attacker who later buys an old key cannot use it to sign historic blocks because the protocol no longer accepts that key for the slot it once covered.
