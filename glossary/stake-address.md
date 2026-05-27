---
title: stake address
slug: stake-address
short: The bech32 address (`stake1...`) that owns delegation rights and receives staking rewards, separate from your payment address.
category: wallets
aliases: ["Reward Address", "Staking Address"]
related: [bech32, delegation, rewards, wallet]
---

A second address every Cardano wallet has, distinct from the payment address used to send and receive ada. The stake address (also called the reward address) is what the protocol tracks for delegation: it decides which stake pool the wallet's ada is delegated to, and it is where rewards are paid.

A typical Cardano payment address (the `addr1...` form) actually contains both halves: the payment part that controls spending, and the stake part that controls delegation. Some wallets generate enterprise addresses without the stake part; those can hold ada but cannot delegate or earn rewards.
