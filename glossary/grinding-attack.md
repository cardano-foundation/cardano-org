---
title: Grinding Attack
slug: grinding-attack
short: An attack on the randomness used to pick proof-of-stake block leaders, where the adversary tries to bias the lottery in its own favour.
category: consensus
link: /research
related: [pos-attacks, proof-of-stake, ouroboros, vrf]
---

An attack on the source of randomness that determines which validator gets to produce the next block. By selectively withholding blocks or VRF outputs at the end of an epoch, an adversary tries to nudge the seed of the next epoch toward outcomes that elect its own pools more often.

Ouroboros Praos derives the per-epoch randomness from VRF outputs that the adversary cannot manipulate without controlling a stake majority, and the protocol's security proof bounds the adversary's grinding advantage tightly. Genesis tightens the same bound for the dynamic-availability setting.
