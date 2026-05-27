---
title: Stake-Bleeding Attack
slug: stake-bleeding-attack
short: A long-range attack in which a minority adversary slowly drains stake from the honest chain onto its private chain by copying transactions and collecting their fees.
category: consensus
aliases: ["Stake Bleeding"]
link: /research
related: [pos-attacks, proof-of-stake, long-range-attack, ouroboros]
sources:
  - title: "Stake-Bleeding Attacks on Proof-of-Stake Blockchains"
    url: "https://eprint.iacr.org/2018/248.pdf"
---

A long-range attack on naive proof-of-stake systems. The attacker forks the chain into the past, replays every honest transaction onto their private fork, and pockets the transaction fees on the private chain. Over time the attacker accumulates enough stake to keep producing blocks and eventually presents a longer chain to the network.

Cardano counters the attack on two fronts: Ouroboros Genesis's density-based chain-selection rule prevents stake-bleeding chains from being accepted on bootstrapping nodes, and proposals for context-sensitive transactions further break the assumption that transactions can be cleanly replayed across forks.
