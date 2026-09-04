---
title: Stake-Bleeding Attack
slug: stake-bleeding-attack
short: A long-range attack in which a minority adversary slowly drains stake from the honest chain onto its private chain by copying transactions and collecting their fees.
category: consensus
level: advanced
aliases: ["Stake Bleeding"]
link: /research
related: [proof-of-stake-attacks, proof-of-stake, long-range-attack, ouroboros]
sources:
  - title: "Stake-Bleeding Attacks on Proof-of-Stake Blockchains"
    url: "https://eprint.iacr.org/2018/248.pdf"
---

A long-range attack on naive proof-of-stake systems. The attacker forks the chain into the past, replays every honest transaction onto their private fork, and pockets the transaction fees on the private chain. Over time the attacker accumulates enough stake to keep producing blocks and eventually presents a longer chain to the network.

The protocol-level defense is the density-based chain-selection rule of Ouroboros Genesis, which prevents a bootstrapping node from accepting a stake-bleeding chain. Genesis ships in the Cardano node but is [opt-in on mainnet](https://github.com/IntersectMBO/cardano-node/blob/master/configuration/cardano/mainnet-config.yaml), where [Praos](/glossary/ouroboros) runs and syncing nodes rely on trusted bootstrap peers instead. Research proposals around context-sensitive transactions go further by breaking the assumption that transactions can be cleanly replayed across forks. Those proposals are not deployed on mainnet today.
