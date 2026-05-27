---
title: Proof-of-Stake Attacks
slug: pos-attacks
short: The set of known attack categories against proof-of-stake blockchains and how Cardano's Ouroboros family defends against each.
category: consensus
aliases: ["Attacks", "PoS Attacks", "Attack Vectors", "Consensus Attacks"]
link: /research
related: [proof-of-stake, ouroboros, long-range-attack, nothing-at-stake, grinding-attack, stake-bleeding-attack, posterior-corruption, bribery-attack, adaptive-corruption, stake-majority-attack, sybil-attack, eclipse]
---

Proof-of-stake blockchains face a specific catalogue of attacks distinct from proof-of-work mining attacks. Cardano's Ouroboros consensus family was designed with each of these categories in mind, and the protocol's security proofs explicitly bound the adversary's success probability under formal models of every threat.

The named attack categories most often referenced in PoS research:

- [Long-Range Attack](/glossary/long-range-attack): rewriting old history by building a competing chain from far back.
- [Nothing-at-Stake](/glossary/nothing-at-stake): signing every fork at once because doing so costs nothing.
- [Grinding Attack](/glossary/grinding-attack): biasing the leader-election randomness in the adversary's favour.
- [Stake-Bleeding Attack](/glossary/stake-bleeding-attack): slowly draining stake onto a private fork by replaying fees.
- [Posterior Corruption](/glossary/posterior-corruption): buying or stealing signing keys from former large stakeholders.
- [Bribery Attack](/glossary/bribery-attack): paying current or past validators to misbehave.
- [Adaptive Corruption](/glossary/adaptive-corruption): targeting validators only after seeing who has been elected.
- [Stake Majority Attack](/glossary/stake-majority-attack): the proof-of-stake analogue of the 51% attack.
- [Sybil Attack](/glossary/sybil-attack): spinning up many fake identities to gain disproportionate influence.
- [Eclipse Attack](/glossary/eclipse): isolating a node from the honest network so it sees only attacker-controlled state.

The recurring defences across these attacks are stake-weighted influence (creating fake identities does not help), VRF-based hidden leader election (the adversary cannot target who has not yet been announced), key-evolving signatures (old keys cannot retroactively sign), and Ouroboros Genesis's density-based chain selection (bootstrapping nodes can pick the honest chain without external checkpoints).
