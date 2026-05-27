---
title: mempool
slug: mempool
short: The pool of pending transactions a Cardano node holds locally before they are included in a block.
category: network
aliases: ["Transaction Pool"]
related: [block, stake-pool, ouroboros]
---

The local pool of unconfirmed transactions a Cardano node holds in memory while waiting for one of them to be picked up into a block. Unlike some other blockchains, Cardano does not maintain a single shared public mempool; each node keeps its own view and gossips transactions to its peers.

When a stake pool produces a block it picks transactions from its own mempool, applying the protocol's size and execution limits. A transaction can reach a pool either by ordinary peer gossip or by being submitted directly to that pool's node.
