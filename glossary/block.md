---
title: Block
slug: block
short: A unit of data containing a batch of transactions that is added to the blockchain.
category: network
level: beginner
mentalModel: "Like a page in the chain's ledger. Once written, it's stamped with a reference to the previous page so no page can be quietly rewritten without breaking everything after it."
related: [ouroboros, slot, slot-leader]
---

A unit of data containing a batch of transactions that is added to the blockchain. Each block includes a cryptographic reference to the previous block, forming an immutable chain. On Cardano, blocks are produced by stake pools selected through the [Ouroboros](/ouroboros/) protocol. Block size has been increased over time to improve network capacity.
