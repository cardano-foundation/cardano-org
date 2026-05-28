---
title: Adaptive Corruption
slug: adaptive-corruption
short: An adversary that picks which validators to attack on the fly, after seeing who has been elected to produce upcoming blocks.
category: consensus
level: advanced
aliases: ["Adaptive Adversary"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, ouroboros, vrf]
---

A model of adversary that does not commit in advance to which validators it will corrupt. Instead it watches the network, sees which validator has been elected for the next slot, and targets that specific validator for compromise or denial-of-service moments before its turn.

Ouroboros Praos blocks this by keeping each slot's leader hidden until the block is published. Validators learn privately, via a verifiable random function, whether they have won the current slot, and the adversary discovers it only after the block has been broadcast. By then the leader has already done its job.
