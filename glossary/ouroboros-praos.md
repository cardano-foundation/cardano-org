---
title: Ouroboros Praos
slug: ouroboros-praos
short: The Ouroboros variant Cardano mainnet runs today. It elects block producers privately with verifiable random functions so leaders are not known in advance.
category: consensus
aliases: ["Praos"]
related: [ouroboros, ouroboros-genesis, ouroboros-peras, leios, vrf, slot-leader, proof-of-stake]
sources:
  - title: "Ouroboros Praos: An adaptively-secure, semi-synchronous proof-of-stake blockchain"
    url: "https://eprint.iacr.org/2017/573"
  - title: "cardano-node mainnet configuration (ConsensusMode)"
    url: "https://github.com/IntersectMBO/cardano-node/blob/master/configuration/cardano/mainnet-config.yaml"
---

Praos is the production consensus protocol behind Cardano mainnet. Compared with earlier Ouroboros Classic, it elects slot leaders with a VRF so the next producer is not advertised ahead of time, which removes a class of grinding and denial-of-service attacks against known leaders. Security holds in a semi-synchronous network model with adaptive adversaries.

Mainnet still runs Praos as the chain-producing rule. [Ouroboros Genesis](/glossary/ouroboros-genesis) is available in the node and is the default on Preview and Preprod, but on mainnet it remains opt-in. Upcoming Dijkstra-era work adds [Peras](/glossary/ouroboros-peras) and [Leios](/glossary/leios) as extensions on top of this Praos base rather than replacing it.
