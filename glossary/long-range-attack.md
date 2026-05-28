---
title: Long-Range Attack
slug: long-range-attack
short: An attack that tries to rewrite long stretches of blockchain history by building a competing chain from far back in the past.
category: consensus
level: advanced
aliases: ["Long Range Attack"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, ouroboros, posterior-corruption, grinding-attack]
---

An attack that exploits the fact that producing old blocks in a proof-of-stake system costs essentially nothing. An adversary collects old signing keys (or buys them), rebuilds a long alternate chain starting far behind the current tip, and presents it to bootstrapping nodes as the "real" history.

Cardano mitigates the attack via Ouroboros Genesis, whose chain-selection rule lets a fresh or rejoining node compare chain density at the point of divergence and pick the honest branch without trusting any external checkpoint.
