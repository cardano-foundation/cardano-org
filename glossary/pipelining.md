---
title: pipelining
slug: pipelining
short: A protocol optimization that lets a newly produced block start propagating across the network before validation completes.
category: consensus
aliases: ["Diffusion Pipelining"]
related: [block, slot, ouroboros]
---

A consensus optimization where a freshly produced block begins propagating to peer nodes before full validation has finished, so the network does not have to wait for each block to be fully checked at every hop. Validation still happens; pipelining just overlaps it with diffusion, reclaiming time that would otherwise be spent idle.

Diffusion pipelining was a major reason Cardano could raise effective block size and throughput without lowering security.
