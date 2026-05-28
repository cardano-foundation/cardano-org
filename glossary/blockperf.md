---
title: Blockperf
slug: blockperf
short: An open-source tool stake pool operators use to measure how quickly their nodes receive and forward newly produced blocks.
category: consensus
aliases: ["Block Performance"]
related: [stake-pool, block, ouroboros, pipelining]
---

An open-source measurement tool maintained by the Cardano Foundation for stake pool operators. blockperf records when each new block arrives at the node, how long validation takes, and how quickly the node forwards the block to its peers. SPOs run the client locally and submit anonymised metrics to the Foundation-operated backend via an issued OpenSSL client certificate.

The numbers help operators diagnose network paths, peer choices, and hardware bottlenecks that would otherwise slow down block propagation. Aggregated blockperf data also gives the wider Cardano community a picture of how fast blocks spread through the topology in practice.
