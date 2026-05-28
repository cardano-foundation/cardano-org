---
title: Bribery Attack
slug: bribery-attack
short: An external attacker pays validators to deviate from the protocol, for example by signing conflicting blocks or handing over dormant keys.
category: consensus
level: advanced
link: /research
related: [pos-attacks, proof-of-stake, posterior-corruption, kes]
---

An attacker pays current or former validators to misbehave: sign double blocks, censor transactions, hand over keys, vote on a controversial proposal. Bribery is the economic version of corruption attacks, and works wherever stakeholders have keys with residual value.

Cardano mitigates bribery in two directions. Present-time bribery requires corrupting a stake majority, which under Ouroboros's honest-majority assumption is economically prohibitive. Past-time bribery (buying old keys) is neutralised by key-evolving signatures, which retire old keys so they cannot be sold for malicious replay.
