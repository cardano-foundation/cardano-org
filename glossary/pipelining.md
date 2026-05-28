---
title: Pipelining
slug: pipelining
short: A protocol optimization that lets a newly produced block start propagating across the network before validation completes.
category: consensus
level: advanced
aliases: ["Diffusion Pipelining"]
related: [block, slot, ouroboros]
---

A consensus optimization where a node forwards a fresh block's header to its peers before validating the block body, so the network does not have to wait for each block to be fully checked at every hop. Body validation still happens locally on every node, and no node adopts the chain until validation succeeds; pipelining just overlaps the header diffusion step with the body check, reclaiming time that would otherwise be spent idle.

Diffusion pipelining was a major reason Cardano could raise effective block size and throughput without lowering security.
